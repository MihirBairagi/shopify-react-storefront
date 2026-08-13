import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Header from "./components/Header";

import Home from "./pages/Home";
import Products from "./pages/Products";
import Product from "./pages/Product";
import Cart from "./pages/Cart";


function App() {

    return (
        <BrowserRouter>

            <Header />

            <Routes>

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/products"
                    element={<Products />}
                />

                <Route
                    path="/products/:handle"
                    element={<Product />}
                />

                <Route
                    path="/cart"
                    element={<Cart />}
                />

            </Routes>

        </BrowserRouter>
    );
}


export default App;