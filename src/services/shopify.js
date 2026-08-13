const SHOPIFY_STORE_DOMAIN =
    import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;

const SHOPIFY_STOREFRONT_TOKEN =
    import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;

const SHOPIFY_API_VERSION = "2026-07";

const SHOPIFY_ENDPOINT =
    `https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;


export async function shopifyFetch(
    query,
    variables = {}
) {

    const response = await fetch(
        SHOPIFY_ENDPOINT,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Storefront-Access-Token":
                    SHOPIFY_STOREFRONT_TOKEN
            },

            body: JSON.stringify({
                query,
                variables
            })
        }
    );


    const result = await response.json();


    if (!response.ok) {

        console.error(
            "Shopify HTTP Error:",
            result
        );

        throw new Error(
            result?.errors?.[0]?.message ||
            "Shopify request failed."
        );
    }


    if (result.errors) {

        console.error(
            "Shopify GraphQL Errors:",
            result.errors
        );

        throw new Error(
            result.errors
                .map((error) => error.message)
                .join(", ")
        );
    }


    return result.data;
}