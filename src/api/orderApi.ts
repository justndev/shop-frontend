import apiClient from '../lib/apiClient'
import { Order } from '@/src/types'

const orderApi = {
  async createFromCart(): Promise<{ details: string; data: Order }> {
    const res = await apiClient.post('/orders')
    return res.data
  },

  async getMyOrders(): Promise<{ details: string; data: Order[] }> {
    const res = await apiClient.get('/orders')
    return res.data
  },

  async getOrderById(id: string): Promise<{ details: string; data: Order }> {
    const res = await apiClient.get(`/orders/${id}`)
    return res.data
  },
}

export default orderApi
