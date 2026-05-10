
import ADMIN_PANEL_COLORS from '@/src/modules/admin/colors';
const C = ADMIN_PANEL_COLORS;

const inp: React.CSSProperties = {
    background: C.inputBg,
    border: `1px solid ${C.inputBorder}`,
    borderRadius: 4,
    color: C.text,
    fontSize: 13,
    padding: "7px 11px",
    fontFamily: "inherit",
    outline: "none",
};

const SectionHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
    <div style={{
        padding: "10px 16px",
        borderBottom: `1px solid ${C.border}`,
        background: C.surfaceAlt,
        display: "flex",
        alignItems: "center",
        gap: 8,
    }}>
    <span style={{ fontSize: 12, fontWeight: 700, color: C.text, textTransform: "uppercase", letterSpacing: "0.6px" }}>
      {title}
    </span>
        {subtitle && (
            <span style={{ fontSize: 11, color: C.textFaint, fontWeight: 400, textTransform: "none" }}>— {subtitle}</span>
        )}
    </div>
);

export default function ProductSlugField({slug, error, setField}) {
    return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
        <SectionHeader title="Slug" subtitle="URL identifier" />
        <div style={{ padding: 16 }}>
            <div style={{
                display: "flex",
                alignItems: "center",
                border: `1px solid ${error ? C.danger : C.inputBorder}`,
                borderRadius: 4,
                overflow: "hidden",
            }}>
                <span style={{
                    padding: "8px 10px",
                    background: C.surfaceAlt,
                    color: C.textFaint,
                    fontSize: 12,
                    borderRight: `1px solid ${C.inputBorder}`,
                    whiteSpace: "nowrap",
                }}>
                  /products/
                </span>
                <input
                    type="text"
                    value={slug}
                    onChange={(e) => setField('slug' ,e.target.value)}
                    placeholder="my-slug"
                    style={{ ...inp, border: "none", borderRadius: 0, flex: 1 }}
                />
            </div>
            {!!error
                && <p style={{ margin: "6px 0 0", fontSize: 12, color: C.danger }}>{error}</p>
            }
        </div>
    </div>
    )
}