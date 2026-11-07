import { Link, useParams } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
import NotFoundPage from './NotFoundPage';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const product = PRODUCTS.find((item) => item.slug === slug);

  if (!product) return <NotFoundPage />;

  return (
    <main className="site-page site-detail">
      <Link to="/products">← Products</Link>
      <h1>{product.title}</h1>
      {product.imageUrl && <img src={product.imageUrl} alt={`${product.title}のスクリーンショット`} />}
      {product.description && <p>{product.description}</p>}
      {product.technologies.length > 0 && (
        <ul className="site-tags">
          {product.technologies.map((technology) => <li key={technology}>{technology}</li>)}
        </ul>
      )}
      <div className="site-links">
        {product.siteUrl && <a href={product.siteUrl} target="_blank" rel="noopener noreferrer">サイトを見る</a>}
        {product.githubUrl && <a href={product.githubUrl} target="_blank" rel="noopener noreferrer">GitHub</a>}
      </div>
    </main>
  );
}
