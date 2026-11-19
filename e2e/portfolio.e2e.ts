import { expect, test } from '@playwright/test';
import { INTERNSHIPS } from '../src/data/internships';
import { PRODUCTS } from '../src/data/products';

for (const [label, path, heading] of [
  ['Profile', '/about', 'Profile'],
  ['Skills', '/skills', 'Skills'],
  ['Products', '/products', 'Products'],
]) {
  test(`Homeのメニューから${label}へ移動できる`, async ({ page }) => {
    await page.goto('/');
    await page.getByRole('navigation', { name: 'メインナビゲーション' })
      .getByRole('link', { name: label, exact: true }).click();

    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();
  });
}

test('Homeから作品一覧を開き、作品と外部リンクを確認できる', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: '制作物を見る' }).click();

  await expect(page).toHaveURL(/\/products$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Products' })).toBeVisible();
  await expect(page.getByRole('article')).toHaveCount(PRODUCTS.length);
  for (const product of PRODUCTS) {
    await expect(page.getByRole('heading', { level: 2, name: product.title })).toBeVisible();
  }

  const arrow = page.getByRole('article').filter({
    has: page.getByRole('heading', { level: 2, name: 'ARROW（JPHACKS 2025）' }),
  });
  const githubLink = arrow.getByRole('link', { name: /GitHub/ });
  await expect(githubLink).toHaveAttribute('href', 'https://github.com/jphacks/os_2508');
  await expect(githubLink).toHaveAttribute('target', '_blank');
  await expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
});

test('存在しないURLからHomeへ戻れる', async ({ page }) => {
  await page.goto('/unknown');

  await expect(page.getByRole('heading', { level: 1, name: 'ページが見つかりません' }))
    .toBeVisible();
  await page.getByRole('link', { name: 'Homeへ戻る' }).click();
  await expect(page).toHaveURL(/\/$/);
});

test('Skillsの関連リンクからインターン経験のカードへ移動できる', async ({ page }) => {
  const experience = INTERNSHIPS.find((item) => item.technologies?.length);
  if (!experience) throw new Error('技術を掲載したインターン経験がありません');

  await page.goto('/skills');
  await page.locator(`a[href="#internship-${experience.id}"]`).first().click();

  await expect(page).toHaveURL(new RegExp(`#internship-${experience.id}$`));
  await expect(page.locator(`#internship-${experience.id}`)).toBeInViewport();
});

test('ターミナルのcdコマンドでページを移動できる', async ({ page }) => {
  await page.goto('/');

  const terminal = page.getByRole('group', { name: '操作できるポートフォリオのターミナル' });
  await terminal.locator('.Terminal-container').click();
  await page.keyboard.type('cd skills');
  await page.keyboard.press('Enter');

  await expect(page).toHaveURL(/\/skills$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Skills' })).toBeVisible();
});

test('動きを減らす設定ではページとカードの演出を停止する', async ({ page }) => {
  await page.goto('/products');

  const content = page.locator('.site-page');
  const card = page.locator('.product-card').first();
  await expect(content).toHaveCSS('animation-name', 'site-page-appear');
  await expect(card).toHaveCSS('transition-duration', '0.18s, 0.18s, 0.18s');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(content).toHaveCSS('animation-name', 'none');
  await expect(card).toHaveCSS('transition-duration', '0s');
  await card.hover();
  await expect(card).toHaveCSS('transform', 'none');
});

// 同じ確認を春夏秋冬で行い、季節ごとに独立したテストを1件ずつ登録する。
for (const [season, month] of [
  ['spring', 4], ['summer', 7], ['autumn', 10], ['winter', 1],
] as const) {
  test(`${season}の装飾は操作を妨げず、動きを減らす設定では静止する`, async ({ page }) => {
    // ブラウザの日付を各季節の代表月に固定する。Dateの月は0始まりなので1を引く。
    await page.clock.setFixedTime(new Date(2026, month - 1, 15, 12));
    await page.goto('/');

    const decoration = page.locator('.seasonal-decoration');
    // 日付に対応する季節が、装飾とサイト全体のテーマに反映されることを確認する。
    await expect(decoration).toHaveClass(`seasonal-decoration seasonal-decoration--${season}`);
    await expect(page.locator('.site-shell')).toHaveClass(`site-shell site-shell--${season}`);

    // 装飾が読み上げ対象にならず、背後のリンクなどへのクリックも妨げない設定を確認する。
    await expect(decoration).toHaveAttribute('aria-hidden', 'true');
    await expect(decoration).toHaveCSS('pointer-events', 'none');

    // 装飾が画面全体の背面に固定され、Homeのヒーロー内ではなく共通レイアウト直下にあることを確認する。
    await expect(decoration).toHaveCSS('position', 'fixed');
    await expect(decoration).toHaveCSS('z-index', '-1');
    await expect(page.locator('.site-shell > .seasonal-decoration')).toHaveCount(1);
    await expect(page.locator('.home-hero .seasonal-decoration')).toHaveCount(0);

    // 各SVGの読み込みを待ち、画像本来の幅が0より大きいことで画像切れがないか確認する。
    for (const image of await decoration.locator('img').all()) {
      await expect.poll(() => image.evaluate((element) => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    }

    // Profileにページを移動しても、共通の季節装飾が引き続き表示されることを確認する。
    await page.getByRole('navigation', { name: 'メインナビゲーション' })
      .getByRole('link', { name: 'Profile', exact: true }).click();
    await expect(decoration).toBeVisible();

    // 「動きを減らす」設定を再現し、装飾要素と画像のアニメーションが停止することを確認する。
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(decoration.locator('span').first()).toHaveCSS('animation-name', 'none');
    for (const image of await decoration.locator('img').all()) {
      await expect(image).toHaveCSS('animation-name', 'none');
    }
  });
}
