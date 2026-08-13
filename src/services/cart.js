import { shopifyFetch } from "./shopify";

const CART_STORAGE_KEY = "shopify_cart_id";


function getStoredCartId() {

    return localStorage.getItem(
        CART_STORAGE_KEY
    );
}


function saveCartId(cartId) {

    localStorage.setItem(
        CART_STORAGE_KEY,
        cartId
    );
}


function removeStoredCartId() {

    localStorage.removeItem(
        CART_STORAGE_KEY
    );
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
            cartId
        }
    );


    if (!data.cart) {

        removeStoredCartId();

        return null;
    }


    return data.cart;
}


export async function createCart(
    variantId,
    quantity = 1
) {

    const data = await shopifyFetch(
        `
        mutation CreateCart(
            $input: CartInput
        ) {

            cartCreate(
                input: $input
            ) {

                cart {
                    ${CART_FRAGMENT}
                }

                userErrors {
                    field
                    message
                }

                warnings {
                    code
                    message
                }

            }

        }
        `,
        {
            input: {
                lines: [
                    {
                        merchandiseId: variantId,
                        quantity
                    }
                ]
            }
        }
    );


    const errors =
        data.cartCreate.userErrors;


    if (errors.length) {

        throw new Error(
            errors
                .map((error) => error.message)
                .join(", ")
        );

    }


    const cart =
        data.cartCreate.cart;


    saveCartId(cart.id);


    return cart;
}

export async function createCheckoutCart(
    variantId,
    quantity = 1
) {

    const data = await shopifyFetch(
        `
        mutation CreateCheckoutCart(
            $input: CartInput
        ) {

            cartCreate(
                input: $input
            ) {

                cart {
                    id
                    checkoutUrl
                }

                userErrors {
                    field
                    message
                }

                warnings {
                    code
                    message
                }

            }

        }
        `,
        {
            input: {
                lines: [
                    {
                        merchandiseId: variantId,
                        quantity
                    }
                ]
            }
        }
    );


    const errors =
        data.cartCreate.userErrors;


    if (errors.length) {

        throw new Error(
            errors
                .map((error) => error.message)
                .join(", ")
        );

    }


    return data.cartCreate.cart;
}

export async function addToCart(
    variantId,
    quantity = 1
) {

    const existingCart =
        await getCart();


    if (!existingCart) {

        return createCart(
            variantId,
            quantity
        );

    }


    const data = await shopifyFetch(
        `
        mutation AddToCart(
            $cartId: ID!
            $lines: [CartLineInput!]!
        ) {

            cartLinesAdd(
                cartId: $cartId
                lines: $lines
            ) {

                cart {
                    ${CART_FRAGMENT}
                }

                userErrors {
                    field
                    message
                }

                warnings {
                    code
                    message
                }

            }

        }
        `,
        {
            cartId: existingCart.id,

            lines: [
                {
                    merchandiseId: variantId,
                    quantity
                }
            ]
        }
    );


    const errors =
        data.cartLinesAdd.userErrors;


    if (errors.length) {

        throw new Error(
            errors
                .map((error) => error.message)
                .join(", ")
        );

    }


    return data.cartLinesAdd.cart;
}


export async function updateCartLine(
    lineId,
    quantity
) {

    const cartId =
        getStoredCartId();


    if (!cartId) {
        return null;
    }


    const data = await shopifyFetch(
        `
        mutation UpdateCartLine(
            $cartId: ID!
            $lines: [CartLineUpdateInput!]!
        ) {

            cartLinesUpdate(
                cartId: $cartId
                lines: $lines
            ) {

                cart {
                    ${CART_FRAGMENT}
                }

                userErrors {
                    field
                    message
                }

                warnings {
                    code
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
                    quantity
                }
            ]
        }
    );


    const errors =
        data.cartLinesUpdate.userErrors;


    if (errors.length) {

        throw new Error(
            errors
                .map((error) => error.message)
                .join(", ")
        );

    }


    return data.cartLinesUpdate.cart;
}


export async function removeCartLine(
    lineId
) {

    const cartId =
        getStoredCartId();


    if (!cartId) {
        return null;
    }


    const data = await shopifyFetch(
        `
        mutation RemoveCartLine(
            $cartId: ID!
            $lineIds: [ID!]!
        ) {

            cartLinesRemove(
                cartId: $cartId
                lineIds: $lineIds
            ) {

                cart {
                    ${CART_FRAGMENT}
                }

                userErrors {
                    field
                    message
                }

                warnings {
                    code
                    message
                }

            }

        }
        `,
        {
            cartId,

            lineIds: [
                lineId
            ]
        }
    );


    const errors =
        data.cartLinesRemove.userErrors;


    if (errors.length) {

        throw new Error(
            errors
                .map((error) => error.message)
                .join(", ")
        );

    }


    return data.cartLinesRemove.cart;
}


export function getCheckoutUrl(cart) {

    return cart?.checkoutUrl || "";
}