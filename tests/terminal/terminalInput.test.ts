import { describe, expect, it } from 'vitest';
import {
  backspaceAtCursor,
  browseHistory,
  insertAtCursor,
  moveCursor,
  printableInput,
} from '../../src/components/Terminal/terminalInput';

describe('ターミナルの入力', () => {
  const history = ['hello', 'cd skills', 'ls'];

  it('↑で新しい履歴から古い履歴へ戻り、先頭で止まる', () => {
    expect(browseHistory(history, null, 'previous')).toEqual({ index: 2, value: 'ls' });
    expect(browseHistory(history, 2, 'previous')).toEqual({ index: 1, value: 'cd skills' });
    expect(browseHistory(history, 0, 'previous')).toEqual({ index: 0, value: 'hello' });
  });

  it('↓で新しい履歴へ進み、最後の次は空の入力に戻る', () => {
    expect(browseHistory(history, 0, 'next')).toEqual({ index: 1, value: 'cd skills' });
    expect(browseHistory(history, 2, 'next')).toEqual({ index: null, value: '' });
    expect(browseHistory(history, null, 'next')).toBeNull();
  });

  it('履歴が空なら↑↓のどちらも何もしない', () => {
    expect(browseHistory([], null, 'previous')).toBeNull();
    expect(browseHistory([], null, 'next')).toBeNull();
  });

  it('文字列の貼り付けは受け付け、制御文字とエスケープシーケンスは表示しない', () => {
    expect(printableInput('hello 世界 😀')).toBe('hello 世界 😀');
    expect(printableInput('a\rb\nc\x7f')).toBe('abc');
    expect(printableInput('\x1b[31m')).toBe('');
  });

  it('左右キーでカーソルを動かし、文字列の両端では止まる', () => {
    expect(moveCursor('hello', 5, 'left')).toBe(4);
    expect(moveCursor('hello', 4, 'right')).toBe(5);
    expect(moveCursor('hello', 0, 'left')).toBe(0);
    expect(moveCursor('hello', 5, 'right')).toBe(5);
    expect(moveCursor('日😀本', 3, 'left')).toBe(2);
  });

  it('カーソル位置に入力し、Backspaceで直前の文字を消す', () => {
    expect(insertAtCursor('helo', 3, 'l')).toEqual({ value: 'hello', cursorIndex: 4 });
    expect(backspaceAtCursor('hello', 4)).toEqual({ value: 'helo', cursorIndex: 3 });
    expect(backspaceAtCursor('hello', 0)).toEqual({ value: 'hello', cursorIndex: 0 });
    expect(insertAtCursor('日本', 1, '😀')).toEqual({ value: '日😀本', cursorIndex: 2 });
  });
});
