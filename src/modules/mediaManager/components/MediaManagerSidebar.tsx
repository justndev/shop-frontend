import {useState} from "react";
import C_old from "@/src/modules/admin/colors";
import NavItem from "@/src/modules/admin/Navitem";
import {useRouter} from "next/navigation";

// ── NAV CONFIG ───────────────────────────────────────────────────────────────
const NAV = [
    {label: "Add media"},
    {label: "Create gallery"},
    {label: "Product image"},
];

export default function MediaManagerSidebar({mobileOpen, onClose, selected, handleSelect}) {
    const content = (
        <div style={{
            width: 220, height: "100%", background: C_old.sidebar,
            display: "flex", flexDirection: "column", paddingTop: 10,
            borderRight: `1px solid ${C_old.border}`,
        }}>
            <div style={{padding: "10px 14px 8px", borderBottom: `1px solid #222527`}}>
        <span
            style={{fontSize: 9, color: C_old.faint, textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: 700}}>
          Action
        </span>
            </div>
            <div style={{flex: 1, overflowY: "auto"}}>
                {NAV.map(item => (
                    <NavItem key={item.label} item={item} selected={selected} onSelect={handleSelect}/>
                ))}
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop permanent */}
            <div style={{ width: 220, flexShrink: 0, height: "100%" }} className="sidebar-desktop">
                {/* Remove the fixed wrapper, just render content directly */}
                {content}
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