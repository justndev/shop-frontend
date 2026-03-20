import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '@/src/hooks/redux'
import { clearCart } from '@/src/store/slices/cartSlice'
import paymentApi, {
    PaymentMethod,
    PaymentMethodsResponse,
    ContactInfo,
    DELIVERY_OPTIONS,
    DeliveryOption,
} from '@/src/api/paymentApi'
import {useDispatch, useSelector} from "react-redux";

export type CheckoutStep = 1 | 2 | 3

export interface CheckoutFormState {
    // Step 1 — Contact
    contact: ContactInfo
    // Step 2 — Delivery
    deliveryId: string
    // Step 3 — Payment
    selectedMethod: PaymentMethod | null
}

const INITIAL_FORM: CheckoutFormState = {
    contact: { firstName: '', lastName: '', email: '', phone: '', note: '' },
    deliveryId: 'omniva',
    selectedMethod: null,
}

export interface StepError {
    [key: string]: string
}

export function useCheckout() {
    const router   = useRouter()
    const dispatch = useDispatch()
    const { items }         = useSelector(s => s.cart)
    const { user }          = useSelector(s => s.auth)

    // ── Form state ─────────────────────────────────────────────────────────────
    const [step, setStep]   = useState<CheckoutStep>(1)
    const [form, setForm]   = useState<CheckoutFormState>({
        ...INITIAL_FORM,
        contact: {
            firstName: user?.firstName || '',
            lastName:  user?.lastName  || '',
            email:     user?.email     || '',
            phone: '', note: '',
        },
    })
    const [errors, setErrors] = useState<StepError>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError]   = useState<string | null>(null)

    // ── Payment methods ────────────────────────────────────────────────────────
    const [paymentMethods, setPaymentMethods]     = useState<PaymentMethodsResponse | null>(null)
    const [loadingMethods, setLoadingMethods]     = useState(false)
    const [activeCountry, setActiveCountry]       = useState<string>('EE')

    // ── Derived values ─────────────────────────────────────────────────────────
    const delivery      = DELIVERY_OPTIONS.find(d => d.id === form.deliveryId) || DELIVERY_OPTIONS[0]
    const subtotal      = items.reduce((s, i) => s + i.price * i.quantity, 0)
    const total         = parseFloat((subtotal + delivery.price).toFixed(2))

    // ── Fetch payment methods when reaching step 3 ─────────────────────────────
    useEffect(() => {
        if (step === 3 && !paymentMethods) {
            setLoadingMethods(true)
            paymentApi.getPaymentMethods(total)
                .then(setPaymentMethods)
                .catch(console.error)
                .finally(() => setLoadingMethods(false))
        }
    }, [step, total])

    // ── Field setters ──────────────────────────────────────────────────────────
    const setContact = useCallback((patch: Partial<ContactInfo>) => {
        setForm(f => ({ ...f, contact: { ...f.contact, ...patch } }))
        setErrors(e => {
            const n = { ...e }
            Object.keys(patch).forEach(k => delete n[k])
            return n
        })
    }, [])

    const setDelivery = useCallback((id: string) => {
        setForm(f => ({ ...f, deliveryId: id, selectedMethod: null }))
    }, [])

    const selectMethod = useCallback((method: PaymentMethod) => {
        setForm(f => ({ ...f, selectedMethod: method }))
        setErrors(e => ({ ...e, payment: undefined! }))
    }, [])

    // ── Validation per step ────────────────────────────────────────────────────
    const validateStep = useCallback((s: CheckoutStep): boolean => {
        const errs: StepError = {}
        if (s === 1) {
            if (!form.contact.firstName.trim()) errs.firstName = 'Введите имя'
            if (!form.contact.lastName.trim())  errs.lastName  = 'Введите фамилию'
            if (!form.contact.email.trim() || !/\S+@\S+\.\S+/.test(form.contact.email))
                errs.email = 'Введите корректный email'
            if (!form.contact.phone.trim())     errs.phone = 'Введите телефон'
        }
        if (s === 2) {
            if (!form.deliveryId) errs.delivery = 'Выберите способ доставки'
        }
        if (s === 3) {
            if (!form.selectedMethod) errs.payment = 'Выберите способ оплаты'
        }
        setErrors(errs)
        return Object.keys(errs).length === 0
    }, [form])

    const nextStep = useCallback(() => {
        if (!validateStep(step)) return
        if (step < 3) setStep(s => (s + 1) as CheckoutStep)
    }, [step, validateStep])

    const prevStep = useCallback(() => {
        if (step > 1) setStep(s => (s - 1) as CheckoutStep)
    }, [step])

    // ── Submit ─────────────────────────────────────────────────────────────────
    const submitOrder = useCallback(async () => {
        if (!validateStep(3)) return
        if (!user) { router.push('/auth/login?redirect=/checkout'); return }
        if (items.length === 0) return

        setIsSubmitting(true)
        setSubmitError(null)

        try {
            const result = await paymentApi.initCheckout({
                items: items.map(i => ({ productId: i.id, quantity: i.quantity })),
                deliveryMethod:    form.deliveryId,
                deliveryPrice:     delivery.price,
                contactInfo:       form.contact,
                paymentMethodName: form.selectedMethod!.name,
                paymentMethodUrl:  form.selectedMethod!.url,
                country:           activeCountry,
                locale:            'ru',
            })

            dispatch(clearCart())
            // Redirect to MakeCommerce payment page
            window.location.href = result.paymentUrl
        } catch (err: any) {
            setSubmitError(err?.response?.data?.details || 'Ошибка оформления заказа')
        } finally {
            setIsSubmitting(false)
        }
    }, [form, items, user, delivery, activeCountry, dispatch, router, validateStep])

    // ── Banklinks grouped by country ───────────────────────────────────────────
    const banksByCountry = paymentMethods
        ? Object.entries(
            paymentMethods.banklinks.reduce<Record<string, PaymentMethod[]>>((acc, m) => {
                ;(acc[m.country] = acc[m.country] || []).push(m)
                return acc
            }, {})
        )
        : []

    const countryNames: Record<string, string> = { EE: '🇪🇪 Eesti', LV: '🇱🇻 Latvija', LT: '🇱🇹 Lietuva' }

    return {
        // State
        step, form, errors, isSubmitting, submitError,
        // Payment methods
        paymentMethods, loadingMethods,
        banksByCountry, countryNames, activeCountry, setActiveCountry,
        // Derived
        delivery, subtotal, total, items, user,
        // Actions
        setContact, setDelivery, selectMethod,
        nextStep, prevStep, submitOrder,
    }
}