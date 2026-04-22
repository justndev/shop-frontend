import apiClient from '../../lib/apiClient'
import {Tag, TranslatedStrings} from '@/src/types'

export interface CreateTagPayload {
    name: TranslatedStrings;
}

const tagApi = {
    // Add to categoryApi.ts
    async getById(id: string): Promise<{ details: string; data: Tag[] }> {
        const res = await apiClient.get(`/tags/${id}`);
        return res.data;
    },

    async getAll(): Promise<{ details: string; data: Tag[] }> {
        const res = await apiClient.get('/tags');
        return res.data;
    },

    async create(data: CreateTagPayload): Promise<{ details: string; data: Tag }> {
        const res = await apiClient.post('/tags', data);
        return res.data;
    },

    async update(id: string, payload: Partial<CreateTagPayload>): Promise<{ details: string; data: Tag }> {
        const res = await apiClient.patch(`/tags/${id}`, payload);
        return res.data;
    },

    async delete(id: string): Promise<{ details: string }> {
        const res = await apiClient.delete(`/tags/${id}`);
        return res.data;
    }
}

export default tagApi;
