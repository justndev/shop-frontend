import { useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import productApi, {
    CreateProductPayload,
    StockStatus,
    Product,
} from '@/src/api/productApi'

// ── TYPES ─────────────────────────────────────────────────────────────────────

export type ProductStatus = 'draft' | 'published'
export type ActiveTab = 'general' | 'inventory' | 'advanced'

export interface ProductFormState {
    // Basic
    name: string
    description: string        // rich HTML
    shortDescription: string   // rich HTML
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
}

export interface FormErrors {
    name?: string
    price?: string
    categoryId?: string
    sku?: string
    stock?: string
    [key: string]: string | undefined
}

const INITIAL_STATE: ProductFormState = {
    name: '',
    description: '',
    shortDescription: '',
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
}

// ── HOOK ──────────────────────────────────────────────────────────────────────

export function useAddProduct(existingProduct?: Product) {
    const router = useRouter()

    const [form, setForm] = useState<ProductFormState>(() => {
        if (!existingProduct) return INITIAL_STATE
        return {
            name: existingProduct.name,
            description: existingProduct.description ?? '',
            shortDescription: existingProduct.shortDescription ?? '',
            price: String(existingProduct.price),
            salePrice: existingProduct.salePrice ? String(existingProduct.salePrice) : '',
            sku: existingProduct.sku ?? '',
            stock: String(existingProduct.stock),
            stockStatus: existingProduct.stockStatus,
            categoryId: existingProduct.categoryId,
            tags: existingProduct.tags,
            images: existingProduct.images,
            status: existingProduct.isActive ? 'published' : 'draft',
            reviewsEnabled: existingProduct.reviewsEnabled,
            purchaseNote: existingProduct.purchaseNote ?? '',
            menuOrder: String(existingProduct.menuOrder),
        }
    })

    const [errors, setErrors] = useState<FormErrors>({})
    const [isSaving, setIsSaving] = useState(false)
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle')
    const [activeTab, setActiveTab] = useState<ActiveTab>('general')
    const [tagInput, setTagInput] = useState('')

    // Autosave debounce ref
    const autoSaveTimer = useRef<ReturnType<typeof setTimeout>>()
    const savedProductId = useRef<string | undefined>(existingProduct?.id)

    // ── Field setters ──────────────────────────────────────────────────────────

    const setField = useCallback(<K extends keyof ProductFormState>(
        key: K,
        value: ProductFormState[K]
    ) => {
        setForm(prev => ({ ...prev, [key]: value }))
        // Clear error for field when user edits it
        setErrors(prev => ({ ...prev, [key]: undefined }))
    }, [])

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
        if (!form.name.trim()) errs.name = 'Product name is required'
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
            name: form.name.trim(),
            description: form.description || undefined,
            shortDescription: form.shortDescription || undefined,
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

    // ── Save draft (silent, no validation required) ────────────────────────────

    const saveDraft = useCallback(async () => {
        if (!form.name.trim()) return // need at minimum a name
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
        } catch {
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
        } catch {
            setSaveStatus('error')
        } finally {
            setIsSaving(false)
        }
    }, [validate, buildPayload, router])

    // ── Preview (save draft then open) ────────────────────────────────────────

    const preview = useCallback(async () => {
        await saveDraft()
        if (savedProductId.current) {
            window.open(`/products/${savedProductId.current}?preview=true`, '_blank')
        }
    }, [saveDraft])

    return {
        form,
        setField,
        errors,
        isSaving,
        saveStatus,
        activeTab,
        setActiveTab,
        tagInput,
        setTagInput,
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
        isEditing: !!existingProduct,
        productId: savedProductId.current,
    }
}