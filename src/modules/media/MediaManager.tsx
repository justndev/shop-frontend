'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { X, Upload, Trash2, Check, Search, Image as ImageIcon, Loader, RefreshCw } from 'lucide-react'
import { useAdminHook } from '@/src/hooks/useAdminHook'
import { MediaImage } from '@/src/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:4000'

interface MediaManagerProps {
  open: boolean
  onClose: () => void
  selected: string[]
  onConfirm: (urls: string[]) => void
  maxSelect?: number
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function MediaManager({ open, onClose, selected: initSelected, onConfirm, maxSelect }: MediaManagerProps) {
  const { mediaImages, mediaLoading, fetchMediaImages, handleUploadMedia, handleDeleteMedia } = useAdminHook()
  const [selected, setSelected] = useState<string[]>(initSelected)
  const [search, setSearch] = useState('')
  const [dragging, setDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setSelected(initSelected)
      fetchMediaImages()
    }
  }, [open])

  const onUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    await handleUploadMedia(Array.from(files))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const onDelete = async (img: MediaImage) => {
    const deleted = await handleDeleteMedia(img.filename)
    if (deleted) setSelected(prev => prev.filter(u => u !== img.url))
  }

  const toggleSelect = (url: string) => {
    setSelected(prev => {
      if (prev.includes(url)) return prev.filter(u => u !== url)
      if (maxSelect && prev.length >= maxSelect) return prev
      return [...prev, url]
    })
  }

  const onDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setDragging(true) }, [])
  const onDragLeave = useCallback(() => setDragging(false), [])
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false); onUpload(e.dataTransfer.files)
  }, [])

  const filtered = mediaImages.filter(img => img.filename.toLowerCase().includes(search.toLowerCase()))

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl animate-modal-in overflow-hidden">
        <div className="bg-[#111213] text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <ImageIcon className="w-5 h-5 text-[#E8181A]" />
            <h2 className="font-condensed text-xl font-bold">Медиафайлы</h2>
            <span className="text-gray-400 text-sm">{mediaImages.length} файл(ов)</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchMediaImages} className="text-gray-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 min-h-0">
          <div className="flex-1 flex flex-col min-w-0 border-r border-gray-100">
            <div className="px-4 py-3 border-b flex items-center gap-3 shrink-0">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#E8181A]"
                  placeholder="Поиск файлов..."
                  value={search} onChange={e => setSearch(e.target.value)}
                />
              </div>
              <button onClick={() => fileInputRef.current?.click()} disabled={mediaLoading}
                className="flex items-center gap-2 bg-[#E8181A] hover:bg-[#b80f11] disabled:opacity-60 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
                <Upload className="w-4 h-4" /> Загрузить
              </button>
              <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={e => onUpload(e.target.files)} />
            </div>

            <div
              className={`flex-1 overflow-y-auto p-4 transition-colors ${dragging ? 'bg-blue-50 border-2 border-dashed border-blue-400' : ''}`}
              onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
            >
              {mediaLoading ? (
                <div className="flex items-center justify-center h-48 text-gray-400">
                  <div className="text-center"><Loader className="w-8 h-8 animate-spin mx-auto mb-2" /><p className="text-sm">Загрузка...</p></div>
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-gray-400 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="w-10 h-10 mb-3 opacity-30" />
                  <p className="font-medium text-sm">Нет файлов</p>
                  <p className="text-xs mt-1">Нажмите или перетащите изображения сюда</p>
                </div>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                  {filtered.map(img => {
                    const isSelected = selected.includes(img.url)
                    return (
                      <div key={img.filename}
                        className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer group border-2 transition-all ${isSelected ? 'border-[#E8181A] ring-2 ring-[#E8181A]/30' : 'border-transparent hover:border-gray-300'}`}
                        onClick={() => toggleSelect(img.url)}
                      >
                        <img src={`${API_URL}${img.url}`} alt={img.filename} className="w-full h-full object-cover" loading="lazy" />
                        {isSelected && (
                          <div className="absolute inset-0 bg-[#E8181A]/20 flex items-center justify-center">
                            <div className="w-7 h-7 bg-[#E8181A] rounded-full flex items-center justify-center shadow-lg">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        )}
                        {isSelected && (
                          <div className="absolute top-1 left-1 w-5 h-5 bg-[#E8181A] text-white text-xs font-black rounded-full flex items-center justify-center">
                            {selected.indexOf(img.url) + 1}
                          </div>
                        )}
                        <button onClick={e => { e.stopPropagation(); onDelete(img) }}
                          className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="w-56 shrink-0 flex flex-col bg-gray-50">
            <div className="px-4 py-3 border-b bg-white">
              <h3 className="font-semibold text-sm text-gray-700">Выбрано</h3>
              <p className="text-xs text-gray-400 mt-0.5">{selected.length} {maxSelect ? `/ ${maxSelect}` : ''} файл(ов)</p>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {selected.length === 0 ? (
                <div className="text-center text-gray-400 text-xs mt-6">
                  <ImageIcon className="w-7 h-7 mx-auto mb-2 opacity-30" />
                  Нажмите на изображение, чтобы выбрать
                </div>
              ) : selected.map((url, i) => (
                <div key={url} className="relative group rounded-lg overflow-hidden border border-gray-200 bg-white">
                  <img src={`${API_URL}${url}`} alt="" className="w-full aspect-square object-cover" />
                  <div className="absolute top-1 left-1 w-5 h-5 bg-[#E8181A] text-white text-xs font-black rounded-full flex items-center justify-center">{i + 1}</div>
                  <button onClick={() => setSelected(prev => prev.filter(u => u !== url))}
                    className="absolute top-1 right-1 w-5 h-5 bg-black/60 hover:bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="p-3 border-t bg-white space-y-2 shrink-0">
              <button onClick={() => onConfirm(selected)} disabled={selected.length === 0}
                className="w-full bg-[#E8181A] hover:bg-[#b80f11] disabled:opacity-40 disabled:cursor-not-allowed text-white font-condensed font-bold py-2.5 rounded-xl transition-colors text-sm">
                Использовать ({selected.length})
              </button>
              <button onClick={() => { setSelected([]); onConfirm([]) }}
                className="w-full border border-gray-200 text-gray-500 hover:bg-gray-50 font-medium py-2 rounded-xl transition-colors text-xs">
                Очистить
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
