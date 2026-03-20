import {MediaItem} from "@/src/types";
import {MEDIA_C} from "@/src/modules/mediaManager/utils/MediaManagerColors";
import {useEffect} from "react";

export default function MediaThumbnail({
                            item, isSelected, isLastSelected, onClick,
                        }: {
    item: MediaItem;
    isSelected: boolean;
    isLastSelected: boolean;
    onClick: (e: React.MouseEvent) => void;
}) {

    useEffect(() => {
        console.log(item)

    })

    const renderThumb = () => {
        if (item.type === "image" && item.url) {
            return (
                <img
                    src={item.url}
                    alt={item.altText || item.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    draggable={false}
                />
            );
        }
        if (item.type === "pdf") {
            return (
                <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, background: "#f0f0f0" }}>
                    <svg width="28" height="36" viewBox="0 0 28 36" fill="none">
                        <rect width="28" height="36" rx="3" fill="#e2e8f0"/>
                        <rect x="4" y="8" width="14" height="2" rx="1" fill="#94a3b8"/>
                        <rect x="4" y="13" width="20" height="2" rx="1" fill="#94a3b8"/>
                        <rect x="4" y="18" width="16" height="2" rx="1" fill="#94a3b8"/>
                        <rect x="4" y="23" width="12" height="2" rx="1" fill="#94a3b8"/>
                    </svg>
                    <span style={{ fontSize: 9, color: "#64748b", fontWeight: 700 }}>PDF</span>
                </div>
            );
        }
        return (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#e2e8f0" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                </svg>
            </div>
        );
    };

    return (
        <div
            onClick={onClick}
            style={{
                position: "relative",
                aspectRatio: "1",
                borderRadius: 4,
                overflow: "hidden",
                cursor: "pointer",
                outline: isLastSelected
                    ? `3px solid ${MEDIA_C.selectedBorder}`
                    : isSelected
                        ? `2px solid ${MEDIA_C.selected}`
                        : "2px solid transparent",
                outlineOffset: isLastSelected ? -3 : -2,
                transition: "outline 0.1s",
            }}
        >
            {renderThumb()}

            {/* Selection overlay */}
            {isSelected && (
                <div style={{
                    position: "absolute", inset: 0,
                    background: "rgba(34,113,177,0.25)",
                    pointerEvents: "none",
                }}/>
            )}

            {/* Checkmark */}
            {isSelected && (
                <div style={{
                    position: "absolute", top: 6, right: 6,
                    width: 20, height: 20, borderRadius: "50%",
                    background: MEDIA_C.accent,
                    display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="2 6 5 9 10 3"/>
                    </svg>
                </div>
            )}

            {/* Hover overlay */}
            <div className="media-thumb-hover" style={{
                position: "absolute", inset: 0,
                background: "rgba(0,0,0,0)",
                transition: "background 0.15s",
                pointerEvents: "none",
            }}/>

            <style>{`.media-thumb-hover:hover { background: rgba(0,0,0,0.12) !important; }`}</style>
        </div>
    );
}