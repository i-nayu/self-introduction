import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal as XtermTerminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { executeCommand } from './terminalCommands';
import { backspaceAtCursor, browseHistory, insertAtCursor, moveCursor, printableInput } from './terminalInput';
import 'xterm/css/xterm.css';
import './Terminal.css';

export default function Terminal() {
  const navigate = useNavigate();
  const terminalRef = useRef<HTMLDivElement>(null); //ターミナルをいれるdivのref
  const commandBuffer = useRef<string>(''); // 現在のコマンド入力を保持する
  const cursorIndex = useRef<number>(0); // 入力中の文字列内でのカーソル位置
  const commandHistory = useRef<string[]>([]); // コマンド履歴を保持する
  const historyIndex = useRef<number | null>(null); // 履歴のどの位置にいるかを保持する

  //ターミナルの描画
  useEffect(() => {
    if (!terminalRef.current) return;

    const term = new XtermTerminal({
      cursorBlink: true,
      rows: 20,
      cols: 80,
      fontFamily: 'monospace',
      theme: {
        background: '#0f2537',
      }
    });
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    fitAddon.fit();

    const prompt = () => {
      term.write('\r\n> ');
    };

    // 入力中のコマンドを表示する関数
    const showInput = () => {
      const characters = [...commandBuffer.current];
      const beforeCursor = characters.slice(0, cursorIndex.current).join('');
      const afterCursor = characters.slice(cursorIndex.current).join('');
      term.write(`\x1b[2K\r> ${beforeCursor}\x1b[s${afterCursor}\x1b[u`);
    };

    term.writeln('Welcome to my portfolio!');
    term.writeln('Type "help" for available commands.');
    term.write('> ');

    //キー入力を受け付ける
    const inputSubscription = term.onData((data) => {
      // Enterキーが押された場合、コマンドを実行する
      if (data === '\r' || data === '\n') {
        term.write('\r\n');
        const result = executeCommand(commandBuffer.current, commandHistory.current);
        commandHistory.current = result.history;
        for (const line of result.lines) term.writeln(line);

        // コマンドの実行結果に応じてアクションを実行する
        if (result.action?.type === 'navigate') {
          navigate(result.action.path);
        } else if (result.action?.type === 'open') {
          window.open(result.action.url, '_blank', 'noopener,noreferrer');
        } else if (result.action?.type === 'clear') {
          term.clear();
        }

        // 実行後は入力と履歴の選択位置をリセットする
        commandBuffer.current = '';
        cursorIndex.current = 0;
        historyIndex.current = null;
        prompt();
        return;
      }

      // Backspaceキーが押された場合、カーソルの直前の文字を削除する
      if (data === '\x7f' || data === '\b') {
        if (cursorIndex.current > 0) {
          const edited = backspaceAtCursor(commandBuffer.current, cursorIndex.current);
          commandBuffer.current = edited.value;
          cursorIndex.current = edited.cursorIndex;
          showInput();
        }
        return;
      }

      // 左右矢印キーで入力中のカーソルを移動する
      if (data === '\x1b[D' || data === '\x1b[C') {
        const direction = data === '\x1b[D' ? 'left' : 'right';
        cursorIndex.current = moveCursor(commandBuffer.current, cursorIndex.current, direction);
        showInput();
        return;
      }

      // 上矢印キーまたは下矢印キーが押された場合、履歴を参照する
      if (data === '\x1b[A' || data === '\x1b[B') {
        const direction = data === '\x1b[A' ? 'previous' : 'next';
        const selection = browseHistory(commandHistory.current, historyIndex.current, direction);
        if (selection) {
          historyIndex.current = selection.index;
          commandBuffer.current = selection.value;
          cursorIndex.current = [...selection.value].length;
          showInput();
        }
        return;
      }

      // その他の入力は文字として処理する
      const printable = printableInput(data);
      if (printable) {
        const edited = insertAtCursor(commandBuffer.current, cursorIndex.current, printable);
        commandBuffer.current = edited.value;
        cursorIndex.current = edited.cursorIndex;
        showInput();
      }
    });

    // ウィンドウサイズが変更されたときにターミナルをリサイズする
    const resizeObserver = new ResizeObserver(() => {
      fitAddon.fit();
    });
    resizeObserver.observe(terminalRef.current);

    return () => {
      resizeObserver.disconnect();
      inputSubscription.dispose();
      term.dispose();
    };
  }, [navigate]);

  return (
    <div className="Terminal-wrapper">
      <div
        ref={terminalRef}
        className="Terminal-container"
      />
    </div>
  );
}
