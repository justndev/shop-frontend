"use client";

import { useState, useEffect } from "react";
import { categoryApi, Category } from "@/src/api/productApi";
import {ProductFormState} from "@/src/modules/product/useAddProduct";

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

const inputStyle: React.CSSProperties = {
    background: C.inputBg, border: `1px solid ${C.inputBorder}`,
    borderRadius: 4, color: C.text, fontSize: 12,
    padding: "6px 9px", fontFamily: "inherit", outline: "none",
    width: "100%", boxSizing: "border-box" as const,
};

// ── CATEGORIES ────────────────────────────────────────────────────────────────

interface CategoriesProps {
    categoryId: string;
    setField: <K extends keyof ProductFormState>(k: K, v: ProductFormState[K]) => void;
    error?: string;
}

export function ProductCategoriesPanel({ categoryId, setField, error }: CategoriesProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [newName, setNewName] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [search, setSearch] = useState("");

    useEffect(() => {
        categoryApi.list().then(setCategories).catch(console.error);
    }, []);

    async function handleCreate() {
        if (!newName.trim()) return;
        setIsCreating(true);
        try {
            const created = await categoryApi.create(newName.trim());
            setCategories(prev => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
            setField("categoryId", created.id);
            setNewName("");
            setIsAdding(false);
        } catch {
            // handle error
        } finally {
            setIsCreating(false);
        }
    }

    const filtered = categories.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
            <SectionHeader title="Product categories" />

            <div style={{ padding: "10px 14px" }}>
                {categories.length > 5 && (
                    <input
                        type="search"
                        placeholder="Search categories…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ ...inputStyle, marginBottom: 8 }}
                    />
                )}

                <div style={{ maxHeight: 180, overflowY: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
                    {filtered.length === 0 && (
                        <span style={{ fontSize: 12, color: C.textFaint }}>No categories found</span>
                    )}
                    {filtered.map(cat => (
                        <label
                            key={cat.id}
                            style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: "3px 0" }}
                        >
                            <input
                                type="radio"
                                name="categoryId"
                                value={cat.id}
                                checked={categoryId === cat.id}
                                onChange={() => setField("categoryId", cat.id)}
                                style={{ accentColor: C.accent }}
                            />
                            <span style={{ fontSize: 13, color: C.text }}>{cat.name}</span>
                        </label>
                    ))}
                </div>

                {error && (
                    <p style={{ margin: "6px 0 0", fontSize: 11, color: C.danger }}>{error}</p>
                )}

                {/* Add new category */}
                <div style={{ marginTop: 10, borderTop: `1px solid ${C.border}`, paddingTop: 10 }}>
                    {!isAdding ? (
                        <button
                            onClick={() => setIsAdding(true)}
                            style={{ background: "none", border: "none", color: C.accent, fontSize: 12, cursor: "pointer", padding: 0, fontFamily: "inherit" }}
                        >
                            + Add new category
                        </button>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            <input
                                type="text"
                                placeholder="Category name"
                                value={newName}
                                onChange={e => setNewName(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && handleCreate()}
                                autoFocus
                                style={inputStyle}
                            />
                            <div style={{ display: "flex", gap: 6 }}>
                                <button
                                    onClick={handleCreate}
                                    disabled={isCreating || !newName.trim()}
                                    style={{
                                        background: C.accent, border: "none", borderRadius: 3,
                                        color: "#fff", fontSize: 12, padding: "5px 12px",
                                        cursor: isCreating ? "not-allowed" : "pointer", fontFamily: "inherit",
                                        opacity: isCreating ? 0.6 : 1,
                                    }}
                                >
                                    {isCreating ? "Creating…" : "Add"}
                                </button>
                                <button
                                    onClick={() => { setIsAdding(false); setNewName(""); }}
                                    style={{ background: "none", border: "none", color: C.textMuted, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ── TAGS ──────────────────────────────────────────────────────────────────────

interface TagsProps {
    tags: string[];
    tagInput: string;
    setTagInput: (v: string) => void;
    addTag: (t: string) => void;
    removeTag: (t: string) => void;
    handleTagKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function ProductTagsPanel({ tags, tagInput, setTagInput, addTag, removeTag, handleTagKeyDown }: TagsProps) {
    return (
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
            <SectionHeader title="Product tags" />
            <div style={{ padding: 14 }}>
                {/* Tag chips */}
                {tags.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                        {tags.map(tag => (
                            <span
                                key={tag}
                                style={{
                                    display: "inline-flex", alignItems: "center", gap: 5,
                                    background: C.accentLight, border: `1px solid rgba(34,113,177,0.3)`,
                                    borderRadius: 20, padding: "3px 10px",
                                    fontSize: 12, color: C.text,
                                }}
                            >
                {tag}
                                <button
                                    onClick={() => removeTag(tag)}
                                    style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", padding: 0, lineHeight: 1, fontSize: 14 }}
                                >
                  ×
                </button>
              </span>
                        ))}
                    </div>
                )}

                {/* Input + Add button */}
                <div style={{ display: "flex", gap: 6 }}>
                    <input
                        type="text"
                        placeholder="Add tag…"
                        value={tagInput}
                        onChange={e => setTagInput(e.target.value)}
                        onKeyDown={handleTagKeyDown}
                        style={{ ...inputStyle, flex: 1 }}
                    />
                    <button
                        onClick={() => addTag(tagInput)}
                        disabled={!tagInput.trim()}
                        style={{
                            background: C.accent, border: "none", borderRadius: 4,
                            color: "#fff", fontSize: 12, fontWeight: 600,
                            padding: "6px 12px", cursor: !tagInput.trim() ? "not-allowed" : "pointer",
                            fontFamily: "inherit", flexShrink: 0,
                            opacity: !tagInput.trim() ? 0.5 : 1,
                        }}
                    >
                        Add
                    </button>
                </div>
                <p style={{ margin: "6px 0 0", fontSize: 11, color: C.textFaint }}>
                    Press Enter or comma to add · Backspace to remove last
                </p>
            </div>
        </div>
    );
}