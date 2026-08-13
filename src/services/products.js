import { shopifyFetch } from "./shopify";

const PRODUCT_CARD_FRAGMENT = `
  fragment ProductCardFields on Product {
    id
    title
    handle
    description

    featuredImage {
      url
      altText
    }

    variants(first: 10) {
      nodes {
        id
        title
        availableForSale

        price {
          amount
          currencyCode
        }
      }
    }
  }
`;

const PRODUCT_DETAIL_FRAGMENT = `
  fragment ProductDetailFields on Product {
    id
    title
    handle
    description

    featuredImage {
      url
      altText
    }

    images(first: 20) {
      nodes {
        url
        altText
      }
    }

    options {
      name
      optionValues {
        name
      }
    }

    variants(first: 50) {
      nodes {
        id
        title
        availableForSale

        price {
          amount
          currencyCode
        }

        selectedOptions {
          name
          value
        }

        image {
          url
          altText
        }
      }
    }
  }
`;

function normalizeProductLimit(first) {
  const limit = Number(first);

  if (!Number.isFinite(limit)) {
    return 24;
  }

  return Math.min(100, Math.max(1, Math.trunc(limit)));
}

export async function getProducts({ first = 24, signal } = {}) {
  const data = await shopifyFetch(
    `
      query GetProducts($first: Int!) {
        products(first: $first) {
          nodes {
            ...ProductCardFields
          }
        }
      }

      ${PRODUCT_CARD_FRAGMENT}
    `,
    {
      first: normalizeProductLimit(first),
    },
    {
      signal,
    },
  );

  return data.products?.nodes ?? [];
}

export async function getProductByHandle(handle, { signal } = {}) {
  if (!handle) {
    return null;
  }

  const data = await shopifyFetch(
    `
      query GetProduct($handle: String!) {
        product(handle: $handle) {
          ...ProductDetailFields
        }
      }

      ${PRODUCT_DETAIL_FRAGMENT}
    `,
    {
      handle,
    },
    {
      signal,
    },
  );

  return data.product ?? null;
}
