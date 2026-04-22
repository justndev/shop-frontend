
import Link from "next/link";
import {C} from "@/src/utils/customColors";
import {Tag} from "@/src/utils/types";

export default function TagRow({tag, isLast, handleDelete}: {tag: Tag, isLast: boolean, handleDelete: () => void })

{
    const name = (tag.name as any).en ?? "Untitled";
    const hasRu = !!(tag.name as any).ru;
    const hasEt = !!(tag.name as any).et;
// add this hover { background: rgba(255,255,255,0.02) !important
    return (
        <div key={tag.id}>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "156px 1fr 1fr",
                    padding: "12px 16px",
                    borderBottom: isLast ? `1px solid ${C.border}` : "none",
                    alignItems: "center",
                    background: "transparent",
                    transition: "background 0.15s",
                }}
                className="tag-row"
            >
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

                {/* Created */}
                <div style={{ fontSize: 12, color: C.textMuted }}>
                    {new Date(tag.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                    <Link
                        href={`/admin/tags/${tag.id}/edit`}
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