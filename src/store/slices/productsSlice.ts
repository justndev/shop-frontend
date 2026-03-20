'use client'

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Product, Category } from '@/src/types'

interface ProductsState {
  items: Product[]
  categories: Category[]
  selectedProduct: Product | null
}

const initialState: ProductsState = {
  items: [],
  categories: [],
  selectedProduct: null,
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts(state, action: PayloadAction<Product[]>) {
      state.items = action.payload
    },
    addProduct(state, action: PayloadAction<Product>) {
      state.items.unshift(action.payload)
    },
    removeProduct(state, action: PayloadAction<string>) {
      state.items = state.items.filter((p) => p.id !== action.payload)
    },
    setCategories(state, action: PayloadAction<Category[]>) {
      state.categories = action.payload
    },
    addCategory(state, action: PayloadAction<Category>) {
      state.categories.push(action.payload)
    },
    setSelectedProduct(state, action: PayloadAction<Product | null>) {
      state.selectedProduct = action.payload
    },
  },
})

export const { setProducts, addProduct, removeProduct, setCategories, addCategory, setSelectedProduct } =
  productsSlice.actions
export default productsSlice.reducer
