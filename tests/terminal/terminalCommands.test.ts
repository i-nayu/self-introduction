import { describe, expect, it } from 'vitest';
import { executeCommand } from '../../src/components/Terminal/terminalCommands';
import { PROFILE } from '../../src/data/profile';

describe('ターミナルのコマンド', () => {
  it('空の入力は履歴に追加せず、何も実行しない', () => {
    expect(executeCommand('   ', ['hello'])).toEqual({
      lines: [],
      history: ['hello'],
    });
  });

  it('案内と表示だけを行うコマンドを処理する', () => {
    const cases: Array<[string, string[]]> = [
      ['help', [
        'Available commands: help, hello, cd, ls, echo, history, open, clear',
        'cd <about|skills|products>',
        'open <x|github>',
        'echo <text>',
      ]],
      ['hello', ['Hello!']],
      ['ls', ['👤 About Me', '💻 Skills', '🚀 Products']],
      ['echo Hello World', ['Hello World']],
    ];

    for (const [input, expectedLines] of cases) {
      const result = executeCommand(input, []);
      expect(result.lines).toEqual(expectedLines);
      expect(result.history).toEqual([input]);
      expect(result.action).toBeUndefined();
    }
  });

  it('コマンド名は大文字・小文字を区別せず、echoの本文は保持する（コマンドの前にスペースがあってもコマンドとして認識される）', () => {
    expect(executeCommand('  ECHO   Hello World  ', []).lines).toEqual(['  Hello World']);
    expect(executeCommand('HELLO', []).lines).toEqual(['Hello!']);
  });

  it('cdで許可されたページだけに移動する', () => {
    for (const [target, path] of [
      ['about', '/about'],
      ['skills', '/skills'],
      ['products', '/products'],
    ]) {
      const result = executeCommand(`cd ${target}`, []);
      expect(result.lines).toEqual([`Opening ${target}...`]);
      expect(result.action).toEqual({ type: 'navigate', path });
    }

    expect(executeCommand('CD ABOUT', []).action).toEqual({ type: 'navigate', path: '/about' });
  });

  it('openでプロフィールに登録されたSNSだけを開く', () => {
    for (const [target, url, label] of [
      ['x', PROFILE.xUrl, 'X'],
      ['github', PROFILE.githubUrl, 'GitHub'],
    ]) {
      const result = executeCommand(`open ${target}`, []);
      expect(result.lines).toEqual([`Opening ${label}...`]);
      expect(result.action).toEqual({ type: 'open', url });
    }
  });

  it('historyは実行したコマンドを含む履歴を順番に表示する', () => {
    const previous = ['hello', 'cd skills'];
    const result = executeCommand('history', previous);

    expect(result.lines).toEqual(['1: hello', '2: cd skills', '3: history']);
    expect(result.history).toEqual([...previous, 'history']);
    expect(previous).toEqual(['hello', 'cd skills']);
  });

  it('clearは表示を消す指示を返し、履歴は残す', () => {
    expect(executeCommand('clear', ['hello'])).toEqual({
      lines: [],
      history: ['hello', 'clear'],
      action: { type: 'clear' },
    });
  });

  it('不足・余分・未対応の引数では移動や外部サイトの表示をしない', () => {
    const cases = [
      ['cd', 'Usage: cd <about|skills|products>'],
      ['cd about extra', 'Usage: cd <about|skills|products>'],
      ['cd unknown', 'Page not found: unknown'],
      ['cd /admin', 'Page not found: /admin'],
      ['open', 'Usage: open <x|github>'],
      ['open github extra', 'Usage: open <x|github>'],
      ['open unknown', 'Usage: open <x|github>'],
      ['open https://example.com', 'Usage: open <x|github>'],
      ['echo', 'Usage: echo <text>'],
      ['help extra', 'Usage: help'],
      ['hello extra', 'Usage: hello'],
      ['ls extra', 'Usage: ls'],
      ['history extra', 'Usage: history'],
      ['clear extra', 'Usage: clear'],
      ['rm -rf /', 'Command not found: rm -rf /'],
    ];

    for (const [input, expectedLine] of cases) {
      const result = executeCommand(input, []);
      expect(result.lines).toEqual([expectedLine]);
      expect(result.action).toBeUndefined();
    }
  });

  it('オブジェクトの特殊な名前も許可された行き先として扱わない', () => {
    for (const input of ['cd __proto__', 'cd constructor', 'open __proto__', 'open constructor']) {
      expect(executeCommand(input, []).action).toBeUndefined();
    }
  });
});
