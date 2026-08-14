import { useEffect, useState } from "react";

import { getProductByHandle } from "../services/products";
import { isAbortError } from "../utils/isAbortError";
import { logger } from "../utils/logger";

export function useProduct(handle) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadProduct() {
      try {
        const nextProduct = await getProductByHandle(handle, {
          signal: controller.signal,
        });

        if (!nextProduct) {
          setProduct(null);
          setError("Product not found.");
          return;
        }

        setProduct(nextProduct);
        setError("");
      } catch (error) {
        if (isAbortError(error)) {
          return;
        }

        logger.error("Unable to load product:", error);
        setProduct(null);
        setError("Unable to load product.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      controller.abort();
    };
  }, [handle]);

  return {
    error,
    loading,
    product,
  };
}
