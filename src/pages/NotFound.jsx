import { Link } from "react-router-dom";

function NotFound() {
  return (
    <main>
      <section className="page-status">
        <div className="container">
          <h1>Page Not Found</h1>
          <p>page not available</p>

          <Link className="button-link" to="/products">
            Browse Products
          </Link>
        </div>
      </section>
    </main>
  );
}

export default NotFound;
