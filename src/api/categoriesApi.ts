import apiClient from '../lib/apiClient'
import { Category } from '@/src/types'

const categoriesApi = {
  async getAll(): Promise<{ details: string; data: Category[] }> {
    const res = await apiClient.get('/categories')
    return res.data
  },

  async create(data: { name: string }): Promise<{ details: string; data: Category }> {
    const res = await apiClient.post('/categories', data)
    return res.data
  },
}

export default categoriesApi
