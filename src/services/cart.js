import { shopifyFetch } from "./shopify";
import { normalizeCartQuantity } from "../utils/quantity";
import {
  getStorageItem,
  removeStorageItem,
  setStorageItem,
} from "../utils/storage";

const CART_STORAGE_KEY = "shopify_cart_id";

function getStoredCartId() {
  return getStorageItem(CART_STORAGE_KEY);
}

function saveCartId(cartId) {
  if (cartId) {
    setStorageItem(CART_STORAGE_KEY, cartId);
  }
}

function removeStoredCartId() {
  removeStorageItem(CART_STORAGE_KEY);
}

function getUserErrorMessage(errors = []) {
  return errors.map((error) => error.message).filter(Boolean).join(", ");
}

function ensureValidCartLine(variantId, quantity) {
  if (!variantId) {
    throw new Error("A product variant is required.");
  }

  return {
    merchandiseId: variantId,
    quantity: normalizeCartQuantity(quantity),
  };
}

function getMutationCart(payload, operationName, { persist = true } = {}) {
  const errors = payload?.userErrors ?? [];

  if (errors.length) {
    throw new Error(getUserErrorMessage(errors));
  }

  const cart = payload?.cart ?? null;

  if (!cart) {
    removeStoredCartId();
    throw new Error(`${operationName} did not return a cart.`);
  }

  if (persist) {
    saveCartId(cart.id);
  }

  return cart;
}

const CART_FRAGMENT = `
  id
  checkoutUrl
  totalQuantity

  cost {
    totalAmount {
      amount
      currencyCode
    }
  }

  lines(first: 100) {
    nodes {
      id
      quantity

      cost {
        totalAmount {
          amount
          currencyCode
        }
      }

      merchandise {
        ... on ProductVariant {
          id
          title

          price {
            amount
            currencyCode
          }

          product {
            id
            title
            handle

            featuredImage {
              url
              altText
            }
          }
        }
      }
    }
  }
`;

export async function getCart() {
  const cartId = getStoredCartId();

  if (!cartId) {
    return null;
  }

  const data = await shopifyFetch(
    `
      query GetCart($cartId: ID!) {
        cart(id: $cartId) {
          ${CART_FRAGMENT}
        }
      }
    `,
    {
      cartId,
    },
  );

  if (!data.cart) {
    removeStoredCartId();
    return null;
  }

  return data.cart;
}

export async function createCart(variantId, quantity = 1) {
  const data = await shopifyFetch(
    `
      mutation CreateCart($input: CartInput) {
        cartCreate(input: $input) {
          cart {
            ${CART_FRAGMENT}
          }

          userErrors {
            field
            message
          }
        }
      }
    `,
    {
      input: {
        lines: [ensureValidCartLine(variantId, quantity)],
      },
    },
  );

  return getMutationCart(data.cartCreate, "Create cart");
}

export async function createCheckoutCart(variantId, quantity = 1) {
  const data = await shopifyFetch(
    `
      mutation CreateCheckoutCart($input: CartInput) {
        cartCreate(input: $input) {
          cart {
            id
            checkoutUrl
          }

          userErrors {
            field
            message
          }
        }
      }
    `,
    {
      input: {
        lines: [ensureValidCartLine(variantId, quantity)],
      },
    },
  );

  return getMutationCart(data.cartCreate, "Create checkout cart", {
    persist: false,
  });
}

export async function addToCart(variantId, quantity = 1) {
  const existingCart = await getCart();

  if (!existingCart) {
    return createCart(variantId, quantity);
  }

  const data = await shopifyFetch(
    `
      mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart {
            ${CART_FRAGMENT}
          }

          userErrors {
            field
            message
          }
        }
      }
    `,
    {
      cartId: existingCart.id,
      lines: [ensureValidCartLine(variantId, quantity)],
    },
  );

  return getMutationCart(data.cartLinesAdd, "Add to cart");
}

export async function updateCartLine(lineId, quantity) {
  const cartId = getStoredCartId();

  if (!cartId || !lineId) {
    return null;
  }

  const data = await shopifyFetch(
    `
      mutation UpdateCartLine($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
          cart {
            ${CART_FRAGMENT}
          }

          userErrors {
            field
            message
          }
        }
      }
    `,
    {
      cartId,
      lines: [
        {
          id: lineId,
          quantity: normalizeCartQuantity(quantity),
        },
      ],
    },
  );

  return getMutationCart(data.cartLinesUpdate, "Update cart line");
}

export async function removeCartLine(lineId) {
  const cartId = getStoredCartId();

  if (!cartId || !lineId) {
    return null;
  }

  const data = await shopifyFetch(
    `
      mutation RemoveCartLine($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
          cart {
            ${CART_FRAGMENT}
          }

          userErrors {
            field
            message
          }
        }
      }
    `,
    {
      cartId,
      lineIds: [lineId],
    },
  );

  return getMutationCart(data.cartLinesRemove, "Remove cart line");
}

export function getCheckoutUrl(cart) {
  return cart?.checkoutUrl || "";
}
