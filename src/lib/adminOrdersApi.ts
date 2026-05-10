import apiClient from './apiClient'
import {Order, StockStatus} from "@/src/utils/types";


export type UpdateOrderPayload = Partial<Order>

export interface OrderListParams {
    page?: number
    limit?: number
    search?: string
    type?: string
    stockStatus?: StockStatus
}

export interface OrderListResponse {
    details: string
    data: Order[]
    total: number
    page: number
    limit: number
}

const adminOrdersApi = {
    async getAll(params: OrderListParams): Promise<OrderListResponse> {
        const res = await apiClient.get('/admin/orders', {params})
        return res.data
    },

    async getById(id: string): Promise<Order> {
        const res = await apiClient.get(`/admin/orders/${id}`)
        return res.data.data
    },

    async update(id: string, payload: UpdateOrderPayload): Promise<Order> {
        const res = await apiClient.put(`/admin/orders/${id}`, payload)
        return res.data.data
    },

    async delete(id: string): Promise<void> {
        await apiClient.delete(`/admin/orders/${id}`)
    },
}

export default adminOrdersApi;
