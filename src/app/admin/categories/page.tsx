// src/app/admin/categories/page.tsx
"use client";

import Link from "next/link";
import {useCategoryList} from "@/src/modules/category/hooks/useCategoryList";
import CategoryHeader from "@/src/modules/category/CategoryHeader";

import ADMIN_PANEL_COLORS from '@/src/modules/admin/colors';
const C = ADMIN_PANEL_COLORS;
import CategoryRow from "@/src/modules/category/CategoryRow";
import {useState} from "react";
import {Alert} from "@mui/material";



const TABS = ["Image", "Name", "Slug", "Created", ""];

export default function CategoriesPage() {
    const [showDialog, setShowDialog] = useState(false);

    function handleCloseDialog() {
        setShowDialog(false);
    }

    function handleOpenDialog() {
        setShowDialog(true);
    }

    const { categories, loading, handleDelete, categoryAlert } = useCategoryList();

    return (
        <div style={{
            minHeight: "100vh",
            background: C.bg,
            color: C.text,
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        }}>

            <CategoryHeader totalCount={categories.length}/>

            {/* ── Content ── */}
            <div style={{maxWidth: 900, margin: "0 auto", padding: "24px"}}>

                {/* Error/Success Alert */}
                {categoryAlert && <Alert severity={categoryAlert.type}>{categoryAlert.message}</Alert>}

                {/* Table */}
                <div style={{
                    background: C.surface,
                    border: `1px solid ${C.border}`,
                    borderRadius: 8,
                    overflow: "hidden"
                }}>

                    {/* Table header */}
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "56px 1fr 1fr 160px 120px",
                        padding: "10px 16px",
                        borderBottom: `1px solid ${C.border}`,
                        background: C.surfaceAlt,
                    }}>
                        {TABS.map((tab) => (
                            <span key={tab} style={{
                                fontSize: 11,
                                fontWeight: 700,
                                color: C.textMuted,
                                textTransform: "uppercase",
                                letterSpacing: "0.5px"
                            }}>
                                {tab}
                             </span>
                        ))}
                    </div>

                    {/* Rows */}
                    {loading ? (
                        <div style={{padding: "40px 16px", textAlign: "center", color: C.textFaint, fontSize: 13}}>
                            Loading…
                        </div>
                    ) : categories.length === 0 ? (
                        <div style={{padding: "48px 16px", textAlign: "center"}}>
                            <div style={{color: C.textFaint, fontSize: 13, marginBottom: 12}}>
                                No categories yet
                            </div>
                            <Link href="/admin/categories/add" style={{color: C.accent, fontSize: 13}}>
                                Add your first category →
                            </Link>
                        </div>
                    ) : (
                        categories.map((cat, i) => (
                            <CategoryRow
                                key={i}
                                category={cat}
                                handleDelete={() => handleDelete(cat.id)}
                                isLast={categories[categories.length - 1].id === cat.id}
                            />)
                    ))}
                </div>

                <style>{`
          .cat-row:hover { background: rgba(255,255,255,0.02) !important; }
        `}</style>
            </div>
        </div>
    );
}