import { Link } from "react-router-dom";

import { formatMoney } from "../../utils/formatMoney";

function ProductCard({ product }) {
  const variant = product?.variants?.nodes?.[0];
  const isAvailable = Boolean(variant?.availableForSale);
  const price = formatMoney(variant?.price);

  if (!product) {
    return null;
  }

  return (
    <article className="product-card">
      <Link
        to={`/products/${product.handle}`}
        className="product-card-image"
        aria-label={`View ${product.title}`}
      >
        {product.featuredImage ? (
          <img
            src={product.featuredImage.url}
            alt={product.featuredImage.altText || product.title}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span>No image</span>
        )}
      </Link>

      <div className="product-card-content">
        <h2>
          <Link to={`/products/${product.handle}`}>{product.title}</Link>
        </h2>

        {product.description && <p>{product.description}</p>}

        <div className="product-card-meta">
          {price && <span className="product-card-price">{price}</span>}

          <span
            className={`product-card-status ${
              isAvailable ? "is-available" : "is-sold-out"
            }`}
          >
            {isAvailable ? "Available" : "Sold out"}
          </span>
        </div>

        <Link className="text-link" to={`/products/${product.handle}`}>
          View Product
        </Link>
      </div>
    </article>
  );
}

export default ProductCard;
