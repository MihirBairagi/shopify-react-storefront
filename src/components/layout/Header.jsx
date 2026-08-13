import { Link, NavLink } from "react-router-dom";

import { useCart } from "../../context/useCart";

const navLinks = [
  {
    label: "Home",
    to: "/",
  },
  {
    label: "Products",
    to: "/products",
  },
];

function Header() {
  const { cartCount } = useCart();

  return (
    <header className="site-header">
      <div className="container">
        <div className="header-inner">
          <Link to="/" className="site-logo" aria-label="React Storefront home">
            React Storefront
          </Link>

          <nav className="site-navigation" aria-label="Primary navigation">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => (isActive ? "active" : undefined)}
              >
                {link.label}
              </NavLink>
            ))}

            <NavLink
              to="/cart"
              className={({ isActive }) => (isActive ? "active" : undefined)}
              aria-label={`Cart with ${cartCount} items`}
            >
              Cart
              <span className="cart-count">{cartCount}</span>
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
