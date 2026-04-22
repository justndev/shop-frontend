import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../store"
import {
  addItem as addItemAction,
  removeItem as removeItemAction,
  updateQuantity as updateQuantityAction,
  clearCart as clearCartAction, closeCart,
} from "@/src/store/slices/cartSlice"
import { CartItem } from "@/src/store/slices/cartSlice"
import {useState} from "react";

export default function useCartHook() {
  const dispatch = useDispatch();

  const [showCart, setShowCart] = useState(false);

  const items = useSelector((state: RootState) => state.cart.items)
  // const isOpen = useSelector((state: RootState) => state.cart.isOpen)

  function toggleShowCart() {
    console.log('showCart', showCart)
    setShowCart(!showCart)
  }

  function closeCart() {
    setShowCart(false);
  }

  function addItem(item: CartItem) {
    dispatch(addItemAction(item));
    setShowCart(true);
  }

  function removeItem(id: string) {
    dispatch(removeItemAction(id))
  }

  function updateQuantity(id: string, quantity: number) {
    dispatch(updateQuantityAction({ id, quantity }))
  }

  function clearCart() {
    dispatch(clearCartAction())
  }

  return {
    items,
    toggleShowCart,
    closeCart,
    showCart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  }
}