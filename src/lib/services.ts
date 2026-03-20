import api from './apiClient';
import { Cart, Category, Order, Product } from '@/src/types'

// ─── Products ───────────────────────────────────────────────
export const productsService = {
  async getAll(params?: {
    page?: number
    limit?: number
    minPrice?: number
    maxPrice?: number
  }): Promise<Product[]> {
    const res = await api.get<Product[]>('/products', { params })
    return res.data
  },

  async getById(id: string): Promise<Product> {
    const res = await api.get<Product>(`/products/${id}`)
    return res.data
  },

  async create(data: Partial<Product>): Promise<Product> {
    const res = await api.post<Product>('/products', data)
    return res.data
  },

  async update(id: string, data: Partial<Product>): Promise<Product> {
    const res = await api.patch<Product>(`/products/${id}`, data)
    return res.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/products/${id}`)
  },
}

// ─── Categories ─────────────────────────────────────────────
export const categoriesService = {
  async getAll(): Promise<Category[]> {
    const res = await api.get<Category[]>('/categories')
    return res.data
  },

  async create(data: { name: string; slug: string }): Promise<Category> {
    const res = await api.post<Category>('/categories', data)
    return res.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/categories/${id}`)
  },
}

// ─── Cart ────────────────────────────────────────────────────
export const cartService = {
  async addItem(productId: string, quantity: number): Promise<{ message: string }> {
    const res = await api.post('/cart/add', { productId, quantity })
    return res.data
  },

  async getCart(): Promise<Cart> {
    const res = await api.get<Cart>('/cart')
    return res.data
  },

  async removeItem(itemId: string): Promise<void> {
    await api.delete(`/cart/items/${itemId}`)
  },

  async updateItem(itemId: string, quantity: number): Promise<void> {
    await api.patch(`/cart/items/${itemId}`, { quantity })
  },
}

// ─── Orders ──────────────────────────────────────────────────
export const ordersService = {
  async createFromCart(): Promise<Order> {
    const res = await api.post<Order>('/orders')
    return res.data
  },

  async getMyOrders(): Promise<Order[]> {
    const res = await api.get<Order[]>('/orders')
    return res.data
  },

  async getById(id: string): Promise<Order> {
    const res = await api.get<Order>(`/orders/${id}`)
    return res.data
  },

  async getAllAdmin(): Promise<Order[]> {
    const res = await api.get<Order[]>('/orders/admin/all')
    return res.data
  },
}

// ─── Payments ────────────────────────────────────────────────
export const paymentService = {
  async initPayment(orderId: string): Promise<{ paymentUrl: string; payload: object; signature: string }> {
    const res = await api.post('/payment/init', { orderId })
    return res.data
  },
}

// ─── Media ───────────────────────────────────────────────────
export const mediaService = {
  async getAll(): Promise<import('@/src/types').MediaImage[]> {
    const res = await api.get('/media')
    return res.data
  },

  async upload(files: File[]): Promise<{ urls: string[] }> {
    const formData = new FormData()
    files.forEach(f => formData.append('images', f))
    const res = await api.post('/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  },

  async delete(filename: string): Promise<void> {
    await api.delete(`/media/${filename}`)
  },
}
