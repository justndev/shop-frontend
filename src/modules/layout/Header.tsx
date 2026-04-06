'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ShoppingCart, Heart, User, Menu, X, Search, ChevronDown, LogOut, Settings, Package } from 'lucide-react'
import { useAppSelector } from '@/src/hooks/redux'
import { useAppDispatch } from '@/src/hooks/redux'
import { toggleCart } from '@/src/store/slices/cartSlice'
import { useAuthHook } from '@/src/modules/auth/useAuthHook'
import productsApi from '@/src/api/productsApi'
import { showToast } from '@/src/modules/ui/Toast'
import { Product } from '@/src/types'
import {useDispatch, useSelector} from "react-redux";

const CATEGORY_ICONS: Record<string, string> = {
  engine: '🔧', brakes: '🛞', suspension: '🔩', filters: '🌀',
  electric: '⚡', exhaust: '💨', cooling: '❄️', other: '🛠',
}

export default function Header() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { user } = useSelector((s) => s.auth)
  const { items: cartItems } = useSelector((s) => s.cart)
  const { categories } = useSelector((s) => s.products)
  const { handleLogout } = useAuthHook()

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [showSearch, setShowSearch] = useState(false)
  const [showMega, setShowMega] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0)

  useEffect(() => {
    if (searchQuery.length < 2) { setSearchResults([]); return }
    const timer = setTimeout(async () => {
      try {
        const res = await productsApi.getAll({ limit: 20 })
        setSearchResults(res.data.filter(p =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 5))
      } catch {}
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  return (
    <>
      {/* Top bar */}
      <div className="bg-[#111213] text-gray-400 text-xs py-1.5">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="hidden md:flex gap-5">
            <span>📦 Доставка 1-3 дня</span>
            <span>☎ +372 5XXX XXXX</span>
          </div>
          <div className="flex gap-2 ml-auto">
            {['RU', 'ET', 'EN', 'LV'].map((l) => (
              <button key={l} onClick={() => showToast(`Язык: ${l}`)}
                className={`px-2 py-0.5 rounded text-xs border transition-colors ${l === 'RU' ? 'bg-[#E8181A] border-[#E8181A] text-white' : 'border-gray-600 hover:border-[#E8181A] hover:text-white'}`}>
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="bg-[#1a1c1e] sticky top-0 z-50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link href="/" className="font-condensed text-3xl font-black text-white tracking-tight shrink-0">
            AUTO<span className="text-[#E8181A]">PARTS</span>
          </Link>

          <div className="flex-1 relative hidden md:block">
            <div className="flex bg-white rounded-lg overflow-hidden shadow-sm">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  className="w-full pl-10 pr-4 py-3 text-sm outline-none"
                  placeholder="Артикул, название..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSearch(true)}
                  onBlur={() => setTimeout(() => setShowSearch(false), 200)}
                />
              </div>
              <button className="bg-[#E8181A] hover:bg-[#b80f11] text-white px-5 transition-colors" onClick={() => router.push(`/shop?q=${searchQuery}`)}>
                <Search className="w-5 h-5" />
              </button>
            </div>

            {showSearch && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-2xl z-50 overflow-hidden animate-fade-in">
                {searchResults.map(p => (
                  <div key={p.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                    onMouseDown={() => router.push(`/shop/${p.id}`)}>
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl shrink-0">
                      {CATEGORY_ICONS[p.category?.slug || ''] || '🔧'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate">{p.name}</div>
                      <div className="text-xs text-gray-500">{p.category?.name}</div>
                    </div>
                    <div className="text-sm font-bold text-[#E8181A] shrink-0">{p.price.toFixed(2)} €</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button className="hidden md:flex flex-col items-center p-2 text-gray-300 hover:text-white rounded-lg hover:bg-[#222527] transition-colors text-xs gap-0.5">
              <Heart className="w-5 h-5" />
              <span>Список</span>
            </button>

            <button onClick={() => dispatch(toggleCart())}
              className="flex flex-col items-center p-2 text-gray-300 hover:text-white rounded-lg hover:bg-[#222527] transition-colors text-xs gap-0.5 relative">
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden md:block">Корзина</span>
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#E8181A] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="relative">
                <button onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-2 text-gray-300 hover:text-white rounded-lg hover:bg-[#222527] transition-colors">
                  <div className="w-7 h-7 rounded-full bg-[#E8181A] flex items-center justify-center text-white text-xs font-bold">
                    {user.email[0].toUpperCase()}
                  </div>
                  <ChevronDown className="w-4 h-4 hidden md:block" />
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-2xl z-50 overflow-hidden animate-modal-in">
                    <div className="px-4 py-3 border-b bg-gray-50">
                      <div className="text-sm font-semibold truncate">{user.firstName || user.email}</div>
                      <div className="text-xs text-gray-500 capitalize">{user.role.toLowerCase()}</div>
                    </div>
                    <Link href="/account" className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors" onClick={() => setShowUserMenu(false)}>
                      <User className="w-4 h-4 text-gray-400" /> Мой аккаунт
                    </Link>
                    {user.role === 'ADMIN' && (
                      <Link href="/admin" className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors text-[#E8181A] font-semibold" onClick={() => setShowUserMenu(false)}>
                        <Settings className="w-4 h-4" /> Панель Admin
                      </Link>
                    )}
                    <div className="border-t">
                      <button onClick={() => { setShowUserMenu(false); handleLogout() }} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors w-full text-left text-gray-600">
                        <LogOut className="w-4 h-4 text-gray-400" /> Выйти
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/src/app/(main)/(auth)/auth/login" className="flex flex-col items-center p-2 text-gray-300 hover:text-white rounded-lg hover:bg-[#222527] transition-colors text-xs gap-0.5">
                <User className="w-5 h-5" />
                <span className="hidden md:block">Войти</span>
              </Link>
            )}
          </div>
        </div>

        {/* Car selector bar */}
        <div className="bg-[#222527] border-t border-gray-700 border-b-2 border-b-[#E8181A]">
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-3 flex-wrap">
            <span className="text-gray-400 text-xs font-bold uppercase tracking-wider shrink-0">🚗 Выбор авто</span>
            <div className="flex gap-2 flex-1 flex-wrap">
              {['Марка', 'Модель', 'Год', 'Двигатель'].map((label) => (
                <select key={label} className="bg-[#1a1c1e] border border-gray-600 text-gray-200 text-xs px-3 py-1.5 rounded-md focus:outline-none focus:border-[#E8181A] flex-1 min-w-24 max-w-36 cursor-pointer">
                  <option>{label}</option>
                </select>
              ))}
            </div>
            <button onClick={() => showToast('🔍 Поиск запчастей...')}
              className="bg-[#E8181A] hover:bg-[#b80f11] text-white text-xs font-bold px-4 py-1.5 rounded-md transition-colors font-condensed tracking-wide shrink-0">
              Найти →
            </button>
            <span className="text-gray-600 text-xs shrink-0">или</span>
            <input placeholder="VIN номер..." className="bg-[#1a1c1e] border border-gray-600 text-gray-200 text-xs px-3 py-1.5 rounded-md focus:outline-none focus:border-[#E8181A] w-36 uppercase" />
          </div>
        </div>

        {/* Nav */}
        <nav className="bg-[#111213] border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 flex items-center relative">
            <button onClick={() => setShowMega(!showMega)}
              className="flex items-center gap-2 px-4 py-3 text-white font-bold text-sm bg-[#E8181A] hover:bg-[#b80f11] transition-colors font-condensed tracking-wide">
              {showMega ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              Все категории
            </button>
            {['Главная', 'Акции 🔥', 'Новинки', 'Бренды', 'Доставка', 'Контакты'].map((item) => (
              <Link key={item} href={item === 'Главная' ? '/' : '#'}
                className="px-4 py-3 text-gray-400 hover:text-white text-sm font-medium transition-colors border-b-2 border-transparent hover:border-[#E8181A]">
                {item}
              </Link>
            ))}
            {showMega && (
              <div className="absolute top-full left-0 bg-white shadow-2xl rounded-b-xl z-50 p-6 grid grid-cols-4 gap-6 w-[700px] animate-modal-in">
                {[
                  { title: '🔧 Двигатель', links: ['Фильтры масляные', 'Прокладки', 'Свечи зажигания', 'Турбины'] },
                  { title: '🛞 Тормоза', links: ['Тормозные колодки', 'Тормозные диски', 'Суппорты', 'Тормозная жидкость'] },
                  { title: '🔩 Подвеска', links: ['Амортизаторы', 'Пружины', 'Сайлентблоки', 'Шаровые опоры'] },
                  { title: '⚡ Электрика', links: ['Аккумуляторы', 'Генераторы', 'Стартеры', 'Датчики'] },
                ].map((col) => (
                  <div key={col.title}>
                    <h4 className="font-condensed text-xs font-bold uppercase tracking-widest text-[#E8181A] mb-3 pb-2 border-b-2 border-gray-100">{col.title}</h4>
                    {col.links.map((l) => <a key={l} href="#" className="block py-1 text-sm text-gray-700 hover:text-[#E8181A] hover:pl-2 transition-all">{l}</a>)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </nav>
      </header>
    </>
  )
}
