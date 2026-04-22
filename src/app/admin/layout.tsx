'use client'

import {useState} from "react";
import Sidebar from "@/src/modules/admin/Sidebar";
import MediaManager from "@/src/modules/media/MediaManager";


export default function AdminLayout({children}) {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div style={{display: "flex", minHeight: "100vh", background: "#0d1117"}}>
            <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)}/>
            <MediaManager/>
            {/* Main */}
            <div style={{flex: 1, marginTop: 48, overflowY: "auto", minHeight: "calc(100vh - 48px)"}}>
                {children}
            </div>
        </div>
    );
}
