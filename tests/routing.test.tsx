import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import App from '../src/App';
import { PRODUCTS } from '../src/data/products';
import { PROFILE } from '../src/data/profile';

// xterm はブラウザ専用のため、Node でのルート表示テストでは差し替える。
vi.mock('../src/components/Terminal/Terminal', () => ({
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
  it('Home にターミナルと主要ページへの導線を表示する', () => {
    const html = renderAt('/');
    expect(html).toContain('Terminal-wrapper');
    expect(html).toContain('メインナビゲーション');
    expect(html).toContain('href="/about"');
    expect(html).toContain('href="/products"');
    expect(html).toContain(PROFILE.about);
    expect(html).not.toContain('View Works');
    expect(html).not.toContain('RiST');
  });

  it('Home に注目作品だけを表示する', () => {
    const cards = productCards(renderAt('/'));
    const featuredProducts = PRODUCTS.filter((product) => product.featured);

    expect(cards).toHaveLength(featuredProducts.length);
    for (const product of PRODUCTS) {
      const card = cards.find((item) => item.includes(`<h2>${product.title}</h2>`));
      expect(card !== undefined).toBe(product.featured);
    }
  });

  it('Profile と Skills を表示する', () => {
    expect(renderAt('/about')).toContain('<h1>Profile</h1>');
    expect(renderAt('/skills')).toContain('<h1>Skills</h1>');
  });

  it('Profile に写真、所属、興味分野、SNSリンクを表示する', () => {
    const html = renderAt('/about');

    expect(html).toContain(`src="${PROFILE.avatarUrl}"`);
    expect(html).toContain(PROFILE.affiliation);
    expect(html).toContain(PROFILE.about);
    for (const interest of PROFILE.interests) {
      expect(html).toContain(interest);
    }
    expect(html).toContain(`href="${PROFILE.xUrl}"`);
    expect(html).toContain(`href="${PROFILE.githubUrl}"`);
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
