export const MIN_CART_QUANTITY = 1;
export const MAX_CART_QUANTITY = 99;

export function normalizeCartQuantity(value) {
  const quantity = Number(value);

  if (!Number.isFinite(quantity)) {
    return MIN_CART_QUANTITY;
  }

  return Math.min(
    MAX_CART_QUANTITY,
    Math.max(MIN_CART_QUANTITY, Math.trunc(quantity)),
  );
}
