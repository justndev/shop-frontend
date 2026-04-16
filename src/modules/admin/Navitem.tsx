import {useState} from "react";
import CustomIcon from "@/src/modules/admin/CustomIcon";
import icons from "@/src/modules/admin/icons";
import C_old from "@/src/modules/admin/colors";


export default function NavItem({ item, selected, onSelect }) {
    const [open, setOpen] = useState(false);
    const isSel = selected === item.label;

    return (
        <div>
            <div
                onClick={() => item.children ? setOpen(o => !o) : onSelect(item.slug ?? item.label)}
                style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "7px 14px",
                    background: isSel ? C_old.red : "transparent",
                    borderLeft: `3px solid ${isSel ? "#ff4444" : "transparent"}`,
                    cursor: "pointer", userSelect: "none",
                    transition: "background 0.15s",
                }}
                className={isSel ? "" : "nav-item"}
            >
                {item.icon && <CustomIcon d={icons[item.icon] || icons.settings} size={15} color={isSel ? "#fff" : C_old.sub}/>
                }                <span style={{ flex: 1, fontSize: 12, fontWeight: isSel ? 700 : 500, color: isSel ? "#fff" : "#ccc" }}>
          {item.label}
        </span>
                {item.badge && (
                    <span style={{
                        background: C_old.red, color: "#fff", borderRadius: "50%",
                        width: 18, height: 18, fontSize: 10, fontWeight: 700,
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}>{item.badge}</span>
                )}
                {item.children && (
                    <CustomIcon d={open ? "M18 15l-6-6-6 6" : icons.chevron} size={12} color={C_old.faint} />
                )}
            </div>
            {item.children && open && (
                <div style={{ background: "#0d1117" }}>
                    {item.children.map(child => (
                        <div key={child.label}
                             onClick={() => onSelect(child.slug ?? child.label)}
                             style={{ padding: "6px 14px 6px 40px", fontSize: 11, color: C_old.sub, cursor: "pointer" }}
                             className="nav-child"
                        >{child.label}</div>
                    ))}
                </div>
            )}
        </div>
    );
}