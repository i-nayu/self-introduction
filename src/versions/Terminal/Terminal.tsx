import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import './Terminal.css';

const TerminalComponent: React.FC = () => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<Terminal | null>(null);
  // 入力中の文字列を保持するためのRef（Stateだと再レンダリングで入力が遅れるため）
  const commandBuffer = useRef<string>('');
  const commandHistory = useRef<string[]>([]);
  const historyIndex = useRef<number | null>(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    const term = new Terminal({
      cursorBlink: true,
      rows: 20,
      cols: 80,
      fontFamily: 'monospace',
      theme: {
        background: '#1e1e1e', // お好みで
      }
    });
    termRef.current = term;

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    fitAddon.fit();

    // プロンプトを表示する関数
    const prompt = () => {
      term.write('\r\n> ');
    };

    // 初期表示
    term.writeln('Welcome to my portfolio!');
    term.writeln('Type "help" for available commands.');
    term.write('> ');

    // 入力イベントの制御
    term.onData((data) => {
      const code = data.charCodeAt(0);

      if (code === 13) { // Enter
    const input = commandBuffer.current.trim();
    term.write('\r\n');
    if (input.length > 0) {
      handleCommand(input, term);
    }
    commandBuffer.current = '';
    historyIndex.current = null; // Enterで履歴位置をリセット
    prompt();

  } else if (code === 127) { // Backspace
    if (commandBuffer.current.length > 0) {
      commandBuffer.current = commandBuffer.current.slice(0, -1);
      term.write('\b \b');
    }

  } else if (data === '\x1b[A') { // ↑キー
    if (commandHistory.current.length === 0) return;
    if (historyIndex.current === null) {
      historyIndex.current = commandHistory.current.length - 1;
    } else if (historyIndex.current > 0) {
      historyIndex.current -= 1;
    }
    // 現在の入力を消して履歴を表示
    term.write('\x1b[2K\r> ' + commandHistory.current[historyIndex.current]);
    commandBuffer.current = commandHistory.current[historyIndex.current];

  } else if (data === '\x1b[B') { // ↓キー
    if (commandHistory.current.length === 0 || historyIndex.current === null) return;
    if (historyIndex.current < commandHistory.current.length - 1) {
      historyIndex.current += 1;
      term.write('\x1b[2K\r> ' + commandHistory.current[historyIndex.current]);
      commandBuffer.current = commandHistory.current[historyIndex.current];
    } else {
      // 履歴の最後なら空にする
      historyIndex.current = null;
      term.write('\x1b[2K\r> ');
      commandBuffer.current = '';
    }

  } else if (code < 32) {
    // その他の制御文字は無視
  } else {
    // 通常文字
    commandBuffer.current += data;
    term.write(data);
  }
    });

   // コマンド判定ロジック
const handleCommand = (cmd: string, t: Terminal) => {
  const trimmedCmd = cmd.trim();
  const lowerCmd = trimmedCmd.toLowerCase();
  const [baseCmd, ...args] = lowerCmd.split(/\s+/);

  if (trimmedCmd.length > 0) {
    commandHistory.current.push(trimmedCmd);
  }

  // 'help' コマンド: コマンド一覧表示
  if (baseCmd === 'help') {
    t.writeln('Available commands: help, hello, cd, ls, echo, history, open, clear');
    t.writeln('cd <about|skills|products>');
    t.writeln('open <x|github>');
  
  // 'hello' コマンド: 挨拶表示
  } else if (baseCmd === 'hello') {
    t.writeln('Hello!');
  
  // 'cd' コマンド: 指定された見出しまでスクロール
  } else if (baseCmd === 'cd') {
    const target = args[0];
    const sectionMap: Record<string, string> = {
      about: 'about',
      skills: 'skills',
      products: 'Products',
    };

    if (!target) {
      t.writeln('Usage: cd <about|skills|products>');
    } else {
      const sectionId = sectionMap[target];
      const sectionElement = sectionId ? document.getElementById(sectionId) : null;

      if (!sectionElement) {
        t.writeln(`Section not found: ${target}`);
      } else {
        sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        t.writeln(`Moved to section: ${target}`);
      }
    }
  
  // 'ls' コマンド: 見出し一覧を表示
  } else if (baseCmd === 'ls') {
    t.writeln("👤 About Me");
    t.writeln("💻 Skills");
    t.writeln("🚀 Products");
  
  // 'echo' コマンド: 入力された内容を復唱
  } else if (baseCmd === 'echo') {
    t.writeln(trimmedCmd.slice(5)); // "echo "以降の文字列を表示
  
  // 'history' コマンド: コマンド履歴を表示
  } else if (baseCmd === 'history') {
    if (commandHistory.current.length === 0) {
      t.writeln('No command history.');
    } else {
      commandHistory.current.forEach((historyCommand, index) => {
        t.writeln(`${index + 1}: ${historyCommand}`);
      });
    }
  
  // 'open' コマンド: XやGithubなどのリンクを開く
  } else if (baseCmd === 'open') {
    const target = args[0];
    const xLink = document.querySelector<HTMLAnchorElement>('.btn-x')?.href;
    const githubLink = document.querySelector<HTMLAnchorElement>('.btn-github')?.href;

    if (!target) {
      t.writeln('Usage: open <x|github>');
    } else if (target === 'x') {
      if (xLink) {
        window.open(xLink, '_blank', 'noopener,noreferrer');
        t.writeln('Opening X...');
      } else {
        t.writeln('X link not found.');
      }
    } else if (target === 'github') {
      if (githubLink) {
        window.open(githubLink, '_blank', 'noopener,noreferrer');
        t.writeln('Opening GitHub...');
      } else {
        t.writeln('GitHub link not found.');
      }
    } else {
      t.writeln('Usage: open <x|github>');
    }
  
  // 'clear' コマンド: ターミナルをクリア
  } else if (baseCmd === 'clear') {
    t.clear();
  
  // 未対応コマンド
  } else {
    t.writeln(`Command not found: ${cmd}`);
  }
};

    const resizeObserver = new ResizeObserver(() => {
      fitAddon.fit();
    });
    resizeObserver.observe(terminalRef.current);

    return () => {
      resizeObserver.disconnect();
      term.dispose();
    };
  }, []);

  return (
    <div className="Terminal-wrapper">
      <div 
        ref={terminalRef}
        className="Terminal-container"
      />
    </div>
  );
};

export default TerminalComponent;