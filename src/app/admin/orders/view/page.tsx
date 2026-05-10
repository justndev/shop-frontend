'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import adminOrdersApi from '@/src/lib/adminOrdersApi';
import { Order, OrderItem } from '@/src/utils/types';

// ── Types ──────────────────────────────────────────────────────────────────────

type OrderStatus = 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED' | 'COMPLETED' | 'ABORTED' | 'EXPIRED';

const ALL_STATUSES: OrderStatus[] = ['PENDING', 'PAID', 'COMPLETED', 'FAILED', 'CANCELLED', 'ABORTED', 'EXPIRED'];

// ── Status badge ───────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
    const map: Record<string, string> = {
        PAID:      'bg-[var(--admin-success-bg)] text-[var(--admin-success)]',
        COMPLETED: 'bg-[var(--admin-success-bg)] text-[var(--admin-success)]',
        PENDING:   'bg-[var(--admin-warning-bg)] text-[var(--admin-warning)]',
        FAILED:    'bg-[var(--admin-danger-bg)]  text-[var(--admin-danger)]',
        CANCELLED: 'bg-[var(--admin-danger-bg)]  text-[var(--admin-danger)]',
        ABORTED:   'bg-[var(--admin-danger-bg)]  text-[var(--admin-danger)]',
        EXPIRED:   'bg-[var(--admin-danger-bg)]  text-[var(--admin-danger)]',
    };
    return (
        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${map[status] ?? 'bg-[var(--admin-surface-alt)] text-[var(--admin-text-muted)]'}`}>
            {status}
        </span>
    );
}

// ── Section card ───────────────────────────────────────────────────────────────

function Card({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="border border-[var(--admin-border)] rounded-md overflow-hidden">
            <div className="px-4 py-2.5 bg-[var(--admin-surface-alt)] border-b border-[var(--admin-border)]">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--admin-text-faint)]">{title}</h2>
            </div>
            <div className="bg-[var(--admin-surface)] px-4 py-3">
                {children}
            </div>
        </div>
    );
}

// ── Field row ──────────────────────────────────────────────────────────────────

function Field({ label, value }: { label: string; value?: React.ReactNode }) {
    return (
        <div className="flex items-start gap-2 py-1.5 border-b border-[var(--admin-border)] last:border-0">
            <span className="w-36 shrink-0 text-xs text-[var(--admin-text-faint)]">{label}</span>
            <span className="text-xs text-[var(--admin-text)] break-all">{value ?? <span className="text-[var(--admin-text-faint)]">—</span>}</span>
        </div>
    );
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function AdminOrderPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const orderId = searchParams.get('orderId');

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Status edit
    const [editingStatus, setEditingStatus] = useState(false);
    const [newStatus, setNewStatus] = useState<OrderStatus>('PENDING');
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState('');

    useEffect(() => {
        if (!orderId) { setLoading(false); return; }
        adminOrdersApi.getById(orderId)
            .then((o) => { setOrder(o); setNewStatus(o.status as OrderStatus); })
            .catch(() => setError('Failed to load order.'))
            .finally(() => setLoading(false));
    }, [orderId]);

    async function handleSaveStatus() {
        if (!order) return;
        setSaving(true);
        setSaveMsg('');
        try {
            await adminOrdersApi.update(order.id, { status: newStatus });
            setOrder(prev => prev ? { ...prev, status: newStatus } : prev);
            setEditingStatus(false);
            setSaveMsg('Status updated.');
            setTimeout(() => setSaveMsg(''), 3000);
        } catch {
            setSaveMsg('Failed to update status.');
        } finally {
            setSaving(false);
        }
    }

    // ── States ─────────────────────────────────────────────────────────────────

    if (!orderId) return (
        <div className="p-8 text-sm text-[var(--admin-danger)]">No order ID provided.</div>
    );

    if (loading) return (
        <div className="p-8 text-sm text-[var(--admin-text-muted)]">Loading…</div>
    );

    if (error || !order) return (
        <div className="p-8 text-sm text-[var(--admin-danger)]">{error || 'Order not found.'}</div>
    );

    // ── Derived ────────────────────────────────────────────────────────────────

    const contact = order.contactInfo as Record<string, string> | null;
    const subtotal = order.items.reduce((s: number, i: OrderItem) => s + i.product.price * i.quantity, 0);
    const totalQty = order.items.reduce((s: number, i: OrderItem) => s + i.quantity, 0);

    function fmt(n?: number | null) { return n != null ? `€${n.toFixed(2)}` : '—'; }
    function fmtDate(s?: string | null) {
        if (!s) return '—';
        const d = new Date(s);
        return d.toLocaleDateString('en-CA') + ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    }

    // ── Render ─────────────────────────────────────────────────────────────────

    return (
        <div className="min-h-screen bg-[var(--admin-bg)] text-[var(--admin-text)] font-sans">

            {/* Page header */}
            <div className="px-6 py-4 border-b border-[var(--admin-border)] bg-[var(--admin-surface)] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.push('/admin/orders')}
                        className="text-xs text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] transition-colors"
                    >
                        ← Orders
                    </button>
                    <span className="text-[var(--admin-border)]">/</span>
                    <h1 className="text-sm font-semibold text-[var(--admin-text)] truncate max-w-[320px]">
                        {order.id}
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    <StatusBadge status={order.status} />
                    {saveMsg && (
                        <span className={`text-xs ${saveMsg.includes('Failed') ? 'text-[var(--admin-danger)]' : 'text-[var(--admin-success)]'}`}>
                            {saveMsg}
                        </span>
                    )}
                </div>
            </div>

            {/* Body */}
            <div className="p-6 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5 max-w-6xl">

                {/* ── Left column ─────────────────────────────────────────────── */}
                <div className="flex flex-col gap-5">

                    {/* Order items */}
                    <Card title={`Order items — ${totalQty} item${totalQty !== 1 ? 's' : ''}`}>
                        <table className="w-full text-xs border-collapse">
                            <thead>
                            <tr className="border-b border-[var(--admin-border)]">
                                <th className="text-left py-2 pr-3 text-[var(--admin-text-faint)] font-semibold uppercase tracking-wide">Product</th>
                                <th className="text-right py-2 px-3 text-[var(--admin-text-faint)] font-semibold uppercase tracking-wide">Qty</th>
                                <th className="text-right py-2 pl-3 text-[var(--admin-text-faint)] font-semibold uppercase tracking-wide">Unit</th>
                                <th className="text-right py-2 pl-3 text-[var(--admin-text-faint)] font-semibold uppercase tracking-wide">Line</th>
                            </tr>
                            </thead>
                            <tbody>
                            {order.items.map((item: OrderItem) => {
                                const name = typeof item.product.name === 'object'
                                    ? (item.product.name as Record<string, string>).en ?? Object.values(item.product.name as Record<string, string>)[0]
                                    : String(item.product.name);
                                return (
                                    <tr key={item.id} className="border-b border-[var(--admin-border)] last:border-0 hover:bg-[var(--admin-surface-hover)] transition-colors">
                                        <td className="py-2.5 pr-3">
                                            <div className="flex items-center gap-2.5">
                                                {item.product.images?.[0] && (
                                                    <img src={item.product.images[0]} alt={name} className="w-8 h-8 rounded object-cover shrink-0 border border-[var(--admin-border)]" />
                                                )}
                                                <div>
                                                    <p className="text-[var(--admin-text)] font-medium">{name}</p>
                                                    {item.product.sku && <p className="text-[var(--admin-text-faint)] text-[10px]">SKU: {item.product.sku}</p>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-2.5 px-3 text-right text-[var(--admin-text-muted)]">{item.quantity}</td>
                                        <td className="py-2.5 pl-3 text-right text-[var(--admin-text-muted)]">{fmt(item.product.price)}</td>
                                        <td className="py-2.5 pl-3 text-right font-semibold text-[var(--admin-text)]">{fmt(item.product.price * item.quantity)}</td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>

                        {/* Totals */}
                        <div className="mt-3 pt-3 border-t border-[var(--admin-border)] flex flex-col gap-1.5 items-end text-xs">
                            <div className="flex gap-8">
                                <span className="text-[var(--admin-text-faint)]">Subtotal</span>
                                <span className="text-[var(--admin-text-muted)] w-20 text-right">{fmt(subtotal)}</span>
                            </div>
                            <div className="flex gap-8">
                                <span className="text-[var(--admin-text-faint)]">Shipping ({order.deliveryMethod ?? '—'})</span>
                                <span className="text-[var(--admin-text-muted)] w-20 text-right">{fmt(order.deliveryPrice)}</span>
                            </div>
                            <div className="flex gap-8">
                                <span className="text-[var(--admin-text-faint)]">Tax</span>
                                <span className="text-[var(--admin-text-muted)] w-20 text-right">{fmt(order.taxes)}</span>
                            </div>
                            <div className="flex gap-8 pt-1.5 border-t border-[var(--admin-border)]">
                                <span className="font-semibold text-[var(--admin-text)]">Total</span>
                                <span className="font-bold text-[var(--admin-accent)] w-20 text-right">{fmt(order.totalAmount)}</span>
                            </div>
                        </div>
                    </Card>

                    {/* Contact info */}
                    {contact && (
                        <Card title="Contact information">
                            <Field label="First name"  value={contact.firstName} />
                            <Field label="Last name"   value={contact.lastName} />
                            <Field label="Email"       value={contact.email} />
                            <Field label="Phone"       value={contact.phone} />
                            {contact.note && <Field label="Note" value={contact.note} />}
                        </Card>
                    )}

                    {/* Payment & delivery */}
                    <Card title="Payment & delivery">
                        <Field label="Payment method"   value={order.mkPaymentMethod} />
                        <Field label="Transaction ID"   value={order.mkTransactionId} />
                        <Field label="Payment URL"      value={order.paymentUrl || undefined} />
                        <Field label="Delivery method"  value={order.deliveryMethod} />
                        <Field label="Delivery price"   value={fmt(order.deliveryPrice)} />
                    </Card>

                </div>

                {/* ── Right column ─────────────────────────────────────────────── */}
                <div className="flex flex-col gap-5">

                    {/* Status */}
                    <Card title="Order status">
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <StatusBadge status={order.status} />
                                {!editingStatus && (
                                    <button
                                        onClick={() => setEditingStatus(true)}
                                        className="text-xs text-[var(--admin-accent)] hover:text-[var(--admin-accent-hover)] transition-colors"
                                    >
                                        Change
                                    </button>
                                )}
                            </div>

                            {editingStatus && (
                                <div className="flex flex-col gap-2">
                                    <select
                                        value={newStatus}
                                        onChange={e => setNewStatus(e.target.value as OrderStatus)}
                                        className="w-full text-xs rounded px-2.5 py-1.5
                                            bg-[var(--admin-input-bg)] border border-[var(--admin-input-border)]
                                            text-[var(--admin-text)] outline-none appearance-none cursor-pointer"
                                    >
                                        {ALL_STATUSES.map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleSaveStatus}
                                            disabled={saving}
                                            className="flex-1 text-xs py-1.5 rounded font-semibold
                                                bg-[var(--admin-accent)] text-white
                                                hover:bg-[var(--admin-accent-hover)] disabled:opacity-50 transition-colors"
                                        >
                                            {saving ? 'Saving…' : 'Save'}
                                        </button>
                                        <button
                                            onClick={() => { setEditingStatus(false); setNewStatus(order.status as OrderStatus); }}
                                            className="flex-1 text-xs py-1.5 rounded
                                                bg-[var(--admin-surface-alt)] border border-[var(--admin-border)]
                                                text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Order meta */}
                    <Card title="Order details">
                        <Field label="Order ID"   value={<span className="font-mono text-[10px] break-all">{order.id}</span>} />
                        <Field label="Created"    value={fmtDate(order.createdAt)} />
                        <Field label="Aborted at" value={fmtDate(order.abortedAt)} />
                        <Field label="Expired at" value={fmtDate(order.expiredAt)} />
                    </Card>

                    {/* User */}
                    {order.user && (
                        <Card title="Customer">
                            <Field label="User ID"    value={<span className="font-mono text-[10px]">{order.user.id}</span>} />
                            <Field label="Email"      value={order.user.email} />
                            <Field label="First name" value={order.user.firstName} />
                            <Field label="Last name"  value={order.user.lastName} />
                            <Field label="Role"       value={order.user.role} />
                            <Field label="Verified"   value={order.user.isVerified ? 'Yes' : 'No'} />
                            <Field label="Joined"     value={fmtDate(order.user.createdAt)} />
                            <div className="pt-2">
                                <a
                                    href={`/admin/users/${order.user.id}`}
                                    className="text-xs text-[var(--admin-accent)] hover:text-[var(--admin-accent-hover)] transition-colors"
                                >
                                    View user →
                                </a>
                            </div>
                        </Card>
                    )}

                </div>
            </div>
        </div>
    );
}