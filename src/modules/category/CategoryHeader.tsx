import Link from "next/link";
import {C} from "@/src/utils/customColors";

interface CategoryHeaderProps {
    totalCount: number;
}

export default function CategoryHeader({totalCount}: CategoryHeaderProps) {
    return (
        <div style={{
            borderBottom: `1px solid ${C.border}`,
            background: C.surface,
            padding: "16px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
        }}>
            <div>
                <h1 style={{margin: 0, fontSize: 20, fontWeight: 700}}>Categories</h1>
                <span style={{fontSize: 12, color: C.textMuted}}>
                        {totalCount} {totalCount === 1 ? "category" : "categories"} total
                    </span>
            </div>
            <Link
                href="/admin/categories/add"
                style={{
                    background: C.accent,
                    border: "none",
                    borderRadius: 4,
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 700,
                    padding: "8px 18px",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                }}
            >
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="#fff" strokeWidth="2"
                     strokeLinecap="round">
                    <line x1="6.5" y1="1" x2="6.5" y2="12"/>
                    <line x1="1" y1="6.5" x2="12" y2="6.5"/>
                </svg>
                Add Category
            </Link>
        </div>
    )
}