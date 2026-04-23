import apiClient from '../../lib/apiClient'
import {Category, TranslatedStrings} from '@/src/utils/types'

export interface CreateCategoryPayload {
  name: TranslatedStrings;
  slug: string;
  image?: string;
}

const categoryApi = {
  // Add to categoryApi.ts
  async getById(id: string): Promise<{ details: string; data: Category[] }> {
    const res = await apiClient.get(`/categories/${id}`);
    return res.data;
  },

  async getAll(): Promise<{ details: string; data: Category[] }> {
    const res = await apiClient.get('/categories');
    return res.data;
  },

  async create(data: { name: string }): Promise<{ details: string; data: Category }> {
    const res = await apiClient.post('/categories', data);
    return res.data;
  },

  async update(id: string, payload: Partial<CreateCategoryPayload>): Promise<{ details: string; data: Category }> {
    const res = await apiClient.patch(`/categories/${id}`, payload);
    return res.data;
  },

  async delete(id: string): Promise<{ details: string }> {
    const res = await apiClient.delete(`/categories/${id}`);
    return res.data;
  }
}

export default categoryApi;
