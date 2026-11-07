import { Link } from 'react-router-dom';
import { PRODUCTS } from '../data/products';

export default function ProductsPage() {
  return (
    <main className="site-page">
      <h1>Products</h1>
      <div className="site-grid">
        {PRODUCTS.map((product) => (
          <article className="site-panel" key={product.slug}>
            <h2>{product.title}</h2>
            {product.description && <p>{product.description}</p>}
            <Link to={`/products/${product.slug}`}>詳細を見る</Link>
          </article>
        ))}
      </div>
    </main>
  );
}
