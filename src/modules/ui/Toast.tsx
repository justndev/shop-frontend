'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

let addToastFn: ((toast: Omit<Toast, 'id'>) => void) | null = null

export function showToast(message: string, type: Toast['type'] = 'success') {
  addToastFn?.({ message, type })
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    addToastFn = (toast) => {
      const id = Math.random().toString(36).slice(2)
      setToasts((prev) => [...prev, { ...toast, id }])
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, 3000)
    }
    return () => { addToastFn = null }
  }, [])

  if (!toasts.length) return null

  return (
    <div className="fixed top-20 right-5 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`animate-toast-in flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl text-sm font-medium min-w-56 border-l-4 bg-white
            ${t.type === 'success' ? 'border-emerald-500' : t.type === 'error' ? 'border-red-500' : 'border-blue-500'}`}
        >
          <span className="text-base">
            {t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : 'ℹ️'}
          </span>
          {t.message}
        </div>
      ))}
    </div>
  )
}
