import apiClient from '../lib/apiClient'
import {Product} from "@/src/types";

// ── TYPES ─────────────────────────────────────────────────────────────────────




export interface CreateProductPayload {
    slug: string;
    name: string
    description?: string
    shortDescription?: string
    price: number
    salePrice?: number | null
    sku?: string
    stock?: number
    stockStatus?: StockStatus
    images?: string[]
    tags?: string[]
    isActive?: boolean
    purchaseNote?: string
    menuOrder?: number
    reviewsEnabled?: boolean
    categoryId: string
}

export type UpdateProductPayload = Partial<CreateProductPayload>

export interface ProductListParams {
    page?: number
    limit?: number
    search?: string
    categoryId?: string
    minPrice?: number
    maxPrice?: number
    isActive?: boolean
    stockStatus?: StockStatus
}

export interface ProductListResponse {
    details: string
    data: Product[]
    total: number
    page: number
    limit: number
}

// ── PRODUCT API ───────────────────────────────────────────────────────────────

const productApi = {
    async list(params: ProductListParams = {}): Promise<ProductListResponse> {
        const res = await apiClient.get('/products', { params })
        return res.data
    },

    async getById(id: string): Promise<Product> {
        const res = await apiClient.get(`/products/${id}`)
        return res.data.data
    },

    async getBySlug(slug: string): Promise<Product> {
        const res = await apiClient.get(`/products/${slug}`)
        return res.data.data
    },

    async create(payload: CreateProductPayload): Promise<Product> {
        const res = await apiClient.post('/products', payload)
        return res.data.data
    },

    async update(id: string, payload: UpdateProductPayload): Promise<Product> {
        const res = await apiClient.put(`/products/${id}`, payload)
        return res.data.data
    },

    async delete(id: string): Promise<void> {
        await apiClient.delete(`/products/${id}`)
    },
}


export default productApi