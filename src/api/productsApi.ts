import apiClient from '../lib/apiClient'
import { Product } from '@/src/types'

const productsApi = {
  async getAll(params?: {
    page?: number
    limit?: number
    minPrice?: number
    maxPrice?: number
    slug?: string
  }): Promise<{ details: string; data: Product[] }> {
    const res = await apiClient.get('/products', { params })
    return res.data
  },

  async getById(id: string): Promise<{ details: string; data: Product }> {
    const res = await apiClient.get(`/products/${id}`)
    return res.data
  },

  async create(data: {
    name: string
    price: number
    categoryId: string
    isActive?: boolean
    description?: string
    stock?: number
    slug?: string
    images?: string[]
  }): Promise<{ details: string; data: Product }> {
    const res = await apiClient.post('/products', data)
    return res.data
  },

  async delete(id: string): Promise<{ details: string }> {
    const res = await apiClient.delete(`/products/${id}`)
    return res.data
  },
}

export default productsApi
