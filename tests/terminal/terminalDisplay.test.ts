import { describe, expect, it } from 'vitest';
import { drawInputWindow, inputWindow } from '../../src/components/Terminal/terminalDisplay';

const lines = Array.from({ length: 15 }, (_, index) => `line ${index + 1}`);

describe('ターミナルの入力表示', () => {
  it('画面内に収まる入力は全行を表示する', () => {
    const layout = { lines: lines.slice(0, 3), cursorRow: 1, cursorColumn: 4 };
    expect(inputWindow(layout, 10)).toEqual(layout);
  });

  it('画面の高さを超えた入力は、末尾のカーソルを含む範囲だけ表示する', () => {
    expect(inputWindow({ lines, cursorRow: 14, cursorColumn: 2 }, 10)).toEqual({
      lines: lines.slice(5), cursorRow: 9, cursorColumn: 2,
    });
  });

  it('長い入力の先頭へ移動すると、表示範囲も先頭に戻す', () => {
    expect(inputWindow({ lines, cursorRow: 0, cursorColumn: 2 }, 10)).toEqual({
      lines: lines.slice(0, 10), cursorRow: 0, cursorColumn: 2,
    });
  });

  it('1行しか表示できなくても、編集中の行とカーソルを表示する', () => {
    expect(inputWindow({ lines, cursorRow: 7, cursorColumn: 3 }, 1)).toEqual({
      lines: [lines[7]], cursorRow: 0, cursorColumn: 3,
    });
  });

  it('「指定された位置に文字を描き、カーソルを戻すための命令文字列」を正しく作れる（描画している間だけ、xterm自身の自動折り返しを一時停止）', () => {
    expect(drawInputWindow({ lines: ['> echo a', 'bc'], cursorRow: 0, cursorColumn: 7 }, 2)).toBe(
      '\x1b[?7l\x1b[3;1H> echo a\x1b[4;1Hbc\x1b[3;8H\x1b[?7h',
    );
  });
});
