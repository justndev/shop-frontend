"use client";

import { useState, useEffect } from "react";
import { ProductFormState } from "@/src/modules/product/useAddProduct";
import tagApi from "@/src/modules/tag/tagApi";
import { Tag } from "@/src/utils/types";

const C = {
    surface: "#22262a",
    surfaceAlt: "#1e2226",
    border: "#2e3338",
    text: "#e8eaed",
    textMuted: "#8b949e",
    textFaint: "#545d67",
    accent: "#2271b1",
    accentLight: "rgba(34,113,177,0.15)",
    inputBg: "#161b1f",
    inputBorder: "#3d444d",
    danger: "#d63638",
};

const SectionHeader = ({ title }: { title: string }) => (
    <div style={{
        padding: "10px 14px",
        borderBottom: `1px solid ${C.border}`,
        fontSize: 12, fontWeight: 700, color: C.text,
        textTransform: "uppercase" as const, letterSpacing: "0.6px",
        background: C.surfaceAlt,
    }}>
        {title}
    </div>
);

interface TagsPanelProps {
    tags: string[];  // currently selected tag IDs from form.tag
    setField: <K extends keyof ProductFormState>(k: K, v: ProductFormState[K]) => void;
    error?: string;
}

export default function ProductTagsPanel({ tags, setField, error }: TagsPanelProps) {
    const [loading, setLoading] = useState(false);

    const [allTags, setAllTags] = useState<Tag[]>([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        async function fetchTags() {
            try {
                const responseData = await tagApi.getAll();
                setAllTags(responseData.data)
            } catch (e) {
                // TODO Handle error
            }

        }
        fetchTags();

    }, []);

    const filtered = search.trim()
        ? allTags.filter(t =>
            String(t.name?.en ?? "").toLowerCase().includes(search.toLowerCase())
        )
        : allTags;

    function toggle(id: string) {
        const next = tags.includes(id)
            ? tags.filter(t => t !== id)
            : [...tags, id];
        setField("tags", next);
    }

    return (
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
            <SectionHeader title="Product tags" />

            <div style={{ padding: "10px 14px", display: "flex", flexDirection: "column", gap: 8 }}>

                {/* Search */}
                <input
                    type="text"
                    placeholder="Search tags…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{
                        background: C.inputBg,
                        border: `1px solid ${C.inputBorder}`,
                        borderRadius: 4,
                        color: C.text,
                        fontSize: 12,
                        padding: "6px 9px",
                        fontFamily: "inherit",
                        outline: "none",
                        width: "100%",
                        boxSizing: "border-box" as const,
                    }}
                />

                {/* Tag list */}
                <div style={{ maxHeight: 180, overflowY: "auto", display: "flex", flexDirection: "column", gap: 1 }}>
                    {filtered.length === 0 && (
                        <span style={{ fontSize: 12, color: C.textFaint, padding: "4px 0" }}>
                            {search ? "No tag match your search" : "No tag found"}
                        </span>
                    )}
                    {filtered.map(tag => {
                        const checked = tags.includes(tag.id);
                        return (
                            <label
                                key={tag.id}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    cursor: "pointer",
                                    padding: "4px 6px",
                                    borderRadius: 4,
                                    background: checked ? C.accentLight : "transparent",
                                    transition: "background 0.12s",
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => toggle(tag.id)}
                                    style={{ accentColor: C.accent, width: 13, height: 13, flexShrink: 0 }}
                                />
                                <span style={{ fontSize: 13, color: checked ? C.text : C.textMuted }}>
                                    {String(tag.name?.en ?? tag.id)}
                                </span>
                            </label>
                        );
                    })}
                </div>

                {/* Selected count */}
                {tags.length > 0 && (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 11, color: C.textFaint }}>
                            {tags.length} tag{tags.length !== 1 ? "s" : ""} selected
                        </span>
                        <button
                            onClick={() => setField("tags", [])}
                            style={{
                                background: "none",
                                border: "none",
                                color: C.danger,
                                fontSize: 11,
                                cursor: "pointer",
                                padding: 0,
                                fontFamily: "inherit",
                            }}
                        >
                            Clear all
                        </button>
                    </div>
                )}

                {error && (
                    <p style={{ margin: 0, fontSize: 11, color: C.danger }}>{error}</p>
                )}
            </div>
        </div>
    );
}