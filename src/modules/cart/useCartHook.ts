import {useDispatch, useSelector} from "react-redux"
import {RootState} from "@/src/store"
import {
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    CartItem, clearOrder
} from "@/src/store/slices/cartSlice"
import paymentApi from "@/src/modules/checkout/paymentApi";
import {useAppContext} from "@/src/context/AppContext";


export default function useCartHook() {
    const dispatch = useDispatch();
    const { openCancelOrderDialog, showCart, toggleCart, closeCart, openCart } = useAppContext();
    const {items, currentOrder} = useSelector((state: RootState) => state.cart)

    function handleToggleShowCart() {
        toggleCart()
    }

    function handleCloseCart() {
        closeCart()
    }

    async function handleAddItem(item: CartItem) {
        if (currentOrder) {
            openCancelOrderDialog(async () => {
                try {
                    await paymentApi.abortOrder(currentOrder.id);
                } catch (error) {
                    console.error(error);
                }
                dispatch(addItem(item));
                dispatch(clearOrder());
                openCart()
            });
            return;
        }
        dispatch(addItem(item));
        openCart()
    }

    function handleRemoveItem(id: string) {
        if (currentOrder) {
            openCancelOrderDialog(async () => {
                try {
                    await paymentApi.abortOrder(currentOrder.id);
                } catch (error) {
                    console.error(error);
                }
                dispatch(removeItem(id));
                dispatch(clearOrder());
            });
            return;
        }
        dispatch(removeItem(id));
    }

    function handleUpdateQuantity(id: string, quantity: number) {
        if (currentOrder) {
            openCancelOrderDialog(async () => {
                try {
                    await paymentApi.abortOrder(currentOrder.id);
                } catch (error) {
                    console.error(error);
                }
                dispatch(updateQuantity({ id, quantity }));
                dispatch(clearOrder());
            });
            return;
        }
        dispatch(updateQuantity({ id, quantity }));
    }

    function handleClearCart() {
        dispatch(clearCart())
    }

    const totalQuantity = useSelector((state: RootState) =>
        state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
    );

    return {
        items,
        handleToggleShowCart,
        handleCloseCart,
        handleAddItem,
        handleRemoveItem,
        handleUpdateQuantity,
        handleClearCart,
        showCart,
        totalQuantity
    }
}
