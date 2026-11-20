import { Terminal as XtermTerminal } from '@xterm/xterm';
import { drawInputWindow, inputWindow, type InputLayout } from './terminalDisplay';

type Write = (value: string) => Promise<void>;

export class TerminalInputViewport {
  private readonly layout: XtermTerminal; // 入力欄の描画を計測するための、画面に出さないxterm
  private top: number; // 入力欄の描画開始位置（現在の画面内の行番号、0始まり）
  private displayed = { value: '', cursorIndex: 0 }; // 現在表示されている入力欄の内容とカーソル位置
  private disposed = false; // インスタンスが破棄されたかどうか。破棄後は描画処理を行わない。
  private readonly term: XtermTerminal; // 実際に表示されるターミナル
  private readonly write: Write; // ターミナルに描画するための非同期関数

  //受け取ったターミナルと描画関数を保存し、計測用のターミナルを作る（最初にnewされた時のみ実行）
  constructor(term: XtermTerminal, write: Write) {
    this.term = term;
    this.write = write;
    // 画面に出さないxtermで、日本語・絵文字も実際のターミナルと同じ幅で折り返す。
    this.layout = new XtermTerminal({ cols: term.cols, rows: term.rows });
    this.top = term.buffer.active.cursorY;
  }

  // 新しいプロンプトがある画面内の行を記録し、保存していた入力を空にする。
  startPrompt() {
    if (this.disposed) return;
    this.top = this.term.buffer.active.cursorY;
    this.displayed = { value: '', cursorIndex: 0 };
  }

  // 入力全文を計測し、折り返し後の全行とカーソル位置を返す。
  private async measure(value: string, cursorIndex: number): Promise<InputLayout | null> {
    this.layout.reset();
    // 入力全体を計測用バッファに保持する。ここへ描いた文字は実際の履歴には入らない。
    this.layout.options.scrollback = Math.max(1000, value.length + 2);
    const characters = [...value];

    // カーソル位置までの文字列を描画
    await new Promise<void>((resolve) => this.layout.write(`> ${characters.slice(0, cursorIndex).join('')}`, resolve));

    // その時点でのカーソル位置を取得
    if (this.disposed) return null;
    const buffer = this.layout.buffer.active;
    const cursorColumn = buffer.cursorX % this.term.cols;
    const cursorRow = buffer.baseY + buffer.cursorY + Math.floor(buffer.cursorX / this.term.cols);

    // カーソル位置以降の文字列を描画
    await new Promise<void>((resolve) => this.layout.write(characters.slice(cursorIndex).join(''), resolve));


    if (this.disposed) return null; // 入力欄の描画中にdisposeされた場合はnullを返す（後続の処理をとめる）

    // 入力全体を描画した後のカーソル位置を取得し、入力全体の行列を返す
    const endRow = buffer.baseY + buffer.cursorY + Math.floor(buffer.cursorX / this.term.cols);
    const lines = Array.from({ length: Math.max(endRow, cursorRow) + 1 }, (_, row) => (
      buffer.getLine(row)?.translateToString(true) ?? ''
    ));
    return { lines, cursorRow, cursorColumn };
  }

  // 入力欄の描画を消す。ターミナルのスクロール履歴は増やさない。
  private async erase() {
    if (this.disposed) return;
    await this.write(`\x1b[${this.top + 1};1H\x1b[0J`);
  }

  // 入力欄の描画を更新する。入力全体を描画して、カーソル位置を含む行だけを表示する。
  async show(value: string, cursorIndex: number) {
    if (this.disposed) return;

    // 入力全文が何行に折り返されるかと、カーソル位置を調べる。
    const layout = await this.measure(value, cursorIndex);

    // 計測が中断された、または待っている間に破棄された場合は終了する。
    if (!layout || this.disposed) return;

    // 計測した全文から、画面に収まる行を選ぶ。（this.term.rows はターミナルに表示できる行数。）
    const frame = inputWindow(layout, this.term.rows);

    // 新しく描くために、前回の入力表示を消す。（消し終わるまで待つ。）
    await this.erase();

    if (this.disposed) return;

    // 入力欄を広げる必要があるときだけ、確定済みの出力を上へ送って場所を確保する。
    const scroll = Math.max(0, this.top + frame.lines.length - this.term.rows);
    if (scroll > 0) {
      await this.write(`\x1b[${this.term.rows};1H${'\r\n'.repeat(scroll)}`);
      if (this.disposed) return;
      this.top -= scroll;
    }
    this.term.scrollToBottom();
    await this.write(drawInputWindow(frame, this.top));
    this.displayed = { value, cursorIndex };
  }

  //Enterを押したとき、全文を確定して表示する
  async submit(value: string) {
    // 編集用の表示を消し、確定した全文を一度だけ通常のスクロール履歴に書く。
    await this.erase();
    if (!this.disposed) await this.write(`> ${value}\r\n`);
  }

  // ターミナルのサイズが変わったとき、入力欄の描画を消して再描画する。
  async resize(fit: () => void) {
    if (this.disposed) return;
    await this.erase();
    if (this.disposed) return;
    fit();
    this.top = this.term.buffer.active.cursorY;
    this.layout.resize(this.term.cols, this.term.rows);
    await this.show(this.displayed.value, this.displayed.cursorIndex);
  }

  dispose() {
    this.disposed = true;
    this.layout.dispose();
  }
}
