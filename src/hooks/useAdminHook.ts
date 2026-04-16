'use client'

import { useState } from 'react'
import { useAppDispatch } from '@/src/hooks/redux'
import { addProduct, removeProduct, addCategory } from '@/src/store/slices/productsSlice'
import { setOrders } from '@/src/store/slices/ordersSlice'
import productsApi from '@/src/api/productsApi'
import categoryApi from '@/src/api/categoryApi'
import mediaApiOld from '@/src/api/mediaApi.old'
import ordersApi from '@/src/api/ordersApi'
import { showToast } from '@/src/modules/ui/Toast'
import { MediaImage, Product, Category } from '@/src/types'
import {useDispatch} from "react-redux";

export function useAdminHook() {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [mediaImages, setMediaImages] = useState<MediaImage[]>([])
  const [mediaLoading, setMediaLoading] = useState(false)

  async function handleCreateProduct(data: {
    name: string
    price: number
    categoryId: string
    isActive: boolean
    description?: string
    stock: number
    slug: string
    images: string[]
  }) {
    setLoading(true)
    try {
      const res = await productsApi.create(data)
      dispatch(addProduct(res.data))
      showToast('✅ Товар добавлен!')
      return { success: true }
    } catch (err: any) {
      const details = err.response?.data?.details
      showToast(details === 'product_creation_failed' ? 'Ошибка создания товара' : 'Не удалось создать товар', 'error')
      return { success: false }
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteProduct(id: string, name: string) {
    if (!confirm(`Удалить "${name}"?`)) return false
    setLoading(true)
    try {
      await productsApi.delete(id)
      dispatch(removeProduct(id))
      showToast('🗑 Товар удалён')
      return true
    } catch {
      showToast('Ошибка удаления товара', 'error')
      return false
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateCategory(data: { name: string, slug: string }) {
    setLoading(true)
    try {
      const res = await categoryApi.create(data)
      dispatch(addCategory(res.data))
      showToast('✅ Категория создана!')
      return { success: true }
    } catch (err: any) {
      showToast('Ошибка создания категории', 'error')
      return { success: false }
    } finally {
      setLoading(false)
    }
  }

  async function fetchAdminOrders() {
    setLoading(true)
    try {
      // Note: API doc only shows GET /orders (user orders) — using same endpoint
      // If backend adds admin endpoint later, update ordersApi
      const res = await ordersApi.getMyOrders()
      dispatch(setOrders(res.data))
    } catch {
      showToast('Не удалось загрузить заказы', 'error')
    } finally {
      setLoading(false)
    }
  }

  async function fetchMediaImages() {
    setMediaLoading(true)
    try {
      const res = await mediaApiOld.getAll()
      setMediaImages(res.data)
    } catch {
      showToast('Не удалось загрузить медиафайлы', 'error')
    } finally {
      setMediaLoading(false)
    }
  }

  async function handleUploadMedia(files: File[]) {
    const invalid = files.filter((f) => !f.type.startsWith('image/'))
    if (invalid.length) { showToast('Только изображения (jpg, png, webp, gif)', 'error'); return { success: false } }
    const tooBig = files.filter((f) => f.size > 5 * 1024 * 1024)
    if (tooBig.length) { showToast('Файлы не должны превышать 5 MB', 'error'); return { success: false } }

    setMediaLoading(true)
    try {
      const res = await mediaApiOld.upload(files)
      await fetchMediaImages()
      showToast(`✅ Загружено ${res.data.urls.length} файл(ов)`)
      return { success: true, urls: res.data.urls }
    } catch {
      showToast('Ошибка загрузки', 'error')
      return { success: false }
    } finally {
      setMediaLoading(false)
    }
  }

  async function handleDeleteMedia(filename: string) {
    if (!confirm(`Удалить "${filename}"?`)) return false
    try {
      await mediaApiOld.delete(filename)
      setMediaImages((prev) => prev.filter((i) => i.filename !== filename))
      showToast('🗑 Файл удалён')
      return true
    } catch {
      showToast('Ошибка удаления', 'error')
      return false
    }
  }

  return {
    loading,
    mediaImages,
    mediaLoading,
    handleCreateProduct,
    handleDeleteProduct,
    handleCreateCategory,
    fetchAdminOrders,
    fetchMediaImages,
    handleUploadMedia,
    handleDeleteMedia,
  }
}
