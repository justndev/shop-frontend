import {MediaItem} from "@/src/types";
import {useCallback, useRef, useState} from "react";
import {MEDIA_C} from "@/src/modules/mediaManager/utils/MediaManagerColors";

export function UploadFilesView({ onFilesUploaded }: { onFilesUploaded?: (files: File[]) => void }) {
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        if (files.length) onFilesUploaded?.(files);
    }, [onFilesUploaded]);

    return (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 32 }}>
            <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                style={{
                    border: `2px dashed ${isDragging ? MEDIA_C.selectedBorder : MEDIA_C.border}`,
                    borderRadius: 8,
                    background: isDragging ? MEDIA_C.accentLight : MEDIA_C.surfaceAlt,
                    padding: "64px 80px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 16,
                    transition: "all 0.18s ease",
                    cursor: "default",
                    maxWidth: 500,
                    width: "100%",
                }}
            >
                {/* Upload icon */}
                <div style={{
                    width: 56, height: 56, borderRadius: "50%",
                    background: isDragging ? MEDIA_C.accentLight : "rgba(255,255,255,0.04)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.18s",
                }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={isDragging ? MEDIA_C.selectedBorder : MEDIA_C.textMuted} strokeWidth="1.5">
                        <polyline points="16 16 12 12 8 16"/>
                        <line x1="12" y1="12" x2="12" y2="21"/>
                        <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
                    </svg>
                </div>

                <div style={{ textAlign: "center" }}>
                    <p style={{ color: MEDIA_C.text, fontSize: 15, fontWeight: 500, margin: "0 0 6px" }}>
                        Drop files to upload
                    </p>
                    <p style={{ color: MEDIA_C.textMuted, fontSize: 13, margin: 0 }}>or</p>
                </div>

                <button
                    onClick={() => inputRef.current?.click()}
                    style={{
                        background: MEDIA_C.accent,
                        color: "#fff",
                        border: "none",
                        borderRadius: 4,
                        padding: "8px 20px",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        transition: "background 0.15s",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = MEDIA_C.accentHover)}
                    onMouseOut={(e) => (e.currentTarget.style.background = MEDIA_C.accent)}
                >
                    Select Files
                </button>

                <p style={{ color: MEDIA_C.textFaint, fontSize: 12, margin: 0 }}>
                    Maximum upload file size: 64 MB
                </p>

                <input
                    ref={inputRef}
                    type="file"
                    multiple
                    style={{ display: "none" }}
                    onChange={(e) => {
                        const files = Array.from(e.target.files ?? []);
                        if (files.length) onFilesUploaded?.(files);
                    }}
                />
            </div>
        </div>
    );
}