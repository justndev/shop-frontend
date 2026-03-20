'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:4000'

interface ProductImagesProps {
  images: string[]
  fallbackEmoji?: string
  className?: string
}

export default function ProductImages({ images, fallbackEmoji = '🔧', className = '' }: ProductImagesProps) {
  const [current, setCurrent] = useState(0)
  const validImages = (images || []).filter(Boolean)

  if (validImages.length === 0) {
    return (
      <div className={`bg-gray-50 flex items-center justify-center text-8xl ${className}`}>
        {fallbackEmoji}
      </div>
    )
  }

  const prev = () => setCurrent(i => (i - 1 + validImages.length) % validImages.length)
  const next = () => setCurrent(i => (i + 1) % validImages.length)
  const fullUrl = (url: string) => url.startsWith('http') ? url : `${API_URL}${url}`

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* Main image */}
      <div className="relative bg-gray-50 rounded-xl overflow-hidden aspect-square group">
        <img
          src={fullUrl(validImages[current])}
          alt="Product"
          className="w-full h-full object-contain p-4"
        />
        {validImages.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            {/* Dot indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {validImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${i === current ? 'bg-[#E8181A] w-3' : 'bg-gray-300'}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {validImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {validImages.map((url, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                i === current ? 'border-[#E8181A]' : 'border-transparent hover:border-gray-300'
              }`}
            >
              <img src={fullUrl(url)} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
