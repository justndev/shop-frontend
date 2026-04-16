
import Link from "next/link";
import {C} from "@/src/utils/customColors";
import {Category} from "@/src/types";

export default function CategoryRow({category, isLast, handleDelete}: {category: Category, isLast: boolean, handleDelete: () => void })

{
    const name = (category.name as any).en ?? "Untitled";
    const hasRu = !!(category.name as any).ru;
    const hasEt = !!(category.name as any).et;
// add this hover { background: rgba(255,255,255,0.02) !important
    return (
        <div key={category.id}>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "56px 1fr 1fr 160px 120px",
                    padding: "12px 16px",
                    borderBottom: isLast ? `1px solid ${C.border}` : "none",
                    alignItems: "center",
                    background: "transparent",
                    transition: "background 0.15s",
                }}
                className="cat-row"
            >
                {/* Thumbnail */}
                <div style={{ width: 40, height: 40, borderRadius: 4, overflow: "hidden", background: C.surfaceAlt, flexShrink: 0 }}>
                    {category.image ? (
                        <img src={category.image} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.textFaint} strokeWidth="1.5">
                                <rect x="3" y="3" width="18" height="18" rx="2" />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <polyline points="21 15 16 10 5 21" />
                            </svg>
                        </div>
                    )}
                </div>

                {/* Name + translations */}
                <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{name}</div>
                    <div style={{ display: "flex", gap: 4, marginTop: 3 }}>
                        {[{ code: "EN", active: true }, { code: "RU", active: hasRu }, { code: "ET", active: hasEt }].map(({ code, active }) => (
                            <span key={code} style={{
                                fontSize: 10,
                                fontWeight: 700,
                                padding: "1px 5px",
                                borderRadius: 3,
                                background: active ? "rgba(34,113,177,0.15)" : C.surfaceAlt,
                                color: active ? C.accent : C.textFaint,
                                border: `1px solid ${active ? "rgba(34,113,177,0.3)" : C.border}`,
                            }}>
                            {code}
                          </span>
                        ))}
                    </div>
                </div>

                {/* Slug */}
                <div style={{ fontSize: 12, color: C.textFaint, fontFamily: "monospace" }}>
                    /{category.slug}
                </div>

                {/* Created */}
                <div style={{ fontSize: 12, color: C.textMuted }}>
                    {new Date(category.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                    <Link
                        href={`/admin/categories/${category.id}/edit`}
                        style={{
                            background: C.surfaceAlt,
                            border: `1px solid ${C.inputBorder}`,
                            borderRadius: 4,
                            color: C.text,
                            fontSize: 12,
                            fontWeight: 600,
                            padding: "5px 12px",
                            cursor: "pointer",
                            fontFamily: "inherit",
                            textDecoration: "none",
                            display: "inline-block",
                        }}
                    >
                        Edit
                    </Link>
                    <button
                        onClick={handleDelete}
                        style={{
                            background: C.surfaceAlt,
                            border: `1px solid ${C.inputBorder}`,
                            borderRadius: 4,
                            color: C.danger,
                            fontSize: 12,
                            fontWeight: 600,
                            padding: "5px 12px",
                            cursor: "pointer",
                            fontFamily: "inherit",
                            opacity: 1,
                            transition: "all 0.15s",
                        }}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}