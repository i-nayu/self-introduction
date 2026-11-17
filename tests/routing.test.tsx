import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import App from '../src/App';
import ProductCard from '../src/components/ProductCard';
import { INTERNSHIPS } from '../src/data/internships';
import { PRODUCTS } from '../src/data/products';
import { PROFILE } from '../src/data/profile';
import { SKILL_GROUPS } from '../src/data/skills';

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
  return [...html.matchAll(/<article class="product-card"[^>]*>([\s\S]*?)<\/article>/g)]
    .map((match) => match[1]);
}

function skillSections(html: string) {
  return [...html.matchAll(/<section class="skills-category"[^>]*>([\s\S]*?)<\/section>/g)]
    .map((match) => match[1]);
}

function internshipCards(html: string) {
  return [...html.matchAll(/<article class="internship-card"[^>]*>([\s\S]*?)<\/article>/g)]
    .map((match) => match[1]);
}

describe('サイトのルート', () => {
  it('Home にターミナルと主要ページへの導線を表示する', () => {
    const html = renderAt('/');
    expect(html).toContain('Terminal-wrapper');
    expect(html).toContain('<h1 id="home-title">Portfolio</h1>');
    expect(html).toContain('メインナビゲーション');
    expect(html).toContain('href="/about"');
    expect(html).toContain('href="/products"');
    expect(html).toContain('制作物を見る');
    expect(html).not.toContain('プロフィールを見る');
    expect(html).not.toContain('ABOUT ME');
    expect(html).not.toContain(PROFILE.about);
    expect(html).not.toContain('©');
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

  it('Skills にカテゴリと掲載済みの技術を表示する', () => {
    const html = renderAt('/skills');
    const sections = skillSections(html);

    expect(html).toContain('<h2 id="technical-stack-title">技術スタック</h2>');
    expect(sections).toHaveLength(SKILL_GROUPS.length);
    for (const group of SKILL_GROUPS) {
      const section = sections.find((item) => item.includes(`<h3 id="skills-${group.id}">${group.label}</h3>`));
      expect(section).toBeDefined();
      expect(section).toContain(group.description);
      for (const skill of group.skills) {
        expect(section).toContain(`<li>${skill}</li>`);
      }
      if (group.skills.length === 0) {
        expect(section).toContain('準備中…');
        expect(section).not.toContain('関連するProducts');
      }
    }
  });

  it('Skills から実際に使用技術が一致する Product にだけリンクする', () => {
    const sections = skillSections(renderAt('/skills'));

    for (const group of SKILL_GROUPS) {
      const section = sections.find((item) => item.includes(`<h3 id="skills-${group.id}">${group.label}</h3>`));
      expect(section).toBeDefined();
      for (const product of PRODUCTS) {
        const matchedSkills = group.skills.filter((skill) => product.technologies.includes(skill));
        const link = `href="/products#product-${product.slug}"`;
        if (matchedSkills.length > 0) {
          expect(section).toContain(link);
          expect(section).toContain(matchedSkills.join(' / '));
        } else {
          expect(section).not.toContain(link);
        }
      }
    }
  });

  it('Skills から技術が一致するインターン経験にだけリンクする', () => {
    const sections = skillSections(renderAt('/skills'));

    for (const group of SKILL_GROUPS) {
      const section = sections.find((item) => item.includes(`<h3 id="skills-${group.id}">${group.label}</h3>`));
      expect(section).toBeDefined();
      for (const experience of INTERNSHIPS) {
        const matchedSkills = group.skills.filter((skill) => experience.technologies?.includes(skill));
        const link = `href="#internship-${experience.id}"`;
        if (matchedSkills.length > 0) {
          expect(section).toContain(link);
          expect(section).toContain(matchedSkills.join(' / '));
        } else {
          expect(section).not.toContain(link);
        }
      }
    }
  });

  it('Skills にインターンでの担当内容を表示する', () => {
    const html = renderAt('/skills');
    const cards = internshipCards(html);

    expect(html).toContain('<h2 id="internship-experience-title">インターン経験</h2>');
    expect(html).toContain('href="#technical-stack"');
    expect(html).toContain('href="#internship-experience"');
    expect(cards).toHaveLength(INTERNSHIPS.length);
    for (const experience of INTERNSHIPS) {
      const card = cards.find((item) => item.includes(`<h3>${experience.title}</h3>`));
      expect(card).toBeDefined();
      expect(html).toContain(`id="internship-${experience.id}"`);
      expect(card).toContain(experience.duration);
      expect(card).toContain(experience.role);
      expect(card).toContain(experience.summary);
      expect(card).toContain(experience.learning);
      for (const contribution of experience.contributions) {
        expect(card).toContain(`<li>${contribution}</li>`);
      }
      if (experience.technologies?.length) {
        expect(card).toContain('<h4>使用技術</h4>');
        for (const technology of experience.technologies) {
          expect(card).toContain(`<li>${technology}</li>`);
        }
      } else {
        expect(card).not.toContain('internship-card-technologies');
      }
    }
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
      expect(listHtml).toContain(`id="product-${product.slug}"`);
      expect(card?.includes('class="product-card-featured"')).toBe(product.featured);
      expect(card).not.toContain(`href="/products/${product.slug}"`);
      expect(card).toContain(`src="${product.imageUrl}"`);
      expect(card).toMatch(/<img\b[^>]*\balt="[^"]+"/);
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
    const productWithoutTechnologies = { ...PRODUCTS[0], technologies: [] };
    const html = renderToStaticMarkup(<ProductCard product={productWithoutTechnologies} />);

    expect(html).not.toContain('aria-label="使用技術"');
  });

  it('不明な URL と廃止した詳細URLには案内画面を表示する', () => {
    expect(renderAt('/unknown')).toContain('ページが見つかりません');
    expect(renderAt('/products/unknown')).toContain('ページが見つかりません');
    for (const product of PRODUCTS) {
      expect(renderAt(`/products/${product.slug}`)).toContain('ページが見つかりません');
    }
  });
});
