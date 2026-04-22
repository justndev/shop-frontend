import apiClient from '../lib/apiClient'
import { Product, StockStatus, TranslatedStrings } from "@/src/utils/types";
import {useTranslation} from "react-i18next";
import {usePathname} from "next/navigation";

export interface CreateProductPayload {
    name: TranslatedStrings;
    slug: string;
    description: TranslatedStrings;
    shortDescription: TranslatedStrings;
    price: number;
    salePrice?: number;
    sku?: string
    stock: number;
    stockStatus: string;
    images: string[];
    isActive: boolean;
    purchaseNote?: string
    menuOrder?: number;
    reviewsEnabled?: boolean;
    tags?: string[];
    categoryId?: string;
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

const productApi = {
    async getAll(params?: {
        inStock?: boolean;
        sort?: string
        slug?: string
    }): Promise<ProductListResponse> {
        const res = await apiClient.get('/products', { params })
        return res.data
    },

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

export default productApi;
