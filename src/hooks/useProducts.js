import { useEffect, useState } from "react";

import { getProducts } from "../services/products";
import { isAbortError } from "../utils/isAbortError";
import { logger } from "../utils/logger";

export function useProducts({ first = 24 } = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      try {
        const nextProducts = await getProducts({
          first,
          signal: controller.signal,
        });

        setProducts(nextProducts);
        setError("");
      } catch (error) {
        if (isAbortError(error)) {
          return;
        }

        logger.error("Unable to load products:", error);
        setProducts([]);
        setError("Unable to load products.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      controller.abort();
    };
  }, [first]);

  return {
    error,
    loading,
    products,
  };
}
