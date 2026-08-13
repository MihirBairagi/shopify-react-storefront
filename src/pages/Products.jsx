import { useEffect, useState } from "react";
import { shopifyFetch } from "../services/shopify";
import ProductGrid from "../components/ProductGrid";


function Products() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {

        async function getProducts() {

            try {

                const data = await shopifyFetch(`
                    query GetProducts {
                        products(first: 50) {
                            nodes {
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

                                        price {
                                            amount
                                            currencyCode
                                        }

                                        availableForSale
                                    }
                                }
                            }
                        }
                    }
                `);


                setProducts(
                    data.products.nodes
                );

            } catch (error) {

                console.error(error);

                setError(
                    "Unable to load products."
                );

            } finally {

                setLoading(false);

            }

        }


        getProducts();

    }, []);


    if (loading) {

        return (
            <main>

                <section className="products-section">

                    <div className="container">

                        <h1>
                            Products Listing
                        </h1>

                        <p>
                            Loading products...
                        </p>

                    </div>

                </section>

            </main>
        );

    }


    if (error) {

        return (
            <main>

                <section className="products-section">

                    <div className="container">

                        <h1>
                            Products
                        </h1>

                        <p>
                            {error}
                        </p>

                    </div>

                </section>

            </main>
        );

    }


    return (
        <main>

            <section className="products-section">

                <div className="container">

                    <div className="products-head">

                        <h1>
                            Products Listing
                        </h1>

                        <p>
                            {products.length} products
                        </p>

                    </div>


                    <ProductGrid
                        products={products}
                    />

                </div>

            </section>

        </main>
    );
}


export default Products;