
// ── STAT CARD ─────────────────────────────────────────────────────────────────
import CustomIcon from "@/src/modules/admin/CustomIcon";
import icons from "@/src/modules/admin/icons";
import C from "@/src/modules/admin/colors";
import {cardStyles} from "@/src/modules/admin/styles";

export default function StatCard({ s }) {
    return (
        <div style={{ ...cardStyles, padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                    <div style={{ fontSize: 10, color: C.faint, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 4 }}>
                        {s.label}
                    </div>
                    <div style={{ fontSize: 28, fontWeight: 900, color: "#fff", lineHeight: 1 }}>{s.value}</div>
                </div>
                <div style={{
                    width: 36, height: 36, borderRadius: 8, display: "flex",
                    alignItems: "center", justifyContent: "center",
                    background: s.color + "22", color: s.color,
                }}>
                    <CustomIcon d={icons[s.icon]} size={18} color={s.color} />
                </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 12 }}>
                <CustomIcon d={s.up ? icons.up : icons.down} size={12} color={s.up ? "#4caf50" : C.red} />
                <span style={{ fontSize: 11, color: s.up ? "#4caf50" : C.red, fontWeight: 700 }}>{s.change}</span>
                <span style={{ fontSize: 11, color: C.faint }}>vs last month</span>
            </div>
        </div>
    );
}
