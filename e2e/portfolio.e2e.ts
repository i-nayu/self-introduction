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
