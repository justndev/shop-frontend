import apiClient from '../lib/apiClient'

// ── TYPES ─────────────────────────────────────────────────────────────────────

export interface MediaItem {
    id: string
    key: string
    url: string
    filename: string
    mimetype: string
    size: number
    alt: string
    description?: string
    width?: number
    height?: number
    createdAt: string
    // derived: thumbnail url (same image, just used smaller in UI)
    thumbnailUrl: string
}

export interface ListMediaParams {
    search?: string
    mimetype?: string
    page?: number
    limit?: number
}

export interface ListMediaResponse {
    items: MediaItem[]
    total: number
    page: number
    limit: number
}

export interface PresignResponse {
    uploadUrl: string
    fileKey: string
}

export interface UploadProgress {
    file: File
    progress: number // 0-100
    status: 'pending' | 'uploading' | 'confirming' | 'done' | 'error'
    error?: string
    result?: MediaItem
}

// ── HELPERS ───────────────────────────────────────────────────────────────────

/** Derive image dimensions from a File object before upload */
async function getImageDimensions(file: File): Promise<{ width: number; height: number } | null> {
    if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') return null
    return new Promise((resolve) => {
        const url = URL.createObjectURL(file)
        const img = new Image()
        img.onload = () => {
            URL.revokeObjectURL(url)
            resolve({ width: img.naturalWidth, height: img.naturalHeight })
        }
        img.onerror = () => { URL.revokeObjectURL(url); resolve(null) }
        img.src = url
    })
}

/** Build a thumbnail URL. Since files are in MinIO, we use the same URL but
 *  you can swap this for a real thumbnail service (imgproxy, thumbor, etc.) */
function toThumbnailUrl(url: string): string {
    // If you add imgproxy/thumbor later, transform here.
    // For now just return the original URL — browsers will scale it.
    return url
}

function normalizeItem(raw: any): MediaItem {
    return {
        ...raw,
        thumbnailUrl: toThumbnailUrl(raw.url),
    }
}

// ── API ───────────────────────────────────────────────────────────────────────

const mediaApi = {
    /**
     * List media with optional filters and pagination.
     */
    async list(params: ListMediaParams = {}): Promise<ListMediaResponse> {
        const res = await apiClient.get('/media', { params })
        const data = res.data
        return {
            ...data,
            items: (data.items as any[]).map(normalizeItem),
        }
    },

    /**
     * Upload a single file using the presigned URL flow:
     * 1. POST /media/presign  → get S3 presigned URL + fileKey
     * 2. PUT directly to S3   → upload the file bytes
     * 3. POST /media/confirm  → save metadata to DB
     *
     * @param file         The File to upload
     * @param alt          Alt text to store immediately
     * @param onProgress   Progress callback 0-100
     */
    async uploadOne(
        file: File,
        alt = '',
        onProgress?: (pct: number) => void,
    ): Promise<MediaItem> {
        // 1. Get presigned URL
        const presignRes = await apiClient.post<PresignResponse>('/media/presign', {
            filename: file.name,
            mimetype: file.type,
        })
        const { uploadUrl, fileKey } = presignRes.data

        // 2. Upload directly to S3/MinIO (XHR so we get progress)
        await new Promise<void>((resolve, reject) => {
            const xhr = new XMLHttpRequest()
            xhr.open('PUT', uploadUrl)
            xhr.setRequestHeader('Content-Type', file.type)
            xhr.upload.onprogress = (e) => {
                if (e.lengthComputable) onProgress?.(Math.round((e.loaded / e.total) * 90))
            }
            xhr.onload = () => (xhr.status < 300 ? resolve() : reject(new Error(`S3 upload failed: ${xhr.status}`)))
            xhr.onerror = () => reject(new Error('Network error during S3 upload'))
            xhr.send(file)
        })

        onProgress?.(95)

        // 3. Get image dimensions if possible
        const dims = await getImageDimensions(file)

        // 4. Confirm upload — save to DB
        const confirmRes = await apiClient.post('/media/confirm', {
            fileKey,
            filename: file.name,
            mimetype: file.type,
            size: file.size,
            alt,
            width: dims?.width,
            height: dims?.height,
        })

        onProgress?.(100)
        return normalizeItem(confirmRes.data)
    },

    /**
     * Update alt text / description for an existing media item.
     */
    async update(id: string, data: { alt?: string; description?: string }): Promise<MediaItem> {
        const res = await apiClient.patch(`/media/${id}`, data)
        return normalizeItem(res.data)
    },

    /**
     * Delete a media item (removes from S3 + DB).
     */
    async delete(id: string): Promise<void> {
        await apiClient.delete(`/media/${id}`)
    },
}

export default mediaApi