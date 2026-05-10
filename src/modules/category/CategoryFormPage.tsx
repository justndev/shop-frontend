// src/app/admin/categories/add/page.tsx  ← pass no props
// src/app/admin/categories/[id]/edit/page.tsx  ← fetch category, pass as existingCategory
"use client";

import { useState } from "react";
import Link from "next/link";
import { Dialog } from "@mui/material";
import AddMediaContent from "@/src/modules/media/contents/AddMediaContent";
import type { MediaItem } from "@/src/modules/media/mediaApi";
import useCategoryForm from "@/src/modules/category/hooks/useCategoryForm";
import { LOCALES } from "../product/useAddProduct";


import ADMIN_PANEL_COLORS from '@/src/modules/admin/colors';
const C = ADMIN_PANEL_COLORS;

const inp: React.CSSProperties = {
    width: "100%",
    background: C.inputBg,
    border: `1px solid ${C.inputBorder}`,
    borderRadius: 4,
    color: C.text,
    fontSize: 13,
    padding: "8px 11px",
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box",
};

const SectionHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
    <div style={{
        padding: "10px 16px",
        borderBottom: `1px solid ${C.border}`,
        background: C.surfaceAlt,
        display: "flex",
        alignItems: "center",
        gap: 8,
    }}>
    <span style={{ fontSize: 12, fontWeight: 700, color: C.text, textTransform: "uppercase", letterSpacing: "0.6px" }}>
      {title}
    </span>
        {subtitle && (
            <span style={{ fontSize: 11, color: C.textFaint, fontWeight: 400, textTransform: "none" }}>— {subtitle}</span>
        )}
    </div>
);

interface Props {
    existingCategory?: Category;
}

export default function CategoryFormPage({ existingCategory }: Props) {
    const {
        form, errors, activeLocale, setActiveLocale,
        setName, setSlug, setImage,
        saveStatus, handleSubmit, isEditing,
    } = useCategoryForm(existingCategory);

    const [mediaOpen, setMediaOpen] = useState(false);
    const isSaving = saveStatus === "saving";

    function handleMediaInsert(items: MediaItem[]) {
        if (items[0]) setImage(items[0].url);
        setMediaOpen(false);
    }

    const SaveBtn = ({ full }: { full?: boolean }) => (
        <button
            onClick={handleSubmit}
            disabled={isSaving}
            style={{
                width: full ? "100%" : "auto",
                background: isSaving ? C.surfaceAlt : C.accent,
                border: "none",
                borderRadius: 4,
                color: isSaving ? C.textMuted : "#fff",
                fontSize: 13,
                fontWeight: 700,
                padding: "8px 20px",
                cursor: isSaving ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                opacity: isSaving ? 0.7 : 1,
                transition: "all 0.15s",
            }}
        >
            {isSaving ? "Saving…" : isEditing ? "Update Category" : "Add Category"}
        </button>
    );

    return (
        <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>

            {/* ── Sticky header ── */}
            <div style={{
                borderBottom: `1px solid ${C.border}`,
                background: C.surface,
                padding: "16px 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                position: "sticky",
                top: 0,
                zIndex: 10,
            }}>
                <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                        <Link href="/admin/categories" style={{ color: C.textMuted, fontSize: 12, textDecoration: "none" }}>
                            ← Categories
                        </Link>
                    </div>
                    <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: C.text }}>
                        {isEditing ? `Edit: ${(existingCategory?.name as any)?.en ?? ""}` : "Add New Category"}
                    </h1>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    {saveStatus === "saved" && (
                        <span style={{ fontSize: 12, color: "#4caf50", display: "flex", alignItems: "center", gap: 5 }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="#4caf50">
                <circle cx="6" cy="6" r="6"/>
                <polyline points="3,6 5,8 9,4" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
              </svg>
                            {isEditing ? "Updated" : "Created"}
            </span>
                    )}
                    {saveStatus === "error" && (
                        <span style={{ fontSize: 12, color: C.danger }}>⚠ Failed to save</span>
                    )}
                    <SaveBtn />
                </div>
            </div>

            {/* ── Layout ── */}
            <div style={{
                maxWidth: 960,
                margin: "0 auto",
                padding: "24px",
                display: "grid",
                gridTemplateColumns: "1fr 280px",
                gap: 20,
                alignItems: "start",
            }}>

                {/* ── LEFT ── */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                    {/* Name translations panel */}
                    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
                        <SectionHeader title="Category name" subtitle="per language" />

                        {/* Locale tabs */}
                        <div style={{ display: "flex", borderBottom: `1px solid ${C.border}`, background: C.surfaceAlt }}>
                            {LOCALES.map((loc) => (
                                <button
                                    key={loc.code}
                                    onClick={() => setActiveLocale(loc.code)}
                                    style={{
                                        background: activeLocale === loc.code ? C.surface : "transparent",
                                        border: "none",
                                        borderBottom: activeLocale === loc.code ? `2px solid ${C.accent}` : "2px solid transparent",
                                        color: activeLocale === loc.code ? C.text : C.textMuted,
                                        fontSize: 12,
                                        fontWeight: activeLocale === loc.code ? 700 : 400,
                                        padding: "9px 16px",
                                        cursor: "pointer",
                                        fontFamily: "inherit",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 6,
                                        transition: "all 0.12s",
                                    }}
                                >
                                    <span style={{ fontSize: 14 }}>{loc.flag}</span>
                                    {loc.label}
                                    {loc.code === "en" && (
                                        <span style={{ fontSize: 9, background: C.accent, color: "#fff", borderRadius: 3, padding: "1px 5px", fontWeight: 700 }}>
                                            REQ
                                        </span>
                                    )}
                                    {form.name[loc.code as Locale] && (
                                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4caf50", flexShrink: 0 }} />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Name input per locale */}
                        <div style={{ padding: 16 }}>
                            {LOCALES.map((loc) => (
                                <div key={loc.code} style={{ display: activeLocale === loc.code ? "block" : "none" }}>
                                    <input
                                        type="text"
                                        placeholder={`Category name in ${loc.label}${loc.code === "en" ? " (required)" : " (optional)"}`}
                                        value={form.name[loc.code as Locale]}
                                        onChange={(e) => setName(loc.code as Locale, e.target.value)}
                                        style={{
                                            ...inp,
                                            fontSize: 18,
                                            fontWeight: 600,
                                            padding: "11px 14px",
                                            borderColor: loc.code === "en" && errors.name ? C.danger : C.inputBorder,
                                        }}
                                    />
                                </div>
                            ))}
                            {errors.name && (
                                <p style={{ margin: "6px 0 0", fontSize: 12, color: C.danger }}>{errors.name}</p>
                            )}
                            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                                {LOCALES.map((loc) => (
                                    <div key={loc.code} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: form.name[loc.code as Locale] ? "#4caf50" : C.textFaint }} />
                                        <span style={{ fontSize: 11, color: C.textFaint }}>{loc.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Slug */}
                    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
                        <SectionHeader title="Slug" subtitle="URL identifier" />
                        <div style={{ padding: 16 }}>
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                border: `1px solid ${errors.slug ? C.danger : C.inputBorder}`,
                                borderRadius: 4,
                                overflow: "hidden",
                            }}>
                <span style={{
                    padding: "8px 10px",
                    background: C.surfaceAlt,
                    color: C.textFaint,
                    fontSize: 12,
                    borderRight: `1px solid ${C.inputBorder}`,
                    whiteSpace: "nowrap",
                }}>
                  /categories/
                </span>
                                <input
                                    type="text"
                                    value={form.slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    placeholder="my-category"
                                    style={{ ...inp, border: "none", borderRadius: 0, flex: 1 }}
                                />
                            </div>
                            {errors.slug
                                ? <p style={{ margin: "6px 0 0", fontSize: 12, color: C.danger }}>{errors.slug}</p>
                                : <p style={{ margin: "6px 0 0", fontSize: 11, color: C.textFaint }}>
                                    {isEditing ? "Changing the slug may break existing links" : "Auto-generated · edit to customise"}
                                </p>
                            }
                        </div>
                    </div>
                </div>

                {/* ── RIGHT ── */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

                    {/* Image panel */}
                    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
                        <SectionHeader title="Category image" />
                        <div style={{ padding: 14 }}>
                            {form.image ? (
                                <div style={{ position: "relative", borderRadius: 6, overflow: "hidden", aspectRatio: "4/3" }} className="cat-img-wrap">
                                    <img src={form.image} alt="Category" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                                    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0)", transition: "background 0.15s" }} className="img-overlay" />
                                    <div style={{
                                        position: "absolute", bottom: 0, left: 0, right: 0,
                                        padding: "8px", display: "flex", gap: 6, justifyContent: "center",
                                        opacity: 0, transition: "opacity 0.15s",
                                    }} className="img-actions">
                                        <button
                                            onClick={() => setMediaOpen(true)}
                                            style={{ background: "rgba(0,0,0,0.75)", border: "none", borderRadius: 3, color: "#fff", fontSize: 11, padding: "4px 10px", cursor: "pointer", fontFamily: "inherit" }}
                                        >
                                            Change
                                        </button>
                                        <button
                                            onClick={() => setImage("")}
                                            style={{ background: "rgba(214,54,56,0.85)", border: "none", borderRadius: 3, color: "#fff", fontSize: 11, padding: "4px 10px", cursor: "pointer", fontFamily: "inherit" }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setMediaOpen(true)}
                                    style={{
                                        width: "100%",
                                        background: C.surfaceAlt,
                                        border: `1px dashed ${C.inputBorder}`,
                                        borderRadius: 6,
                                        padding: "32px 16px",
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
                                    Set category image
                                    <span style={{ fontSize: 11, color: C.textFaint }}>From media library</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Summary card */}
                    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
                        <SectionHeader title="Summary" />
                        <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 1 }}>
                            {([
                                { label: "English", value: form.name.en },
                                { label: "Russian", value: form.name.ru },
                                { label: "Estonian", value: form.name.et },
                                { label: "Slug", value: form.slug ? `/${form.slug}` : "" },
                                { label: "Image", value: form.image ? "Set" : "None" },
                            ] as const).map(({ label, value }) => (
                                <div key={label} style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    fontSize: 12,
                                    padding: "6px 0",
                                    borderBottom: `1px solid ${C.border}`,
                                }}>
                                    <span style={{ color: C.textMuted }}>{label}</span>
                                    <span style={{
                                        color: value ? C.text : C.textFaint,
                                        fontStyle: value ? "normal" : "italic",
                                        fontWeight: value ? 500 : 400,
                                        maxWidth: "60%",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        fontFamily: label === "Slug" ? "monospace" : "inherit",
                                        fontSize: label === "Slug" ? 11 : 12,
                                    }}>
                    {value || "not set"}
                  </span>
                                </div>
                            ))}
                            <div style={{ marginTop: 10 }}>
                                <SaveBtn full />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        .cat-img-wrap:hover .img-overlay { background: rgba(0,0,0,0.3) !important; }
        .cat-img-wrap:hover .img-actions { opacity: 1 !important; }
        @media (max-width: 700px) {
          div[style*="grid-template-columns: 1fr 280px"] { grid-template-columns: 1fr !important; }
        }
      `}</style>

            <Dialog
                open={mediaOpen}
                onClose={() => setMediaOpen(false)}
                PaperProps={{ sx: { height: "calc(100vh - 64px)", m: "32px", width: "calc(100% - 64px)", maxWidth: "none", borderRadius: "8px", overflow: "hidden" } }}
                slotProps={{ backdrop: { sx: { backdropFilter: "blur(4px)" } } }}
            >
                <AddMediaContent onInsert={handleMediaInsert} onClose={() => setMediaOpen(false)} />
            </Dialog>
        </div>
    );
}