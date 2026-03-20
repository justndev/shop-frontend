"use client"

import { useState, useEffect, useCallback } from "react"
import { adminOrderApi, AdminOrder, OrderStatus } from "@/src/api/paymentApi"

const C = {
    bg: "#1a1d1e", surface: "#22262a", surfaceAlt: "#1e2226",
    surfaceHover: "#252b30", border: "#2e3338", text: "#e8eaed",
    textMuted: "#8b949e", textFaint: "#545d67", accent: "#2271b1",
    inputBg: "#161b1f", inputBorder: "#3d444d",
    success: "#1a7f37", successBg: "rgba(26,127,55,0.12)",
    warning: "#9a6700", warningBg: "rgba(154,103,0,0.12)",
    danger: "#d63638", dangerBg: "rgba(214,54,56,0.10)",
    pending: "#6366f1", pendingBg: "rgba(99,102,241,0.12)",
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; icon: string }> = {
    PAID:      { label: "Оплачен",    color: C.success, bg: C.successBg, icon: "✓" },
    PENDING:   { label: "Ожидание",   color: C.pending, bg: C.pendingBg, icon: "⏳" },
    CANCELLED: { label: "Отменён",    color: C.danger,  bg: C.dangerBg,  icon: "✗" },
    FAILED:    { label: "Ошибка",     color: C.danger,  bg: C.dangerBg,  icon: "!" },
}

const DELIVERY_LABELS: Record<string, string> = {
    omniva: "📦 Omniva", dpd: "🚚 DPD курьер",
    dpd_parcel: "📫 DPD пакомат", pickup: "🏪 Самовывоз",
}

const PAYMENT_LABELS: Record<string, string> = {
    swedbank: "Swedbank", seb: "SEB", lhv: "LHV", coop: "Coop",
    card: "Карта", google_pay: "Google Pay", apple_pay: "Apple Pay",
    luminor_ee: "Luminor", indivy: "Indivy",
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })
}

function StatusBadge({ status }: { status: OrderStatus }) {
    const s = STATUS_CONFIG[status]
    return (
        <span style={{ color: s.color, background: s.bg, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" as const }}>
      {s.icon} {s.label}
    </span>
    )
}

const selectStyle: React.CSSProperties = {
    background: C.inputBg, border: `1px solid ${C.inputBorder}`,
    borderRadius: 4, color: C.text, fontSize: 12,
    padding: "6px 28px 6px 9px", fontFamily: "inherit", outline: "none",
    appearance: "none" as const, cursor: "pointer",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%238b949e'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center",
}

// ── ORDER DETAIL MODAL ────────────────────────────────────────────────────────

function OrderDetailModal({ order, onClose, onStatusUpdate }: {
    order: AdminOrder
    onClose: () => void
    onStatusUpdate: (id: string, status: OrderStatus) => void
}) {
    const [updatingStatus, setUpdatingStatus] = useState(false)
    const contact = order.contactInfo

    async function handleStatusChange(status: OrderStatus) {
        setUpdatingStatus(true)
        try {
            await adminOrderApi.updateStatus(order.id, status)
            onStatusUpdate(order.id, status)
        } finally {
            setUpdatingStatus(false)
        }
    }

    return (
        <div
            onClick={onClose}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, backdropFilter: "blur(4px)" }}
        >
            <div
                onClick={e => e.stopPropagation()}
                style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, width: "100%", maxWidth: 640, maxHeight: "85vh", overflow: "auto" }}
            >
                {/* Header */}
                <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: C.surfaceAlt }}>
                    <div>
                        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: C.text }}>Заказ #{order.id.slice(0, 8).toUpperCase()}</h3>
                        <p style={{ margin: "2px 0 0", fontSize: 12, color: C.textMuted }}>{formatDate(order.createdAt)}</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <StatusBadge status={order.status} />
                        <button onClick={onClose} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 20, padding: 4 }}>×</button>
                    </div>
                </div>

                <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 18 }}>
                    {/* Customer */}
                    <div style={{ background: C.surfaceAlt, borderRadius: 8, padding: 14 }}>
                        <div style={{ fontSize: 10, color: C.textFaint, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 10 }}>Покупатель</div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 13 }}>
                            <div><span style={{ color: C.textMuted }}>Имя: </span><span style={{ color: C.text }}>{contact?.firstName} {contact?.lastName}</span></div>
                            <div><span style={{ color: C.textMuted }}>Email: </span><span style={{ color: C.text }}>{contact?.email || order.user.email}</span></div>
                            <div><span style={{ color: C.textMuted }}>Телефон: </span><span style={{ color: C.text }}>{contact?.phone || "—"}</span></div>
                            <div><span style={{ color: C.textMuted }}>Аккаунт: </span><span style={{ color: C.accent }}>{order.user.email}</span></div>
                        </div>
                        {contact?.note && <div style={{ marginTop: 8, fontSize: 12, color: C.textMuted, fontStyle: "italic" }}>"{contact.note}"</div>}
                    </div>

                    {/* Items */}
                    <div>
                        <div style={{ fontSize: 10, color: C.textFaint, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 10 }}>Товары</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            {order.items.map(item => (
                                <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 10, background: C.surfaceAlt, borderRadius: 6, padding: "8px 12px" }}>
                                    <div style={{ width: 32, height: 32, borderRadius: 4, overflow: "hidden", background: C.bg, flexShrink: 0 }}>
                                        {item.product?.images?.[0]
                                            ? <img src={item.product.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                            : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🔧</div>
                                        }
                                    </div>
                                    <div style={{ flex: 1, fontSize: 13, color: C.text }}>{item.name}</div>
                                    <div style={{ fontSize: 12, color: C.textMuted }}>× {item.quantity}</div>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{(item.price * item.quantity).toFixed(2)} €</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Payment + Delivery */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <div style={{ background: C.surfaceAlt, borderRadius: 8, padding: 12 }}>
                            <div style={{ fontSize: 10, color: C.textFaint, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8 }}>Оплата</div>
                            <div style={{ fontSize: 13, color: C.text }}>{PAYMENT_LABELS[order.mkPaymentMethod || ""] || order.mkPaymentMethod || "—"}</div>
                            {order.mkTransactionId && <div style={{ fontSize: 11, color: C.textFaint, marginTop: 4, wordBreak: "break-all" }}>TXN: {order.mkTransactionId}</div>}
                        </div>
                        <div style={{ background: C.surfaceAlt, borderRadius: 8, padding: 12 }}>
                            <div style={{ fontSize: 10, color: C.textFaint, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8 }}>Доставка</div>
                            <div style={{ fontSize: 13, color: C.text }}>{DELIVERY_LABELS[order.deliveryMethod || ""] || order.deliveryMethod || "—"}</div>
                            <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{order.deliveryPrice === 0 ? "Бесплатно" : `${order.deliveryPrice?.toFixed(2)} €`}</div>
                        </div>
                    </div>

                    {/* Total */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderTop: `1px solid ${C.border}` }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Итого</span>
                        <span style={{ fontSize: 22, fontWeight: 800, color: C.text }}>{order.totalAmount.toFixed(2)} €</span>
                    </div>

                    {/* Status update */}
                    <div style={{ display: "flex", gap: 8 }}>
                        <span style={{ fontSize: 13, color: C.textMuted, alignSelf: "center" }}>Изменить статус:</span>
                        {(["PAID", "PENDING", "CANCELLED"] as OrderStatus[]).map(s => {
                            const cfg = STATUS_CONFIG[s]
                            const isCurrent = order.status === s
                            return (
                                <button
                                    key={s}
                                    onClick={() => !isCurrent && handleStatusChange(s)}
                                    disabled={isCurrent || updatingStatus}
                                    style={{
                                        background: isCurrent ? cfg.bg : C.surfaceAlt,
                                        border: `1px solid ${isCurrent ? cfg.color : C.inputBorder}`,
                                        borderRadius: 4, color: isCurrent ? cfg.color : C.textMuted,
                                        fontSize: 12, fontWeight: 600, padding: "5px 12px",
                                        cursor: isCurrent ? "default" : "pointer", fontFamily: "inherit",
                                        opacity: updatingStatus ? 0.6 : 1,
                                    }}
                                >
                                    {cfg.icon} {cfg.label}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────

export default function AdminPaymentsPage() {
    const [orders, setOrders]         = useState<AdminOrder[]>([])
    const [total, setTotal]           = useState(0)
    const [isLoading, setIsLoading]   = useState(true)
    const [page, setPage]             = useState(1)
    const [statusFilter, setStatusFilter] = useState<OrderStatus | "">("")
    const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null)

    const fetchOrders = useCallback(async () => {
        setIsLoading(true)
        try {
            const res = await adminOrderApi.list({ page, limit: 20, status: statusFilter || undefined })
            setOrders(res.data)
            setTotal(res.total)
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }, [page, statusFilter])

    useEffect(() => { fetchOrders() }, [fetchOrders])

    function handleStatusUpdate(id: string, status: OrderStatus) {
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
        if (selectedOrder?.id === id) setSelectedOrder(o => o ? { ...o, status } : o)
    }

    // Stats
    const stats = {
        total:     orders.length,
        paid:      orders.filter(o => o.status === "PAID").length,
        pending:   orders.filter(o => o.status === "PENDING").length,
        cancelled: orders.filter(o => o.status === "CANCELLED").length,
        revenue:   orders.filter(o => o.status === "PAID").reduce((s, o) => s + o.totalAmount, 0),
    }

    return (
        <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
            {/* Header */}
            <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, background: C.surface }}>
                <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Заказы и оплата</h1>
            </div>

            <div style={{ padding: 24 }}>
                {/* Stats cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 24 }}>
                    {[
                        { label: "Всего заказов", value: total, color: C.textMuted },
                        { label: "Оплачено",      value: stats.paid,      color: C.success },
                        { label: "Ожидание",      value: stats.pending,   color: C.pending },
                        { label: "Отменено",      value: stats.cancelled, color: C.danger },
                        { label: "Выручка",       value: `${stats.revenue.toFixed(2)} €`, color: C.success },
                    ].map(s => (
                        <div key={s.label} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "14px 16px" }}>
                            <div style={{ fontSize: 11, color: C.textFaint, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 6 }}>{s.label}</div>
                            <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
                        </div>
                    ))}
                </div>

                {/* Filter bar */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px" }}>
                    <span style={{ fontSize: 12, color: C.textMuted }}>Статус:</span>
                    <select style={selectStyle} value={statusFilter} onChange={e => { setStatusFilter(e.target.value as any); setPage(1); }}>
                        <option value="">Все заказы</option>
                        <option value="PAID">Оплачены</option>
                        <option value="PENDING">Ожидание</option>
                        <option value="CANCELLED">Отменены</option>
                        <option value="FAILED">Ошибка</option>
                    </select>
                    <button onClick={fetchOrders} style={{ marginLeft: "auto", background: C.surfaceAlt, border: `1px solid ${C.inputBorder}`, borderRadius: 4, color: C.text, fontSize: 12, padding: "5px 12px", cursor: "pointer", fontFamily: "inherit" }}>
                        ↻ Обновить
                    </button>
                </div>

                {/* Table */}
                <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" as const }}>
                        <thead>
                        <tr style={{ background: C.surfaceAlt }}>
                            {["Заказ", "Дата", "Покупатель", "Товары", "Доставка", "Оплата", "Сумма", "Статус"].map(h => (
                                <th key={h} style={{ padding: "10px 14px", textAlign: "left" as const, fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: `2px solid ${C.border}` }}>
                                    {h}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {isLoading ? (
                            <tr><td colSpan={8} style={{ padding: 40, textAlign: "center" as const, color: C.textMuted }}>Загрузка…</td></tr>
                        ) : orders.length === 0 ? (
                            <tr><td colSpan={8} style={{ padding: 48, textAlign: "center" as const, color: C.textMuted }}>Заказы не найдены</td></tr>
                        ) : (
                            orders.map(order => (
                                <tr
                                    key={order.id}
                                    onClick={() => setSelectedOrder(order)}
                                    style={{ borderBottom: `1px solid ${C.border}`, cursor: "pointer", transition: "background 0.12s" }}
                                    onMouseEnter={e => (e.currentTarget.style.background = C.surfaceHover)}
                                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                                >
                                    <td style={{ padding: "12px 14px" }}>
                      <span style={{ fontFamily: "monospace", fontSize: 12, color: C.accent, fontWeight: 600 }}>
                        #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                                    </td>
                                    <td style={{ padding: "12px 14px", fontSize: 12, color: C.textMuted, whiteSpace: "nowrap" as const }}>
                                        {formatDate(order.createdAt)}
                                    </td>
                                    <td style={{ padding: "12px 14px" }}>
                                        <div style={{ fontSize: 13, color: C.text }}>{order.contactInfo?.firstName} {order.contactInfo?.lastName}</div>
                                        <div style={{ fontSize: 11, color: C.textMuted }}>{order.user.email}</div>
                                    </td>
                                    <td style={{ padding: "12px 14px", fontSize: 12, color: C.textMuted }}>
                                        {order.items.length} шт.
                                    </td>
                                    <td style={{ padding: "12px 14px", fontSize: 12, color: C.textMuted }}>
                                        {DELIVERY_LABELS[order.deliveryMethod || ""] || "—"}
                                    </td>
                                    <td style={{ padding: "12px 14px", fontSize: 12, color: C.textMuted }}>
                                        {PAYMENT_LABELS[order.mkPaymentMethod || ""] || order.mkPaymentMethod || "—"}
                                    </td>
                                    <td style={{ padding: "12px 14px", fontSize: 14, fontWeight: 700, color: C.text, whiteSpace: "nowrap" as const }}>
                                        {order.totalAmount.toFixed(2)} €
                                    </td>
                                    <td style={{ padding: "12px 14px" }}>
                                        <StatusBadge status={order.status} />
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {total > 20 && (
                    <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 16 }}>
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ background: C.surfaceAlt, border: `1px solid ${C.inputBorder}`, borderRadius: 4, color: C.text, fontSize: 12, padding: "5px 12px", cursor: page === 1 ? "not-allowed" : "pointer", opacity: page === 1 ? 0.4 : 1, fontFamily: "inherit" }}>‹</button>
                        <span style={{ fontSize: 12, color: C.textMuted, alignSelf: "center" }}>Стр. {page} из {Math.ceil(total / 20)}</span>
                        <button onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(total / 20)} style={{ background: C.surfaceAlt, border: `1px solid ${C.inputBorder}`, borderRadius: 4, color: C.text, fontSize: 12, padding: "5px 12px", cursor: page >= Math.ceil(total / 20) ? "not-allowed" : "pointer", opacity: page >= Math.ceil(total / 20) ? 0.4 : 1, fontFamily: "inherit" }}>›</button>
                    </div>
                )}
            </div>

            {/* Detail modal */}
            {selectedOrder && (
                <OrderDetailModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onStatusUpdate={handleStatusUpdate}
                />
            )}
        </div>
    )
}