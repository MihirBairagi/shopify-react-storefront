import { Link } from "react-router-dom";


function ProductCard({ product }) {

    const variant =
        product.variants.nodes[0];


    return (
        <article className="product-card">

            <Link
                to={`/products/${product.handle}`}
                className="product-card-image"
            >

                {product.featuredImage && (

                    <img
                        src={product.featuredImage.url}
                        alt={
                            product.featuredImage.altText ||
                            product.title
                        }
                    />

                )}

            </Link>


            <div className="product-card-content">

                <h2>

                    <Link
                        to={`/products/${product.handle}`}
                    >
                        {product.title}
                    </Link>

                </h2>


                <p>
                    {product.description}
                </p>


                <div className="product-card-price">

                    {variant?.price?.currencyCode}{" "}
                    {variant?.price?.amount}

                </div>


                <div className="product-card-status">

                    {variant?.availableForSale
                        ? "Available"
                        : "Sold out"}

                </div>


                <Link
                    to={`/products/${product.handle}`}
                >
                    View Product
                </Link>

            </div>

        </article>
    );
}


export default ProductCard;