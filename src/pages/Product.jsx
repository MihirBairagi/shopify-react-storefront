import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { shopifyFetch } from "../services/shopify";
// import { addToCart, createCheckoutCart } from "../services/cart";
import { useCart } from "../context/CartContext";
import { createCheckoutCart } from "../services/cart";


function Product() {

    const { handle } = useParams();

    const [product, setProduct] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);

    const [quantity, setQuantity] = useState(1);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [addingToCart, setAddingToCart] = useState(false);

    const [buyingNow, setBuyingNow] = useState(false);

    const [cartMessage, setCartMessage] = useState("");

    const { addToCart } = useCart();


    async function handleAddToCart() {
        if (!selectedVariant) {
            return;
        }
        if (!selectedVariant.availableForSale) {
            return;
        }
        try {

            setAddingToCart(true);

            setCartMessage("");


            await addToCart(
                selectedVariant.id,
                quantity
            );


            setCartMessage(
                "Product added to cart."
            );


        } catch (error) {

            console.error(error);

            setCartMessage(
                error.message ||
                "Unable to add product to cart."
            );


        } finally {

            setAddingToCart(false);

        }

    }

    async function handleBuyNow() {

        if (!selectedVariant) {
            return;
        }


        if (!selectedVariant.availableForSale) {
            return;
        }


        try {

            setBuyingNow(true);

            setCartMessage("");


            const checkoutCart =
                await createCheckoutCart(
                    selectedVariant.id,
                    quantity
                );


            const checkoutUrl =
                checkoutCart?.checkoutUrl;


            if (!checkoutUrl) {

                throw new Error(
                    "Checkout URL was not returned."
                );

            }


            window.location.href =
                checkoutUrl;


        } catch (error) {

            console.error(error);

            setCartMessage(
                error.message ||
                "Unable to start checkout."
            );


        } finally {

            setBuyingNow(false);

        }

    }


    useEffect(() => {

        async function getProduct() {

            try {

                const data = await shopifyFetch(
                    `
                    query GetProduct($handle: String!) {

                        product(handle: $handle) {

                            id
                            title
                            handle
                            description
                            descriptionHtml

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

                    }
                    `,
                    {
                        handle
                    }
                );


                if (!data.product) {

                    setError(
                        "Product not found."
                    );

                    return;

                }


                setProduct(data.product);


                const firstAvailableVariant =
                    data.product.variants.nodes.find(
                        (variant) =>
                            variant.availableForSale
                    ) ||
                    data.product.variants.nodes[0];


                setSelectedVariant(
                    firstAvailableVariant
                );


            } catch (error) {

                console.error(error);

                setError(
                    "Unable to load product."
                );

            } finally {

                setLoading(false);

            }

        }


        getProduct();

    }, [handle]);


    function increaseQuantity() {

        setQuantity(
            (currentQuantity) =>
                currentQuantity + 1
        );

    }


    function decreaseQuantity() {

        setQuantity(
            (currentQuantity) =>
                Math.max(1, currentQuantity - 1)
        );

    }


    if (loading) {

        return (
            <main>
                <h2>
                    Loading product...
                </h2>
            </main>
        );

    }


    if (error) {

        return (
            <main>
                <h2>
                    {error}
                </h2>
            </main>
        );

    }


    if (!product) {
        return null;
    }


    return (
        <main>

            <section className="product-detail-section">

                <div className="container">

                    <div className="product-detail">

                        {/* Product Images */}

                        <div className="product-detail-images">

                            {product.images.nodes.map(
                                (image) => (

                                    <div
                                        className="product-detail-image"
                                        key={image.url}
                                    >

                                        <img
                                            src={image.url}
                                            alt={
                                                image.altText ||
                                                product.title
                                            }
                                        />

                                    </div>

                                )
                            )}

                        </div>


                        {/* Product Information */}

                        <div className="product-detail-content">

                            <h1>
                                {product.title}
                            </h1>


                            <div
                                className="product-description"
                                dangerouslySetInnerHTML={{
                                    __html:
                                        product.descriptionHtml
                                }}
                            />


                            {/* Variant */}

                            {product.variants.nodes.length > 1 && (

                                <div className="product-variants">

                                    <h3>
                                        Select Variant
                                    </h3>


                                    <div>

                                        {product.variants.nodes.map(
                                            (variant) => (

                                                <button
                                                    type="button"
                                                    key={variant.id}
                                                    disabled={
                                                        !variant.availableForSale
                                                    }
                                                    onClick={() =>
                                                        setSelectedVariant(
                                                            variant
                                                        )
                                                    }
                                                    className={
                                                        selectedVariant?.id ===
                                                        variant.id
                                                            ? "active"
                                                            : ""
                                                    }
                                                >

                                                    {variant.title}

                                                </button>

                                            )
                                        )}

                                    </div>

                                </div>

                            )}


                            {/* Price */}

                            {selectedVariant && (

                                <div className="product-price">

                                    {
                                        selectedVariant.price
                                            .currencyCode
                                    }{" "}

                                    {
                                        selectedVariant.price
                                            .amount
                                    }

                                </div>

                            )}


                            {/* Quantity */}

                            <div className="product-quantity">

                                <button
                                    type="button"
                                    onClick={
                                        decreaseQuantity
                                    }
                                >
                                    -
                                </button>


                                <span>
                                    {quantity}
                                </span>


                                <button
                                    type="button"
                                    onClick={
                                        increaseQuantity
                                    }
                                >
                                    +
                                </button>

                            </div>


                            {/* Buttons */}

                            <div className="product-actions">

                                <button
                                    type="button"
                                    disabled={
                                        !selectedVariant ||
                                        !selectedVariant.availableForSale ||
                                        addingToCart ||
                                        buyingNow
                                    }
                                    onClick={handleAddToCart}
                                >
                                    {addingToCart
                                        ? "Adding..."
                                        : "Add to Cart"}
                                </button>


                                <button
                                    type="button"
                                    disabled={
                                        !selectedVariant ||
                                        !selectedVariant.availableForSale ||
                                        addingToCart ||
                                        buyingNow
                                    }
                                    onClick={handleBuyNow}
                                >
                                    {buyingNow
                                        ? "Processing..."
                                        : "Buy Now"}
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

        </main>
    );
}


export default Product;