import {MediaItem} from "@/src/types";
import {useState} from "react";
import {MEDIA_C} from "@/src/modules/media/utils/MediaManagerColors";
import MediaThumbnail from "@/src/modules/media/components/MediaThumbnail";
import AttachmentDetails from "@/src/modules/media/components/AttachmentDetails";
import {MOCK_MEDIA} from "@/src/modules/media/contents/AddMediaContent";



export function MediaLibraryView({
                              selectedIds, lastSelectedId, onSelectionChange,
                          }: {
    selectedIds: Set<string>;
    lastSelectedId: string | null;
    onSelectionChange: (ids: Set<string>, lastId: string | null) => void;
}) {
    const [mediaItems, setMediaItems] = useState<MediaItem[]>(MOCK_MEDIA);
    const [typeFilter, setTypeFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState("all");
    const [search, setSearch] = useState("");

    // ── Details panel item (last selected)
    const detailItem = lastSelectedId ? mediaItems.find((m) => m.id === lastSelectedId) : null;

    const filtered = mediaItems.filter((item) => {
        if (typeFilter !== "all" && item.type !== typeFilter) return false;
        if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    function handleThumbClick(e: React.MouseEvent, id: string) {
        const newSelected = new Set(selectedIds);
        if (e.ctrlKey || e.metaKey) {
            // toggle
            if (newSelected.has(id)) {
                newSelected.delete(id);
                const newLast = newSelected.size > 0 ? [...newSelected].at(-1)! : null;
                onSelectionChange(newSelected, newLast);
            } else {
                newSelected.add(id);
                onSelectionChange(newSelected, id);
            }
        } else {
            // single select / deselect
            if (selectedIds.has(id) && selectedIds.size === 1) {
                onSelectionChange(new Set(), null);
            } else {
                onSelectionChange(new Set([id]), id);
            }
        }
    }

    function handleUpdate(id: string, patch: Partial<MediaItem>) {
        setMediaItems((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
    }

    const selectStyle: React.CSSProperties = {
        background: MEDIA_C.inputBg,
        border: `1px solid ${MEDIA_C.inputBorder}`,
        borderRadius: 4,
        color: MEDIA_C.text,
        fontSize: 12,
        padding: "5px 28px 5px 8px",
        fontFamily: "inherit",
        outline: "none",
        appearance: "none",
        cursor: "pointer",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%238b949e'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 8px center",
    };

    return (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {/* ── Filter/Search header */}
            <div style={{
                padding: "10px 16px",
                borderBottom: `1px solid ${MEDIA_C.border}`,
                display: "flex",
                alignItems: "flex-end",
                gap: 16,
                background: MEDIA_C.surface,
                flexShrink: 0,
            }}>
                <div>
                    <div style={{ fontSize: 10, color: MEDIA_C.textFaint, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 4 }}>
                        Filter media
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                        <select style={selectStyle} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                            <option value="all">All media items</option>
                            <option value="image">Images</option>
                            <option value="pdf">PDFs</option>
                            <option value="video">Videos</option>
                        </select>
                        <select style={selectStyle} value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
                            <option value="all">All dates</option>
                            <option value="2026-02">February 2026</option>
                            <option value="2026-01">January 2026</option>
                        </select>
                    </div>
                </div>

                <div style={{ marginLeft: "auto" }}>
                    <div style={{ fontSize: 10, color: MEDIA_C.textFaint, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 4 }}>
                        Search media
                    </div>
                    <input
                        type="search"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            background: MEDIA_C.inputBg,
                            border: `1px solid ${MEDIA_C.inputBorder}`,
                            borderRadius: 4,
                            color: MEDIA_C.text,
                            fontSize: 12,
                            padding: "5px 10px",
                            fontFamily: "inherit",
                            outline: "none",
                            width: 200,
                        }}
                    />
                </div>
            </div>

            {/* ── Grid + Details panel */}
            <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
                {/* Grid */}
                <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
                        gap: 8,
                    }}>
                        {filtered.map((item) => (
                            <MediaThumbnail
                                key={item.id}
                                item={item}
                                isSelected={selectedIds.has(item.id)}
                                isLastSelected={lastSelectedId === item.id}
                                onClick={(e) => handleThumbClick(e, item.id)}
                            />
                        ))}
                    </div>

                    {/* Count */}
                    <p style={{ textAlign: "center", color: MEDIA_C.textFaint, fontSize: 12, marginTop: 24 }}>
                        Showing {filtered.length} of {mediaItems.length} media items
                    </p>
                </div>

                {/* Attachment details sidebar */}
                {detailItem && (
                    <AttachmentDetails item={detailItem} onUpdate={handleUpdate} />
                )}
            </div>
        </div>
    );
}