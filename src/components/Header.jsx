import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";


function Header() {

    const { cartCount } = useCart();


    return (
        <header className="site-header">

            <div className="container">

                <div className="header-inner">

                    <Link
                        to="/"
                        className="site-logo"
                    >
                        React Storefront
                    </Link>


                    <nav className="site-navigation">

                        <Link to="/">
                            Home
                        </Link>

                        <Link to="/products">
                            Products
                        </Link>

                        <Link to="/cart">
                            Cart
                            {" "}
                            ({cartCount})
                        </Link>

                    </nav>

                </div>

            </div>

        </header>
    );
}


export default Header;