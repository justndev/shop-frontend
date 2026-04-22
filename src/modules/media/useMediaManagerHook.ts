import { useState, useEffect, useCallback, useRef } from 'react'
import mediaApi, { MediaItem, UploadProgress, ListMediaParams } from '@/src/modules/media/mediaApi'

// ── TYPES ─────────────────────────────────────────────────────────────────────

export interface MediaFilters {
    search: string
    mimetype: string // '' = all
    page: number
}

export interface UseMediaManagerReturn {
    // ── Data
    items: MediaItem[]
    total: number
    isLoading: boolean
    isLoadingMore: boolean
    hasMore: boolean

    // ── Filters
    filters: MediaFilters
    setSearch: (v: string) => void
    setMimetype: (v: string) => void
    loadMore: () => void
    refresh: () => void

    // ── Selection
    selectedIds: string[]
    lastSelectedId: string | null
    selectedItems: MediaItem[]
    handleThumbnailClick: (e: React.MouseEvent, id: string) => void
    clearSelection: () => void

    // ── Upload
    uploads: UploadProgress[]
    uploadFiles: (files: File[]) => Promise<void>
    isUploading: boolean

    // ── Edit (optimistic, debounced save)
    updateItem: (id: string, patch: Partial<Pick<MediaItem, 'alt' | 'description'>>) => void

    // ── Delete
    deleteItem: (id: string) => Promise<void>
    isDeleting: boolean
}

const PAGE_LIMIT = 24

// ── HOOK ──────────────────────────────────────────────────────────────────────

export function useMediaManager(): UseMediaManagerReturn {
    // ── List state
    const [items, setItems] = useState<MediaItem[]>([])
    const [total, setTotal] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const [filters, setFilters] = useState<MediaFilters>({ search: '', mimetype: '', page: 1 })

    // ── Selection state
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [lastSelectedId, setLastSelectedId] = useState<string | null>(null)

    // ── Upload state
    const [uploads, setUploads] = useState<UploadProgress[]>([])

    // ── Delete state
    const [isDeleting, setIsDeleting] = useState(false)

    // ── Debounce refs for field saves
    const debounceTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

    // ── Fetch ──────────────────────────────────────────────────────────────────
    const fetchPage = useCallback(async (f: MediaFilters, append = false) => {
        if (append) setIsLoadingMore(true)
        else setIsLoading(true)

        try {
            const params: ListMediaParams = {
                page: f.page,
                limit: PAGE_LIMIT,
                ...(f.search && { search: f.search }),
                ...(f.mimetype && { mimetype: f.mimetype }),
            }
            const res = await mediaApi.list(params)
            setTotal(res.total)
            setItems((prev) => (append ? [...prev, ...res.items] : res.items))
        } catch (err) {
            console.error('Failed to fetch media:', err)
        } finally {
            setIsLoading(false)
            setIsLoadingMore(false)
        }
    }, [])

    // Initial + filter-change fetch
    useEffect(() => {
        fetchPage(filters, false)
        // Reset selection on filter change
        setSelectedIds([])
        setLastSelectedId(null)
    }, [filters.search, filters.mimetype]) // page changes handled by loadMore

    const refresh = useCallback(() => {
        const reset = { ...filters, page: 1 }
        setFilters(reset)
        fetchPage(reset, false)
    }, [filters, fetchPage])

    // ── Filters ────────────────────────────────────────────────────────────────

    // Debounced search
    const searchTimer = useRef<ReturnType<typeof setTimeout>>()
    const setSearch = useCallback((v: string) => {
        clearTimeout(searchTimer.current)
        searchTimer.current = setTimeout(() => {
            setFilters((f) => ({ ...f, search: v, page: 1 }))
        }, 300)
    }, [])

    const setMimetype = useCallback((v: string) => {
        setFilters((f) => ({ ...f, mimetype: v, page: 1 }))
    }, [])

    const loadMore = useCallback(() => {
        if (isLoadingMore || items.length >= total) return
        const next = { ...filters, page: filters.page + 1 }
        setFilters(next)
        fetchPage(next, true)
    }, [filters, isLoadingMore, items.length, total, fetchPage])

    const hasMore = items.length < total

    // ── Selection ──────────────────────────────────────────────────────────────

    const handleThumbnailClick = useCallback((e: React.MouseEvent, id: string) => {
        setSelectedIds((prev) => {
            if (e.ctrlKey || e.metaKey) {
                if (prev.includes(id)) {
                    // Remove — last selected becomes the new tail
                    const next = prev.filter((x) => x !== id)
                    setLastSelectedId(next.at(-1) ?? null)
                    return next
                } else {
                    // Append in click order
                    setLastSelectedId(id)
                    return [...prev, id]
                }
            } else {
                // Single click: deselect if already the only one, otherwise select only this
                if (prev.length === 1 && prev[0] === id) {
                    setLastSelectedId(null)
                    return []
                } else {
                    setLastSelectedId(id)
                    return [id]
                }
            }
        })
    }, [])

    const clearSelection = useCallback(() => {
        setSelectedIds([])
        setLastSelectedId(null)
    }, [])

    const selectedItems = selectedIds
        .map((id) => items.find((m) => m.id === id))
        .filter(Boolean) as MediaItem[]

    // ── Upload ─────────────────────────────────────────────────────────────────

    const uploadFiles = useCallback(async (files: File[]) => {
        // Initialise progress entries
        const entries: UploadProgress[] = files.map((file) => ({
            file,
            progress: 0,
            status: 'pending',
        }))
        setUploads(entries)

        const results: MediaItem[] = []

        for (let i = 0; i < files.length; i++) {
            const file = files[i]

            setUploads((prev) =>
                prev.map((u, idx) => (idx === i ? { ...u, status: 'uploading' } : u))
            )

            try {
                const item = await mediaApi.uploadOne(file, '', (pct) => {
                    setUploads((prev) =>
                        prev.map((u, idx) => (idx === i ? { ...u, progress: pct } : u))
                    )
                })

                setUploads((prev) =>
                    prev.map((u, idx) =>
                        idx === i ? { ...u, status: 'done', progress: 100, result: item } : u
                    )
                )
                results.push(item)
            } catch (err: any) {
                setUploads((prev) =>
                    prev.map((u, idx) =>
                        idx === i ? { ...u, status: 'error', error: err.message } : u
                    )
                )
            }
        }

        // Prepend new items to the list
        if (results.length) {
            setItems((prev) => [...results, ...prev])
            setTotal((t) => t + results.length)
            // Auto-select the first uploaded item
            setSelectedIds([results[0].id])
            setLastSelectedId(results[0].id)
        }

        // Clear upload indicators after 3s
        setTimeout(() => setUploads([]), 3000)
    }, [])

    const isUploading = uploads.some((u) => u.status === 'uploading' || u.status === 'confirming')

    // ── Update (optimistic + debounced API save) ───────────────────────────────

    const updateItem = useCallback(
        (id: string, patch: Partial<Pick<MediaItem, 'alt' | 'description'>>) => {
            // Optimistic update
            setItems((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)))

            // Debounce the actual API call per item
            clearTimeout(debounceTimers.current[id])
            debounceTimers.current[id] = setTimeout(async () => {
                try {
                    const updated = await mediaApi.update(id, patch)
                    // Sync with server response
                    setItems((prev) => prev.map((m) => (m.id === id ? { ...m, ...updated } : m)))
                } catch (err) {
                    console.error('Failed to save media update:', err)
                    // Optionally revert here
                }
            }, 600)
        },
        []
    )

    // ── Delete ─────────────────────────────────────────────────────────────────

    const deleteItem = useCallback(async (id: string) => {
        setIsDeleting(true)
        // Optimistic remove
        setItems((prev) => prev.filter((m) => m.id !== id))
        setTotal((t) => t - 1)
        setSelectedIds((prev) => prev.filter((x) => x !== id))
        if (lastSelectedId === id) setLastSelectedId(null)

        try {
            await mediaApi.delete(id)
        } catch (err) {
            console.error('Failed to delete media:', err)
            // Re-fetch to restore state on failure
            refresh()
        } finally {
            setIsDeleting(false)
        }
    }, [lastSelectedId, refresh])

    return {
        items,
        total,
        isLoading,
        isLoadingMore,
        hasMore,
        filters,
        setSearch,
        setMimetype,
        loadMore,
        refresh,
        selectedIds,
        lastSelectedId,
        selectedItems,
        handleThumbnailClick,
        clearSelection,
        uploads,
        uploadFiles,
        isUploading,
        updateItem,
        deleteItem,
        isDeleting,
    }
}