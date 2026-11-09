import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { PRODUCTS } from '../data/products';
import { PROFILE } from '../data/profile';
import Terminal from '../components/Terminal/Terminal';
import './HomePage.css';

const featuredProducts = PRODUCTS.filter((product) => product.featured);

export default function HomePage() {
  return (
    <main className="site-page home-page">
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-hero-copy">
          <p className="site-eyebrow">NAYU / PORTFOLIO</p>
          <h1 id="home-title">つくって、試して、<span>次へ。</span></h1>
          <p className="home-hero-lead">ハッカソンや個人開発で取り組んだ制作物を紹介します。</p>
          <div className="home-hero-actions">
            <Link className="home-button home-button-primary" to="/products">制作物を見る</Link>
            <Link className="home-button home-button-secondary" to="/about">プロフィールを見る</Link>
          </div>
          <p className="home-hero-affiliation">{PROFILE.name} · {PROFILE.affiliation}</p>
        </div>
        <div className="home-terminal" role="group" aria-label="操作できるポートフォリオのターミナル">
          <div className="home-terminal-bar" aria-hidden="true">
            <span className="home-terminal-dots"><i /><i /><i /></span>
            <span>nayu@portfolio</span>
          </div>
          <Terminal />
        </div>
      </section>

      <section className="home-intro" aria-labelledby="home-intro-title">
        <div>
          <p className="site-eyebrow">ABOUT ME</p>
          <h2 id="home-intro-title">こんにちは、nayuです。</h2>
        </div>
        <div className="home-intro-body">
          <p>{PROFILE.about}</p>
          <Link className="home-text-link" to="/about">Profileへ <span aria-hidden="true">→</span></Link>
        </div>
      </section>

      <section className="home-featured" aria-labelledby="home-featured-title">
        <div className="home-section-heading">
          <div>
            <p className="site-eyebrow">SELECTED PROJECTS</p>
            <h2 id="home-featured-title">Featured Products</h2>
            <p>注目の制作物を紹介します。</p>
          </div>
          <Link className="home-text-link" to="/products">すべての制作物 <span aria-hidden="true">→</span></Link>
        </div>
        <div className="home-featured-grid">
          {featuredProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
