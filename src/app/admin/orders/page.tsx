"use client";

import {useState, useEffect, useCallback, useRef} from "react";
import {useRouter} from "next/navigation";
import adminOrdersApi, {OrderListParams} from "@/src/lib/adminOrdersApi";

import ADMIN_PANEL_COLORS from '@/src/modules/admin/colors';
import {Order, OrderItem} from "@/src/utils/types";

const C = ADMIN_PANEL_COLORS;

// ── HELPERS ───────────────────────────────────────────────────────────────────

function formatPrice(price: number, sale?: number | null) {
    const fmt = (n: number) => `€${n.toFixed(2)}`;
    if (sale && sale > 0) {
        return (
            <span style={{display: "flex", flexDirection: "column", gap: 1}}>
        <span style={{textDecoration: "line-through", color: C.textFaint, fontSize: 11}}>{fmt(price)}</span>
        <span style={{color: "#4caf50", fontWeight: 600}}>{fmt(sale)}</span>
      </span>
        );
    }
    return <span style={{color: C.text}}>{fmt(price)}</span>;
}

function StockBadge({status, stock}: { status: string; stock: number }) {
    const map: Record<string, { label: string; color: string; bg: string }> = {
        IN_STOCK: {label: "In stock", color: C.success, bg: C.successBg},
        OUT_OF_STOCK: {label: "Out of stock", color: C.danger, bg: C.dangerBg},
        ON_BACKORDER: {label: "On backorder", color: C.warning, bg: C.warningBg},
    };
    const s = map[status] ?? map.IN_STOCK;
    return (
        <span style={{
            color: s.color,
            background: s.bg,
            padding: "2px 8px",
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 600,
            whiteSpace: "nowrap" as const
        }}>
      {s.label}{stock > 0 ? ` (${stock})` : ""}
    </span>
    );
}

function getStatusColor(status: string) {
    switch (status) {
        case 'PAID':
            return C.success;
        case 'CANCELLED':
        case 'ABORTED':
            return C.danger;
        case 'EXPIRED':
            return C.warning;

        default:
            return C.text;


    }

}

function formatDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString("en-CA") + " at " + d.toLocaleTimeString("en-GB", {hour: "2-digit", minute: "2-digit"});
}

// ── FILTER BAR ────────────────────────────────────────────────────────────────

const selectStyle: React.CSSProperties = {
    background: C.inputBg,
    border: `1px solid ${C.inputBorder}`,
    borderRadius: 4,
    color: C.text,
    fontSize: 12,
    padding: "5px 28px 5px 9px",
    fontFamily: "inherit",
    outline: "none",
    appearance: "none" as const,
    cursor: "pointer",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%238b949e'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 8px center",
};

const btnStyle = (variant: "primary" | "secondary" | "danger" = "secondary"): React.CSSProperties => ({
    background: variant === "primary" ? C.accent : variant === "danger" ? C.dangerBg : C.surfaceAlt,
    border: `1px solid ${variant === "primary" ? C.accent : variant === "danger" ? C.danger : C.inputBorder}`,
    borderRadius: 4,
    color: variant === "primary" ? "#fff" : variant === "danger" ? C.danger : C.text,
    fontSize: 12,
    fontWeight: variant === "primary" ? 700 : 500,
    padding: "5px 12px",
    cursor: "pointer",
    fontFamily: "inherit",
    whiteSpace: "nowrap" as const,
});

// ── HOOK ──────────────────────────────────────────────────────────────────────

function useOrderList() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const [params, setParams] = useState<OrderListParams & { tab: "all" | "paid" | "cancelled" | 'pending' }>({
        tab: "all",
        page: 1,
        limit: 20,
        search: "",
    });

    const [search, setSearch] = useState("");
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [sortBy, setSortBy] = useState<"status" | "createdAt">("createdAt");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

    const searchTimer = useRef<ReturnType<typeof setTimeout>>();

    const fetchOrders = useCallback(async (p: typeof params) => {
        setIsLoading(true);
        try {
            const res = await adminOrdersApi.getAll({
                page: p.page,
                limit: p.limit,
                search: p.search || undefined,
                type: p.tab

            });
            setOrders(res.data);
            setTotal(res.total);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders(params);
    }, [params]);

    // Tabs
    const setTab = (tab: typeof params.tab) =>
        setParams(p => ({...p, tab, page: 1}));

    const setStockFilter = (stockStatus: string) =>
        setParams(p => ({...p, stockStatus: stockStatus as any || undefined, page: 1}));

    // Search (debounced)
    const handleSearchChange = (v: string) => {
        setSearch(v);
        clearTimeout(searchTimer.current);
        searchTimer.current = setTimeout(() => {
            setParams(p => ({...p, search: v, page: 1}));
        }, 350);
    };

    const handleSearchSubmit = () =>
        setParams(p => ({...p, search, page: 1}));

    // Sorting (client-side for current page)
    const sortedOrders = [...orders].sort((a, b) => {
        let av: any, bv: any;
        if (sortBy === "status") { av = a.status; bv = b.status; }
        if (sortBy === "createdAt") { av = a.createdAt; bv = b.createdAt; }
        if (av < bv) return sortDir === "asc" ? -1 : 1;
        if (av > bv) return sortDir === "asc" ? 1 : -1;
        return 0;
    });

    const toggleSort = (col: "status" | "createdAt") => {
        if (sortBy === col) setSortDir(d => d === "asc" ? "desc" : "asc");
        else { setSortBy(col); setSortDir("asc"); }
        console.log(`Sorting by ${col}`)
    };

    // Selection
    const toggleSelect = (id: string) =>
        setSelectedIds(prev => {
            const n = new Set(prev);
            n.has(id) ? n.delete(id) : n.add(id);
            return n;
        });

    const toggleSelectAll = () => {
        if (selectedIds.size === sortedOrders.length) setSelectedIds(new Set());
        else setSelectedIds(new Set(sortedOrders.map(p => p.id)));
    };

    // Bulk actions
    const [bulkAction, setBulkAction] = useState("");

    const applyBulkAction = async () => {
        if (!bulkAction || selectedIds.size === 0) return;
        const ids = [...selectedIds];

        if (bulkAction === "delete") {
            if (!confirm(`Delete ${ids.length} product(s)? This cannot be undone.`)) return;
            await Promise.all(ids.map(id => adminOrdersApi.delete(id)));
        } else if (bulkAction === "publish") {
            await Promise.all(ids.map(id => adminOrdersApi.update(id, {isActive: true})));
        } else if (bulkAction === "draft") {
            await Promise.all(ids.map(id => adminOrdersApi.update(id, {isActive: false})));
        }

        setSelectedIds(new Set());
        setBulkAction("");
        fetchOrders(params);
    };

    // Single item delete
    const deleteOne = async (id: string) => {
        if (!confirm("Delete this product?")) return;
        await adminOrdersApi.delete(id);
        fetchOrders(params);
    };

    // Pagination
    const totalPages = Math.ceil(total / params.limit!);
    const setPage = (page: number) => setParams(p => ({...p, page}));

    return {
        orders: sortedOrders,
        total,
        isLoading,
        params,
        search,
        selectedIds,
        sortBy,
        sortDir,
        bulkAction,
        totalPages,
        setTab,
        setStockFilter,
        handleSearchChange,
        handleSearchSubmit,
        toggleSort,
        toggleSelect,
        toggleSelectAll,
        setBulkAction,
        applyBulkAction,
        deleteOne,
        setPage,
        refresh: () => fetchOrders(params),
    };
}

// ── SORT ICON ─────────────────────────────────────────────────────────────────

function SortIcon({active, dir}: { active: boolean; dir: "asc" | "desc" }) {
    return (
        <svg width="10" height="12" viewBox="0 0 10 12" fill="none" style={{marginLeft: 4, opacity: active ? 1 : 0.3}}>
            <path d="M5 0L9 4H1L5 0Z" fill={active && dir === "asc" ? C.accent : C.textMuted}/>
            <path d="M5 12L1 8H9L5 12Z" fill={active && dir === "desc" ? C.accent : C.textMuted}/>
        </svg>
    );
}

// ── COLUMN HEADER ─────────────────────────────────────────────────────────────

function ColHeader({label, sortKey, currentSort, currentDir, onSort}: {
    label: string;
    sortKey?: "status" | "createdAt";
    currentSort: string;
    currentDir: "asc" | "desc";
    onSort?: (k: "status" | "createdAt") => void;
}) {
    const isActive = sortKey === currentSort;
    return (
        <th
            onClick={() => sortKey && onSort?.(sortKey)}
            style={{
                padding: "10px 12px",
                textAlign: "left" as const,
                fontSize: 12,
                fontWeight: 700,
                color: isActive ? C.accent : C.textMuted,
                cursor: sortKey ? "pointer" : "default",
                whiteSpace: "nowrap" as const,
                userSelect: "none" as const,
                borderBottom: `2px solid ${C.border}`,
                background: C.surfaceAlt,
            }}
        >
            {label}
            {sortKey && <SortIcon active={isActive} dir={currentDir}/>}
        </th>
    );
}

// ── PRODUCT ROW ───────────────────────────────────────────────────────────────

function OrderRow({order, selected, onToggle, onDelete, router}: {
    order: Order;
    selected: boolean;
    onToggle: () => void;
    onDelete: () => void;
    router: ReturnType<typeof useRouter>;
}) {

    const totalProducts = order.items.reduce((sum: number, item: OrderItem) => sum + item.quantity, 0);

    const [hovered, setHovered] = useState(false);


    return (
        <tr
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: selected ? C.accentLight : hovered ? C.surfaceHover : C.surface,
                transition: "background 0.12s",
                cursor: "default",
            }}
        >
            {/* Checkbox */}
            <td style={{padding: "10px 12px", width: 32}}>
                <input
                    type="checkbox"
                    checked={selected}
                    onChange={onToggle}
                />
            </td>


            {/* Id */}
            <td style={{padding: "10px 12px", maxWidth: 320}}>
                <div>
                    <button
                        onClick={() => router.push(`/admin/orders/view?orderId=${order.id}`)}
                        style={{
                            background: "none",
                            border: "none",
                            padding: 0,
                            color: C.textMuted,
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: "pointer",
                            fontFamily: "inherit",
                            textAlign: "left" as const
                        }}
                    >
                        {order.id}
                    </button>
                    {/* Row actions on hover */}
                    <div className='h-5'>
                        {hovered && (
                            <div style={{display: "flex", gap: 8,}}>
                                <button onClick={() => router.push(`/admin/orders/${order.id}/edit`)} style={{
                                    background: "none",
                                    border: "none",
                                    padding: 0,
                                    color: C.accent,
                                    fontSize: 11,
                                    cursor: "pointer",
                                    fontFamily: "inherit"
                                }}>
                                    Edit
                                </button>
                                <span style={{color: C.textFaint, fontSize: 11}}>|</span>
                                <button onClick={() => window.open(`/orders/${order.id}`, "_blank")} style={{
                                    background: "none",
                                    border: "none",
                                    padding: 0,
                                    color: C.textMuted,
                                    fontSize: 11,
                                    cursor: "pointer",
                                    fontFamily: "inherit"
                                }}>
                                    View
                                </button>
                            </div>
                        )}
                    </div>

                </div>
            </td>

            {/* Status */}
            <td style={{padding: "10px 12px", fontSize: 12, fontWeight: 600, color: getStatusColor(order.status)}}>
                {order.status || <span style={{color: C.textFaint}}>–</span>}

            </td>
            {/* Total */}
            <td style={{padding: "10px 12px", fontSize: 13}}>
                {order.totalAmount}
            </td>
            {/* Delivery method */}
            <td style={{padding: "10px 12px", fontSize: 12, color: C.textMuted}}>
                {order.deliveryMethod || <span style={{color: C.textFaint}}>–</span>}
            </td>

            {/* Payment method */}
            <td style={{padding: "10px 12px", fontSize: 12, color: C.textMuted}}>
                {order.mkPaymentMethod || <span style={{color: C.textFaint}}>–</span>}

            </td>


            {/* Items */}
            <td style={{padding: "10px 12px", fontSize: 12, color: C.accent}}>
                {totalProducts}
            </td>


            {/* User */}
            <td style={{padding: "10px 12px", fontSize: 12, color: C.textMuted}}>
                {order.user ?
                    order.user.email
                    :
                    ''
                }

            </td>

            {/* Created */}
            <td style={{padding: "10px 12px", fontSize: 11, color: C.textMuted, whiteSpace: "nowrap" as const}}>
                <div style={{fontSize: 10, color: C.textFaint, marginBottom: 1}}>Created</div>
                {formatDate(order.createdAt)}

            </td>
        </tr>
    );
}

// ── PAGINATION ────────────────────────────────────────────────────────────────

function Pagination({page, totalPages, onPage}: { page: number; totalPages: number; onPage: (p: number) => void }) {
    if (totalPages <= 1) return null;

    const pages = Array.from({length: Math.min(totalPages, 7)}, (_, i) => {
        if (totalPages <= 7) return i + 1;
        if (page <= 4) return i + 1;
        if (page >= totalPages - 3) return totalPages - 6 + i;
        return page - 3 + i;
    });

    return (
        <div style={{display: "flex", alignItems: "center", gap: 4}}>
            <button onClick={() => onPage(page - 1)} disabled={page === 1}
                    style={{...btnStyle(), opacity: page === 1 ? 0.4 : 1}}>‹
            </button>
            {pages.map(p => (
                <button key={p} onClick={() => onPage(p)}
                        style={{...btnStyle(p === page ? "primary" : "secondary"), minWidth: 32, padding: "5px 8px"}}>
                    {p}
                </button>
            ))}
            <button onClick={() => onPage(page + 1)} disabled={page === totalPages}
                    style={{...btnStyle(), opacity: page === totalPages ? 0.4 : 1}}>›
            </button>
        </div>
    );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────

export default function ProductsListPage() {
    const router = useRouter();
    const list = useOrderList();

    const tabCounts: Record<string, number> = {
        all: list.total,
        paid: list.orders.filter(o => o.status === 'PAID').length,
        cancelled: list.orders.filter(o => o.status !== 'PAID' && o.status !== 'PENDING').length,
    };

    const TABS: { id: "all" | "paid" | "cancelled" | "pending"; label: string }[] = [
        {id: "all", label: "All"},
        {id: "paid", label: "Paid"},
        {id: "cancelled", label: "Cancelled"},
        {id: "pending", label: "Pending"},

    ];

    return (
        <div style={{
            minHeight: "100vh",
            background: C.bg,
            color: C.text,
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        }}>

            {/* ── Page header ─────────────────────────────────────────────────────── */}
            <div style={{padding: "20px 24px 0", borderBottom: `1px solid ${C.border}`, background: C.surface}}>
                <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12}}>
                    <h1 style={{margin: 0, fontSize: 22, fontWeight: 700}}>Orders</h1>
                    <div style={{display: "flex", gap: 8}}>
                        <button style={btnStyle("secondary")}>Export</button>
                        {/*<button*/}
                        {/*    onClick={() => router.push("/admin/products/add")}*/}
                        {/*    style={btnStyle("primary")}*/}
                        {/*>*/}
                        {/*    + Add new product*/}
                        {/*</button>*/}
                    </div>
                </div>

                {/* Tabs */}
                <div style={{display: "flex", gap: 0}}>
                    {TABS.map((tab, i) => (
                        <div key={tab.id} style={{display: "flex", alignItems: "center"}}>
                            <button
                                onClick={() => list.setTab(tab.id)}
                                style={{
                                    background: "none", border: "none",
                                    borderBottom: list.params.tab === tab.id ? `2px solid ${C.accent}` : "2px solid transparent",
                                    color: list.params.tab === tab.id ? C.text : C.textMuted,
                                    fontSize: 13, fontWeight: list.params.tab === tab.id ? 600 : 400,
                                    padding: "8px 12px", cursor: "pointer", fontFamily: "inherit",
                                    transition: "all 0.12s",
                                }}
                            >
                                {tab.label}
                                <span style={{marginLeft: 4, color: C.textFaint, fontSize: 12}}>
                                    ({tabCounts[tab.id] ?? 0})
                                </span>
                            </button>
                            {i < TABS.length - 1 &&
                                <span style={{color: C.textFaint, fontSize: 12, padding: "0 2px"}}>|</span>}
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Filter bar ──────────────────────────────────────────────────────── */}
            <div style={{
                padding: "12px 24px",
                background: C.surface,
                borderBottom: `1px solid ${C.border}`,
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexWrap: "wrap" as const
            }}>
                <div style={{width: 1, height: 22, background: C.border, margin: "0 4px"}}/>

                {/* Order status filter */}
                <select style={selectStyle} onChange={e => list.setStockFilter(e.target.value)}>
                    <option value="">Filter by status</option>
                    <option value="PAID">Paid</option>
                    <option value="PENDING">Pending</option>
                    <option value="EXPIRED">Expired</option>
                    <option value="CANCELLED">Cancelled</option>

                </select>

                <button style={{...btnStyle("primary"), marginLeft: 2}}>Filter</button>

                {/* Spacer */}
                <div style={{flex: 1}}/>

                {/* Search */}
                <div style={{display: "flex", gap: 6}}>
                    <input
                        type="search"
                        placeholder="Search orders…"
                        value={list.search}
                        onChange={e => list.handleSearchChange(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && list.handleSearchSubmit()}
                        style={{
                            background: C.inputBg, border: `1px solid ${C.inputBorder}`,
                            borderRadius: 4, color: C.text, fontSize: 12,
                            padding: "5px 10px", fontFamily: "inherit", outline: "none", width: 220,
                        }}
                    />
                    <button onClick={list.handleSearchSubmit} style={btnStyle("primary")}>
                        Search orders
                    </button>
                </div>
            </div>

            {/* ── Table ───────────────────────────────────────────────────────────── */}
            <div style={{padding: "16px 24px"}}>
                {/* Top pagination + count */}
                <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10}}>
          <span style={{fontSize: 12, color: C.textFaint}}>
            {list.total > 0 ? `${list.total} item${list.total !== 1 ? "s" : ""}` : ""}
          </span>
                    <Pagination page={list.params.page!} totalPages={list.totalPages} onPage={list.setPage}/>
                </div>

                <div style={{
                    background: C.surface,
                    border: `1px solid ${C.border}`,
                    borderRadius: 8,
                    overflow: "hidden"
                }}>
                    <table style={{width: "100%", borderCollapse: "collapse" as const}}>
                        <thead>
                        <tr>
                            {/* Select all */}
                            <th style={{
                                padding: "10px 12px",
                                width: 32,
                                background: C.surfaceAlt,
                                borderBottom: `2px solid ${C.border}`
                            }}>
                                <input
                                    type="checkbox"
                                    checked={list.selectedIds.size > 0 && list.selectedIds.size === list.orders.length}
                                    ref={el => {
                                        if (el) el.indeterminate = list.selectedIds.size > 0 && list.selectedIds.size < list.orders.length;
                                    }}
                                    onChange={list.toggleSelectAll}
                                />

                            </th>
                            {/* Thumb col */}
                            <ColHeader label="ID" currentSort={list.sortBy} currentDir={list.sortDir}
                            />
                            <ColHeader label="Status" sortKey='status' currentSort={list.sortBy}
                                       currentDir={list.sortDir}
                                       onSort={list.toggleSort}   // ← add this
                            />
                            <ColHeader label="Total Amount" currentSort={list.sortBy} currentDir={list.sortDir}/>
                            <ColHeader label="Delivery" currentSort={list.sortBy} currentDir={list.sortDir}
                            />
                            <ColHeader label="Payment" currentSort={list.sortBy} currentDir={list.sortDir}/>
                            <ColHeader label="Items" currentSort={list.sortBy} currentDir={list.sortDir}/>

                            <ColHeader label="User" currentSort={list.sortBy} currentDir={list.sortDir}
                            />

                            <ColHeader label="Date" sortKey="createdAt" currentSort={list.sortBy}
                                       currentDir={list.sortDir}
                                       onSort={list.toggleSort}
                            />
                        </tr>
                        </thead>

                        <tbody>
                        {list.isLoading ? (
                            <tr>
                                <td colSpan={10} style={{
                                    padding: 40,
                                    textAlign: "center" as const,
                                    color: C.textMuted,
                                    fontSize: 14
                                }}>
                                    Loading…
                                </td>
                            </tr>
                        ) : list.orders.length === 0 ? (
                            <tr>
                                <td colSpan={10} style={{
                                    padding: 48,
                                    textAlign: "center" as const,
                                    color: C.textMuted,
                                    fontSize: 14
                                }}>
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={C.textFaint}
                                         strokeWidth="1" style={{display: "block", margin: "0 auto 12px"}}>
                                        <rect x="2" y="7" width="20" height="14" rx="2"/>
                                        <path d="M16 3H8L2 7h20l-6-4z"/>
                                    </svg>
                                    No orders found.{" "}

                                </td>
                            </tr>
                        ) : (
                            list.orders.map(order => (
                                <OrderRow
                                    key={order.id}
                                    order={order}
                                    selected={list.selectedIds.has(order.id)}
                                    onToggle={() => list.toggleSelect(order.id)}
                                    onDelete={() => list.deleteOne(order.id)}
                                    router={router}
                                />
                            ))
                        )}
                        </tbody>
                    </table>
                </div>

                {/* Bottom pagination */}
                <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12}}>
          <span style={{fontSize: 12, color: C.textFaint}}>
            {list.total > 0 && `${list.total} item${list.total !== 1 ? "s" : ""}`}
          </span>
                    <Pagination page={list.params.page!} totalPages={list.totalPages} onPage={list.setPage}/>
                </div>
            </div>

            {/* ── Selection bar (floating, when items selected) ────────────────────── */}
            {list.selectedIds.size > 0 && (
                <div style={{
                    position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
                    background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8,
                    padding: "10px 20px", display: "flex", alignItems: "center", gap: 12,
                    boxShadow: "0 4px 24px rgba(0,0,0,0.4)", zIndex: 100,
                }}>
          <span style={{fontSize: 13, color: C.text, fontWeight: 600}}>
            {list.selectedIds.size} selected
          </span>
                    <button onClick={() => {
                        list.setBulkAction("publish");
                        list.applyBulkAction();
                    }} style={btnStyle()}>Publish
                    </button>
                    <button onClick={() => {
                        list.setBulkAction("draft");
                        list.applyBulkAction();
                    }} style={btnStyle()}>Draft
                    </button>
                    <button onClick={() => {
                        list.setBulkAction("delete");
                        list.applyBulkAction();
                    }} style={btnStyle("danger")}>Delete
                    </button>
                    <button
                        onClick={() => list.toggleSelectAll()}
                        style={{
                            background: "none",
                            border: "none",
                            color: C.textMuted,
                            cursor: "pointer",
                            fontSize: 18,
                            padding: "0 4px",
                            fontFamily: "inherit"
                        }}
                    >
                        ×
                    </button>
                </div>
            )}
        </div>
    );
}