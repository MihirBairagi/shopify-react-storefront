import PageStatus from "../components/common/PageStatus";
import ProductGrid from "../components/products/ProductGrid";
import { useProducts } from "../hooks/useProducts";

function Products() {
  const { error, loading, products } = useProducts({
    first: 50,
  });

  if (loading) {
    return (
      <PageStatus
        className="products-section"
        title="Products"
        message="Loading products..."
      />
    );
  }

  if (error) {
    return (
      <PageStatus
        className="products-section"
        title="Products"
        message={error}
      />
    );
  }

  return (
    <main>
      <section className="products-section">
        <div className="container">
          <div className="section-head">
            <div>
              <h1>Products</h1>
              <p>Browse the complete storefront catalog.</p>
            </div>

            <span>
              {products.length} {products.length === 1 ? "product" : "products"}
            </span>
          </div>

          <ProductGrid products={products} />
        </div>
      </section>
    </main>
  );
}

export default Products;
