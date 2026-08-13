import { useState } from "react";
import { useCart } from "../context/CartContext";


function Cart() {

    const {
        cart,
        cartLoading,
        updateCartLine,
        removeCartLine
    } = useCart();


    const [updatingLine, setUpdatingLine] =
        useState(null);

    const [error, setError] =
        useState("");


    async function handleQuantityChange(
        line,
        quantity
    ) {

        if (quantity < 1) {
            return;
        }


        try {

            setUpdatingLine(line.id);
            setError("");


            await updateCartLine(
                line.id,
                quantity
            );


        } catch (error) {

            console.error(error);

            setError(
                error.message ||
                "Unable to update cart."
            );


        } finally {

            setUpdatingLine(null);

        }

    }


    async function handleRemove(lineId) {

        try {

            setUpdatingLine(lineId);
            setError("");


            await removeCartLine(
                lineId
            );


        } catch (error) {

            console.error(error);

            setError(
                error.message ||
                "Unable to remove product."
            );


        } finally {

            setUpdatingLine(null);

        }

    }


    function handleCheckout() {

        if (!cart?.checkoutUrl) {
            return;
        }


        window.location.href =
            cart.checkoutUrl;

    }


    /*
     * Loading
     */

    if (cartLoading) {

        return (
            <main>

                <section className="cart-section">

                    <div className="container">

                        <h1>
                            Your Cart
                        </h1>

                        <p>
                            Loading cart...
                        </p>

                    </div>

                </section>

            </main>
        );

    }


    /*
     * Error
     */

    if (error) {

        return (
            <main>

                <section className="cart-section">

                    <div className="container">

                        <h1>
                            Your Cart
                        </h1>

                        <p>
                            {error}
                        </p>

                    </div>

                </section>

            </main>
        );

    }


    /*
     * Empty cart
     */

    if (
        !cart ||
        !cart.lines ||
        cart.lines.nodes.length === 0
    ) {

        return (
            <main>

                <section className="cart-section">

                    <div className="container">

                        <h1>
                            Your Cart
                        </h1>

                        <p>
                            Your cart is empty.
                        </p>

                    </div>

                </section>

            </main>
        );

    }


    /*
     * Cart
     */

    return (
        <main>

            <section className="cart-section">

                <div className="container">

                    <div className="cart-head">

                        <h1>
                            Your Cart
                        </h1>

                        <p>
                            {cart.totalQuantity}{" "}
                            {cart.totalQuantity === 1
                                ? "item"
                                : "items"}
                        </p>

                    </div>


                    {error && (

                        <p className="cart-error">
                            {error}
                        </p>

                    )}


                    <div className="cart-items">

                        {cart.lines.nodes.map(
                            (line) => {

                                const product =
                                    line.merchandise.product;

                                const variant =
                                    line.merchandise;

                                const isUpdating =
                                    updatingLine ===
                                    line.id;


                                return (

                                    <div
                                        className="cart-item"
                                        key={line.id}
                                    >

                                        {/* Image */}

                                        <div className="cart-item-image">

                                            {product.featuredImage && (

                                                <img
                                                    src={
                                                        product
                                                            .featuredImage
                                                            .url
                                                    }
                                                    alt={
                                                        product
                                                            .featuredImage
                                                            .altText ||
                                                        product.title
                                                    }
                                                />

                                            )}

                                        </div>


                                        {/* Content */}

                                        <div className="cart-item-content">

                                            <h2>
                                                {product.title}
                                            </h2>


                                            {variant.title &&
                                                variant.title !==
                                                    "Default Title" && (

                                                    <p>
                                                        {
                                                            variant.title
                                                        }
                                                    </p>

                                                )}


                                            {/* Price */}

                                            <p>

                                                {
                                                    variant.price
                                                        .currencyCode
                                                }{" "}

                                                {
                                                    variant.price
                                                        .amount
                                                }

                                            </p>


                                            {/* Quantity */}

                                            <div className="cart-item-quantity">

                                                <button
                                                    type="button"
                                                    disabled={
                                                        isUpdating ||
                                                        line.quantity <=
                                                            1
                                                    }
                                                    onClick={() =>
                                                        handleQuantityChange(
                                                            line,
                                                            line.quantity -
                                                                1
                                                        )
                                                    }
                                                >
                                                    -
                                                </button>


                                                <span>
                                                    {
                                                        line.quantity
                                                    }
                                                </span>


                                                <button
                                                    type="button"
                                                    disabled={
                                                        isUpdating
                                                    }
                                                    onClick={() =>
                                                        handleQuantityChange(
                                                            line,
                                                            line.quantity +
                                                                1
                                                        )
                                                    }
                                                >
                                                    +
                                                </button>

                                            </div>


                                            {/* Remove */}

                                            <button
                                                type="button"
                                                disabled={
                                                    isUpdating
                                                }
                                                onClick={() =>
                                                    handleRemove(
                                                        line.id
                                                    )
                                                }
                                            >
                                                {isUpdating
                                                    ? "Updating..."
                                                    : "Remove"}
                                            </button>

                                        </div>


                                        {/* Line total */}

                                        <div className="cart-item-total">

                                            <p>

                                                {
                                                    line.cost
                                                        .totalAmount
                                                        .currencyCode
                                                }{" "}

                                                {
                                                    line.cost
                                                        .totalAmount
                                                        .amount
                                                }

                                            </p>

                                        </div>

                                    </div>

                                );

                            }
                        )}

                    </div>


                    {/* Summary */}

                    <div className="cart-summary">

                        <div>

                            <p>
                                Total Items
                            </p>

                            <p>
                                {cart.totalQuantity}
                            </p>

                        </div>


                        <div>

                            <p>
                                Total
                            </p>

                            <p>

                                {
                                    cart.cost
                                        .totalAmount
                                        .currencyCode
                                }{" "}

                                {
                                    cart.cost
                                        .totalAmount
                                        .amount
                                }

                            </p>

                        </div>


                        <button
                            type="button"
                            onClick={
                                handleCheckout
                            }
                        >
                            Go To Checkout
                        </button>

                    </div>

                </div>

            </section>

        </main>
    );
}


export default Cart;