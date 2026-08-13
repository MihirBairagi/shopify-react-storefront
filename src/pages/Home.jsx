import { useEffect, useState } from "react";
import { shopifyFetch } from "../services/shopify";
import ProductGrid from "../components/ProductGrid";


function Home() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {

        async function getProducts() {

            try {

                const data = await shopifyFetch(`
                    query GetProducts {
                        products(first: 20) {
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
                <h2>Loading products...</h2>
            </main>
        );

    }


    if (error) {

        return (
            <main>
                <h2>{error}</h2>
            </main>
        );

    }


    return (
        <main>

            <section className="product-listing-section">

                <div className="container">

                    <div className="product-listing-head">

                        <h1>
                            Home Page
                        </h1>

                    </div>


                    <ProductGrid
                        products={products}
                    />

                </div>

            </section>

        </main>
    );
}


export default Home;