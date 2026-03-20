'use client';
import { useState, useEffect, useCallback } from 'react';
import mediaApi, { Media } from '@/src/api/mediaApi';

interface MediaLibraryProps {
    onSelect?: (media: Media) => void;
    selectable?: boolean;
}

function formatBytes(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric',
    });
}

export default function MediaLibrary({ onSelect, selectable = false }: MediaLibraryProps) {
    const [items, setItems] = useState<Media[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState<Media | null>(null);
    const [editAlt, setEditAlt] = useState('');
    const [editDesc, setEditDesc] = useState('');
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [copied, setCopied] = useState(false);

    const limit = 24;
    const totalPages = Math.ceil(total / limit);

    const fetchMedia = useCallback(async () => {
        setLoading(true);
        try {
            const res = await mediaApi.list({ search: search || undefined, page, limit });
            console.log(res)
            setItems(res.data);
            setTotal(res.data.lengthl);
        } finally {
            setLoading(false);
        }
    }, [search, page]);

    useEffect(() => { fetchMedia(); }, [fetchMedia]);

    // debounce search
    useEffect(() => {
        const t = setTimeout(() => { setSearch(searchInput); setPage(1); }, 400);
        return () => clearTimeout(t);
    }, [searchInput]);

    function openDetail(item: Media) {
        setSelected(item);
        setEditAlt(item.alt);
        setEditDesc(item.description);
        setCopied(false);
    }

    function closeDetail() { setSelected(null); }

    async function handleSave() {
        if (!selected) return;
        setSaving(true);
        try {
            const updated = await mediaApi.update(selected.id, { alt: editAlt, description: editDesc });
            setItems(prev => prev.map(i => i.id === selected.id ? updated.data : i));
            setSelected(updated.data);
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete() {
        if (!selected) return;
        if (!confirm(`Delete "${selected.filename}"? This cannot be undone.`)) return;
        setDeleting(true);
        try {
            await mediaApi.delete(selected.id);
            setItems(prev => prev.filter(i => i.id !== selected.id));
            setTotal(t => t - 1);
            setSelected(null);
        } finally {
            setDeleting(false);
        }
    }

    function handleCopyUrl() {
        if (!selected) return;
        navigator.clipboard.writeText(selected.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    function handleSelect(item: Media) {
        if (selectable && onSelect) { onSelect(item); return; }
        openDetail(item);
    }

    return (
        <div className="flex h-full bg-[#f7f7f8] font-sans">
            {/* Main panel */}
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                {/* Toolbar */}
                <div className="flex items-center gap-3 px-5 py-3 bg-white border-b border-gray-200 shrink-0">
                    <div className="relative flex-1 max-w-sm">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path d="M11 11a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm9 9-4.35-4.35" strokeLinecap="round"/>
                        </svg>
                        <input
                            type="text"
                            placeholder="Search by name or alt text…"
                            value={searchInput}
                            onChange={e => setSearchInput(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                        />
                    </div>
                    <span className="text-xs text-gray-400 ml-auto whitespace-nowrap">
            {total} file{total !== 1 ? 's' : ''}
          </span>
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto p-5">
                    {loading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {Array.from({ length: 12 }).map((_, i) => (
                                <div key={i} className="aspect-square rounded-xl bg-gray-200 animate-pulse" />
                            ))}
                        </div>
                    ) : items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                            <svg className="w-12 h-12 mb-3 opacity-30" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                <path d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zM8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM21 15l-5-5L5 21" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <p className="text-sm font-medium">No media found</p>
                            {search && <p className="text-xs mt-1">Try a different search term</p>}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {items.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => handleSelect(item)}
                                    className={`group relative aspect-square rounded-xl overflow-hidden bg-gray-100 border-2 transition-all focus:outline-none
                    ${selected?.id === item.id
                                        ? 'border-blue-500 shadow-lg shadow-blue-100'
                                        : 'border-transparent hover:border-gray-300 hover:shadow-md'
                                    }`}
                                >
                                    <img
                                        src={item.url}
                                        alt={item.alt || item.filename}
                                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-1.5 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                                        <p className="text-white text-[10px] truncate leading-tight">{item.filename}</p>
                                        <p className="text-white/70 text-[10px]">{formatBytes(item.size)}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 py-3 border-t border-gray-200 bg-white shrink-0">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition"
                        >
                            ← Prev
                        </button>
                        <span className="text-xs text-gray-500">Page {page} of {totalPages}</span>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition"
                        >
                            Next →
                        </button>
                    </div>
                )}
            </div>

            {/* Detail sidebar */}
            <div className={`shrink-0 border-l border-gray-200 bg-white transition-all duration-300 overflow-hidden flex flex-col
        ${selected ? 'w-72' : 'w-0'}`}>
                {selected && (
                    <>
                        {/* Image preview */}
                        <div className="relative bg-gray-100 aspect-square shrink-0">
                            <img
                                src={selected.url}
                                alt={selected.alt || selected.filename}
                                className="w-full h-full object-contain p-4"
                            />
                            <button
                                onClick={closeDetail}
                                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                    <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round"/>
                                </svg>
                            </button>
                        </div>

                        {/* Info & edit */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {/* File info */}
                            <div className="space-y-1">
                                <p className="text-xs font-semibold text-gray-900 truncate">{selected.filename}</p>
                                <p className="text-xs text-gray-400">{formatBytes(selected.size)} · {selected.mimetype.split('/')[1].toUpperCase()}</p>
                                <p className="text-xs text-gray-400">{formatDate(selected.createdAt)}</p>
                            </div>

                            {/* Copy URL */}
                            <button
                                onClick={handleCopyUrl}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg border border-gray-200 hover:bg-gray-50 transition text-left"
                            >
                                <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" strokeLinecap="round"/>
                                </svg>
                                <span className={`truncate ${copied ? 'text-green-600 font-medium' : 'text-gray-600'}`}>
                  {copied ? 'Copied!' : 'Copy URL'}
                </span>
                            </button>

                            {/* Alt text */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Alt text</label>
                                <input
                                    type="text"
                                    value={editAlt}
                                    onChange={e => setEditAlt(e.target.value)}
                                    placeholder="Describe the image…"
                                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={editDesc}
                                    onChange={e => setEditDesc(e.target.value)}
                                    placeholder="Optional description…"
                                    rows={3}
                                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                                />
                            </div>

                            {/* Save */}
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="w-full py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-60"
                            >
                                {saving ? 'Saving…' : 'Save changes'}
                            </button>

                            {/* Select button (if selectable mode) */}
                            {selectable && onSelect && (
                                <button
                                    onClick={() => onSelect(selected)}
                                    className="w-full py-2 text-xs font-semibold rounded-lg bg-green-600 hover:bg-green-700 text-white transition"
                                >
                                    Use this image
                                </button>
                            )}

                            {/* Delete */}
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="w-full py-2 text-xs font-semibold rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition disabled:opacity-60"
                            >
                                {deleting ? 'Deleting…' : 'Delete file'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}