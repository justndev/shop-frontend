
// ── TOP HEADER ───────────────────────────────────────────────────────────────
import CustomIcon from "@/src/modules/admin/CustomIcon";
import icons from "@/src/modules/admin/icons";
import C_old from "@/src/modules/admin/colors";


export default function TopHeader({ onMenuClick }) {
    return (
        <div style={{
            position: "fixed", top: 0, left: 0, right: 0, height: 48, zIndex: 1200,
            background: C_old.header, borderBottom: `1px solid ${C_old.border}`,
            display: "flex", alignItems: "center", padding: "0 12px", gap: 8,
        }}>
            {/* Mobile menu toggle */}
            <button onClick={onMenuClick} style={{
                display: "none", background: "none", border: "none", color: C_old.sub, cursor: "pointer",
                padding: 6, borderRadius: 4,
            }} className="mobile-menu-btn">
                <CustomIcon d={icons.menu} size={18} />
            </button>

            {/* Logo */}
            <span style={{ fontWeight: 900, fontSize: 18, color: "#fff", letterSpacing: -0.5, whiteSpace: "nowrap" }}>
        AUTO<span style={{ color: C_old.red }}>PARTS</span>
        <span style={{ fontSize: 10, color: C_old.faint, fontWeight: 400, marginLeft: 6 }}>Admin</span>
      </span>

            {/* Site badge */}
            <div style={{
                display: "flex", alignItems: "center", gap: 6,
                background: C_old.muted, padding: "3px 10px", borderRadius: 4, cursor: "pointer",
            }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#4caf50" }} />
                <span style={{ fontSize: 11, color: "#bbb" }}>Auto Parts</span>
            </div>

            {["9 Updates", "0 Comments"].map(l => (
                <span key={l} style={{ fontSize: 11, color: C_old.sub, padding: "3px 8px", borderRadius: 4, cursor: "pointer" }}
                      className="header-link">{l}</span>
            ))}

            <div style={{ flex: 1 }} />

            {/* Search */}
            <div style={{
                display: "flex", alignItems: "center", gap: 6,
                background: C_old.muted, padding: "4px 10px", borderRadius: 4, marginRight: 4,
            }} className="header-search">
                <CustomIcon d={icons.search} size={14} color={C_old.faint} />
                <input placeholder="Search..." style={{
                    background: "none", border: "none", outline: "none",
                    color: C_old.sub, fontSize: 12, width: 120,
                }} />
            </div>

            {/* Icons */}
            {["bell", "settings"].map(k => (
                <button key={k} style={{ background: "none", border: "none", color: C_old.sub, cursor: "pointer", padding: 6, borderRadius: 4, position: "relative" }}>
                    <CustomIcon d={icons[k]} size={16} />
                    {k === "bell" && (
                        <span style={{
                            position: "absolute", top: 2, right: 2, width: 14, height: 14,
                            background: C_old.red, borderRadius: "50%", fontSize: 9, color: "#fff",
                            display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700,
                        }}>3</span>
                    )}
                </button>
            ))}

            {/* Avatar */}
            <div style={{
                width: 28, height: 28, borderRadius: "50%", background: C_old.red,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700, color: "#fff", marginLeft: 4,
            }}>A</div>
            <span style={{ fontSize: 11, color: "#bbb" }} className="header-user">Howdy, admin</span>
        </div>
    );
}