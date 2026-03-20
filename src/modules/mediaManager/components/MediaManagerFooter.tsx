import {MediaItem} from "@/src/types";
import {MEDIA_C} from "@/src/modules/mediaManager/utils/MediaManagerColors";
import {linkBtnStyle} from "@/src/modules/mediaManager/utils/MediaManagerStyles";

export function MediaManagerFooter({
                    selectedIds, allMedia, onClear, onInsert,
                }: {
    selectedIds: Set<string>;
    allMedia: MediaItem[];
    onClear: () => void;
    onInsert: (items: MediaItem[]) => void;
}) {
    const selectedItems = allMedia.filter((m) => selectedIds.has(m.id));
    const count = selectedItems.length;

    return (
        <div style={{
            height: 60,
            borderTop: `1px solid ${MEDIA_C.border}`,
            background: MEDIA_C.surface,
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            gap: 12,
            flexShrink: 0,
        }}>
            {/* Left: selection info */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
                {count > 0 ? (
                    <>
                        {/* Thumbnails */}
                        <div style={{ display: "flex", gap: 4 }}>
                            {selectedItems.slice(0, 4).map((item) => (
                                <div key={item.id} style={{
                                    width: 36, height: 36, borderRadius: 3, overflow: "hidden",
                                    border: `1px solid ${MEDIA_C.border}`, flexShrink: 0,
                                }}>
                                    {item.type === "image" && item.url
                                        ? <img src={item.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
                                        : <div style={{ width: "100%", height: "100%", background: MEDIA_C.surfaceAlt }}/>
                                    }
                                </div>
                            ))}
                        </div>
                        <div>
                            <div style={{ fontSize: 13, color: MEDIA_C.text, fontWeight: 600 }}>
                                {count} item{count !== 1 ? "s" : ""} selected
                            </div>
                            <div style={{ display: "flex", gap: 8, marginTop: 1 }}>
                                <button style={linkBtnStyle(MEDIA_C.accent)} onClick={() => {}}>Edit Selection</button>
                                <span style={{ color: MEDIA_C.textFaint, fontSize: 12 }}>|</span>
                                <button style={linkBtnStyle(MEDIA_C.danger)} onClick={onClear}>Clear</button>
                            </div>
                        </div>
                    </>
                ) : (
                    <span style={{ color: MEDIA_C.textFaint, fontSize: 13 }}>No items selected</span>
                )}
            </div>

            {/* Right: insert button */}
            <button
                onClick={() => onInsert(selectedItems)}
                disabled={count === 0}
                style={{
                    background: count > 0 ? MEDIA_C.accent : MEDIA_C.surface,
                    color: count > 0 ? "#fff" : MEDIA_C.textFaint,
                    border: `1px solid ${count > 0 ? MEDIA_C.accent : MEDIA_C.inputBorder}`,
                    borderRadius: 4,
                    padding: "8px 18px",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: count > 0 ? "pointer" : "not-allowed",
                    fontFamily: "inherit",
                    transition: "all 0.15s",
                    whiteSpace: "nowrap",
                }}
            >
                Insert into product
            </button>
        </div>
    );
}