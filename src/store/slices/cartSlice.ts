'use client'

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {Product} from "@/src/utils/types";

export interface CartItem {
  product: Product;
  quantity: number
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
}

const initialState: CartState = { items: [], isOpen: false }

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<CartItem>) {
      const existing = state.items.find(i => i.product.id === action.payload.product.id)
      if (existing) {
        existing.quantity = Math.min(existing.quantity + action.payload.quantity, existing.product.stock)
      } else {
        state.items.push(action.payload)
      }
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter(i => i.product.id !== action.payload)
    },
    updateQuantity(state, action: PayloadAction<{ id: string; quantity: number }>) {
      const item = state.items.find(i => i.product.id === action.payload.id)
      if (item) item.quantity = Math.max(1, Math.min(action.payload.quantity, item.product.stock))
    },
    clearCart(state) {
      state.items = []
    },
    openCart(state)  { state.isOpen = true },
    closeCart(state) { state.isOpen = false },
    toggleCart(state) { state.isOpen = !state.isOpen },
  },
})

export const { addItem, removeItem, updateQuantity, clearCart, openCart, closeCart, toggleCart } = cartSlice.actions
export default cartSlice.reducer