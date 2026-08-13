import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import PageStatus from "../components/common/PageStatus";
import { useCart } from "../context/useCart";
import { useProduct } from "../hooks/useProduct";
import { createCheckoutCart } from "../services/cart";
import { formatMoney } from "../utils/formatMoney";
import {
  MAX_CART_QUANTITY,
  MIN_CART_QUANTITY,
  normalizeCartQuantity,
} from "../utils/quantity";
import { redirectToSecureUrl } from "../utils/url";

function Product() {
  const { handle } = useParams();
  const { addToCart } = useCart();
  const { error, loading, product } = useProduct(handle);

  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [quantity, setQuantity] = useState(MIN_CART_QUANTITY);
  const [addingToCart, setAddingToCart] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);
  const [cartMessage, setCartMessage] = useState("");

  const variants = useMemo(() => product?.variants?.nodes ?? [], [product]);

  const selectedVariant = useMemo(() => {
    const selectedVariant =
      variants.find((variant) => variant.id === selectedVariantId) ?? null;

    return (
      selectedVariant ||
      variants.find((variant) => variant.availableForSale) ||
      variants[0] ||
      null
    );
  }, [selectedVariantId, variants]);

  const productImages = useMemo(() => {
    const images = product?.images?.nodes ?? [];

    if (images.length) {
      return images;
    }

    return product?.featuredImage ? [product.featuredImage] : [];
  }, [product]);

  const canPurchase = Boolean(selectedVariant?.availableForSale);
  const isBusy = addingToCart || buyingNow;
  const price = formatMoney(selectedVariant?.price);

  async function handleAddToCart() {
    if (!canPurchase) {
      return;
    }

    try {
      setAddingToCart(true);
      setCartMessage("");

      await addToCart(selectedVariant.id, quantity);

      setCartMessage("Product added to cart.");
    } catch (error) {
      setCartMessage(error.message || "Unable to add product to cart.");
    } finally {
      setAddingToCart(false);
    }
  }

  async function handleBuyNow() {
    if (!canPurchase) {
      return;
    }

    try {
      setBuyingNow(true);
      setCartMessage("");

      const checkoutCart = await createCheckoutCart(selectedVariant.id, quantity);

      redirectToSecureUrl(checkoutCart?.checkoutUrl);
    } catch (error) {
      setCartMessage(error.message || "Unable to start checkout.");
    } finally {
      setBuyingNow(false);
    }
  }

  function increaseQuantity() {
    setQuantity((currentQuantity) =>
      Math.min(MAX_CART_QUANTITY, currentQuantity + 1),
    );
  }

  function decreaseQuantity() {
    setQuantity((currentQuantity) =>
      Math.max(MIN_CART_QUANTITY, currentQuantity - 1),
    );
  }

  function handleQuantityInput(event) {
    setQuantity(normalizeCartQuantity(event.target.value));
  }

  if (loading) {
    return (
      <PageStatus
        className="product-detail-section"
        title="Product"
        message="Loading product..."
      />
    );
  }

  if (error) {
    return (
      <PageStatus
        className="product-detail-section"
        title="Product"
        message={error}
      />
    );
  }

  if (!product) {
    return null;
  }

  return (
    <main>
      <section className="product-detail-section">
        <div className="container">
          <div className="product-detail">
            <div className="product-detail-images">
              {productImages.length ? (
                productImages.map((image, index) => (
                  <div className="product-detail-image" key={`${image.url}-${index}`}>
                    <img
                      src={image.url}
                      alt={image.altText || product.title}
                      loading={index === 0 ? "eager" : "lazy"}
                      decoding="async"
                    />
                  </div>
                ))
              ) : (
                <div className="product-detail-image product-detail-image-empty">
                  <span>No image</span>
                </div>
              )}
            </div>

            <div className="product-detail-content">
              <div>
                <p className="eyebrow">Product</p>
                <h1>{product.title}</h1>
              </div>

              {product.description && (
                <p className="product-description">{product.description}</p>
              )}

              {variants.length > 1 && (
                <div className="product-variants">
                  <h2>Select Variant</h2>

                  <div className="variant-options">
                    {variants.map((variant) => {
                      const isSelected = selectedVariant?.id === variant.id;

                      return (
                        <button
                          type="button"
                          key={variant.id}
                          disabled={!variant.availableForSale}
                          onClick={() => setSelectedVariantId(variant.id)}
                          className={isSelected ? "active" : undefined}
                          aria-pressed={isSelected}
                        >
                          {variant.title}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {price && <div className="product-price">{price}</div>}

              <div className="product-quantity" aria-label="Quantity">
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  disabled={quantity <= MIN_CART_QUANTITY || isBusy}
                  aria-label="Decrease quantity"
                >
                  -
                </button>

                <input
                  type="number"
                  min={MIN_CART_QUANTITY}
                  max={MAX_CART_QUANTITY}
                  value={quantity}
                  onChange={handleQuantityInput}
                  disabled={isBusy}
                  aria-label="Product quantity"
                />

                <button
                  type="button"
                  onClick={increaseQuantity}
                  disabled={quantity >= MAX_CART_QUANTITY || isBusy}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <div className="product-actions">
                <button
                  type="button"
                  className="button-secondary"
                  disabled={!canPurchase || isBusy}
                  onClick={handleAddToCart}
                >
                  {addingToCart ? "Adding..." : "Add to Cart"}
                </button>

                <button
                  type="button"
                  className="button-primary"
                  disabled={!canPurchase || isBusy}
                  onClick={handleBuyNow}
                >
                  {buyingNow ? "Processing..." : "Buy Now"}
                </button>
              </div>

              {!canPurchase && <p className="cart-message">This variant is sold out.</p>}

              {cartMessage && (
                <p className="cart-message" role="status" aria-live="polite">
                  {cartMessage}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Product;
