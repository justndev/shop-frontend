'use client'

import { X, ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/src/hooks/redux'
import { closeCart, removeItem, updateQuantity } from '@/src/store/slices/cartSlice'
import { useRouter } from 'next/navigation'
import {RootState} from "@/src/store";
import {useDispatch, useSelector} from "react-redux";

export default function CartSidebar() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { items, isOpen } = useSelector((s) => s.cart)
  const user  = useSelector((s: RootState) => s.user.user)

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const count = items.reduce((s, i) => s + i.quantity, 0)

  const handleCheckout = () => {
    dispatch(closeCart())
    if (!user) {
      router.push('/auth/login?redirect=/checkout')
    } else {
      router.push('/checkout')
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-[200] backdrop-blur-sm"
        onClick={() => dispatch(closeCart())}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-[380px] max-w-full bg-white z-[201] flex flex-col animate-slide-in shadow-2xl">
        {/* Header */}
        <div className="bg-[#111213] text-white px-5 py-4 flex justify-between items-center">
          <h3 className="font-condensed text-xl font-bold flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" /> Корзина
            {count > 0 && (
              <span className="bg-[#E8181A] text-white text-xs font-black w-5 h-5 rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </h3>
          <button onClick={() => dispatch(closeCart())} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
              <ShoppingCart className="w-14 h-14 opacity-20" />
              <p className="font-medium">Корзина пуста</p>
              <p className="text-sm text-gray-400">Добавьте товары из каталога</p>
              <button onClick={() => { dispatch(closeCart()); router.push('/shop') }}
                className="mt-2 bg-[#E8181A] text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-[#b80f11] transition-colors">
                Перейти в каталог →
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 items-center p-3 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl shadow-sm shrink-0">
                    {item.emoji || '🔧'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">{item.name}</div>
                    <div className="text-[#E8181A] font-bold text-sm">{(item.price * item.quantity).toFixed(2)} €</div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <button
                        onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                        className="w-6 h-6 rounded bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                        className="w-6 h-6 rounded bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => dispatch(removeItem(item.id))}
                    className="text-gray-300 hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t-2 border-gray-100 p-4">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold text-gray-700">Итого:</span>
              <span className="font-condensed text-2xl font-black text-[#E8181A]">{total.toFixed(2)} €</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-[#E8181A] hover:bg-[#b80f11] text-white font-condensed font-bold text-lg py-4 rounded-xl transition-colors tracking-wide"
            >
              Оформить заказ →
            </button>
            <p className="text-center text-xs text-gray-400 mt-2">Безопасная оплата через Maksekeskus</p>
          </div>
        )}
      </div>
    </>
  )
}
