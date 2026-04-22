// src/app/admin/tag/add/page.tsx  ← pass no props
// src/app/admin/tag/[id]/edit/page.tsx  ← fetch tag, pass as existingTag
"use client";

import Link from "next/link";
import {Tag, Locale, LOCALES} from "@/src/utils/types";
import useAddEditTagForm from "@/src/modules/tag/useAddEditTagForm";

const C = {
    bg: "#1a1d1e",
    surface: "#22262a",
    surfaceAlt: "#1e2226",
    border: "#2e3338",
    text: "#e8eaed",
    textMuted: "#8b949e",
    textFaint: "#545d67",
    accent: "#2271b1",
    accentHover: "#1d6299",
    inputBg: "#161b1f",
    inputBorder: "#3d444d",
    danger: "#d63638",
};

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
    existingTag?: Tag;
}

export default function TagsFormPage({ existingTag }: Props) {
    const {
        form, errors, activeLocale, setActiveLocale,
        setName,
        saveStatus, handleSubmit, isEditing,
    } = useAddEditTagForm(existingTag);

    const isSaving = saveStatus === "saving";

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
            {isSaving ? "Saving…" : isEditing ? "Update Tag" : "Add Tag"}
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
                        <Link href="/admin/tags" style={{ color: C.textMuted, fontSize: 12, textDecoration: "none" }}>
                            ← Tags
                        </Link>
                    </div>
                    <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: C.text }}>
                        {isEditing ? `Edit: ${(existingTag?.name as any)?.en ?? ""}` : "Add New Tag"}
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
                        <SectionHeader title="Tag name" subtitle="per language" />

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
                                        placeholder={`Tag name in ${loc.label}${loc.code === "en" ? " (required)" : " (optional)"}`}
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
                </div>

                {/* ── RIGHT ── */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

                    {/* Summary card */}
                    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
                        <SectionHeader title="Summary" />
                        <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 1 }}>
                            {([
                                { label: "English", value: form.name.en },
                                { label: "Russian", value: form.name.ru },
                                { label: "Estonian", value: form.name.et },
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
                                        fontFamily:  "inherit",
                                        fontSize: 12,
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
        </div>
    );
}