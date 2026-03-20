import apiClient from '../lib/apiClient'

// ── TYPES ─────────────────────────────────────────────────────────────────────

export interface PaymentMethod {
  name: string
  display_name: string
  logo_url: string
  url: string
  country: string
  min_amount: number | null
  max_amount: number | null
  type: 'banklinks' | 'cards' | 'payLater'
}

export interface PaymentMethodsResponse {
  banklinks: PaymentMethod[]
  cards: PaymentMethod[]
  payLater: PaymentMethod[]
}

export interface DeliveryOption {
  id: string
  label: string
  description: string
  price: number
  estimatedDays: string
  icon: string
}

export interface CheckoutItem {
  productId: string
  quantity: number
}

export interface ContactInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  note?: string
}

export interface InitCheckoutPayload {
  items: CheckoutItem[]
  deliveryMethod: string
  deliveryPrice: number
  contactInfo: ContactInfo
  paymentMethodName: string
  paymentMethodUrl?: string
  country?: string
  locale?: string
}

export interface InitCheckoutResponse {
  order: { id: string; totalAmount: number; status: string }
  paymentUrl: string
}

export type OrderStatus = 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED'

export interface AdminOrder {
  id: string
  status: OrderStatus
  totalAmount: number
  mkTransactionId: string | null
  mkPaymentMethod: string | null
  deliveryMethod: string | null
  deliveryPrice: number | null
  contactInfo: ContactInfo | null
  createdAt: string
  user: { id: string; email: string; firstName: string | null; lastName: string | null }
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
    product: { id: string; name: string; images: string[] } | null
  }>
}

// ── MOCK DELIVERY OPTIONS ─────────────────────────────────────────────────────
// When real Omniva/DPD APIs are integrated, fetch from backend instead

export const DELIVERY_OPTIONS: DeliveryOption[] = [
  {
    id: 'omniva',
    label: 'Omniva пакомат',
    description: '1-2 рабочих дня · Сеть паркоматов по всей Эстонии',
    price: 2.99,
    estimatedDays: '1-2 дня',
    icon: '📦',
  },
  {
    id: 'dpd',
    label: 'DPD курьер',
    description: 'Доставка до двери · 1-3 рабочих дня',
    price: 4.99,
    estimatedDays: '1-3 дня',
    icon: '🚚',
  },
  {
    id: 'dpd_parcel',
    label: 'DPD пакомат',
    description: '1-2 рабочих дня · Сеть DPD Pickup',
    price: 2.99,
    estimatedDays: '1-2 дня',
    icon: '📫',
  },
  {
    id: 'pickup',
    label: 'Самовывоз',
    description: 'Liivalaia 45, Tallinn · Пн-Пт 9:00-18:00',
    price: 0,
    estimatedDays: 'Сегодня',
    icon: '🏪',
  },
]

// ── API ───────────────────────────────────────────────────────────────────────

const paymentApi = {
  async getPaymentMethods(amount: number): Promise<PaymentMethodsResponse> {
    const res = await apiClient.get('/payment/methods', { params: { amount } })
    return res.data.data
  },

  async initCheckout(payload: InitCheckoutPayload): Promise<InitCheckoutResponse> {
    const res = await apiClient.post('/checkout/init', payload)
    return res.data.data
  },
}

export const adminOrderApi = {
  async list(params: { page?: number; limit?: number; status?: OrderStatus } = {}) {
    const res = await apiClient.get('/admin/orders', { params })
    return res.data as { data: AdminOrder[]; total: number; page: number; limit: number }
  },

  async getById(id: string): Promise<AdminOrder> {
    const res = await apiClient.get(`/admin/orders/${id}`)
    return res.data.data
  },

  async updateStatus(id: string, status: OrderStatus): Promise<AdminOrder> {
    const res = await apiClient.patch(`/admin/orders/${id}/status`, { status })
    return res.data.data
  },
}

export default paymentApi