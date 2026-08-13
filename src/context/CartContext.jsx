import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import {
    getCart,
    addToCart,
    updateCartLine,
    removeCartLine
} from "../services/cart";


const CartContext = createContext(null);


export function CartProvider({ children }) {

    const [cart, setCart] = useState(null);

    const [cartLoading, setCartLoading] =
        useState(true);


    async function refreshCart() {

        try {

            const currentCart =
                await getCart();

            setCart(currentCart);

        } catch (error) {

            console.error(
                "Unable to load cart:",
                error
            );

        } finally {

            setCartLoading(false);

        }

    }


    useEffect(() => {

        refreshCart();

    }, []);


    async function handleAddToCart(
        variantId,
        quantity = 1
    ) {

        const updatedCart =
            await addToCart(
                variantId,
                quantity
            );

        setCart(updatedCart);

        return updatedCart;
    }


    async function handleUpdateCartLine(
        lineId,
        quantity
    ) {

        const updatedCart =
            await updateCartLine(
                lineId,
                quantity
            );

        setCart(updatedCart);

        return updatedCart;
    }


    async function handleRemoveCartLine(
        lineId
    ) {

        const updatedCart =
            await removeCartLine(
                lineId
            );

        setCart(updatedCart);

        return updatedCart;
    }


    const cartCount =
        cart?.totalQuantity || 0;


    return (
        <CartContext.Provider
            value={{
                cart,
                cartCount,
                cartLoading,
                refreshCart,
                addToCart: handleAddToCart,
                updateCartLine:
                    handleUpdateCartLine,
                removeCartLine:
                    handleRemoveCartLine
            }}
        >
            {children}
        </CartContext.Provider>
    );
}


export function useCart() {

    return useContext(CartContext);

}