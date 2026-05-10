// src/app/admin/tag/add/page.tsx (or wherever your routing sits)
"use client";

import useAddEditTagForm from "@/src/modules/tag/useAddEditTagForm";

import ADMIN_PANEL_COLORS from '@/src/modules/admin/colors';
import {LOCALES} from "@/src/modules/product/useAddProduct";
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

export default function AddTagPage() {
    const {
        form, errors, activeLocale, setActiveLocale,
        setName,
        saveStatus, handleSubmit,
    } = useAddEditTagForm();

    const isSaving = saveStatus === "saving";

    return (
        <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>

            {/* ── Sticky header ──────────────────────────────── */}
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
                    <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: C.text }}>Add New Tag</h1>
                    <span style={{ fontSize: 12, color: C.textMuted }}>Categories organise your products</span>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    {saveStatus === "saved" && (
                        <span style={{ fontSize: 12, color: "#4caf50", display: "flex", alignItems: "center", gap: 5 }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="#4caf50"><circle cx="6" cy="6" r="6"/><polyline points="3,6 5,8 9,4" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
              Saved
            </span>
                    )}
                    {saveStatus === "error" && (
                        <span style={{ fontSize: 12, color: C.danger }}>⚠ Failed to save</span>
                    )}
                    <button
                        onClick={handleSubmit}
                        disabled={isSaving}
                        style={{
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
                        onMouseOver={(e) => { if (!isSaving) e.currentTarget.style.background = C.accentHover; }}
                        onMouseOut={(e) => { if (!isSaving) e.currentTarget.style.background = isSaving ? C.surfaceAlt : C.accent; }}
                    >
                        {isSaving ? "Saving…" : "Add Tag"}
                    </button>
                </div>
            </div>

            {/* ── Main layout ─────────────────────────────────── */}
            <div style={{
                maxWidth: 960,
                margin: "0 auto",
                padding: "24px",
                display: "grid",
                gridTemplateColumns: "1fr 280px",
                gap: 20,
                alignItems: "start",
            }}>

                {/* ── LEFT COLUMN ─────────────────────────────────── */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                    {/* Name translations */}
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
                                    {form.name[loc.code] && (
                                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4caf50", display: "inline-block" }} />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Active locale input */}
                        <div style={{ padding: 16 }}>
                            {LOCALES.map((loc) => (
                                <div key={loc.code} style={{ display: activeLocale === loc.code ? "block" : "none" }}>
                                    <input
                                        type="text"
                                        placeholder={`Tag name in ${loc.label}${loc.code === "en" ? " (required)" : " (optional)"}`}
                                        value={form.name[loc.code]}
                                        onChange={(e) => setName(loc.code, e.target.value)}
                                        style={{
                                            ...inp,
                                            fontSize: 18,
                                            fontWeight: 600,
                                            padding: "11px 14px",
                                            borderColor: loc.code === "en" && errors.name ? C.danger : C.inputBorder,
                                        }}
                                        autoFocus={loc.code === activeLocale}
                                    />
                                </div>
                            ))}
                            {errors.name && (
                                <p style={{ margin: "6px 0 0", fontSize: 12, color: C.danger }}>{errors.name}</p>
                            )}

                            {/* Translation completeness */}
                            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                                {LOCALES.map((loc) => (
                                    <div key={loc.code} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: form.name[loc.code] ? "#4caf50" : C.textFaint }} />
                                        <span style={{ fontSize: 11, color: C.textFaint }}>{loc.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>

                {/* ── RIGHT COLUMN ─────────────────────────────────── */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {/* Summary card */}
                    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
                        <SectionHeader title="Summary" />
                        <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                            {[
                                { label: "English", value: form.name.en || <em style={{ color: C.textFaint }}>not set</em> },
                                { label: "Russian", value: form.name.ru || <em style={{ color: C.textFaint }}>not set</em> },
                                { label: "Estonian", value: form.name.et || <em style={{ color: C.textFaint }}>not set</em> },
                            ].map(({ label, value }) => (
                                <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "4px 0", borderBottom: `1px solid ${C.border}` }}>
                                    <span style={{ color: C.textMuted }}>{label}</span>
                                    <span style={{ color: C.text, fontWeight: 500, maxWidth: "60%", textAlign: "right", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</span>
                                </div>
                            ))}
                            <button
                                onClick={handleSubmit}
                                disabled={isSaving}
                                style={{
                                    marginTop: 4,
                                    width: "100%",
                                    background: isSaving ? C.surfaceAlt : C.accent,
                                    border: "none",
                                    borderRadius: 4,
                                    color: isSaving ? C.textMuted : "#fff",
                                    fontSize: 13,
                                    fontWeight: 700,
                                    padding: "9px",
                                    cursor: isSaving ? "not-allowed" : "pointer",
                                    fontFamily: "inherit",
                                    transition: "all 0.15s",
                                }}
                            >
                                {isSaving ? "Saving…" : "Add Tag"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        .img-hover-wrap:hover .img-overlay { background: rgba(0,0,0,0.25) !important; }
        @media (max-width: 700px) {
          div[style*="grid-template-columns: 1fr 280px"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
        </div>
    );
}