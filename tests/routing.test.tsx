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

  it('Products 一覧と全作品の詳細を表示する', () => {
    const listHtml = renderAt('/products');

    for (const product of PRODUCTS) {
      expect(listHtml).toContain(`href="/products/${product.slug}"`);
      expect(renderAt(`/products/${product.slug}`)).toContain(product.title);
    }
  });

  it('不明な URL と slug には案内画面を表示する', () => {
    expect(renderAt('/unknown')).toContain('ページが見つかりません');
    expect(renderAt('/products/unknown')).toContain('ページが見つかりません');
  });
});
