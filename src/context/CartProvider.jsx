import { useCallback, useEffect, useMemo, useState } from "react";

import {
  addToCart,
  getCart,
  removeCartLine,
  updateCartLine,
} from "../services/cart";
import { logger } from "../utils/logger";
import { CartContext } from "./cartContext";

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [cartLoading, setCartLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    async function loadCart() {
      try {
        const currentCart = await getCart();

        if (isActive) {
          setCart(currentCart);
        }
      } catch (error) {
        logger.error("Unable to load cart:", error);

        if (isActive) {
          setCart(null);
        }
      } finally {
        if (isActive) {
          setCartLoading(false);
        }
      }
    }

    loadCart();

    return () => {
      isActive = false;
    };
  }, []);

  const refreshCart = useCallback(async () => {
    setCartLoading(true);

    try {
      const currentCart = await getCart();
      setCart(currentCart);
      return currentCart;
    } catch (error) {
      logger.error("Unable to refresh cart:", error);
      setCart(null);
      return null;
    } finally {
      setCartLoading(false);
    }
  }, []);

  const handleAddToCart = useCallback(async (variantId, quantity = 1) => {
    const updatedCart = await addToCart(variantId, quantity);

    setCart(updatedCart);

    return updatedCart;
  }, []);

  const handleUpdateCartLine = useCallback(async (lineId, quantity) => {
    const updatedCart = await updateCartLine(lineId, quantity);

    setCart(updatedCart);

    return updatedCart;
  }, []);

  const handleRemoveCartLine = useCallback(async (lineId) => {
    const updatedCart = await removeCartLine(lineId);

    setCart(updatedCart);

    return updatedCart;
  }, []);

  const value = useMemo(
    () => ({
      addToCart: handleAddToCart,
      cart,
      cartCount: cart?.totalQuantity || 0,
      cartLoading,
      refreshCart,
      removeCartLine: handleRemoveCartLine,
      updateCartLine: handleUpdateCartLine,
    }),
    [
      cart,
      cartLoading,
      handleAddToCart,
      handleRemoveCartLine,
      handleUpdateCartLine,
      refreshCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
