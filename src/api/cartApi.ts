import apiClient from '../lib/apiClient'
import { CartItem } from '@/src/types'

const cartApi = {
  async addItem(productId: string, quantity: number): Promise<{ details: string; data: CartItem }> {
    const res = await apiClient.post('/cart/add', { productId, quantity })
    return res.data
  },
}

export default cartApi
