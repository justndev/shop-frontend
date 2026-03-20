'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAppSelector } from '@/src/hooks/redux'
import { useAppDispatch } from '@/src/hooks/redux'
import { useShopHook } from '@/src/hooks/useShopHook'
import { addItem, openCart } from '@/src/store/slices/cartSlice'
import { showToast } from '@/src/modules/ui/Toast'
import { ArrowLeft, Minus, Plus, ShoppingCart, Star } from 'lucide-react'
import {useDispatch, useSelector} from "react-redux";

const EMOJIS: Record<string, string> = {
  brakes: '🛞', engine: '🔧', suspension: '🔩', filters: '🌀',
  electric: '⚡', exhaust: '💨', cooling: '❄️',
}

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useDispatch()
  const { selectedProduct: product } = useSelector((s) => s.products)
  const { fetchProduct, loading } = useShopHook()
  const [qty, setQty] = useState(1)

  useEffect(() => {
    if (params.id) fetchProduct(params.id as string)
  }, [params.id])

  const handleAddToCart = () => {
    if (!product || product.stock === 0) return
    dispatch(addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: qty,
      stock: product.stock,
      emoji: EMOJIS[product.category?.slug || ''] || '🔧',
    }))
    dispatch(openCart())
    showToast(`✅ ${product.name.slice(0, 30)} × ${qty} добавлен`)
  }

  if (loading || !product) return (
    <div className="max-w-5xl mx-auto px-4 py-12 flex items-center justify-center min-h-64">
      <div className="text-gray-400 text-center">
        <div className="text-5xl mb-3 animate-float">🔧</div>
        <p>Загрузка...</p>
      </div>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6 text-sm font-medium transition-colors">
        <ArrowLeft className="w-4 h-4" /> Назад в каталог
      </button>

      <div className="bg-white rounded-2xl overflow-hidden shadow-sm grid md:grid-cols-2 gap-0">
        <div className="bg-gray-50 flex items-center justify-center min-h-64 p-10">
          <div className="text-9xl animate-float">{EMOJIS[product.category?.slug || ''] || '🔧'}</div>
        </div>

        <div className="p-8">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">{product.category?.name}</div>
          <h1 className="font-condensed text-3xl font-black mb-2">{product.name}</h1>
          <div className="font-mono text-sm text-gray-400 mb-4">ID: {product.id.slice(0, 12)}...</div>

          <div className="flex items-center gap-1 mb-4">
            {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
            <span className="text-sm text-gray-500 ml-1">(48 отзывов)</span>
          </div>

          <table className="w-full text-sm mb-6">
            <tbody>
              {[['Категория', product.category?.name || '—'], ['В наличии', `${product.stock} шт.`], ['Статус', product.isActive ? '✅ Активен' : '❌ Неактивен']].map(([key, val]) => (
                <tr key={key} className="border-b last:border-b-0">
                  <td className="py-2 text-gray-500 font-medium w-2/5">{key}</td>
                  <td className="py-2 font-semibold">{val}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {product.description && <p className="text-gray-600 text-sm mb-6 leading-relaxed">{product.description}</p>}

          <div className="font-condensed text-4xl font-black text-[#E8181A] mb-6">{product.price.toFixed(2)} €</div>

          <div className="flex items-center gap-3">
            <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-12 bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors">
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center font-bold text-lg">{qty}</span>
              <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="w-10 h-12 bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <button onClick={handleAddToCart} disabled={product.stock === 0}
              className="flex-1 bg-[#E8181A] hover:bg-[#b80f11] disabled:bg-gray-200 disabled:cursor-not-allowed text-white font-condensed font-bold text-lg py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              {product.stock > 0 ? 'В корзину' : 'Нет в наличии'}
            </button>
          </div>

          <div className="flex flex-wrap gap-3 mt-4 text-xs text-gray-500">
            <span>🚚 Доставка 1-2 дня</span>
            <span>🔄 Возврат 30 дней</span>
            <span>🛡️ Гарантия качества</span>
          </div>
        </div>
      </div>
    </div>
  )
}
