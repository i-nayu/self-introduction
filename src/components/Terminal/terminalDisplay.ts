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
  const lines = layout.lines.map((line, index) => `\x1b[${top + index + 1};1H${line}`).join('');
  // 折り返しは計算済み。最下行への描画でスクロール履歴を増やさないよう、自動折り返しを一時停止する。
  return `\x1b[?7l${lines}\x1b[${top + layout.cursorRow + 1};${layout.cursorColumn + 1}H\x1b[?7h`;
}
