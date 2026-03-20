
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAppDispatch } from '@/src/hooks/redux'
import { addItem, openCart } from '@/src/store/slices/cartSlice'
import { showToast } from '@/src/modules/ui/Toast'
import { SlidersHorizontal, Grid3X3, List, Search } from 'lucide-react'
import productApi, { Product } from '@/src/api/productApi'
import { categoryApi, Category } from '@/src/api/productApi'
import {useDispatch} from "react-redux";

const EMOJIS: Record<string, string> = {
  brakes: '🛞', engine: '🔧', suspension: '🔩', filters: '🌀',
  electric: '⚡', exhaust: '💨', cooling: '❄️',
}

export default function ShopPage() {
  const router = useRouter()
  const dispatch = useDispatch()
  const searchParams = useSearchParams()

  const [products, setProducts]       = useState<Product[]>([])
  const [categories, setCategories]   = useState<Category[]>([])
  const [total, setTotal]             = useState(0)
  const [isLoading, setIsLoading]     = useState(true)

  const [view, setView]               = useState<'grid' | 'list'>('grid')
  const [search, setSearch]           = useState(searchParams.get('q') || '')
  const [selectedCatId, setSelectedCatId] = useState('')
  const [minPrice, setMinPrice]       = useState('')
  const [maxPrice, setMaxPrice]       = useState('')
  const [sortBy, setSortBy]           = useState('default')

  // Fetch categories once
  useEffect(() => {
    categoryApi.list().then(setCategories).catch(console.error)
  }, [])

  const fetchProducts = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await productApi.list({
        search: search || undefined,
        categoryId: selectedCatId || undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        isActive: true,
        limit: 50,
      })
      let data = res.data
      if (sortBy === 'price-asc')  data = [...data].sort((a, b) => a.price - b.price)
      if (sortBy === 'price-desc') data = [...data].sort((a, b) => b.price - a.price)
      setProducts(data)
      setTotal(res.total)
    } finally {
      setIsLoading(false)
    }
  }, [search, selectedCatId, minPrice, maxPrice, sortBy])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  function handleAddToCart(product: Product) {
    dispatch(addItem({
      id: product.id,
      name: product.name,
      price: product.salePrice || product.price,
      quantity: 1,
      stock: product.stock,
      imageUrl: product.images[0],
      emoji: EMOJIS[product.category?.slug || ''] || '🔧',
    }))
    dispatch(openCart())
    showToast(`✅ ${product.name.slice(0, 30)} добавлен`)
  }

  return (
      <div className="max-w-7xl mx-auto px-4 py-8 flex gap-6">
        // Sidebar
        <aside className="hidden md:block md:relative md:w-64 shrink-0">
          <div className="bg-white rounded-xl overflow-hidden shadow-sm mb-4">
            <div className="px-4 py-3 border-b text-xs font-bold uppercase tracking-wider text-gray-400">🗂 Категории</div>
            <div className="divide-y divide-gray-50">
              <button
                  onClick={() => setSelectedCatId('')}
                  className={`flex items-center justify-between w-full px-4 py-2.5 text-sm hover:bg-gray-50 text-left transition-colors ${!selectedCatId ? 'bg-red-50 text-[#E8181A] font-semibold' : ''}`}
              >
                <span>🛠 Все запчасти</span>
                <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">{total}</span>
              </button>
              {categories.map(cat => (
                  <button key={cat.id} onClick={() => setSelectedCatId(cat.id)}
                          className={`flex items-center justify-between w-full px-4 py-2.5 text-sm hover:bg-gray-50 text-left transition-colors ${selectedCatId === cat.id ? 'bg-red-50 text-[#E8181A] font-semibold' : ''}`}
                  >
                    <span className="flex items-center gap-2">{EMOJIS[cat.slug] || '🔧'} {cat.name}</span>
                  </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm">
            <div className="px-4 py-3 border-b text-xs font-bold uppercase tracking-wider text-gray-400">🎛 Фильтры</div>
            <div className="p-4 space-y-4">
              <div>
                <div className="text-xs font-bold uppercase text-gray-400 mb-2">Цена (€)</div>
                <div className="flex gap-2 items-center">
                  <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#E8181A]"
                         type="number" placeholder="От" value={minPrice} onChange={e => setMinPrice(e.target.value)} />
                  <span className="text-gray-300">—</span>
                  <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#E8181A]"
                         type="number" placeholder="До" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
                </div>
              </div>
              <button onClick={fetchProducts}
                      className="w-full bg-[#E8181A] hover:bg-[#b80f11] text-white font-bold py-2.5 rounded-lg transition-colors text-sm">
                Применить
              </button>
            </div>
          </div>
        </aside>

        // Main content
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-5 flex-wrap">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E8181A] bg-white"
                     placeholder="Поиск по каталогу..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                    className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-[#E8181A]">
              <option value="default">По умолчанию</option>
              <option value="price-asc">Цена: дешевле</option>
              <option value="price-desc">Цена: дороже</option>
            </select>
            <div className="flex gap-1">
              <button onClick={() => setView('grid')} className={`p-2 rounded-lg border transition-colors ${view === 'grid' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button onClick={() => setView('list')} className={`p-2 rounded-lg border transition-colors ${view === 'list' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="text-sm text-gray-500 mb-4 font-medium">
            {isLoading ? 'Загрузка...' : `Найдено ${products.length} товаров`}
          </div>

          {isLoading ? (
              <div className={`grid ${view === 'grid' ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1'} gap-4`}>
                {Array.from({ length: 9 }).map((_, i) => <div key={i} className="bg-white rounded-xl h-64 animate-pulse" />)}
              </div>
          ) : products.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <div className="text-5xl mb-3">🔍</div>
                <p className="font-semibold">Ничего не найдено</p>
              </div>
          ) : (
              <div className={`grid gap-4 ${view === 'grid' ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1'}`}>
                {products.map(product => (
                    <div key={product.id}
                         className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all group ${view === 'list' ? 'flex items-center' : ''}`}
                    >
                      <div
                          className={`bg-gray-50 flex items-center justify-center cursor-pointer shrink-0 overflow-hidden ${view === 'list' ? 'w-28 h-28' : 'h-40 w-full'}`}
                          onClick={() => router.push(`/shop/${product.id}`)}
                      >
                        {product.images[0]
                            ? <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                            : <span className="text-5xl">{EMOJIS[product.category?.slug || ''] || '🔧'}</span>
                        }
                      </div>
                      <div className="p-4 flex-1">
                        <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">{product.category?.name}</div>
                        <div className="font-semibold text-sm leading-snug mb-2 line-clamp-2 cursor-pointer group-hover:text-[#E8181A] transition-colors"
                             onClick={() => router.push(`/shop/${product.id}`)}>
                          {product.name}
                        </div>
                        <div className="flex items-center justify-between mt-auto">
                          <div>
                            {product.salePrice ? (
                                <>
                                  <div className="font-condensed text-xl font-black text-[#E8181A]">{product.salePrice.toFixed(2)} €</div>
                                  <div className="text-xs text-gray-400 line-through">{product.price.toFixed(2)} €</div>
                                </>
                            ) : (
                                <div className="font-condensed text-xl font-black text-[#E8181A]">{product.price.toFixed(2)} €</div>
                            )}
                            <div className={`text-xs font-semibold ${product.stock > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                              {product.stock > 0 ? `✅ В наличии` : '❌ Нет'}
                            </div>
                          </div>
                          <button onClick={() => handleAddToCart(product)} disabled={product.stock === 0}
                                  className="bg-[#E8181A] hover:bg-[#b80f11] disabled:bg-gray-200 disabled:cursor-not-allowed text-white font-bold text-xs px-3 py-2 rounded-lg transition-colors">
                            🛒
                          </button>
                        </div>
                      </div>
                    </div>
                ))}
              </div>
          )}
        </div>
      </div>
  )
}
