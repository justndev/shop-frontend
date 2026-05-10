'use client'

import {useState} from "react";
import Sidebar from "@/src/modules/admin/Sidebar";
import MediaManager from "@/src/modules/media/MediaManager";


export default function AdminLayout({children}) {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div style={{display: "flex", minHeight: "100vh", }}>
            <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)}/>
            <MediaManager/>
            {/* Main */}
            <div style={{flex: 1,}}>
                {children}
            </div>
        </div>
    );
}
