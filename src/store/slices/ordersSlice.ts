'use client'

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Order } from '@/src/types'

interface OrdersState {
  items: Order[]
  currentOrder: Order | null
  paymentUrl: string | null
}

const initialState: OrdersState = {
  items: [],
  currentOrder: null,
  paymentUrl: null,
}

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders(state, action: PayloadAction<Order[]>) {
      state.items = action.payload
    },
    addOrder(state, action: PayloadAction<Order>) {
      state.currentOrder = action.payload
      state.items.unshift(action.payload)
    },
    setPaymentUrl(state, action: PayloadAction<string | null>) {
      state.paymentUrl = action.payload
    },
    clearCurrentOrder(state) {
      state.currentOrder = null
    },
  },
})

export const { setOrders, addOrder, setPaymentUrl, clearCurrentOrder } = ordersSlice.actions
export default ordersSlice.reducer
