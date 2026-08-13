import PageStatus from "../components/common/PageStatus";
import ProductGrid from "../components/products/ProductGrid";
import { useProducts } from "../hooks/useProducts";

function Home() {
  const { error, loading, products } = useProducts({
    first: 20,
  });

  if (loading) {
    return (
      <PageStatus
        className="product-listing-section"
        title="Featured Products"
        message="Loading products..."
      />
    );
  }

  if (error) {
    return (
      <PageStatus
        className="product-listing-section"
        title="Featured Products"
        message={error}
      />
    );
  }

  return (
    <main>
      <section className="product-listing-section">
        <div className="container">
          <div className="section-head">
            <div>
              <h1>Featured Products</h1>
              <p>Fresh products selected from the storefront catalog.</p>
            </div>

            <span>{products.length} products</span>
          </div>

          <ProductGrid products={products} />
        </div>
      </section>
    </main>
  );
}

export default Home;
