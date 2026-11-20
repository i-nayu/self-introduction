import { expect, test, type Locator } from '@playwright/test';

// xtermは表示中の行だけをDOMに持つので、実際のスクロール操作で履歴全体を読む。
async function terminalTranscript(terminal: Locator): Promise<string> {
  const frame = () => terminal.evaluate(() => new Promise<void>((resolve) => (
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
  )));
  const visibleLines = () => terminal.locator('.xterm-rows > div').allTextContents();
  let previous = await visibleLines();
  for (let page = 0; page < 100; page += 1) {
    await terminal.page().keyboard.press('Shift+PageUp');
    await frame();
    const next = await visibleLines();
    if (next.join('\n') === previous.join('\n')) break;
    previous = next;
    if (page === 99) throw new Error('ターミナルのスクロール先頭に到達できませんでした');
  }
  const result = [...previous];
  for (let page = 0; page < 100; page += 1) {
    await terminal.page().keyboard.press('Shift+PageDown');
    await frame();
    const next = await visibleLines();
    if (next.join('\n') === previous.join('\n')) return result.map((line) => line.trimEnd()).join('\n');
    let overlap = Math.min(previous.length, next.length);
    while (overlap > 0 && previous.slice(-overlap).join('\n') !== next.slice(0, overlap).join('\n')) overlap -= 1;
    result.push(...next.slice(overlap));
    previous = next;
  }
  throw new Error('ターミナルのスクロール末尾に到達できませんでした');
}

// xtermは描画・リサイズ時に行の要素を作り直すので、座標を取得できるまで待つ。
async function visibleBox(locator: Locator): Promise<NonNullable<Awaited<ReturnType<Locator['boundingBox']>>>> {
  let box: Awaited<ReturnType<Locator['boundingBox']>> = null;
  await expect.poll(async () => {
    box = await locator.boundingBox();
    return box;
  }).not.toBeNull();
  return box!;
}

test.use({ viewport: { width: 375, height: 812 } }); //スマホ画面サイズ

// 実際にマウス選択し、xtermのcopyイベントが出力する文字列を読む。
// OSのクリップボードは書き換えず、改行・空白を含めてそのまま比較する。
async function copyEditableInput(terminal: Locator): Promise<string> {
  const page = terminal.page();
  const prompt = terminal.locator('.xterm-rows > div').filter({ hasText: /^> / }).first();
  const cursor = terminal.locator('.xterm-cursor');
  await expect(prompt).toBeVisible();
  await expect(cursor).toBeVisible();
  const start = await visibleBox(prompt);
  const end = await visibleBox(cursor);
  await page.mouse.move(start.x + end.width * 2 + 0.5, start.y + start.height / 2);
  await page.mouse.down();
  await page.mouse.move(end.x + 0.5, end.y + end.height / 2, { steps: 15 });
  await page.mouse.up();
  await expect(terminal.locator('.xterm-selection div:visible').first()).toBeVisible();
  return terminal.locator('.xterm').evaluate((element) => {
    const clipboardData = new DataTransfer();
    element.dispatchEvent(new ClipboardEvent('copy', { clipboardData, bubbles: true, cancelable: true }));
    return clipboardData.getData('text/plain');
  });
}

for (const kind of ['spaces', 'unicode', 'viewport-bottom'] as const) {
  test(`折り返した入力をコピーしても元の文字列を保つ（${kind}）`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const terminal = page.getByRole('group', { name: '操作できるポートフォリオのターミナル' });
    await terminal.locator('.Terminal-container').click();
    const rows = terminal.locator('.xterm-rows');
    await expect(rows).toHaveText(/>\s*$/);
    const screen = await visibleBox(terminal.locator('.xterm-screen'));
    const cursor = await visibleBox(terminal.locator('.xterm-cursor'));
    const cols = Math.round(screen.width / cursor.width);
    const rowCount = await terminal.locator('.xterm-rows > div').count();
    const command = kind === 'spaces'
      ? `echo ${'a'.repeat(cols - 8)}  next  word  tail `
      : kind === 'unicode'
        ? `echo ${'a'.repeat(cols - 8)}日本語😀e\u0301  末尾`
        : `echo ${'a'.repeat(cols * (rowCount - 1) - 7)}`;
    await page.keyboard.insertText(command);
    await expect(rows).toContainText(kind === 'unicode' ? '末尾' : command.slice(-5).trim());
    await expect.poll(() => copyEditableInput(terminal)).toBe(command);

    if (kind === 'unicode') {
      // リサイズによる再描画でも、折り返し情報と元の文字を保持する。
      await page.keyboard.press('End');
      await page.setViewportSize({ width: 320, height: 640 });
      await expect(rows).toContainText('末尾');
      await expect.poll(() => copyEditableInput(terminal)).toBe(command);
    }
  });
}

test('画面より長い入力を編集してもスクロール履歴に複製を増やさず、全文を実行できる', async ({ page }) => {
  await page.goto('/');
  const terminal = page.getByRole('group', { name: '操作できるポートフォリオのターミナル' });
  const rows = terminal.locator('.xterm-rows');
  await terminal.locator('.Terminal-container').click();

  const payload = `START-${Array.from({ length: 80 }, (_, index) => `${index.toString().padStart(3, '0')}abcdefghij`).join('')}-END`;
  await page.keyboard.insertText(`echo ${payload}`);
  await expect(rows).toContainText('-END');
  await expect(rows).not.toContainText('START-');
  const beforeEditing = await terminalTranscript(terminal);

  // 先頭が画面外になった後の再描画で、入力のコピーが履歴へ積み上がらないことを確認する。
  await page.keyboard.press('Backspace');
  await page.keyboard.insertText('D');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowRight');
  await expect(rows).toContainText('-END');
  await expect.poll(() => terminalTranscript(terminal)).toBe(beforeEditing);

  // 先頭へ戻ってechoの本文に印を追加し、表示されていなかった部分も保持されていることを確認する。
  await page.keyboard.press('Home');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.insertText('CHECK-');
  await page.keyboard.press('End');
  await page.keyboard.press('Enter');
  await expect(rows).toHaveText(/>\s*$/);
  const editedPayload = `CHECK-${payload}`;
  const output = (await terminalTranscript(terminal)).replace(/\s/g, '');
  // 確定したコマンドとechoの出力が各1回だけあり、入力全文が欠けていない。
  expect(output.split(`>echo${editedPayload}`).length - 1).toBe(1);
  expect(output.split(editedPayload).length - 1).toBe(2);

  // 実行履歴は1件だけで、先頭から末尾までの編集内容を保持する。
  await page.keyboard.insertText('history');
  await page.keyboard.press('Enter');
  await expect(rows).toContainText('2: history');
  await expect(rows).toHaveText(/>\s*$/);
  const history = (await terminalTranscript(terminal)).replace(/\s/g, '');
  expect(history).toContain(`1:echo${editedPayload}`);
  expect(history).not.toContain('2:echo');
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('Home');
  await expect(rows).toContainText('echo CHECK-START-');
});

test('日本語・絵文字を含む長い入力をリサイズしても、編集内容と確定済みの出力を保持する', async ({ page }) => {
  await page.goto('/');
  const terminal = page.getByRole('group', { name: '操作できるポートフォリオのターミナル' });
  const rows = terminal.locator('.xterm-rows');
  await terminal.locator('.Terminal-container').click();
  await page.keyboard.insertText('echo PREVIOUS-OUTPUT');
  await page.keyboard.press('Enter');
  await expect(rows).toContainText('PREVIOUS-OUTPUT');
  await expect(rows).toHaveText(/>\s*$/);

  const payload = `先頭-${Array.from({ length: 70 }, (_, index) => `${index.toString().padStart(3, '0')}日本語😀e\u0301`).join('')}-末尾`;
  await page.keyboard.insertText(`echo ${payload}`);
  await expect(rows).toContainText('末尾');
  await page.setViewportSize({ width: 1280, height: 800 });
  await expect(rows).toContainText('末尾');
  await page.setViewportSize({ width: 320, height: 640 });
  await expect(rows).toContainText('末尾');
  await page.keyboard.press('Backspace');
  await page.keyboard.insertText('端');
  await page.keyboard.press('Home');
  await expect(rows).toContainText('echo 先頭-');
  await page.keyboard.press('End');
  await expect(rows).toContainText('末端');
  await page.keyboard.press('Enter');
  await expect(rows).toContainText('末端');
  await expect(rows).toHaveText(/>\s*$/);

  const output = (await terminalTranscript(terminal)).replace(/\s/g, '');
  expect(output.split('PREVIOUS-OUTPUT').length - 1).toBe(2);
  expect(output.split(`${payload.slice(0, -1)}端`).length - 1).toBe(2);
});

test('通常の入力で途中の1文字を編集でき、履歴操作後も次のコマンドを入力できるか', async ({ page }) => {
  await page.goto('/');
  const terminal = page.getByRole('group', { name: '操作できるポートフォリオのターミナル' });
  const rows = terminal.locator('.xterm-rows');
  await terminal.locator('.Terminal-container').click();
  const payload = 'abcdefghijklmnopqrstuvwxyz0123456789';
  await page.keyboard.insertText(`echo ${payload}`);
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('Backspace');
  await page.keyboard.insertText('X');
  await page.keyboard.press('Enter');
  await expect(rows).toContainText('X89');
  await expect(rows).toHaveText(/>\s*$/);
  expect((await terminalTranscript(terminal)).replace(/\s/g, '')).toContain(`${payload.slice(0, -3)}X89`);

  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.insertText('echo SHORT');
  await page.keyboard.press('Enter');
  await expect(rows).toContainText('SHORT');
  await expect(rows).toHaveText(/>\s*$/);
});

for (const width of [375, 1280]) {
  test(`画面幅${width}pxでドラッグした文字と選択ハイライトの位置が一致する`, async ({ page }) => {
    await page.setViewportSize({ width, height: 812 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const terminal = page.getByRole('group', { name: '操作できるポートフォリオのターミナル' });
    await terminal.locator('.Terminal-container').click();
    await expect(terminal.locator('.xterm-rows')).toHaveText(/>\s*$/);
    const firstLine = terminal.locator('.xterm-rows > div').first();
    await expect(firstLine).toHaveText('Welcome to my portfolio!');
    const firstText = firstLine.locator('span').first();
    await expect(firstText).toBeVisible();
    const firstBox = await visibleBox(firstText);

    await page.mouse.move(firstBox.x + 0.5, firstBox.y + firstBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(firstBox.x + firstBox.width - 0.5, firstBox.y + firstBox.height / 2, { steps: 10 });
    await page.mouse.up();

    const selection = terminal.locator('.xterm-selection div:visible');
    await expect(selection).toHaveCount(1);
    // 文字だけに余白が付くと、マウス座標と選択背景が別の行・列へずれる。
    await expect.poll(async () => {
      const box = await selection.first().boundingBox();
      if (!box) return Infinity;
      return Math.max(Math.abs(box.x - firstBox.x), Math.abs(box.y - firstBox.y), Math.abs(box.width - firstBox.width), Math.abs(box.height - firstBox.height));
    }).toBeLessThan(1);

    const secondBox = await visibleBox(terminal.locator('.xterm-rows > div').nth(1).locator('span').first());
    await page.mouse.move(firstBox.x + 0.5, firstBox.y + firstBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(secondBox.x + secondBox.width - 0.5, secondBox.y + secondBox.height / 2, { steps: 10 });
    await page.mouse.up();
    await expect(selection).toHaveCount(2);
    await expect.poll(async () => {
      const box = await selection.nth(1).boundingBox();
      if (!box) return Infinity;
      return Math.max(Math.abs(box.x - secondBox.x), Math.abs(box.y - secondBox.y), Math.abs(box.width - secondBox.width), Math.abs(box.height - secondBox.height));
    }).toBeLessThan(1);
  });
}
