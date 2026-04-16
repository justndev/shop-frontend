'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import productApi, {
    CreateProductPayload,
    StockStatus,
    Product,
} from '@/src/api/productApi'

// ── TYPES ─────────────────────────────────────────────────────────────────────

export type Locale = 'en' | 'ru' | 'et'
export const LOCALES: { code: Locale; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'ru', label: 'Russian', flag: '🇷🇺' },
    { code: 'et', label: 'Estonian', flag: '🇪🇪' },
]

export type ProductStatus = 'draft' | 'published'
export type ActiveTab = 'general' | 'inventory' | 'advanced'

export interface ProductFormState {
    // Basic — now per-locale
    name: Record<Locale, string>
    description: Record<Locale, string>        // rich HTML
    shortDescription: Record<Locale, string>   // rich HTML
    // Pricing
    price: string
    salePrice: string
    // Inventory
    sku: string
    stock: string
    stockStatus: StockStatus
    // Organisation
    categoryId: string
    tags: string[]
    // Images — ordered array of full URLs; index 0 = featured image
    images: string[]
    // Meta
    status: ProductStatus
    reviewsEnabled: boolean
    purchaseNote: string
    menuOrder: string
    slug: string
}

export interface FormErrors {
    name?: string
    price?: string
    categoryId?: string
    sku?: string
    stock?: string
    salePrice?: string
    slug?: string
    [key: string]: string | undefined
}

const EMPTY_LOCALES: Record<Locale, string> = { en: '', ru: '', et: '' }

const INITIAL_STATE: ProductFormState = {
    name: { ...EMPTY_LOCALES },
    description: { ...EMPTY_LOCALES },
    shortDescription: { ...EMPTY_LOCALES },
    price: '',
    salePrice: '',
    sku: '',
    stock: '0',
    stockStatus: 'IN_STOCK',
    categoryId: '',
    tags: [],
    images: [],
    status: 'draft',
    reviewsEnabled: true,
    purchaseNote: '',
    menuOrder: '0',
    slug: '',
}

function toLocaleRecord(value: unknown): Record<Locale, string> {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
        const v = value as Record<string, unknown>
        return {
            en: typeof v.en === 'string' ? v.en : '',
            ru: typeof v.ru === 'string' ? v.ru : '',
            et: typeof v.et === 'string' ? v.et : '',
        }
    }
    // Legacy: plain string stored on the product (e.g. old data before i18n)
    if (typeof value === 'string') return { en: value, ru: '', et: '' }
    return { ...EMPTY_LOCALES }
}

// Helper to convert API product to form state
function productToFormState(product: Product): ProductFormState {
    return {
        name: toLocaleRecord(product.name),
        description: toLocaleRecord(product.description),
        shortDescription: toLocaleRecord(product.shortDescription),
        price: product.price?.toString() || '',
        salePrice: product.salePrice?.toString() || '',
        sku: product.sku || '',
        stock: product.stock?.toString() || '0',
        stockStatus: product.stockStatus || 'IN_STOCK',
        categoryId: product.categoryId || '',
        tags: product.tags || [],
        images: product.images || [],
        status: product.isActive ? 'published' : 'draft',
        reviewsEnabled: product.reviewsEnabled ?? true,
        purchaseNote: product.purchaseNote || '',
        menuOrder: product.menuOrder?.toString() || '0',
        slug: product.slug || '',
    }
}

// ── HOOK ──────────────────────────────────────────────────────────────────────

export function useAddProduct(existingProductId?: string) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(!!existingProductId)
    const [form, setForm] = useState<ProductFormState>(INITIAL_STATE)
    const [errors, setErrors] = useState<FormErrors>({})
    const [isSaving, setIsSaving] = useState(false)
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle')
    const [activeTab, setActiveTab] = useState<ActiveTab>('general')
    const [tagInput, setTagInput] = useState('')

    // Independent locale state per translatable field
    const [nameLocale, setNameLocale] = useState<Locale>('en')
    const [descLocale, setDescLocale] = useState<Locale>('en')
    const [shortDescLocale, setShortDescLocale] = useState<Locale>('en')

    const autoSaveTimer = useRef<ReturnType<typeof setTimeout>>()
    const savedProductId = useRef<string | undefined>(existingProductId)

    // ── Fetch existing product on mount ────────────────────────────────────────
    useEffect(() => {
        async function fetchExistingProduct() {
            if (!existingProductId) return

            setIsLoading(true)
            try {
                const product = await productApi.getById(existingProductId)
                console.log('Fetched product:', product)

                // Convert API response to form state
                const formState = productToFormState(product)
                setForm(formState)
                savedProductId.current = product.id
            } catch (error) {
                console.error('Failed to fetch product:', error)
                setErrors(prev => ({ ...prev, fetch: 'Failed to load product data' }))
            } finally {
                setIsLoading(false)
            }
        }

        fetchExistingProduct()
    }, [existingProductId])

    // ── Field setters ──────────────────────────────────────────────────────────

    const setField = useCallback(<K extends keyof ProductFormState>(
        key: K,
        value: ProductFormState[K]
    ) => {
        setForm(prev => ({ ...prev, [key]: value }))
        setErrors(prev => ({ ...prev, [key]: undefined }))
    }, [])

    /** Set a single locale within a Record<Locale,string> field */
    const setLocaleField = useCallback(
        (key: 'name' | 'description' | 'shortDescription', locale: Locale, value: string) => {
            setForm(prev => ({
                ...prev,
                [key]: { ...prev[key], [locale]: value },
            }))
            if (key === 'name') setErrors(prev => ({ ...prev, name: undefined }))
        },
        []
    )

    // ── Images ─────────────────────────────────────────────────────────────────

    const addImages = useCallback((urls: string[]) => {
        setForm(prev => ({
            ...prev,
            images: [...prev.images, ...urls.filter(u => !prev.images.includes(u))],
        }))
    }, [])

    const removeImage = useCallback((url: string) => {
        setForm(prev => ({ ...prev, images: prev.images.filter(u => u !== url) }))
    }, [])

    const setFeaturedImage = useCallback((url: string) => {
        setForm(prev => {
            const rest = prev.images.filter(u => u !== url)
            return { ...prev, images: [url, ...rest] }
        })
    }, [])

    const reorderImages = useCallback((from: number, to: number) => {
        setForm(prev => {
            const imgs = [...prev.images]
            const [moved] = imgs.splice(from, 1)
            imgs.splice(to, 0, moved)
            return { ...prev, images: imgs }
        })
    }, [])

    // ── Tags ───────────────────────────────────────────────────────────────────

    const addTag = useCallback((tag: string) => {
        const trimmed = tag.trim().toLowerCase()
        if (!trimmed) return
        setForm(prev => ({
            ...prev,
            tags: prev.tags.includes(trimmed) ? prev.tags : [...prev.tags, trimmed],
        }))
        setTagInput('')
    }, [])

    const removeTag = useCallback((tag: string) => {
        setForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))
    }, [])

    const handleTagKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            addTag(tagInput)
        } else if (e.key === 'Backspace' && !tagInput && form.tags.length > 0) {
            removeTag(form.tags[form.tags.length - 1])
        }
    }, [tagInput, form.tags, addTag, removeTag])

    // ── Validation ─────────────────────────────────────────────────────────────

    const validate = useCallback((): boolean => {
        const errs: FormErrors = {}
        if (!form.name.en.trim()) errs.name = 'English product name is required'
        if (!form.price || isNaN(Number(form.price)) || Number(form.price) < 0)
            errs.price = 'Valid price is required'
        if (!form.categoryId) errs.categoryId = 'Please select a category'
        if (form.sku && form.sku.trim().length < 2) errs.sku = 'SKU must be at least 2 characters'
        if (form.stock && isNaN(Number(form.stock))) errs.stock = 'Stock must be a number'
        if (form.salePrice && Number(form.salePrice) >= Number(form.price))
            errs.salePrice = 'Sale price must be less than regular price'

        setErrors(errs)
        return Object.keys(errs).length === 0
    }, [form])

    // ── Build payload ──────────────────────────────────────────────────────────

    const buildPayload = useCallback(
        (status: ProductStatus): CreateProductPayload => ({
            slug: form.slug,
            name: form.name,
            description: Object.values(form.description).some(Boolean) ? form.description : undefined,
            shortDescription: Object.values(form.shortDescription).some(Boolean) ? form.shortDescription : undefined,
            price: Number(form.price),
            salePrice: form.salePrice ? Number(form.salePrice) : null,
            sku: form.sku.trim() || undefined,
            stock: Number(form.stock) || 0,
            stockStatus: form.stockStatus,
            images: form.images,
            tags: form.tags,
            isActive: status === 'published',
            purchaseNote: form.purchaseNote || undefined,
            menuOrder: Number(form.menuOrder) || 0,
            reviewsEnabled: form.reviewsEnabled,
            categoryId: form.categoryId,
        }),
        [form]
    )

    // ── Save draft ─────────────────────────────────────────────────────────────

    const saveDraft = useCallback(async () => {
        if (!form.name.en.trim()) return
        setIsSaving(true)
        try {
            const payload = buildPayload('draft')
            let product: Product
            if (savedProductId.current) {
                product = await productApi.update(savedProductId.current, payload)
            } else {
                product = await productApi.create(payload)
                savedProductId.current = product.id
            }
            setSaveStatus('saved')
            setTimeout(() => setSaveStatus('idle'), 3000)
        } catch (error) {
            console.error('Save draft failed:', error)
            setSaveStatus('error')
        } finally {
            setIsSaving(false)
        }
    }, [form, buildPayload])

    // ── Publish ────────────────────────────────────────────────────────────────

    const publish = useCallback(async () => {
        if (!validate()) return
        setIsSaving(true)
        try {
            const payload = buildPayload('published')
            let product: Product
            if (savedProductId.current) {
                product = await productApi.update(savedProductId.current, payload)
            } else {
                product = await productApi.create(payload)
                savedProductId.current = product.id
            }
            setForm(prev => ({ ...prev, status: 'published' }))
            setSaveStatus('saved')
            router.push(`/admin/products/${product.id}`)
        } catch (error) {
            console.error('Publish failed:', error)
            setSaveStatus('error')
        } finally {
            setIsSaving(false)
        }
    }, [validate, buildPayload, router])

    // ── Preview ────────────────────────────────────────────────────────────────

    const preview = useCallback(async () => {
        await saveDraft()
        if (savedProductId.current) {
            window.open(`/products/${savedProductId.current}?preview=true`, '_blank')
        }
    }, [saveDraft])

    return {
        form,
        setField,
        setLocaleField,
        errors,
        isLoading,
        isSaving,
        saveStatus,
        activeTab,
        setActiveTab,
        tagInput,
        setTagInput,
        // Locale selectors (independent per field)
        nameLocale, setNameLocale,
        descLocale, setDescLocale,
        shortDescLocale, setShortDescLocale,
        // Images
        addImages,
        removeImage,
        setFeaturedImage,
        reorderImages,
        // Tags
        addTag,
        removeTag,
        handleTagKeyDown,
        // Actions
        saveDraft,
        publish,
        preview,
        // Derived
        isEditing: !!existingProductId,
        productId: savedProductId.current,
    }
}