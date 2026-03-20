"use client";

import { useState } from "react";
import { Dialog } from "@mui/material";
import type { MediaItem } from "@/src/api/mediaApi";
import AddMediaContent from "@/src/modules/mediaManager/contents/AddMediaContent";

const C = {
    surface: "#22262a",
    surfaceAlt: "#1e2226",
    border: "#2e3338",
    text: "#e8eaed",
    textMuted: "#8b949e",
    textFaint: "#545d67",
    accent: "#2271b1",
    inputBorder: "#3d444d",
    danger: "#d63638",
};

interface Props {
    images: string[];          // images[0] = featured
    onAdd: (urls: string[]) => void;
    onRemove: (url: string) => void;
    onSetFeatured: (url: string) => void;
    onReorder: (from: number, to: number) => void;
}

type ModalMode = "featured" | "gallery" | null;

export default function ProductImagesPanel({ images, onAdd, onRemove, onSetFeatured, onReorder }: Props) {
    const [modalMode, setModalMode] = useState<ModalMode>(null);
    const [dragIdx, setDragIdx] = useState<number | null>(null);
    const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

    const featured = images[0] ?? null;
    const gallery = images.slice(1);

    function handleMediaInsert(items: MediaItem[]) {
        const urls = items.map(i => i.url);
        if (modalMode === "featured" && urls.length > 0) {
            onSetFeatured(urls[0]);
            // Add the rest as gallery
            if (urls.length > 1) onAdd(urls.slice(1));
        } else {
            onAdd(urls);
        }
        setModalMode(null);
    }

    // ── Drag reorder (gallery items, indices offset by 1 for images array) ──────
    function handleDragStart(e: React.DragEvent, idx: number) {
        setDragIdx(idx);
        e.dataTransfer.effectAllowed = "move";
    }
    function handleDragOver(e: React.DragEvent, idx: number) {
        e.preventDefault();
        setDragOverIdx(idx);
    }
    function handleDrop(e: React.DragEvent, toIdx: number) {
        e.preventDefault();
        if (dragIdx !== null && dragIdx !== toIdx) {
            // +1 offset because gallery starts at images[1]
            onReorder(dragIdx + 1, toIdx + 1);
        }
        setDragIdx(null);
        setDragOverIdx(null);
    }

    const SectionHeader = ({ title, count }: { title: string; count?: number }) => (
        <div style={{
            padding: "10px 14px",
            borderBottom: `1px solid ${C.border}`,
            fontSize: 12,
            fontWeight: 700,
            color: C.text,
            textTransform: "uppercase" as const,
            letterSpacing: "0.6px",
            background: C.surfaceAlt,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
        }}>
            <span>{title}</span>
            {count !== undefined && count > 0 && (
                <span style={{ fontSize: 11, color: C.textMuted, fontWeight: 400, textTransform: "none" }}>
          {count} image{count !== 1 ? "s" : ""}
        </span>
            )}
        </div>
    );

    const RemoveBtn = ({ onClick }: { onClick: () => void }) => (
        <button
            onClick={onClick}
            style={{
                position: "absolute", top: 5, right: 5,
                width: 20, height: 20, borderRadius: "50%",
                background: "rgba(0,0,0,0.7)",
                border: "none", color: "#fff",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                opacity: 0, transition: "opacity 0.15s",
                fontSize: 14, lineHeight: 1,
            }}
            className="remove-btn"
        >
            ×
        </button>
    );

    return (
        <>
            {/* ── Featured image ──────────────────────────────────────────────────── */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden", marginBottom: 12 }}>
                <SectionHeader title="Product Image" />
                <div style={{ padding: 14 }}>
                    {featured ? (
                        <div
                            style={{ position: "relative", borderRadius: 6, overflow: "hidden", aspectRatio: "4/3", cursor: "pointer" }}
                            className="img-hover-wrap"
                            onClick={() => setModalMode("featured")}
                        >
                            <img
                                src={featured}
                                alt="Featured"
                                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                            />
                            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0)", transition: "background 0.15s" }} className="img-overlay" />
                            <RemoveBtn onClick={(e: any) => { e.stopPropagation(); onRemove(featured); }} />
                            <div style={{ position: "absolute", bottom: 8, left: 0, right: 0, textAlign: "center" }}>
                <span style={{ background: "rgba(0,0,0,0.6)", color: "#fff", fontSize: 11, padding: "3px 8px", borderRadius: 3 }}>
                  Click to change
                </span>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setModalMode("featured")}
                            style={{
                                width: "100%",
                                background: C.surfaceAlt,
                                border: `1px dashed ${C.inputBorder}`,
                                borderRadius: 6,
                                padding: "28px 16px",
                                color: C.accent,
                                fontSize: 13,
                                cursor: "pointer",
                                fontFamily: "inherit",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 8,
                            }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.5">
                                <rect x="3" y="3" width="18" height="18" rx="2" />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <polyline points="21 15 16 10 5 21" />
                            </svg>
                            Set product image
                        </button>
                    )}
                </div>
            </div>

            {/* ── Product gallery ─────────────────────────────────────────────────── */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
                <SectionHeader title="Product Gallery" count={gallery.length} />
                <div style={{ padding: 14 }}>
                    {gallery.length > 0 && (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                            {gallery.map((url, i) => (
                                <div
                                    key={url}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, i)}
                                    onDragOver={(e) => handleDragOver(e, i)}
                                    onDrop={(e) => handleDrop(e, i)}
                                    onDragEnd={() => { setDragIdx(null); setDragOverIdx(null); }}
                                    className="img-hover-wrap"
                                    style={{
                                        position: "relative",
                                        borderRadius: 4,
                                        overflow: "hidden",
                                        aspectRatio: "1",
                                        cursor: "grab",
                                        opacity: dragIdx === i ? 0.4 : 1,
                                        outline: dragOverIdx === i ? `2px solid ${C.accent}` : "2px solid transparent",
                                        transition: "opacity 0.15s, outline 0.1s",
                                    }}
                                >
                                    <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", pointerEvents: "none" }} />
                                    <RemoveBtn onClick={() => onRemove(url)} />
                                    {/* Set as featured button */}
                                    <button
                                        onClick={() => onSetFeatured(url)}
                                        title="Set as featured"
                                        style={{
                                            position: "absolute", bottom: 5, left: 5,
                                            background: "rgba(0,0,0,0.65)",
                                            border: "none", borderRadius: 3,
                                            color: "#fff", fontSize: 9, fontWeight: 700,
                                            padding: "2px 5px", cursor: "pointer",
                                            opacity: 0, transition: "opacity 0.15s",
                                            fontFamily: "inherit",
                                        }}
                                        className="set-featured-btn"
                                    >
                                        ★ Featured
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <button
                        onClick={() => setModalMode("gallery")}
                        style={{
                            width: "100%",
                            background: C.surfaceAlt,
                            border: `1px dashed ${C.inputBorder}`,
                            borderRadius: 4,
                            padding: "10px",
                            color: C.accent,
                            fontSize: 12,
                            cursor: "pointer",
                            fontFamily: "inherit",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 6,
                        }}
                    >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round">
                            <line x1="7" y1="1" x2="7" y2="13" /><line x1="1" y1="7" x2="13" y2="7" />
                        </svg>
                        Add gallery images
                    </button>
                </div>
            </div>

            {/* Hover effects */}
            <style>{`
        .img-hover-wrap:hover .remove-btn { opacity: 1 !important; }
        .img-hover-wrap:hover .set-featured-btn { opacity: 1 !important; }
        .img-hover-wrap:hover .img-overlay { background: rgba(0,0,0,0.25) !important; }
      `}</style>

            {/* ── Media manager dialog ──────────────────────────────────────────── */}
            <Dialog
                open={modalMode !== null}
                onClose={() => setModalMode(null)}
                PaperProps={{
                    sx: {
                        height: "calc(100vh - 64px)",
                        m: "32px",
                        width: "calc(100% - 64px)",
                        maxWidth: "none",
                        borderRadius: "8px",
                        overflow: "hidden",
                    },
                }}
                slotProps={{ backdrop: { sx: { backdropFilter: "blur(4px)" } } }}
            >
                <AddMediaContent
                    onInsert={handleMediaInsert}
                    onClose={() => setModalMode(null)}
                />
            </Dialog>
        </>
    );
}