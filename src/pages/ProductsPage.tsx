import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { PRODUCTS } from '../data/products';
import './ProductsPage.css';

export default function ProductsPage() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash.startsWith('#product-')) return;

    const target = document.getElementById(hash.slice(1));
    target?.scrollIntoView({ block: 'start' });
    target?.focus({ preventScroll: true });
  }, [hash]);

  return (
    <main className="site-page products-page">
      <header className="products-intro">
        <p className="product-eyebrow">PORTFOLIO / PRODUCTS</p>
        <h1>Products</h1>
        <p>制作物一覧です。</p>
        <span className="products-count">{PRODUCTS.length} PRODUCTS</span>
      </header>
      <div className="products-grid">
        {PRODUCTS.map((product) => (
          <ProductCard key={product.slug} product={product} anchorId={`product-${product.slug}`} />
        ))}
      </div>
    </main>
  );
}
