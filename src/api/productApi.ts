import apiClient from '../lib/apiClient'

// ── TYPES ─────────────────────────────────────────────────────────────────────

export type StockStatus = 'IN_STOCK' | 'OUT_OF_STOCK' | 'ON_BACKORDER'

export interface Category {
    id: string
    name: string
    slug: string
    createdAt: string
    updatedAt: string
}

export interface Product {
    id: string
    name: string
    slug: string
    description: string | null
    shortDescription: string | null
    price: number
    salePrice: number | null
    sku: string | null
    stock: number
    stockStatus: StockStatus
    images: string[]
    tags: string[]
    isActive: boolean
    purchaseNote: string | null
    menuOrder: number
    reviewsEnabled: boolean
    categoryId: string
    category: Category
    createdAt: string
    updatedAt: string
}

export interface CreateProductPayload {
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

// ── CATEGORY API ──────────────────────────────────────────────────────────────

export const categoryApi = {
    async list(): Promise<Category[]> {
        const res = await apiClient.get('/products/meta/categories')
        return res.data.data
    },

    async create(name: string): Promise<Category> {
        const res = await apiClient.post('/products/meta/categories', { name })
        return res.data.data
    },
}

export default productApi