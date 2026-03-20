import apiClient from '../lib/apiClient'
import { MediaImage } from '@/src/types'

const mediaApiOld = {
  async getAll(): Promise<{ details: string; data: MediaImage[] }> {
    const res = await apiClient.get('/media')
    return res.data
  },

  async upload(files: File[]): Promise<{ details: string; data: { urls: string[] } }> {
    const formData = new FormData()
    files.forEach((f) => formData.append('images', f))
    const res = await apiClient.post('/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  },

  async delete(filename: string): Promise<{ details: string }> {
    const res = await apiClient.delete(`/media/${filename}`)
    return res.data
  },
}

export default mediaApiOld
