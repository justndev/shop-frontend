'use client'

import { useState } from "react";
import TopHeader from "@/src/modules/admin/TopHeader";
import Sidebar from "@/src/modules/admin/Sidebar";


export default function AdminLayout({children}) {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;700;900&family=Barlow+Condensed:wght@700;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body, #root { background: #0d1117; min-height: 100vh; font-family: 'Barlow', sans-serif; }

        .nav-item:hover { background: #222527 !important; }
        .nav-child:hover { background: #1a1c1e; color: #fff !important; }
        .table-row:hover { background: #1f2124; }
        .quick-item:hover { background: #222527; color: #fff !important; }
        .header-link:hover { background: #2d3035; color: #fff !important; }

        /* Responsive grid */
        .grid-4 { grid-template-columns: repeat(4, 1fr); }
        .grid-main { grid-template-columns: 2fr 1fr; }
        .grid-3 { grid-template-columns: repeat(3, 1fr); }

        @media (max-width: 1024px) {
          .grid-4 { grid-template-columns: repeat(2, 1fr) !important; }
          .grid-3 { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .sidebar-desktop { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          .header-search { display: none !important; }
          .header-user { display: none !important; }
          .grid-4 { grid-template-columns: 1fr !important; }
          .grid-main { grid-template-columns: 1fr !important; }
          .grid-3 { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 769px) {
          .sidebar-mobile-overlay { display: none !important; }
        }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
      `}</style>
            <div style={{ display: "flex", minHeight: "100vh", background: "#0d1117" }}>
                <TopHeader onMenuClick={() => setMobileOpen(o => !o)} />
                <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

                {/* Main */}
                <div style={{ flex: 1, marginTop: 48, overflowY: "auto", minHeight: "calc(100vh - 48px)" }}>
                    {children}
                </div>
            </div>
        </>
    );
}