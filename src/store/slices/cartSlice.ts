'use client'

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  stock: number
  imageUrl?: string   // NEW — first image URL from product
  emoji?: string      // fallback emoji
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
      const existing = state.items.find(i => i.id === action.payload.id)
      if (existing) {
        existing.quantity = Math.min(existing.quantity + action.payload.quantity, existing.stock)
      } else {
        state.items.push(action.payload)
      }
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter(i => i.id !== action.payload)
    },
    updateQuantity(state, action: PayloadAction<{ id: string; quantity: number }>) {
      const item = state.items.find(i => i.id === action.payload.id)
      if (item) item.quantity = Math.max(1, Math.min(action.payload.quantity, item.stock))
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