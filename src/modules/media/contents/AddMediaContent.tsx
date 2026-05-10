"use client";

import {useState, useRef, useCallback, useEffect} from "react";
import type { MediaItem } from "@/src/modules/media/mediaApi";
import {useMediaManager} from "@/src/modules/media/useMediaManagerHook";

// ── COLORS ────────────────────────────────────────────────────────────────────


import ADMIN_PANEL_COLORS from '@/src/modules/admin/colors';
const C = ADMIN_PANEL_COLORS;

// ── HELPERS ───────────────────────────────────────────────────────────────────

function formatBytes(b: number) {
    if (b < 1024) return `${b} B`;
    if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`;
    return `${(b / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(s: string) {
    return new Date(s).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function isImage(mimetype: string) { return mimetype.startsWith("image/"); }

// ── UPLOAD FILES VIEW ─────────────────────────────────────────────────────────

function UploadFilesView({ onFiles, isUploading, uploads }: {
    onFiles: (files: File[]) => void;
    isUploading: boolean;
    uploads: ReturnType<typeof useMediaManager>["uploads"];
}) {
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        if (files.length) onFiles(files);
    }, [onFiles]);

    const statusColor = (s: string) =>
        s === "done" ? "#00a32a" : s === "error" ? C.danger : C.accent;

    return (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, gap: 24 }}>
            <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                style={{
                    border: `2px dashed ${isDragging ? C.selectedBorder : C.border}`,
                    borderRadius: 8,
                    background: isDragging ? C.accentLight : C.surfaceAlt,
                    padding: "56px 80px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 16,
                    transition: "all 0.18s ease",
                    maxWidth: 480,
                    width: "100%",
                }}
            >
                <div style={{
                    width: 56, height: 56, borderRadius: "50%",
                    background: isDragging ? C.accentLight : "rgba(255,255,255,0.04)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={isDragging ? C.selectedBorder : C.textMuted} strokeWidth="1.5">
                        <polyline points="16 16 12 12 8 16"/>
                        <line x1="12" y1="12" x2="12" y2="21"/>
                        <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
                    </svg>
                </div>
                <div style={{ textAlign: "center" }}>
                    <p style={{ color: C.text, fontSize: 15, fontWeight: 500, margin: "0 0 6px" }}>Drop files to upload</p>
                    <p style={{ color: C.textMuted, fontSize: 13, margin: 0 }}>or</p>
                </div>
                <button
                    onClick={() => inputRef.current?.click()}
                    disabled={isUploading}
                    style={{
                        background: isUploading ? C.surfaceAlt : C.accent,
                        color: isUploading ? C.textMuted : "#fff",
                        border: "none", borderRadius: 4, padding: "8px 20px",
                        fontSize: 13, fontWeight: 600, cursor: isUploading ? "not-allowed" : "pointer",
                        fontFamily: "inherit",
                    }}
                >
                    {isUploading ? "Uploading…" : "Select Files"}
                </button>
                <p style={{ color: C.textFaint, fontSize: 12, margin: 0 }}>
                    Accepted: JPEG, PNG, WebP, SVG · Max 64 MB
                </p>
                <input ref={inputRef} type="file" multiple accept="image/*" style={{ display: "none" }}
                       onChange={(e) => {
                           const files = Array.from(e.target.files ?? []);
                           if (files.length) onFiles(files);
                           e.target.value = "";
                       }}
                />
            </div>

            {/* Upload progress list */}
            {uploads.length > 0 && (
                <div style={{ width: "100%", maxWidth: 480, display: "flex", flexDirection: "column", gap: 8 }}>
                    {uploads.map((u, i) => (
                        <div key={i} style={{ background: C.surface, borderRadius: 6, padding: "10px 14px", border: `1px solid ${C.border}` }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                  {u.file.name}
                </span>
                                <span style={{ fontSize: 11, color: statusColor(u.status), marginLeft: 12, flexShrink: 0, fontWeight: 600 }}>
                  {u.status === "done" ? "✓ Done" : u.status === "error" ? "✗ Failed" : `${u.progress}%`}
                </span>
                            </div>
                            <div style={{ height: 3, background: C.border, borderRadius: 2 }}>
                                <div style={{
                                    height: "100%", borderRadius: 2,
                                    background: statusColor(u.status),
                                    width: `${u.progress}%`,
                                    transition: "width 0.2s ease",
                                }}/>
                            </div>
                            {u.error && <p style={{ margin: "4px 0 0", fontSize: 11, color: C.danger }}>{u.error}</p>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ── MEDIA THUMBNAIL ───────────────────────────────────────────────────────────

function MediaThumbnail({ item, isSelected, isLastSelected, onClick }: {
    item: MediaItem;
    isSelected: boolean;
    isLastSelected: boolean;
    onClick: (e: React.MouseEvent) => void;
}) {
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        console.log(item);
    }, []);

    const renderThumb = () => {
        if (isImage(item.mimetype) && item.thumbnailUrl && !imgError) {
            return (
                <img
                    src={item.thumbnailUrl}
                    alt={item.alt || item.filename}
                    loading="lazy"
                    onError={() => setImgError(true)}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
            );
        }
        // Fallback icon by type
        const isPdf = item.mimetype === "application/pdf";
        return (
            <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, background: "#2a2f34" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.textMuted} strokeWidth="1.5">
                    {isPdf
                        ? <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>
                        : <><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></>
                    }
                </svg>
                <span style={{ fontSize: 9, color: C.textFaint, fontWeight: 700, textTransform: "uppercase" }}>
          {item.mimetype.split("/")[1]?.toUpperCase() ?? "FILE"}
        </span>
            </div>
        );
    };

    return (
        <div
            onClick={onClick}
            style={{
                position: "relative",
                aspectRatio: "1",
                borderRadius: 4,
                overflow: "hidden",
                cursor: "pointer",
                outline: isLastSelected
                    ? `3px solid ${C.selectedBorder}`
                    : isSelected ? `2px solid ${C.accent}` : "2px solid transparent",
                outlineOffset: isLastSelected ? -3 : -2,
                transition: "outline 0.1s",
                background: C.surfaceAlt,
            }}
        >
            {renderThumb()}
            {isSelected && (
                <>
                    <div style={{ position: "absolute", inset: 0, background: "rgba(34,113,177,0.25)", pointerEvents: "none" }}/>
                    <div style={{
                        position: "absolute", top: 6, right: 6,
                        width: 20, height: 20, borderRadius: "50%",
                        background: C.accent,
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="2 6 5 9 10 3"/>
                        </svg>
                    </div>
                </>
            )}
        </div>
    );
}

// ── ATTACHMENT DETAILS PANEL ──────────────────────────────────────────────────

function AttachmentDetails({ item, onUpdate, onDelete, isDeleting }: {
    item: MediaItem;
    onUpdate: (id: string, patch: Partial<Pick<MediaItem, "alt" | "description">>) => void;
    onDelete: (id: string) => void;
    isDeleting: boolean;
}) {
    const [confirmDelete, setConfirmDelete] = useState(false);

    const inputStyle: React.CSSProperties = {
        width: "100%",
        background: C.inputBg,
        border: `1px solid ${C.inputBorder}`,
        borderRadius: 4,
        color: C.text,
        fontSize: 12,
        padding: "6px 8px",
        fontFamily: "inherit",
        outline: "none",
        boxSizing: "border-box",
        resize: "vertical" as const,
    };

    const Field = ({ label, value, field, multiline = false }: {
        label: string; value: string; field: "alt" | "description"; multiline?: boolean;
    }) => (
        <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 10, color: C.textMuted, marginBottom: 4, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.6px" }}>
                {label}
            </label>
            {multiline ? (
                <textarea value={value} rows={3} style={inputStyle}
                          onChange={(e) => onUpdate(item.id, { [field]: e.target.value })}
                />
            ) : (
                <input type="text" value={value} style={inputStyle}
                       onChange={(e) => onUpdate(item.id, { [field]: e.target.value })}
                />
            )}
        </div>
    );

    return (
        <div style={{ width: 230, flexShrink: 0, background: C.surfaceAlt, borderLeft: `1px solid ${C.border}`, display: "flex", flexDirection: "column", overflowY: "auto" }}>
            {/* Header */}
            <div style={{ padding: "10px 14px", borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
        <span style={{ fontSize: 10, color: C.textFaint, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>
          Attachment Details
        </span>
            </div>

            {/* Thumbnail */}
            {isImage(item.mimetype) && item.thumbnailUrl && (
                <div style={{ padding: 12, borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
                    <img src={item.thumbnailUrl} alt=""
                         style={{ width: "100%", borderRadius: 4, display: "block", maxHeight: 130, objectFit: "cover" }}
                    />
                </div>
            )}

            {/* Meta */}
            <div style={{ padding: "10px 14px", borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
                <p style={{ margin: "0 0 2px", fontSize: 12, color: C.text, fontWeight: 600, wordBreak: "break-all" }}>{item.filename}</p>
                <p style={{ margin: "0 0 2px", fontSize: 11, color: C.textMuted }}>{formatDate(item.createdAt)}</p>
                <p style={{ margin: "0 0 2px", fontSize: 11, color: C.textMuted }}>{formatBytes(item.size)}</p>
                {item.width && item.height && (
                    <p style={{ margin: 0, fontSize: 11, color: C.textMuted }}>{item.width} × {item.height} px</p>
                )}
            </div>

            {/* Editable fields */}
            <div style={{ padding: "12px 14px", flex: 1 }}>
                <Field label="Alt Text" value={item.alt ?? ""} field="alt" multiline />
                <Field label="Description" value={item.description ?? ""} field="description" multiline />

                {/* File URL */}
                <div style={{ marginBottom: 14 }}>
                    <label style={{ display: "block", fontSize: 10, color: C.textMuted, marginBottom: 4, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.6px" }}>
                        File URL
                    </label>
                    <input type="text" readOnly value={item.url} style={{ ...inputStyle, color: C.textMuted, cursor: "text" }}/>
                    <button
                        onClick={() => navigator.clipboard.writeText(item.url)}
                        style={{ marginTop: 6, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, color: C.text, fontSize: 11, padding: "4px 10px", cursor: "pointer", fontFamily: "inherit" }}
                    >
                        Copy URL
                    </button>
                </div>

                {/* Delete */}
                {!confirmDelete ? (
                    <button
                        onClick={() => setConfirmDelete(true)}
                        style={{ background: "none", border: "none", padding: 0, color: C.danger, fontSize: 12, cursor: "pointer", fontFamily: "inherit", textDecoration: "underline" }}
                    >
                        Delete permanently
                    </button>
                ) : (
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{ fontSize: 11, color: C.textMuted }}>Sure?</span>
                        <button
                            onClick={() => { onDelete(item.id); setConfirmDelete(false); }}
                            disabled={isDeleting}
                            style={{ background: C.danger, border: "none", borderRadius: 3, color: "#fff", fontSize: 11, padding: "3px 10px", cursor: "pointer", fontFamily: "inherit" }}
                        >
                            Delete
                        </button>
                        <button
                            onClick={() => setConfirmDelete(false)}
                            style={{ background: "none", border: "none", color: C.textMuted, fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// ── MEDIA LIBRARY VIEW ────────────────────────────────────────────────────────

function MediaLibraryView({ manager }: { manager: ReturnType<typeof useMediaManager> }) {
    const {
        items, total, isLoading, isLoadingMore, hasMore, loadMore,
        selectedIds, lastSelectedId, handleThumbnailClick,
        updateItem, deleteItem, isDeleting,
        setSearch, setMimetype,
    } = manager;

    const detailItem = lastSelectedId ? items.find((m) => m.id === lastSelectedId) : null;

    const gridRef = useRef<HTMLDivElement>(null);

    // Infinite scroll
    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        const el = e.currentTarget;
        if (el.scrollHeight - el.scrollTop - el.clientHeight < 200 && hasMore && !isLoadingMore) {
            loadMore();
        }
    }, [hasMore, isLoadingMore, loadMore]);

    const selectStyle: React.CSSProperties = {
        background: C.inputBg, border: `1px solid ${C.inputBorder}`, borderRadius: 4,
        color: C.text, fontSize: 12, padding: "5px 28px 5px 8px", fontFamily: "inherit",
        outline: "none", appearance: "none" as const, cursor: "pointer",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%238b949e'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center",
    };

    return (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {/* Filter bar */}
            <div style={{ padding: "10px 16px", borderBottom: `1px solid ${C.border}`, background: C.surface, display: "flex", alignItems: "flex-end", gap: 16, flexShrink: 0 }}>
                <div>
                    <div style={{ fontSize: 10, color: C.textFaint, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 4 }}>Filter media</div>
                    <div style={{ display: "flex", gap: 8 }}>
                        <select style={selectStyle} onChange={(e) => setMimetype(e.target.value)}>
                            <option value="">All media items</option>
                            <option value="image/jpeg">JPEG</option>
                            <option value="image/png">PNG</option>
                            <option value="image/webp">WebP</option>
                            <option value="image/svg+xml">SVG</option>
                        </select>
                    </div>
                </div>
                <div style={{ marginLeft: "auto" }}>
                    <div style={{ fontSize: 10, color: C.textFaint, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 4 }}>Search media</div>
                    <input
                        type="search" placeholder="Search filenames, alt text…"
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ background: C.inputBg, border: `1px solid ${C.inputBorder}`, borderRadius: 4, color: C.text, fontSize: 12, padding: "5px 10px", fontFamily: "inherit", outline: "none", width: 220 }}
                    />
                </div>
            </div>

            {/* Grid + details */}
            <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
                {/* Grid */}
                <div ref={gridRef} onScroll={handleScroll} style={{ flex: 1, overflowY: "auto", padding: 16 }}>
                    {isLoading ? (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200, color: C.textMuted, fontSize: 13 }}>
                            Loading…
                        </div>
                    ) : items.length === 0 ? (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200, color: C.textMuted, fontSize: 13 }}>
                            No media found
                        </div>
                    ) : (
                        <>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 8 }}>
                                {items.map((item) => (
                                    <MediaThumbnail
                                        key={item.id}
                                        item={item}
                                        isSelected={selectedIds.includes(item.id)}
                                        isLastSelected={lastSelectedId === item.id}
                                        onClick={(e) => handleThumbnailClick(e, item.id)}
                                    />
                                ))}
                            </div>
                            <p style={{ textAlign: "center", color: C.textFaint, fontSize: 12, marginTop: 20 }}>
                                {isLoadingMore ? "Loading more…" : `Showing ${items.length} of ${total} media items`}
                            </p>
                        </>
                    )}
                </div>

                {/* Details panel */}
                {detailItem && (
                    <AttachmentDetails
                        item={detailItem}
                        onUpdate={updateItem}
                        onDelete={deleteItem}
                        isDeleting={isDeleting}
                    />
                )}
            </div>
        </div>
    );
}

// ── FOOTER ────────────────────────────────────────────────────────────────────

function Footer({ manager, onInsert }: {
    manager: ReturnType<typeof useMediaManager>;
    onInsert: (items: MediaItem[]) => void;
}) {
    const { selectedItems, clearSelection } = manager;
    const count = selectedItems.length;

    return (
        <div style={{ height: 62, borderTop: `1px solid ${C.border}`, background: C.surface, display: "flex", alignItems: "center", padding: "0 16px", gap: 12, flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, overflow: "hidden" }}>
                {count > 0 ? (
                    <>
                        <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                            {selectedItems.slice(0, 5).map((item) => (
                                <div key={item.id} style={{ width: 38, height: 38, borderRadius: 3, overflow: "hidden", border: `1px solid ${C.border}`, flexShrink: 0 }}>
                                    {isImage(item.mimetype) && item.thumbnailUrl
                                        ? <img src={item.thumbnailUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
                                        : <div style={{ width: "100%", height: "100%", background: C.surfaceAlt, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.textMuted} strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>
                                        </div>
                                    }
                                </div>
                            ))}
                        </div>
                        <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: 13, color: C.text, fontWeight: 600 }}>{count} item{count !== 1 ? "s" : ""} selected</div>
                            <div style={{ display: "flex", gap: 8 }}>
                                <button style={{ background: "none", border: "none", padding: 0, color: C.danger, fontSize: 12, cursor: "pointer", fontFamily: "inherit", textDecoration: "underline" }} onClick={clearSelection}>
                                    Clear
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <span style={{ color: C.textFaint, fontSize: 13 }}>No items selected</span>
                )}
            </div>

            <button
                onClick={() => onInsert(selectedItems)}
                disabled={count === 0}
                style={{
                    background: count > 0 ? C.accent : C.surfaceAlt,
                    color: count > 0 ? "#fff" : C.textFaint,
                    border: `1px solid ${count > 0 ? C.accent : C.inputBorder}`,
                    borderRadius: 4, padding: "8px 18px", fontSize: 13, fontWeight: 600,
                    cursor: count > 0 ? "pointer" : "not-allowed", fontFamily: "inherit",
                    whiteSpace: "nowrap", flexShrink: 0, transition: "all 0.15s",
                }}
            >
                Insert into product
            </button>
        </div>
    );
}

// ── TAB BUTTON ────────────────────────────────────────────────────────────────

function TabBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
    return (
        <button onClick={onClick} style={{
            background: "none", border: "none",
            borderBottom: active ? `2px solid ${C.selectedBorder}` : "2px solid transparent",
            color: active ? C.text : C.textMuted,
            fontSize: 13, fontWeight: active ? 600 : 400,
            padding: "10px 14px", cursor: "pointer", fontFamily: "inherit",
            transition: "all 0.15s", marginBottom: -1,
        }}>
            {label}
        </button>
    );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────

export default function AddMediaContent({ onInsert, onClose }: {
    onInsert?: (items: MediaItem[]) => void;
    onClose?: () => void;
}) {
    const [tab, setTab] = useState<"upload" | "library">("upload");
    const manager = useMediaManager();

    async function handleFiles(files: File[]) {
        await manager.uploadFiles(files);
        setTab("library");
    }

    function handleInsert(items: MediaItem[]) {
        onInsert?.(items);
        onClose?.();
    }

    return (
        <div style={{
            display: "flex", flexDirection: "column", height: "100%",
            background: C.bg, color: C.text,
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            overflow: "hidden",
        }}>
            {/* Header */}
            <div style={{ borderBottom: `1px solid ${C.border}`, background: C.surface, padding: "0 16px", flexShrink: 0 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 14 }}>
                    <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: C.text }}>Add media</h2>
                    {onClose && (
                        <button onClick={onClose} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", padding: 4, display: "flex", lineHeight: 1 }}>
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <line x1="2" y1="2" x2="16" y2="16"/><line x1="16" y1="2" x2="2" y2="16"/>
                            </svg>
                        </button>
                    )}
                </div>
                <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
                    <TabBtn label="Upload files" active={tab === "upload"} onClick={() => setTab("upload")}/>
                    <TabBtn label="Media Library" active={tab === "library"} onClick={() => setTab("library")}/>
                </div>
            </div>

            {/* Content */}
            <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                {tab === "upload"
                    ? <UploadFilesView onFiles={handleFiles} isUploading={manager.isUploading} uploads={manager.uploads}/>
                    : <MediaLibraryView manager={manager}/>
                }
            </div>

            {/* Footer */}
            <Footer manager={manager} onInsert={handleInsert}/>
        </div>
    );
}