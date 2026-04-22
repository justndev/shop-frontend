import {MEDIA_C} from "@/src/modules/media/utils/MediaManagerColors";

export default function TabBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            style={{
                background: "none",
                border: "none",
                borderBottom: active ? `2px solid ${MEDIA_C.selectedBorder}` : "2px solid transparent",
                color: active ? MEDIA_C.text : MEDIA_C.textMuted,
                fontSize: 13,
                fontWeight: active ? 600 : 400,
                padding: "10px 14px",
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.15s",
                marginBottom: -1,
            }}
        >
            {label}
        </button>
    );
}