import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import App from '../src/App';
import { PRODUCTS } from '../src/data/products';

// xterm はブラウザ専用のため、Node でのルート表示テストでは差し替える。
vi.mock('../src/versions/Terminal/Terminal', () => ({
  default: () => <div className="Terminal-wrapper" />,
}));

function renderAt(path: string) {
  return renderToStaticMarkup(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

function productCards(html: string) {
  return [...html.matchAll(/<article class="product-card">([\s\S]*?)<\/article>/g)]
    .map((match) => match[1]);
}

describe('サイトのルート', () => {
  it('Home にターミナルの配置と共通ナビゲーションを表示する', () => {
    const html = renderAt('/');
    expect(html).toContain('Terminal-wrapper');
    expect(html).toContain('メインナビゲーション');
  });

  it('Profile と Skills を表示する', () => {
    expect(renderAt('/about')).toContain('<h1>Profile</h1>');
    expect(renderAt('/skills')).toContain('<h1>Skills</h1>');
  });

  it('Products 一覧に全作品のカードを表示する', () => {
    const listHtml = renderAt('/products');
    const cards = productCards(listHtml);

    expect(cards).toHaveLength(PRODUCTS.length);
    for (const product of PRODUCTS) {
      const card = cards.find((item) => item.includes(`<h2>${product.title}</h2>`));
      expect(card).toBeDefined();
      expect(card?.includes('class="product-card-featured"')).toBe(product.featured);
      expect(card).not.toContain(`href="/products/${product.slug}"`);
      expect(card).toContain(`src="${product.imageUrl}"`);
      expect(card).toContain(product.description || '紹介文は準備中です。');
      for (const technology of product.technologies) {
        expect(card).toContain(technology);
      }
      if (product.siteUrl) {
        expect(card).toContain(`href="${product.siteUrl}"`);
      } else {
        expect(card).not.toContain('公開サイト ↗');
      }
      if (product.githubUrl) {
        expect(card).toContain(`href="${product.githubUrl}"`);
      } else {
        expect(card).not.toContain('GitHub ↗');
      }
    }
  });

  it('技術が未登録の作品に技術欄を表示しない', () => {
    const cards = productCards(renderAt('/products'));
    const productsWithoutTechnologies = PRODUCTS.filter((product) => product.technologies.length === 0);

    expect(productsWithoutTechnologies.length).toBeGreaterThan(0);
    for (const product of productsWithoutTechnologies) {
      const card = cards.find((item) => item.includes(`<h2>${product.title}</h2>`));
      expect(card).toBeDefined();
      expect(card).not.toContain('aria-label="使用技術"');
    }
  });

  it('不明な URL と廃止した詳細URLには案内画面を表示する', () => {
    expect(renderAt('/unknown')).toContain('ページが見つかりません');
    expect(renderAt('/products/unknown')).toContain('ページが見つかりません');
    for (const product of PRODUCTS) {
      expect(renderAt(`/products/${product.slug}`)).toContain('ページが見つかりません');
    }
  });
});
