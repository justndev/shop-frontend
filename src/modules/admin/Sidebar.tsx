import {useState} from "react";
import C_old from "@/src/modules/admin/colors";
import NavItem from "@/src/modules/admin/Navitem";
import {useRouter} from "next/navigation";

// ── NAV CONFIG ───────────────────────────────────────────────────────────────
const NAV = [
    {label: "Dashboard", icon: "dash"},
    {label: "Shop", icon: "shop", children: ["Orders", "Coupons", "Reports"]},
    {label: "Products", icon: "product", children: [
            {label: "All Products", slug: 'products'},
            {label: "Add Product", slug: 'products/add'},
            {label: "Categories", slug: 'categories'},
            {label:  "Tags", slug: 'tags'},
        ]},
    {label: "Orders", icon: "order"},
    {label: "Media", icon: "media"},
    {label: "Customers", icon: "people"},
    {label: "Analytics", icon: "chart"},
    {label: "Marketing", icon: "campaign"},
    {label: "Payments", icon: "payment", badge: 1},
    {label: "Database", icon: "db"},
    {label: "Categories", icon: "category"},
    {label: "Plugins", icon: "plugin", badge: 7},
    {label: "Appearance", icon: "palette"},
    {label: "Tools", icon: "tool"},
    {label: "Settings", icon: "settings"},
];

export default function Sidebar({mobileOpen, onClose}) {
    const [selected, setSelected] = useState("Dashboard");
    const router = useRouter();

    function handleSelect(label: string) {
        setSelected(label);

        const formattedLabel = label
            .toLowerCase()
            .replace(/\s+/g, "-");

        router.push(`/admin/${formattedLabel}`);
    }

    const content = (
        <div style={{
            width: 220, height: "100%", background: C_old.sidebar,
            display: "flex", flexDirection: "column", paddingTop: 48,
            borderRight: `1px solid ${C_old.border}`,
        }}>
            <div style={{padding: "10px 14px 8px", borderBottom: `1px solid #222527`}}>
        <span
            style={{fontSize: 9, color: C_old.faint, textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: 700}}>
          Navigation
        </span>
            </div>
            <div style={{flex: 1, overflowY: "auto"}}>
                {NAV.map((item, index) => (
                    <NavItem key={index} item={item} selected={selected} onSelect={handleSelect}/>
                ))}
            </div>
            <div style={{
                padding: "10px 14px",
                borderTop: `1px solid #222527`,
                fontSize: 10,
                color: "#333",
                textAlign: "center"
            }}>
                AutoParts v1.0.0
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop permanent */}
            <div style={{width: 220, flexShrink: 0}} className="sidebar-desktop">
                <div style={{position: "fixed", top: 0, bottom: 0, width: 220}}>
                    {content}
                </div>
            </div>

            {/* Mobile overlay */}
            {mobileOpen && (
                <div style={{position: "fixed", inset: 0, zIndex: 1100}} className="sidebar-mobile-overlay">
                    <div style={{
                        position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)",
                    }} onClick={onClose}/>
                    <div style={{position: "absolute", top: 0, bottom: 0, left: 0, width: 220}}>
                        {content}
                    </div>
                </div>
            )}
        </>
    );
}