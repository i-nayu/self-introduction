export interface HistorySelection { // 履歴のどの位置にいるかとその値を保持する
  index: number | null;
  value: string;
}

export interface EditedInput { // 編集後の入力値とカーソル位置を保持する
  value: string;
  cursorIndex: number;
}

export function moveCursor(value: string, cursorIndex: number, direction: 'left' | 'right'): number { // カーソルの位置を移動する
  const nextIndex = cursorIndex + (direction === 'left' ? -1 : 1);
  return Math.max(0, Math.min([...value].length, nextIndex));
}

export function insertAtCursor(value: string, cursorIndex: number, text: string): EditedInput { // カーソル位置に文字列を挿入する
  const characters = [...value];
  const inserted = [...text];
  characters.splice(cursorIndex, 0, ...inserted);
  return { value: characters.join(''), cursorIndex: cursorIndex + inserted.length };
}

export function backspaceAtCursor(value: string, cursorIndex: number): EditedInput { // カーソル位置の直前の文字を削除する
  if (cursorIndex === 0) return { value, cursorIndex };
  const characters = [...value];
  characters.splice(cursorIndex - 1, 1);
  return { value: characters.join(''), cursorIndex: cursorIndex - 1 };
}

export function browseHistory( // 履歴を選ぶ
  history: readonly string[],
  currentIndex: number | null,
  direction: 'previous' | 'next',
): HistorySelection | null {
  if (history.length === 0) return null;

  if (direction === 'previous') {
    const index = currentIndex === null
      ? history.length - 1
      : Math.max(0, currentIndex - 1);
    return { index, value: history[index] };
  }

  if (currentIndex === null) return null;
  if (currentIndex === history.length - 1) return { index: null, value: '' };

  const index = currentIndex + 1;
  return { index, value: history[index] };
}

export function printableInput(data: string): string { // 入力された文字列から印字可能な文字だけを抽出する
  // エスケープシーケンスをターミナルの表示に流し込まない。
  if (data.includes('\x1b')) return '';

  return [...data].filter((character) => {
    const codePoint = character.codePointAt(0) ?? 0;
    return codePoint >= 32 && codePoint !== 127 && (codePoint < 128 || codePoint > 159);
  }).join('');
}
