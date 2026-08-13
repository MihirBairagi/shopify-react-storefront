import { useState } from "react";
import { Link } from "react-router-dom";

import PageStatus from "../components/common/PageStatus";
import { useCart } from "../context/useCart";
import { getCheckoutUrl } from "../services/cart";
import { formatMoney } from "../utils/formatMoney";
import {
  MAX_CART_QUANTITY,
  MIN_CART_QUANTITY,
  normalizeCartQuantity,
} from "../utils/quantity";
import { redirectToSecureUrl } from "../utils/url";

function Cart() {
  const { cart, cartLoading, removeCartLine, updateCartLine } = useCart();
  const [updatingLine, setUpdatingLine] = useState(null);
  const [error, setError] = useState("");

  const lines = cart?.lines?.nodes ?? [];
  const total = formatMoney(cart?.cost?.totalAmount);

  async function handleQuantityChange(line, quantity) {
    const nextQuantity = normalizeCartQuantity(quantity);

    if (nextQuantity === line.quantity) {
      return;
    }

    try {
      setUpdatingLine(line.id);
      setError("");

      await updateCartLine(line.id, nextQuantity);
    } catch (error) {
      setError(error.message || "Unable to update cart.");
    } finally {
      setUpdatingLine(null);
    }
  }

  async function handleRemove(lineId) {
    try {
      setUpdatingLine(lineId);
      setError("");

      await removeCartLine(lineId);
    } catch (error) {
      setError(error.message || "Unable to remove product.");
    } finally {
      setUpdatingLine(null);
    }
  }

  function handleCheckout() {
    try {
      redirectToSecureUrl(getCheckoutUrl(cart));
    } catch (error) {
      setError(error.message || "Unable to start checkout.");
    }
  }

  if (cartLoading) {
    return (
      <PageStatus
        className="cart-section"
        title="Your Cart"
        message="Loading cart..."
      />
    );
  }

  if (!lines.length) {
    return (
      <main>
        <section className="cart-section">
          <div className="container">
            <div className="empty-cart">
              <h1>Your Cart</h1>
              <p>Your cart is empty.</p>

              <Link className="button-link" to="/products">
                Browse Products
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="cart-section">
        <div className="container">
          <div className="section-head">
            <div>
              <h1>Your Cart</h1>
              <p>
                {cart.totalQuantity} {cart.totalQuantity === 1 ? "item" : "items"}
              </p>
            </div>
          </div>

          {error && (
            <p className="cart-error" role="alert">
              {error}
            </p>
          )}

          <div className="cart-layout">
            <div className="cart-items">
              {lines.map((line) => {
                const variant = line.merchandise;
                const product = variant?.product;
                const isUpdating = updatingLine === line.id;

                if (!variant || !product) {
                  return null;
                }

                return (
                  <article className="cart-item" key={line.id}>
                    <Link
                      className="cart-item-image"
                      to={`/products/${product.handle}`}
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

                    <div className="cart-item-content">
                      <div>
                        <h2>
                          <Link to={`/products/${product.handle}`}>
                            {product.title}
                          </Link>
                        </h2>

                        {variant.title && variant.title !== "Default Title" && (
                          <p>{variant.title}</p>
                        )}
                      </div>

                      <p className="cart-item-price">{formatMoney(variant.price)}</p>

                      <div className="cart-item-actions">
                        <div className="cart-item-quantity">
                          <button
                            type="button"
                            disabled={isUpdating || line.quantity <= MIN_CART_QUANTITY}
                            onClick={() =>
                              handleQuantityChange(line, line.quantity - 1)
                            }
                            aria-label={`Decrease quantity for ${product.title}`}
                          >
                            -
                          </button>

                          <span>{line.quantity}</span>

                          <button
                            type="button"
                            disabled={isUpdating || line.quantity >= MAX_CART_QUANTITY}
                            onClick={() =>
                              handleQuantityChange(line, line.quantity + 1)
                            }
                            aria-label={`Increase quantity for ${product.title}`}
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          className="text-button"
                          disabled={isUpdating}
                          onClick={() => handleRemove(line.id)}
                        >
                          {isUpdating ? "Updating..." : "Remove"}
                        </button>
                      </div>
                    </div>

                    <div className="cart-item-total">
                      <span>Line Total</span>
                      <strong>{formatMoney(line.cost?.totalAmount)}</strong>
                    </div>
                  </article>
                );
              })}
            </div>

            <aside className="cart-summary" aria-label="Cart summary">
              <div>
                <span>Total Items</span>
                <strong>{cart.totalQuantity}</strong>
              </div>

              <div>
                <span>Total</span>
                <strong>{total}</strong>
              </div>

              <button type="button" className="button-primary" onClick={handleCheckout}>
                Go To Checkout
              </button>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Cart;
