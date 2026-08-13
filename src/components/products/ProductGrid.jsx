import ProductCard from "./ProductCard";

function ProductGrid({ products = [] }) {
  if (!products.length) {
    return <p className="empty-state">No products found.</p>;
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default ProductGrid;
