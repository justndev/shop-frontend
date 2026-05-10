"use client";

import { useState } from "react";
import {useAddProduct} from "@/src/modules/product/useAddProduct";


import ADMIN_PANEL_COLORS from '@/src/modules/admin/colors';
const C = ADMIN_PANEL_COLORS;

type UseAddProductReturn = ReturnType<typeof useAddProduct>;

interface Props {
    form: UseAddProductReturn["form"];
    setField: UseAddProductReturn["setField"];
    isSaving: boolean;
    saveStatus: UseAddProductReturn["saveStatus"];
    isEditing: boolean;
    onSaveDraft: () => void;
    onPublish: () => void;
    onPreview: () => void;
}

export default function ProductPublishPanel({
                                                form,
                                                setField,
                                                isSaving,
                                                saveStatus,
                                                isEditing,
                                                onSaveDraft,
                                                onPublish,
                                                onPreview,
                                            }: Props) {
    const [statusOpen, setStatusOpen] = useState(false);
    const [visibilityOpen, setVisibilityOpen] = useState(false);

    const SectionHeader = ({ title }: { title: string }) => (
        <div
            style={{
                padding: "10px 14px",
                borderBottom: `1px solid ${C.border}`,
                fontSize: 12,
                fontWeight: 700,
                color: C.text,
                textTransform: "uppercase" as const,
                letterSpacing: "0.6px",
                background: C.surfaceAlt,
            }}
        >
            {title}
        </div>
    );

    const Row = ({ label, value, onEdit }: { label: string; value: string; onEdit?: () => void }) => (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0" }}>
            <span style={{ fontSize: 13, color: C.textMuted }}>{label}:</span>
            <span style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>
        {value}{" "}
                {onEdit && (
                    <button
                        onClick={onEdit}
                        style={{ background: "none", border: "none", color: C.accent, fontSize: 12, cursor: "pointer", padding: 0, fontFamily: "inherit" }}
                    >
                        Edit
                    </button>
                )}
      </span>
        </div>
    );

    return (
        <div
            style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                overflow: "hidden",
            }}
        >
            <SectionHeader title="Publish" />

            {/* Status row */}
            <div style={{ padding: "12px 14px", borderBottom: `1px solid ${C.border}` }}>
                {/* Quick actions */}
                <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                    <button
                        onClick={onSaveDraft}
                        disabled={isSaving}
                        style={{
                            flex: 1,
                            background: C.surfaceAlt,
                            border: `1px solid ${C.inputBorder}`,
                            borderRadius: 4,
                            color: C.text,
                            fontSize: 12,
                            fontWeight: 600,
                            padding: "7px 10px",
                            cursor: isSaving ? "not-allowed" : "pointer",
                            fontFamily: "inherit",
                            opacity: isSaving ? 0.6 : 1,
                        }}
                    >
                        {isSaving ? "Saving…" : "Save Draft"}
                    </button>
                    <button
                        onClick={onPreview}
                        style={{
                            flex: 1,
                            background: C.surfaceAlt,
                            border: `1px solid ${C.inputBorder}`,
                            borderRadius: 4,
                            color: C.text,
                            fontSize: 12,
                            fontWeight: 600,
                            padding: "7px 10px",
                            cursor: "pointer",
                            fontFamily: "inherit",
                        }}
                    >
                        Preview
                    </button>
                </div>

                {/* Save status indicator */}
                {saveStatus === "saved" && (
                    <div style={{ fontSize: 11, color: "#4caf50", marginBottom: 10, display: "flex", alignItems: "center", gap: 5 }}>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="#4caf50"><circle cx="6" cy="6" r="6"/><polyline points="3,6 5,8 9,4" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
                        Saved successfully
                    </div>
                )}
                {saveStatus === "error" && (
                    <div style={{ fontSize: 11, color: C.danger, marginBottom: 10 }}>⚠ Failed to save</div>
                )}

                {/* Status / Visibility rows */}
                <Row
                    label="Status"
                    value={form.status === "published" ? "Published" : "Draft"}
                    onEdit={() => setStatusOpen(v => !v)}
                />
                {statusOpen && (
                    <div style={{ marginBottom: 8 }}>
                        {(["draft", "published"] as const).map(s => (
                            <label key={s} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: "4px 0" }}>
                                <input
                                    type="radio"
                                    name="status"
                                    checked={form.status === s}
                                    onChange={() => { setField("status", s); setStatusOpen(false); }}
                                    style={{ accentColor: C.accent }}
                                />
                                <span style={{ fontSize: 13, color: C.text, textTransform: "capitalize" }}>{s}</span>
                            </label>
                        ))}
                    </div>
                )}

                <Row label="Visibility" value="Public" onEdit={() => setVisibilityOpen(v => !v)} />
                {visibilityOpen && (
                    <p style={{ fontSize: 12, color: C.textMuted, margin: "4px 0 8px" }}>
                        All published products are publicly visible on your store.
                    </p>
                )}

                <Row
                    label="Publish"
                    value={form.status === "published" ? "Immediately" : "On publish"}
                />
            </div>

            {/* Publish button */}
            <div style={{ padding: "12px 14px", background: C.surfaceAlt }}>
                <button
                    onClick={onPublish}
                    disabled={isSaving}
                    style={{
                        width: "100%",
                        background: isSaving ? C.surfaceAlt : C.accent,
                        color: isSaving ? C.textMuted : "#fff",
                        border: `1px solid ${isSaving ? C.inputBorder : C.accent}`,
                        borderRadius: 4,
                        padding: "9px 16px",
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: isSaving ? "not-allowed" : "pointer",
                        fontFamily: "inherit",
                        transition: "all 0.15s",
                    }}
                    onMouseOver={(e) => { if (!isSaving) e.currentTarget.style.background = C.accentHover; }}
                    onMouseOut={(e) => { if (!isSaving) e.currentTarget.style.background = C.accent; }}
                >
                    {isSaving
                        ? "Saving…"
                        : isEditing
                            ? "Update Product"
                            : form.status === "published"
                                ? "Publish Product"
                                : "Save & Publish"}
                </button>
            </div>
        </div>
    );
}