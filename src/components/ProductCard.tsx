import type { Product } from '../types/content';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
  anchorId?: string;
}

export default function ProductCard({ product, anchorId }: ProductCardProps) {
  return (
    <article className="product-card" id={anchorId} tabIndex={anchorId ? -1 : undefined}>
      <div className="product-card-media">
        <img
          src={product.imageUrl}
          alt={`${product.title}のスクリーンショット`}
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="product-card-content">
        {product.featured && <span className="product-card-featured">注目作品</span>}
        <h2>{product.title}</h2>
        <p className="product-card-description">
          {product.description || '紹介文は準備中です。'}
        </p>
        {product.technologies.length > 0 && (
          <ul className="product-card-tags" aria-label="使用技術">
            {product.technologies.map((technology) => (
              <li key={technology}>{technology}</li>
            ))}
          </ul>
        )}
        {(product.siteUrl || product.githubUrl) && (
          <div className="product-card-links">
            {product.siteUrl && (
              <a href={product.siteUrl} target="_blank" rel="noopener noreferrer">公開サイト ↗</a>
            )}
            {product.githubUrl && (
              <a href={product.githubUrl} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
