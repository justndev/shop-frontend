import {useState} from "react";
import CustomIcon from "@/src/modules/admin/CustomIcon";
import icons from "@/src/modules/admin/icons";
import C from "@/src/modules/admin/colors";


export default function NavItem({ item, selected, onSelect }) {
    const [open, setOpen] = useState(false);
    const isSel = selected === item.label;

    return (
        <div>
            <div
                onClick={() => item.children ? setOpen(o => !o) : onSelect(item.label)}
                style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "7px 14px",
                    background: isSel ? C.red : "transparent",
                    borderLeft: `3px solid ${isSel ? "#ff4444" : "transparent"}`,
                    cursor: "pointer", userSelect: "none",
                    transition: "background 0.15s",
                }}
                className={isSel ? "" : "nav-item"}
            >
                {item.icon && <CustomIcon d={icons[item.icon] || icons.settings} size={15} color={isSel ? "#fff" : C.sub}/>
                }                <span style={{ flex: 1, fontSize: 12, fontWeight: isSel ? 700 : 500, color: isSel ? "#fff" : "#ccc" }}>
          {item.label}
        </span>
                {item.badge && (
                    <span style={{
                        background: C.red, color: "#fff", borderRadius: "50%",
                        width: 18, height: 18, fontSize: 10, fontWeight: 700,
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}>{item.badge}</span>
                )}
                {item.children && (
                    <CustomIcon d={open ? "M18 15l-6-6-6 6" : icons.chevron} size={12} color={C.faint} />
                )}
            </div>
            {item.children && open && (
                <div style={{ background: "#0d1117" }}>
                    {item.children.map(child => (
                        <div key={child}
                             onClick={() => onSelect(child)}
                             style={{ padding: "6px 14px 6px 40px", fontSize: 11, color: C.sub, cursor: "pointer" }}
                             className="nav-child"
                        >{child}</div>
                    ))}
                </div>
            )}
        </div>
    );
}