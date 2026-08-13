import { logger } from "../utils/logger";

const DEFAULT_SHOPIFY_API_VERSION = "2026-07";

function getEnvValue(key) {
  return import.meta.env[key]?.trim() ?? "";
}

function normalizeStoreDomain(value) {
  const domain = value
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/\/.*$/, "");

  if (!domain) {
    return "";
  }

  if (!/^[a-z0-9.-]+$/i.test(domain)) {
    throw new Error("Shopify store domain is invalid.");
  }

  return domain.toLowerCase();
}

function getApiVersion() {
  const configuredVersion = getEnvValue("VITE_SHOPIFY_API_VERSION");

  if (!configuredVersion) {
    return DEFAULT_SHOPIFY_API_VERSION;
  }

  if (!/^\d{4}-\d{2}$/.test(configuredVersion)) {
    throw new Error("Shopify API version must use the YYYY-MM format.");
  }

  return configuredVersion;
}

function getShopifyConfig() {
  const storeDomain = normalizeStoreDomain(
    getEnvValue("VITE_SHOPIFY_STORE_DOMAIN"),
  );
  const storefrontToken = getEnvValue("VITE_SHOPIFY_STOREFRONT_TOKEN");

  if (!storeDomain || !storefrontToken) {
    throw new Error("Shopify storefront environment variables are not configured.");
  }

  return {
    endpoint: `https://${storeDomain}/api/${getApiVersion()}/graphql.json`,
    storefrontToken,
  };
}

async function readJson(response) {
  try {
    return await response.json();
  } catch (error) {
    logger.error("Unable to parse Shopify response:", error);
    return null;
  }
}

function getGraphQLErrorMessage(errors) {
  if (!Array.isArray(errors) || !errors.length) {
    return "";
  }

  return errors.map((error) => error.message).filter(Boolean).join(", ");
}

export async function shopifyFetch(query, variables = {}, { signal } = {}) {
  const { endpoint, storefrontToken } = getShopifyConfig();

  const response = await fetch(endpoint, {
    body: JSON.stringify({
      query,
      variables,
    }),
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": storefrontToken,
    },
    method: "POST",
    signal,
  });

  const result = await readJson(response);

  if (!response.ok) {
    logger.error("Shopify HTTP error:", result);

    throw new Error(
      getGraphQLErrorMessage(result?.errors) ||
        `Shopify request failed with status ${response.status}.`,
    );
  }

  if (!result || typeof result !== "object") {
    throw new Error("Shopify returned an invalid response.");
  }

  if (result.errors?.length) {
    logger.error("Shopify GraphQL errors:", result.errors);

    throw new Error(getGraphQLErrorMessage(result.errors));
  }

  return result.data ?? {};
}
