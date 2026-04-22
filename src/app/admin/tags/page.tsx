// src/app/admin/tag/page.tsx
"use client";

import Link from "next/link";
import TagHeader from "@/src/modules/tag/TagHeader";
import {C} from "@/src/utils/customColors";
import TagRow from "@/src/modules/tag/TagRow";
import {useState} from "react";
import {Alert} from "@mui/material";
import {useTagList} from "@/src/modules/tag/useTagList";

const TABS = ["Name", "Created", ""];

export default function TagsPage() {
    const [showDialog, setShowDialog] = useState(false);

    function handleCloseDialog() {
        setShowDialog(false);
    }

    function handleOpenDialog() {
        setShowDialog(true);
    }

    const { tags, loading, handleDelete, tagAlert } = useTagList();

    return (
        <div style={{
            minHeight: "100vh",
            background: C.bg,
            color: C.text,
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        }}>

            <TagHeader totalCount={tags.length}/>

            {/* ── Content ── */}
            <div style={{maxWidth: 900, margin: "0 auto", padding: "24px"}}>

                {/* Error/Success Alert */}
                {tagAlert && <Alert severity={tagAlert.type}>{tagAlert.message}</Alert>}

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
                        gridTemplateColumns: "156px 1fr",
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
                    ) : tags.length === 0 ? (
                        <div style={{padding: "48px 16px", textAlign: "center"}}>
                            <div style={{color: C.textFaint, fontSize: 13, marginBottom: 12}}>
                                No tags yet
                            </div>
                            <Link href="/admin/tags/add" style={{color: C.accent, fontSize: 13}}>
                                Add your first tag →
                            </Link>
                        </div>
                    ) : (
                        tags.map((tag, i) => (
                            <TagRow
                                key={i}
                                tag={tag}
                                handleDelete={() => handleDelete(tag.id)}
                                isLast={tags[tags.length - 1].id === tag.id}
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