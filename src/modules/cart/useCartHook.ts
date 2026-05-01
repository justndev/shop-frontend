import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/src/store"
import {
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  CartItem, toggleCart, closeCart, openCart
} from "@/src/store/slices/cartSlice"


export default function useCartHook() {
  const dispatch = useDispatch();
  const {items, isOpen} = useSelector((state: RootState) => state.cart)

  function handleToggleShowCart() {
    dispatch(toggleCart())
  }

  function handleCloseCart() {
    dispatch(closeCart())
  }

  async function handleAddItem(item: CartItem) {
    dispatch(addItem(item));
    dispatch(openCart())
  }

  function handleRemoveItem(id: string) {
    dispatch(removeItem(id))
  }

  function handleUpdateQuantity(id: string, quantity: number) {
    dispatch(updateQuantity({ id, quantity }))
  }

  function handleClearCart() {
    dispatch(clearCart())
  }

  return {
    items,
    handleToggleShowCart,
    handleCloseCart,
    handleAddItem,
    handleRemoveItem,
    handleUpdateQuantity,
    handleClearCart,
    isOpen,
  }
}
