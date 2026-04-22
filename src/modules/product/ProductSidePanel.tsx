"use client";

import { useState, useEffect } from "react";
import {ProductFormState} from "@/src/modules/product/useAddProduct";
import categoryApi from "@/src/modules/category/categoryApi";
import {Category} from "@/src/types";

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

export default function ProductCategoriesPanel({ categoryId, setField, error }: CategoriesProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [newName, setNewName] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [search, setSearch] = useState("");

    useEffect(() => {
        async function fetchCategories() {
            const data = await categoryApi.getAll();
            console.log(data.data);
            setCategories(data.data)
        }
        fetchCategories();
    }, []);


    const filtered = categories


    return (
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
            <SectionHeader title="Product categories" />

            <div style={{ padding: "10px 14px" }}>
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
                            <span style={{ fontSize: 13, color: C.text }}>{cat.name['en']}</span>
                        </label>
                    ))}
                </div>

                {error && (
                    <p style={{ margin: "6px 0 0", fontSize: 11, color: C.danger }}>{error}</p>
                )}

            </div>
        </div>
    );
}