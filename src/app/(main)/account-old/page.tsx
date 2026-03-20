'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/src/hooks/redux'
import { useAuthHook } from '@/src/modules/auth/useAuthHook'
import { useShopHook } from '@/src/hooks/useShopHook'
import { User, Package, LogOut } from 'lucide-react'
import {useSelector} from "react-redux";

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  PAID: 'bg-emerald-100 text-emerald-700',
  FAILED: 'bg-red-100 text-red-700',
  CANCELLED: 'bg-gray-100 text-gray-600',
}
const STATUS_LABELS: Record<string, string> = {
  PENDING: '⏳ В обработке',
  PAID: '✅ Оплачен',
  FAILED: '❌ Ошибка',
  CANCELLED: '🚫 Отменён',
}

export default function AccountPage() {
  const router = useRouter()
  const { user } = useSelector((s) => s.auth)
  const { items: orders, } = useSelector((s) => s.orders)
  const { handleLogout } = useAuthHook()
  const { fetchMyOrders, loading } = useShopHook()

  useEffect(() => {
    if (user) fetchMyOrders()
    else router.push('/auth/login')
  }, [user])

  if (!user) return null

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-condensed text-4xl font-black mb-8">Мой аккаунт</h1>

      <div className="grid md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-gradient-to-br from-[#111213] to-[#1a1c1e] p-5 text-center">
              <div className="w-16 h-16 bg-[#E8181A] rounded-full flex items-center justify-center text-white text-2xl font-black mx-auto mb-2">
                {user.email[0].toUpperCase()}
              </div>
              <div className="text-white font-semibold text-sm">{user.firstName} {user.lastName}</div>
              <div className="text-gray-400 text-xs">{user.email}</div>
            </div>
            <div className="p-2">
              <button className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-medium bg-red-50 text-[#E8181A]">
                <Package className="w-4 h-4" /> Мои заказы
              </button>
              {user.role === 'ADMIN' && (
                <button onClick={() => router.push('/admin')}
                  className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors mt-1">
                  <User className="w-4 h-4" /> Панель Admin
                </button>
              )}
              <button onClick={handleLogout}
                className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors mt-1">
                <LogOut className="w-4 h-4" /> Выйти
              </button>
            </div>
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="sidebar-title">📦 История заказов</div>
            {loading ? (
              <div className="p-8 text-center text-gray-400">Загрузка...</div>
            ) : orders.length === 0 ? (
              <div className="p-10 text-center text-gray-400">
                <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="font-medium">Заказов пока нет</p>
                <button onClick={() => router.push('/shop')} className="mt-3 text-[#E8181A] font-semibold text-sm hover:underline">
                  Перейти в каталог →
                </button>
              </div>
            ) : (
              <div className="divide-y">
                {orders.map((order) => (
                  <div key={order.id} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-mono text-xs text-gray-400 mb-1">#{order.id.slice(0, 12)}...</div>
                        <div className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString('ru')}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${STATUS_COLORS[order.status]}`}>
                          {STATUS_LABELS[order.status]}
                        </span>
                        <span className="font-condensed font-black text-lg text-[#E8181A]">{order.totalAmount.toFixed(2)} €</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {order.items?.map((item) => (
                        <span key={item.id} className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                          {item.name} × {item.quantity}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
