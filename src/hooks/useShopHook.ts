'use client'

import { useState } from 'react'
import { useAppDispatch } from '@/src/hooks/redux'
import { setProducts, addProduct, removeProduct, setCategories, addCategory, setSelectedProduct } from '@/src/store/slices/productsSlice'
import { setOrders, addOrder } from '@/src/store/slices/ordersSlice'
import { addItem, clearCart, openCart } from '@/src/store/slices/cartSlice'
import productsApi from '@/src/api/productsApi'
import categoryApi from '@/src/api/categoryApi'
import ordersApi from '@/src/api/ordersApi'
import cartApi from '@/src/api/cartApi'
import paymentApi from '@/src/api/paymentApi'
import { showToast } from '@/src/modules/ui/Toast'
import { Product } from '@/src/types'
import {useDispatch} from "react-redux";

const EMOJIS: Record<string, string> = {
  brakes: '🛞', engine: '🔧', suspension: '🔩', filters: '🌀',
  electric: '⚡', exhaust: '💨', cooling: '❄️',
}

export function useShopHook() {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)

  async function fetchProducts(params?: { page?: number; limit?: number; minPrice?: number; maxPrice?: number }) {
    setLoading(true)
    try {
      const res = await productsApi.getAll(params)
      dispatch(setProducts(res.data))
    } catch (err: any) {
      showToast('Не удалось загрузить товары', 'error')
    } finally {
      setLoading(false)
    }
  }

  async function fetchProduct(id: string) {
    setLoading(true)
    try {
      const res = await productsApi.getById(id)
      dispatch(setSelectedProduct(res.data))
      return res.data
    } catch (err: any) {
      const details = err.response?.data?.details
      showToast(details === 'product_not_found' ? 'Товар не найден' : 'Ошибка загрузки товара', 'error')
      return null
    } finally {
      setLoading(false)
    }
  }

  async function fetchCategories() {
    try {
      const res = await categoryApi.getAll()
      dispatch(setCategories(res.data))
    } catch {
      // categories are non-critical, fail silently
    }
  }

  function handleAddToCart(product: Product) {
    if (product.stock === 0) {
      showToast('Товар отсутствует на складе', 'error')
      return
    }
    dispatch(addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      stock: product.stock,
      emoji: EMOJIS[product.category?.slug || ''] || '🔧',
    }))
    dispatch(openCart())
    showToast(`✅ ${product.name.slice(0, 30)} добавлен`)
  }

  async function handleCreateOrder(cartItems: Array<{ id: string; quantity: number }>) {
    setLoading(true)
    try {
      // Sync local cart to backend
      for (const item of cartItems) {
        await cartApi.addItem(item.id, item.quantity)
      }
      const res = await ordersApi.createFromCart()
      dispatch(addOrder(res.data))
      dispatch(clearCart())
      showToast('🎉 Заказ оформлен!')
      return { success: true, order: res.data }
    } catch (err: any) {
      const details = err.response?.data?.details
      if (details === 'cart_is_empty') {
        showToast('Корзина пуста', 'error')
      } else {
        showToast('Ошибка оформления заказа', 'error')
      }
      return { success: false, order: null }
    } finally {
      setLoading(false)
    }
  }

  async function fetchMyOrders() {
    setLoading(true)
    try {
      const res = await ordersApi.getMyOrders()
      dispatch(setOrders(res.data))
    } catch {
      showToast('Не удалось загрузить заказы', 'error')
    } finally {
      setLoading(false)
    }
  }

  async function handleInitPayment(orderId: string) {
    setLoading(true)
    try {
      const res = await paymentApi.initPayment(orderId)
      return { success: true, paymentUrl: res.data.paymentUrl }
    } catch (err: any) {
      const details = err.response?.data?.details
      showToast(details === 'order_not_found' ? 'Заказ не найден' : 'Ошибка инициализации оплаты', 'error')
      return { success: false, paymentUrl: null }
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    fetchProducts,
    fetchProduct,
    fetchCategories,
    handleAddToCart,
    handleCreateOrder,
    fetchMyOrders,
    handleInitPayment,
  }
}
