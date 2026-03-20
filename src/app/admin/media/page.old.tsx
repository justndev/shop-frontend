'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/src/hooks/redux'
import { useAdminHook } from '@/src/hooks/useAdminHook'
import { Upload, Trash2, Search, RefreshCw, ArrowLeft, Loader } from 'lucide-react'
import { useState } from 'react'
import {useSelector} from "react-redux";

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:4000'

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function AdminMediaPage() {
  const router = useRouter()
  const { user } = useSelector((s) => s.auth)
  const { mediaImages, mediaLoading, fetchMediaImages, handleUploadMedia, handleDeleteMedia } = useAdminHook()

  const [search, setSearch] = useState('')
  const [dragging, setDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!user) { router.push('/auth/login'); return }
    if (user.role !== 'ADMIN') { router.push('/'); return }
    fetchMediaImages()
  }, [user])

  const onUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    await handleUploadMedia(Array.from(files))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const onDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setDragging(true) }, [])
  const onDragLeave = useCallback(() => setDragging(false), [])
  const onDrop = useCallback((e: React.DragEvent) => { e.preventDefault(); setDragging(false); onUpload(e.dataTransfer.files) }, [])

  const filtered = mediaImages.filter(img => img.filename.toLowerCase().includes(search.toLowerCase()))

  if (!user || user.role !== 'ADMIN') return null

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.push('/admin')} className="text-gray-400 hover:text-gray-700 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-condensed text-4xl font-black">🖼️ Медиафайлы</h1>
          <p className="text-gray-500 text-sm">{mediaImages.length} файл(ов) в хранилище</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#E8181A]"
              placeholder="Поиск файлов..."
              value={search} onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button onClick={fetchMediaImages} className="p-2 text-gray-400 hover:text-gray-700 border border-gray-200 rounded-lg transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={() => fileInputRef.current?.click()} disabled={mediaLoading}
            className="flex items-center gap-2 bg-[#E8181A] hover:bg-[#b80f11] disabled:opacity-60 text-white font-bold px-4 py-2 rounded-lg transition-colors text-sm">
            <Upload className="w-4 h-4" /> Загрузить
          </button>
          <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={e => onUpload(e.target.files)} />
        </div>

        <div
          className={`p-4 min-h-64 transition-colors ${dragging ? 'bg-blue-50' : ''}`}
          onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
        >
          {mediaLoading ? (
            <div className="flex items-center justify-center h-48 text-gray-400">
              <div className="text-center"><Loader className="w-8 h-8 animate-spin mx-auto mb-2" /><p>Загрузка...</p></div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <Upload className="w-10 h-10 mb-3 opacity-30" />
              <p className="font-medium">Нет файлов</p>
              <p className="text-xs mt-1">Перетащите изображения сюда или нажмите "Загрузить"</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {filtered.map(img => (
                <div key={img.filename} className="relative group rounded-xl overflow-hidden border border-gray-200 hover:border-[#E8181A] transition-colors">
                  <img src={`${API_URL}${img.url}`} alt={img.filename} className="w-full aspect-square object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end">
                    <div className="w-full p-2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-[9px] truncate font-medium">{img.filename}</p>
                      <p className="text-gray-300 text-[9px]">{formatBytes(img.size)}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteMedia(img.filename)}
                    className="absolute top-1.5 right-1.5 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
