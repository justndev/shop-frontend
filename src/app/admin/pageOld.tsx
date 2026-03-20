'use client'

import {useEffect, useRef, useState} from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/src/hooks/redux'
import { useShopHook } from '@/src/hooks/useShopHook'
import { useAdminHook } from '@/src/hooks/useAdminHook'
import MediaManager from '@/src/modules/media/MediaManager'
import { Plus, Trash2, Package, ShoppingBag, Tag, BarChart3, X, Image as ImageIcon } from 'lucide-react'
import {useSelector} from "react-redux";

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:4000'

type Tab = 'overview' | 'products' | 'orders' | 'categories'

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  PAID: 'bg-emerald-100 text-emerald-700',
  FAILED: 'bg-red-100 text-red-700',
  CANCELLED: 'bg-gray-100 text-gray-600',
}

const EMPTY_PRODUCT = {
  name: '', description: '', price: '', stock: '',
  categoryId: '', slug: '', isActive: true, images: [] as string[],
}

export default function AdminPage() {
  const [categoryForm, setCategoryForm] = useState({ name: '', slug: '' })

  const router = useRouter()
  const { user } = useSelector((s) => s.auth)
  const { items: products, categories } = useSelector((s) => s.products)
  const { items: orders } = useSelector((s) => s.orders)

  const { fetchProducts, fetchCategories, loading: shopLoading } = useShopHook()
  const { handleCreateProduct, handleDeleteProduct, handleCreateCategory, fetchAdminOrders, loading } = useAdminHook()

  const [tab, setTab] = useState<Tab>('overview')
  const [showNewProduct, setShowNewProduct] = useState(false)
  const [showNewCategory, setShowNewCategory] = useState(false)
  const [showMediaManager, setShowMediaManager] = useState(false)
  const [productForm, setProductForm] = useState(EMPTY_PRODUCT)

  const hasRun = useRef(false)

  useEffect(() => {

    if (!user) {
      console.log(user)
      router.push('/auth/login'); return }

    console.log(user)
    if (user.role !== 'ADMIN') { router.push('/'); return }
    if (hasRun.current) return;
    hasRun.current = true;
    //
    // fetchProducts({ limit: 100 })
    // fetchCategories()
    // fetchAdminOrders()
  }, [user])

  const onCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await handleCreateProduct({
      ...productForm,
      price: parseFloat(productForm.price),
      stock: parseInt(productForm.stock),
    })
    if (result.success) {
      setShowNewProduct(false)
      setProductForm(EMPTY_PRODUCT)
    }
  }

  const onCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await handleCreateCategory(categoryForm)
    if (result.success) {
      setShowNewCategory(false)
      setCategoryForm({ name: '', slug: '' })
    }
  }

  if (!user || user.role !== 'ADMIN') return null

  const revenue = orders.filter(o => o.status === 'PAID').reduce((s, o) => s + o.totalAmount, 0)

  const TABS: { id: Tab; label: string; icon: any }[] = [
    { id: 'overview', label: 'Обзор', icon: BarChart3 },
    { id: 'products', label: `Товары (${products.length})`, icon: Package },
    { id: 'orders', label: `Заказы (${orders.length})`, icon: ShoppingBag },
    { id: 'categories', label: `Категории (${categories.length})`, icon: Tag },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-condensed text-4xl font-black">⚙️ Панель управления</h1>
          <p className="text-gray-500 text-sm mt-1">AutoParts Admin</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => router.push('/admin/media')}
            className="flex items-center gap-2 border border-gray-200 text-gray-600 font-bold px-4 py-2.5 rounded-xl transition-colors text-sm hover:bg-gray-50">
            <ImageIcon className="w-4 h-4" /> Медиафайлы
          </button>
          <button onClick={() => setShowNewProduct(true)}
            className="flex items-center gap-2 bg-[#E8181A] hover:bg-[#b80f11] text-white font-bold px-4 py-2.5 rounded-xl transition-colors text-sm">
            <Plus className="w-4 h-4" /> Новый товар
          </button>
        </div>
      </div>

      <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm mb-6 overflow-x-auto">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap ${tab === t.id ? 'bg-[#111213] text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Товаров', value: products.length, icon: '📦', color: 'bg-blue-50 text-blue-700' },
              { label: 'Заказов', value: orders.length, icon: '🛒', color: 'bg-purple-50 text-purple-700' },
              { label: 'Оплачено', value: orders.filter(o => o.status === 'PAID').length, icon: '✅', color: 'bg-emerald-50 text-emerald-700' },
              { label: 'Выручка', value: `${revenue.toFixed(0)} €`, icon: '💶', color: 'bg-amber-50 text-amber-700' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm">
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl text-xl mb-3 ${stat.color}`}>{stat.icon}</div>
                <div className="font-condensed text-3xl font-black">{stat.value}</div>
                <div className="text-gray-500 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="sidebar-title">🕐 Последние заказы</div>
            <div className="divide-y">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 text-sm">
                  <div>
                    <div className="font-mono text-xs text-gray-400">#{order.id.slice(0, 10)}...</div>
                    <div className="font-medium">{order.items?.length || 0} товаров</div>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-lg ${STATUS_COLORS[order.status]}`}>{order.status}</span>
                  <span className="font-condensed font-black text-lg text-[#E8181A]">{order.totalAmount.toFixed(2)} €</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'products' && (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="sidebar-title flex justify-between items-center pr-4">
            <span>📦 Управление товарами</span>
            <button onClick={() => setShowNewProduct(true)} className="flex items-center gap-1 bg-[#E8181A] hover:bg-[#b80f11] text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">
              <Plus className="w-3 h-3" /> Добавить
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500 font-bold uppercase tracking-wider">
                <tr>{['Фото', 'Название', 'Категория', 'Цена', 'Остаток', 'Статус', ''].map(h => <th key={h} className="px-4 py-3 text-left">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y">
                {shopLoading ? (
                  <tr><td colSpan={7} className="p-8 text-center text-gray-400">Загрузка...</td></tr>
                ) : products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                        {product.images?.[0] ? <img src={`${API_URL}${product.images[0]}`} alt="" className="w-full h-full object-cover" /> : <span className="text-xl">🔧</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3"><div className="font-semibold">{product.name}</div></td>
                    <td className="px-4 py-3 text-gray-600">{product.category?.name || '—'}</td>
                    <td className="px-4 py-3 font-bold text-[#E8181A] font-condensed">{product.price.toFixed(2)} €</td>
                    <td className="px-4 py-3">
                      <span className={`font-semibold ${product.stock > 5 ? 'text-emerald-600' : product.stock > 0 ? 'text-amber-600' : 'text-red-600'}`}>{product.stock}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${product.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                        {product.isActive ? 'Активен' : 'Скрыт'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleDeleteProduct(product.id, product.name)} className="text-gray-300 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'orders' && (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="sidebar-title">🛒 Все заказы</div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500 font-bold uppercase tracking-wider">
                <tr>{['ID заказа', 'Дата', 'Товары', 'Сумма', 'Статус'].map(h => <th key={h} className="px-4 py-3 text-left">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{order.id.slice(0, 14)}...</td>
                    <td className="px-4 py-3 text-gray-500">{new Date(order.createdAt).toLocaleDateString('ru')}</td>
                    <td className="px-4 py-3 text-gray-600">{order.items?.length || 0} шт.</td>
                    <td className="px-4 py-3 font-condensed font-black text-[#E8181A]">{order.totalAmount.toFixed(2)} €</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2 py-1 rounded-lg ${STATUS_COLORS[order.status]}`}>{order.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'categories' && (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="sidebar-title flex justify-between items-center pr-4">
            <span>🗂 Категории</span>
            <button onClick={() => setShowNewCategory(true)} className="flex items-center gap-1 bg-[#E8181A] hover:bg-[#b80f11] text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">
              <Plus className="w-3 h-3" /> Добавить
            </button>
          </div>
          <div className="divide-y">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between px-4 py-3">
                <div className="font-semibold">{cat.name}</div>
                <div className="text-sm text-gray-500">{products.filter(p => p.categoryId === cat.id).length} товаров</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Product Modal */}
      {showNewProduct && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl animate-modal-in max-h-[90vh] overflow-y-auto">
            <div className="bg-[#111213] text-white px-6 py-4 flex justify-between items-center sticky top-0 z-10">
              <h3 className="font-condensed text-xl font-bold">➕ Новый товар</h3>
              <button onClick={() => { setShowNewProduct(false); setProductForm(EMPTY_PRODUCT) }}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={onCreateProduct} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Название *</label>
                  <input required className="input-field" placeholder="Тормозные колодки передние"
                    value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Slug *</label>
                  <input required className="input-field font-mono" placeholder="brake-pads-front"
                    value={productForm.slug}
                    onChange={e => setProductForm({ ...productForm, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Описание</label>
                  <textarea className="input-field resize-none h-20" placeholder="Краткое описание..."
                    value={productForm.description}
                    onChange={e => setProductForm({ ...productForm, description: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Цена (€) *</label>
                  <input required type="number" step="0.01" min="0" className="input-field" placeholder="49.90"
                    value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Остаток *</label>
                  <input required type="number" min="0" className="input-field" placeholder="25"
                    value={productForm.stock} onChange={e => setProductForm({ ...productForm, stock: e.target.value })} />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Категория *</label>
                  <select required className="input-field" value={productForm.categoryId}
                    onChange={e => setProductForm({ ...productForm, categoryId: e.target.value })}>
                    <option value="">Выберите категорию</option>
                    {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Фотографии ({productForm.images.length})</label>
                  <button type="button" onClick={() => setShowMediaManager(true)} className="flex items-center gap-1.5 text-xs font-bold text-[#E8181A] hover:underline">
                    <ImageIcon className="w-3.5 h-3.5" /> Открыть медиафайлы
                  </button>
                </div>
                {productForm.images.length === 0 ? (
                  <button type="button" onClick={() => setShowMediaManager(true)}
                    className="w-full h-28 border-2 border-dashed border-gray-300 hover:border-[#E8181A] rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-[#E8181A] transition-colors">
                    <ImageIcon className="w-6 h-6" />
                    <span className="text-sm font-medium">Добавить фотографии</span>
                  </button>
                ) : (
                  <div className="flex gap-2 overflow-x-auto pb-2 border border-gray-200 rounded-xl p-3">
                    {productForm.images.map((url, i) => (
                      <div key={url} className="relative shrink-0 w-20 h-20 rounded-lg overflow-hidden border border-gray-200 group">
                        <img src={`${API_URL}${url}`} alt="" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => setProductForm(f => ({ ...f, images: f.images.filter((_, j) => j !== i) }))}
                          className="absolute top-1 right-1 w-5 h-5 bg-black/60 hover:bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    <button type="button" onClick={() => setShowMediaManager(true)}
                      className="shrink-0 w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 hover:border-[#E8181A] flex items-center justify-center text-gray-400 hover:text-[#E8181A] transition-colors">
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-[#E8181A] w-4 h-4" checked={productForm.isActive}
                  onChange={e => setProductForm({ ...productForm, isActive: e.target.checked })} />
                <span className="text-sm font-medium">Активен (виден в каталоге)</span>
              </label>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowNewProduct(false); setProductForm(EMPTY_PRODUCT) }}
                  className="flex-1 border border-gray-200 py-3 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                  Отмена
                </button>
                <button type="submit" disabled={loading}
                  className="flex-1 bg-[#E8181A] hover:bg-[#b80f11] disabled:opacity-70 text-white font-condensed font-bold py-3 rounded-xl transition-colors text-lg">
                  {loading ? 'Создаём...' : 'Создать →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Category Modal */}
      {showNewCategory && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-modal-in">
              <div className="bg-[#111213] text-white px-6 py-4 flex justify-between items-center">
                <h3 className="font-condensed text-xl font-bold">➕ Новая категория</h3>
                <button onClick={() => setShowNewCategory(false)}><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={onCreateCategory} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Название *</label>
                  <input required className="input-field" placeholder="Тормоза" value={categoryForm.name}
                         onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Slug *</label>
                  <input required className="input-field font-mono" placeholder="tormoza"
                         value={categoryForm.slug}
                         onChange={e => setCategoryForm({ ...categoryForm, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} />
                  <p className="text-xs text-gray-400 mt-1">Только латиница, цифры и дефисы</p>
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => { setShowNewCategory(false); setCategoryForm({ name: '', slug: '' }) }}
                          className="flex-1 border border-gray-200 py-3 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                    Отмена
                  </button>
                  <button type="submit" disabled={loading}
                          className="flex-1 bg-[#E8181A] hover:bg-[#b80f11] disabled:opacity-70 text-white font-condensed font-bold py-3 rounded-xl transition-colors text-lg">
                    {loading ? 'Создаём...' : 'Создать →'}
                  </button>
                </div>
              </form>
            </div>
          </div>
      )}

      <MediaManager
        open={showMediaManager}
        onClose={() => setShowMediaManager(false)}
        selected={productForm.images}
        onConfirm={(urls) => {
          setProductForm(f => ({ ...f, images: urls }))
          setShowMediaManager(false)
          if (!showNewProduct) setShowNewProduct(true)
        }}
      />
    </div>
  )
}
