'use client'

import StatCard from "@/src/modules/admin/StatCard";
import icons from "@/src/modules/admin/icons";
import C from "@/src/modules/admin/colors";
import CustomIcon from "@/src/modules/admin/CustomIcon";
import {cardStyles} from "@/src/modules/admin/styles";
import MediaManager from "@/src/modules/mediaManager/MediaManager";

// ── MOCK DATA ─────────────────────────────────────────────────────────────────
const STATS = [
    { label: "Total Revenue", value: "€ 48,295", change: "+12.4%", up: true,  color: C.red,      icon: "payment" },
    { label: "Orders",        value: "1,284",    change: "+8.1%",  up: true,  color: "#2196f3",  icon: "order" },
    { label: "Customers",     value: "3,920",    change: "+5.3%",  up: true,  color: "#4caf50",  icon: "people" },
    { label: "Products",      value: "500K+",    change: "-2.1%",  up: false, color: "#ff9800",  icon: "product" },
];

const ORDERS = [
    { id: "#4821", customer: "Mikhail S.", product: "Brake Pads BMW E46",    status: "Completed",  amount: "€ 42.90" },
    { id: "#4820", customer: "Andrei K.", product: "Oil Filter Toyota",      status: "Processing", amount: "€ 12.50" },
    { id: "#4819", customer: "Pavel R.",  product: "Shock Absorber Audi A4", status: "Pending",    amount: "€ 89.00" },
    { id: "#4818", customer: "Elena M.",  product: "Air Filter Ford Focus",  status: "Shipped",    amount: "€ 18.30" },
    { id: "#4817", customer: "Dmitri V.", product: "Spark Plugs VW Golf",    status: "Completed",  amount: "€ 24.80" },
];

const STATUS_COLOR = { Completed: "#4caf50", Processing: "#2196f3", Pending: "#ff9800", Shipped: "#9c27b0" };

const LOW_STOCK = [
    { name: "Bosch Oil Filter F026",          stock: 3,  max: 50 },
    { name: "NGK Spark Plug BKR6E",           stock: 5,  max: 100 },
    { name: "Mann Air Filter C 26 168",       stock: 2,  max: 40 },
    { name: "Brembo Brake Disc 09.A326.11",   stock: 7,  max: 30 },
];

const QUICK = [
    { title: "Top Categories", emoji: "📦", items: ["Engine — 412 products", "Suspension — 354", "Brakes — 289", "Electric — 231"] },
    { title: "Deliveries",     emoji: "🚚", items: ["Omniva Parcel — 621", "DPD Express — 438", "Courier — 225", "Pickup — 0 pending"] },
    { title: "Quick Actions",  emoji: "⚡", items: ["Add new product", "Process pending orders", "Export sales report", "Manage coupons"] },
];


// ── DASHBOARD CONTENT ─────────────────────────────────────────────────────────
export default function DashboardMainPage() {
    return (
        <div style={{ padding: 20 }}>
            {/* Title */}
            <MediaManager/>

            <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: "#fff" }}>Dashboard</div>
                <div style={{ fontSize: 12, color: C.sub }}>Welcome back, Admin. Here's what's happening today.</div>
            </div>

            {/* Stats grid */}
            <div className="grid-4" style={{ display: "grid", gap: 12, marginBottom: 16 }}>
                {STATS.map(s => <StatCard key={s.label} s={s} />)}
            </div>

            {/* Orders + Low Stock */}
            <div className="grid-main" style={{ display: "grid", gap: 12, marginBottom: 16 }}>
                {/* Orders table */}
                <div style={cardStyles}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: `1px solid ${C.border}` }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Recent Orders</span>
                        <span style={{ fontSize: 11, color: C.red, cursor: "pointer", fontWeight: 600 }}>View all →</span>
                    </div>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                        <tr>
                            {["Order", "Customer", "Product", "Status", "Amount"].map(h => (
                                <th key={h} style={{ fontSize: 10, color: C.faint, textTransform: "uppercase", letterSpacing: "1px", textAlign: "left", padding: "8px 16px", borderBottom: `1px solid ${C.border}` }}>
                                    {h}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {ORDERS.map(o => (
                            <tr key={o.id} className="table-row" style={{ cursor: "pointer" }}>
                                <td style={{ padding: "10px 16px", fontSize: 12, color: C.red, fontWeight: 700, borderBottom: `1px solid #1a1c1e` }}>{o.id}</td>
                                <td style={{ padding: "10px 16px", fontSize: 12, color: "#ccc", borderBottom: `1px solid #1a1c1e` }}>{o.customer}</td>
                                <td style={{ padding: "10px 16px", fontSize: 12, color: C.sub, borderBottom: `1px solid #1a1c1e`, maxWidth: 160, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{o.product}</td>
                                <td style={{ padding: "10px 16px", borderBottom: `1px solid #1a1c1e` }}>
                    <span style={{
                        fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4,
                        background: STATUS_COLOR[o.status] + "22", color: STATUS_COLOR[o.status],
                        border: `1px solid ${STATUS_COLOR[o.status]}44`,
                    }}>{o.status}</span>
                                </td>
                                <td style={{ padding: "10px 16px", fontSize: 12, color: "#fff", fontWeight: 700, borderBottom: `1px solid #1a1c1e` }}>{o.amount}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Low Stock */}
                <div style={cardStyles}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: `1px solid ${C.border}` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <CustomIcon d={icons.warn} size={15} color="#ff9800" />
                            <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Low Stock</span>
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: "#ff980022", color: "#ff9800" }}>
              {LOW_STOCK.length}
            </span>
                    </div>
                    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
                        {LOW_STOCK.map(item => (
                            <div key={item.name}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                    <span style={{ fontSize: 11, color: "#ccc" }}>{item.name}</span>
                                    <span style={{ fontSize: 11, color: "#ff9800", fontWeight: 700 }}>{item.stock}</span>
                                </div>
                                <div style={{ height: 4, borderRadius: 2, background: C.border, overflow: "hidden" }}>
                                    <div style={{
                                        height: "100%", borderRadius: 2,
                                        width: `${(item.stock / item.max) * 100}%`,
                                        background: item.stock < 5 ? C.red : "#ff9800",
                                    }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom 3-col grid */}
            <div className="grid-3" style={{ display: "grid", gap: 12 }}>
                {QUICK.map(block => (
                    <div key={block.title} style={cardStyles}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderBottom: `1px solid ${C.border}` }}>
                            <span style={{ fontSize: 16 }}>{block.emoji}</span>
                            <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{block.title}</span>
                        </div>
                        <div style={{ padding: 8 }}>
                            {block.items.map((item, i) => (
                                <div key={i} className="quick-item" style={{ padding: "8px 10px", borderRadius: 4, cursor: "pointer", fontSize: 12, color: C.sub }}>
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
