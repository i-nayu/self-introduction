import ProductCard from '../components/ProductCard';
import { PRODUCTS } from '../data/products';

export default function ProductsPage() {
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
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </main>
  );
}
