export interface InputLayout {
  lines: string[]; // 入力全体を描画した結果の行列
  cursorRow: number; // カーソル位置の行番号
  cursorColumn: number; // カーソル位置の列番号
}

// 入力全文のうち、カーソルを含む画面内の行だけを表示する。
export function inputWindow(layout: InputLayout, rows: number): InputLayout {
  const start = Math.max(0, layout.cursorRow - rows + 1);
  return {
    lines: layout.lines.slice(start, start + rows),
    cursorRow: layout.cursorRow - start,
    cursorColumn: layout.cursorColumn,
  };
}

// 選んだ行を指定位置へ描く命令を作る
export function drawInputWindow(layout: InputLayout, top: number): string {
  // 表示範囲だけを連続して書き、自動折り返しによる行のつながりをxtermに記録させる。
  // 各行へ個別に移動すると、選択・コピー時に折り返しが実際の改行として扱われてしまう。
  const text = layout.lines.join('');
  // 行末ちょうどで終わる場合、次の空行はカーソル用に表示範囲へ含まれている。
  // 空白を1文字書いて折り返しを確定し、BS + ECHでその文字だけ消すと、行のつながりを保てる。
  const finishWrap = layout.lines.length > 1 && layout.lines.at(-1) === '' ? ' \b\x1b[X' : '';
  return `\x1b[${top + 1};1H\x1b[?7h${text}${finishWrap}\x1b[${top + layout.cursorRow + 1};${layout.cursorColumn + 1}H`;
}
