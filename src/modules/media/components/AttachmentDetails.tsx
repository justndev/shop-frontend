import {MediaItem} from "@/src/types";
import {MEDIA_C} from "@/src/modules/media/utils/MediaManagerColors";
import {linkBtnStyle} from "@/src/modules/media/utils/MediaManagerStyles";
import {formatDate} from "date-fns";

export default function AttachmentDetails({
                               item, onUpdate,
                           }: {
    item: MediaItem;
    onUpdate: (id: string, patch: Partial<MediaItem>) => void;
}) {
    const Field = ({ label, value, field, multiline = false }: {
        label: string; value: string; field: keyof MediaItem; multiline?: boolean;
    }) => (
        <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 11, color: MEDIA_C.textMuted, marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                {label}
            </label>
            {multiline ? (
                <textarea
                    value={value}
                    onChange={(e) => onUpdate(item.id, { [field]: e.target.value } as any)}
                    rows={3}
                    style={inputStyle}
                />
            ) : (
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onUpdate(item.id, { [field]: e.target.value } as any)}
                    style={inputStyle}
                />
            )}
        </div>
    );

    const inputStyle: React.CSSProperties = {
        width: "100%",
        background: MEDIA_C.inputBg,
        border: `1px solid ${MEDIA_C.inputBorder}`,
        borderRadius: 4,
        color: MEDIA_C.text,
        fontSize: 12,
        padding: "6px 8px",
        fontFamily: "inherit",
        outline: "none",
        boxSizing: "border-box",
        resize: "vertical",
    };

    return (
        <div style={{ width: 220, flexShrink: 0, background: MEDIA_C.surfaceAlt, borderLeft: `1px solid ${MEDIA_C.border}`, overflowY: "auto", display: "flex", flexDirection: "column" }}>
            {/* Header */}
            <div style={{ padding: "12px 14px", borderBottom: `1px solid ${MEDIA_C.border}` }}>
        <span style={{ fontSize: 10, color: MEDIA_C.textFaint, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>
          Attachment Details
        </span>
            </div>

            {/* Thumbnail */}
            {item.type === "image" && item.url && (
                <div style={{ padding: 12, borderBottom: `1px solid ${MEDIA_C.border}` }}>
                    <img
                        src={item.url}
                        alt=""
                        style={{ width: "100%", borderRadius: 4, display: "block", maxHeight: 140, objectFit: "cover" }}
                    />
                </div>
            )}

            {/* Meta info */}
            <div style={{ padding: "10px 14px", borderBottom: `1px solid ${MEDIA_C.border}` }}>
                <p style={{ margin: "0 0 2px", fontSize: 12, color: MEDIA_C.text, fontWeight: 600, wordBreak: "break-all" }}>{item.name}</p>
                <p style={{ margin: "0 0 2px", fontSize: 11, color: MEDIA_C.textMuted }}>{formatDate(item.uploadedAt)}</p>
                <p style={{ margin: "0 0 2px", fontSize: 11, color: MEDIA_C.textMuted }}>{formatBytes(item.size)}</p>
                {item.width && item.height && (
                    <p style={{ margin: 0, fontSize: 11, color: MEDIA_C.textMuted }}>{item.width} × {item.height} px</p>
                )}
                <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                    <button style={linkBtnStyle(MEDIA_C.accent)}>Edit Image</button>
                    <button style={linkBtnStyle(MEDIA_C.danger)}>Delete</button>
                </div>
            </div>

            {/* Editable fields */}
            <div style={{ padding: "12px 14px", flex: 1 }}>
                <Field label="Alt Text" value={item.altText} field="altText" multiline />
                <Field label="Title" value={item.title} field="title" />
                <Field label="Caption" value={item.caption} field="caption" multiline />
                <Field label="Description" value={item.description} field="description" multiline />

                <div style={{ marginBottom: 14 }}>
                    <label style={{ display: "block", fontSize: 11, color: MEDIA_C.textMuted, marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        File URL
                    </label>
                    <input
                        type="text"
                        readOnly
                        value={item.url || "—"}
                        style={{ ...inputStyle as any, color: MEDIA_C.textMuted, cursor: "text" }}
                    />
                    <button
                        onClick={() => item.url && navigator.clipboard.writeText(item.url)}
                        style={{
                            marginTop: 6, background: MEDIA_C.surface, border: `1px solid ${MEDIA_C.border}`,
                            borderRadius: 4, color: MEDIA_C.text, fontSize: 11, padding: "4px 10px",
                            cursor: "pointer", fontFamily: "inherit",
                        }}
                    >
                        Copy URL to clipboard
                    </button>
                </div>
            </div>
        </div>
    );
}