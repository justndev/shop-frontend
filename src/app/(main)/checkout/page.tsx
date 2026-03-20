'use client'

import { useRouter } from 'next/navigation'
import { CheckCircle, User, Package, CreditCard, ChevronRight, ArrowLeft } from 'lucide-react'
import { useCheckout } from '@/src/hooks/useCheckout'
import { DELIVERY_OPTIONS } from '@/src/api/paymentApi'
import PaymentMethodSelector from "@/src/modules/payment/PaymentMethodSelector";

const STEPS = [
  { id: 1 as const, label: 'Данные',   icon: User },
  { id: 2 as const, label: 'Доставка', icon: Package },
  { id: 3 as const, label: 'Оплата',   icon: CreditCard },
]

// ── FIELD ─────────────────────────────────────────────────────────────────────

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">{label}</label>
        {children}
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
  )
}

const inputCls = (err?: string) =>
    `w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-colors bg-white ${
        err ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-[#E8181A]'
    }`

// ── STEP 1: CONTACT ───────────────────────────────────────────────────────────

function StepContact({ form, errors, setContact }: {
  form: ReturnType<typeof useCheckout>['form']
  errors: ReturnType<typeof useCheckout>['errors']
  setContact: ReturnType<typeof useCheckout>['setContact']
}) {
  const { contact } = form
  return (
      <div className="space-y-4">
        <h2 className="font-condensed text-xl font-bold mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-[#E8181A]" /> Личные данные
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Имя" error={errors.firstName}>
            <input className={inputCls(errors.firstName)} placeholder="Иван"
                   value={contact.firstName} onChange={e => setContact({ firstName: e.target.value })} />
          </Field>
          <Field label="Фамилия" error={errors.lastName}>
            <input className={inputCls(errors.lastName)} placeholder="Иванов"
                   value={contact.lastName} onChange={e => setContact({ lastName: e.target.value })} />
          </Field>
          <Field label="Email" error={errors.email}>
            <input type="email" className={inputCls(errors.email)} placeholder="ivan@example.com"
                   value={contact.email} onChange={e => setContact({ email: e.target.value })} />
          </Field>
          <Field label="Телефон" error={errors.phone}>
            <input className={inputCls(errors.phone)} placeholder="+372 5XXX XXXX"
                   value={contact.phone} onChange={e => setContact({ phone: e.target.value })} />
          </Field>
        </div>
        <Field label="Примечание к заказу (необязательно)">
        <textarea className={inputCls()} rows={2} placeholder="Особые пожелания…"
                  value={contact.note || ''} onChange={e => setContact({ note: e.target.value })} />
        </Field>
      </div>
  )
}

// ── STEP 2: DELIVERY ──────────────────────────────────────────────────────────

function StepDelivery({ deliveryId, setDelivery }: {
  deliveryId: string
  setDelivery: (id: string) => void
}) {
  return (
      <div>
        <h2 className="font-condensed text-xl font-bold mb-4 flex items-center gap-2">
          <Package className="w-5 h-5 text-[#E8181A]" /> Способ доставки
        </h2>
        <div className="space-y-3">
          {DELIVERY_OPTIONS.map(opt => (
              <label
                  key={opt.id}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      deliveryId === opt.id
                          ? 'border-[#E8181A] bg-red-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
              >
                <input
                    type="radio" name="delivery" value={opt.id}
                    checked={deliveryId === opt.id}
                    onChange={() => setDelivery(opt.id)}
                    className="accent-[#E8181A] w-4 h-4 shrink-0"
                />
                <span className="text-2xl">{opt.icon}</span>
                <div className="flex-1">
                  <div className="font-semibold text-sm">{opt.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{opt.description}</div>
                  <div className="text-xs text-gray-400 mt-0.5">⏱ {opt.estimatedDays}</div>
                </div>
                <div className="font-bold text-[#E8181A] text-sm shrink-0">
                  {opt.price === 0 ? 'Бесплатно' : `${opt.price.toFixed(2)} €`}
                </div>
              </label>
          ))}
        </div>
      </div>
  )
}

// ── STEP 3: PAYMENT ───────────────────────────────────────────────────────────

function StepPayment({ checkout }: { checkout: ReturnType<typeof useCheckout> }) {
  const { paymentMethods, loadingMethods, form, errors, selectMethod,
    banksByCountry, countryNames, activeCountry, setActiveCountry } = checkout

  return (
      <div>
        <h2 className="font-condensed text-xl font-bold mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-[#E8181A]" /> Способ оплаты
        </h2>

        {loadingMethods ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="w-8 h-8 border-2 border-[#E8181A] border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-gray-500">Загрузка способов оплаты…</span>
            </div>
        ) : paymentMethods ? (
            <PaymentMethodSelector
                methods={paymentMethods}
                selected={form.selectedMethod}
                onSelect={selectMethod}
                banksByCountry={banksByCountry}
                countryNames={countryNames}
                activeCountry={activeCountry}
                setActiveCountry={setActiveCountry}
                error={errors.payment}
            />
        ) : (
            <div className="text-center py-8 text-gray-400">
              <p>Не удалось загрузить способы оплаты</p>
            </div>
        )}

        <div className="mt-5 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-400">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          Безопасная оплата через MakeCommerce · PCI DSS Level 1
        </div>
      </div>
  )
}

// ── ORDER SUMMARY ─────────────────────────────────────────────────────────────

function OrderSummary({ checkout }: { checkout: ReturnType<typeof useCheckout> }) {
  const { items, subtotal, total, delivery } = checkout
  return (
      <div className="bg-white rounded-2xl p-5 shadow-sm sticky top-24">
        <h3 className="font-condensed text-lg font-bold mb-4">📋 Ваш заказ</h3>

        <div className="space-y-3 max-h-64 overflow-y-auto mb-4 pr-1">
          {items.map(item => (
              <div key={item.id} className="flex items-center gap-3 text-sm">
                <div className="w-9 h-9 bg-gray-100 rounded-lg text-lg flex items-center justify-center shrink-0 overflow-hidden">
                  {item.imageUrl
                      ? <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                      : (item.emoji || '🔧')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="truncate font-medium text-xs leading-snug">{item.name}</div>
                  <div className="text-gray-400 text-xs">× {item.quantity}</div>
                </div>
                <div className="font-bold text-xs shrink-0">{(item.price * item.quantity).toFixed(2)} €</div>
              </div>
          ))}
        </div>

        <div className="border-t pt-3 space-y-2 text-sm">
          <div className="flex justify-between text-gray-500">
            <span>Товары ({items.length}):</span>
            <span>{subtotal.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Доставка ({delivery.label}):</span>
            <span>{delivery.price === 0 ? 'Бесплатно' : `${delivery.price.toFixed(2)} €`}</span>
          </div>
          <div className="flex justify-between font-bold text-lg pt-2 border-t">
            <span>Итого:</span>
            <span className="text-[#E8181A] font-condensed font-black text-2xl">{total.toFixed(2)} €</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t flex flex-wrap gap-2 text-xs text-gray-400">
          <span>🚚 Доставка {delivery.estimatedDays}</span>
          <span>🔄 Возврат 30 дней</span>
          <span>🛡️ Гарантия</span>
        </div>
      </div>
  )
}

// ── SUCCESS SCREEN ────────────────────────────────────────────────────────────

function OrderSuccess({ email }: { email: string }) {
  const router = useRouter()
  return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-10 text-center max-w-md shadow-xl">
          <div className="text-6xl mb-4">🎉</div>
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h2 className="font-condensed text-3xl font-black mb-2">Заказ оформлен!</h2>
          <p className="text-gray-500 mb-6">Подтверждение отправлено на <strong>{email}</strong></p>
          <div className="flex flex-col gap-3">
            <button onClick={() => router.push('/account/orders')}
                    className="bg-[#E8181A] text-white font-bold py-3 rounded-xl hover:bg-[#b80f11] transition-colors">
              Мои заказы →
            </button>
            <button onClick={() => router.push('/')}
                    className="border border-gray-200 text-gray-600 font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors">
              Продолжить покупки
            </button>
          </div>
        </div>
      </div>
  )
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const router   = useRouter()
  const checkout = useCheckout()
  const { step, form, errors, isSubmitting, submitError,
    nextStep, prevStep, submitOrder, user, items } = checkout

  // Guards
  if (!user) {
    return (
        <div className="min-h-64 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 mb-3">Для оформления заказа войдите в аккаунт</p>
            <button onClick={() => router.push('/auth/login?redirect=/checkout')}
                    className="bg-[#E8181A] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#b80f11] transition-colors">
              Войти →
            </button>
          </div>
        </div>
    )
  }

  if (items.length === 0) {
    return (
        <div className="min-h-64 flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl mb-3">🛒</div>
            <p className="text-gray-500 mb-3">Ваша корзина пуста</p>
            <button onClick={() => router.push('/shop')}
                    className="bg-[#E8181A] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#b80f11] transition-colors">
              В каталог →
            </button>
          </div>
        </div>
    )
  }

  return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => router.back()} className="flex items-center gap-1 text-gray-400 hover:text-gray-700 transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="font-condensed text-4xl font-black">🛍️ Оформление заказа</h1>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Left — steps */}
          <div className="md:col-span-2">
            {/* Step indicator */}
            <div className="flex items-center gap-0 mb-8 bg-white rounded-xl overflow-hidden shadow-sm">
              {STEPS.map((s, i) => (
                  <button
                      key={s.id}
                      onClick={() => step > s.id && (s.id === 1 ? prevStep() : null)}
                      className={`flex-1 py-4 flex items-center justify-center gap-2 text-sm font-semibold transition-colors border-b-2
                  ${step === s.id
                          ? 'text-[#E8181A] border-[#E8181A] bg-red-50'
                          : step > s.id
                              ? 'text-emerald-600 border-emerald-500 bg-emerald-50/40 cursor-pointer'
                              : 'text-gray-400 border-transparent cursor-not-allowed'}`}
                  >
                    {step > s.id
                        ? <CheckCircle className="w-4 h-4" />
                        : <s.icon className="w-4 h-4" />}
                    <span className="hidden sm:block">{s.label}</span>
                    <span className="sm:hidden">{s.id}.</span>
                  </button>
              ))}
            </div>

            {/* Step content */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              {step === 1 && <StepContact form={form} errors={errors} setContact={checkout.setContact} />}
              {step === 2 && <StepDelivery deliveryId={form.deliveryId} setDelivery={checkout.setDelivery} />}
              {step === 3 && <StepPayment checkout={checkout} />}

              {submitError && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                    ⚠️ {submitError}
                  </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-6 pt-5 border-t border-gray-100">
                <button
                    onClick={prevStep}
                    className={`${step === 1 ? 'invisible' : ''} flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-5 py-2.5 rounded-xl transition-colors text-sm`}
                >
                  <ArrowLeft className="w-4 h-4" /> Назад
                </button>

                {step < 3 ? (
                    <button
                        onClick={nextStep}
                        className="flex items-center gap-2 bg-[#E8181A] hover:bg-[#b80f11] text-white font-condensed font-bold px-8 py-2.5 rounded-xl transition-colors"
                    >
                      Далее <ChevronRight className="w-4 h-4" />
                    </button>
                ) : (
                    <button
                        onClick={submitOrder}
                        disabled={isSubmitting}
                        className="flex items-center gap-2 bg-[#E8181A] hover:bg-[#b80f11] disabled:opacity-60 disabled:cursor-not-allowed text-white font-condensed font-bold text-base px-8 py-2.5 rounded-xl transition-colors"
                    >
                      {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Оформляем…
                          </>
                      ) : (
                          <><CreditCard className="w-4 h-4" /> Перейти к оплате →</>
                      )}
                    </button>
                )}
              </div>
            </div>
          </div>

          {/* Right — order summary */}
          <div>
            <OrderSummary checkout={checkout} />
          </div>
        </div>
      </div>
  )
}