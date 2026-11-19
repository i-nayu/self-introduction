import { describe, expect, it } from 'vitest';
import { redrawCommand, submitCommand, wrappedRowsBeforePrompt } from '../../src/components/Terminal/terminalDisplay';

describe('ターミナルの入力表示', () => {
  it('折り返した行をたどってプロンプトまで戻る行数を求める', () => {
    const wrappedRows = new Set([11, 12, 13]);
    expect(wrappedRowsBeforePrompt(13, (row) => wrappedRows.has(row))).toBe(3);
    expect(wrappedRowsBeforePrompt(10, (row) => wrappedRows.has(row))).toBe(0);
  });

  it('複数行の入力を消して再描画し、途中のカーソル位置へ戻す', () => {
    expect(redrawCommand('echo abcdef', 6, 2)).toBe(
      '\x1b[2A\r\x1b[0J> echo a\x1b[sbcdef\x1b[u',
    );
  });

  it('入力が1行でも、現在のカーソル位置から、その行の右端と、さらに下にある行を消す', () => {
    expect(redrawCommand('hi', 2, 0)).toBe('\r\x1b[0J> hi\x1b[s\x1b[u');
  });

  it('途中の行でEnterを押しても、コマンド末尾まで再描画してから改行する', () => {
    expect(submitCommand('echo abcdef', 2)).toBe(
      '\x1b[2A\r\x1b[0J> echo abcdef\x1b[s\x1b[u\r\n',
    );
  });

  it('1行のUnicode入力も全体を表示してから改行する', () => {
    expect(submitCommand('あ😀', 0)).toBe('\r\x1b[0J> あ😀\x1b[s\x1b[u\r\n');
  });
});
