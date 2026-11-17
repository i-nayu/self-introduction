import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { PRODUCTS } from '../data/products';
import Terminal from '../components/Terminal/Terminal';
import './HomePage.css';

const featuredProducts = PRODUCTS.filter((product) => product.featured);

export default function HomePage() {
  return (
    <main className="site-page home-page">
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-hero-heading">
          <div>
            <h1 id="home-title">Portfolio</h1>
          </div>
          <Link className="home-button home-button-primary" to="/products">制作物を見る</Link>
        </div>
        <div className="home-terminal" role="group" aria-label="操作できるポートフォリオのターミナル">
          <div className="home-terminal-bar" aria-hidden="true">
            <span className="home-terminal-dots"><i /><i /><i /></span>
            <span>nayu@portfolio</span>
          </div>
          <Terminal />
        </div>
      </section>

      <section className="home-featured" aria-labelledby="home-featured-title">
        <div className="home-section-heading">
          <div>
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
