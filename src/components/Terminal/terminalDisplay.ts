//この行は前の行から折り返された行かを調べる
export function wrappedRowsBeforePrompt(currentRow: number, isWrapped: (row: number) => boolean): number {
  let row = currentRow;


  while (row > 0 && isWrapped(row)) {
    row -= 1;
  }

  return currentRow - row;
}

export function redrawCommand(value: string, cursorIndex: number, rowsBeforePrompt: number): string {
  const characters = [...value];
  const beforeCursor = characters.slice(0, cursorIndex).join('');
  const afterCursor = characters.slice(cursorIndex).join('');
  const moveToPrompt = rowsBeforePrompt > 0 ? `\x1b[${rowsBeforePrompt}A` : '';

  // 入力の先頭へ戻り、折り返した行も消してからカーソル位置を復元する。
  return `${moveToPrompt}\r\x1b[0J> ${beforeCursor}\x1b[s${afterCursor}\x1b[u`;
}

//Enterを押したときの表示だけを整えるため
export function submitCommand(value: string, rowsBeforePrompt: number): string {
  // 入力途中の編集位置ではなく、コマンドの末尾から改行する。
  return `${redrawCommand(value, [...value].length, rowsBeforePrompt)}\r\n`;
}
