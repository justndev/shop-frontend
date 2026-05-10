'use client'

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {Order, Product} from "@/src/utils/types";

export interface CartItem {
  product: Product;
  quantity: number
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  currentOrder: Order | null;
}

const initialState: CartState = { items: [], isOpen: false, currentOrder: null };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<CartItem>) {
      const existing = state.items.find(i => i.product.id === action.payload.product.id)
      if (existing) {
        const quantityToAdd  = existing.quantity + action.payload.quantity;

        existing.quantity = quantityToAdd;

      } else {
        state.items.push(action.payload)
      }
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter(i => i.product.id !== action.payload)
    },
    updateQuantity(state, action: PayloadAction<{ id: string; quantity: number }>) {
      const item = state.items.find(i => i.product.id === action.payload.id)

      if (item) item.quantity = Math.max(1, action.payload.quantity)
    },
    clearCart(state) {
      state.items = []
    },
    openCart(state)  { state.isOpen = true },
    closeCart(state) { state.isOpen = false },
    toggleCart(state) { state.isOpen = !state.isOpen },

    /* Order Reducers */
    setOrder(state, action: PayloadAction<Order>) {
      state.currentOrder = action.payload
    },
    clearOrder(state) {
      state.currentOrder = null
    }
  },
})

export const { addItem, removeItem, updateQuantity, clearCart, openCart, closeCart, toggleCart, setOrder, clearOrder } = cartSlice.actions
export default cartSlice.reducer