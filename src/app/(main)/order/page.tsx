// src/app/(main)/order/page.tsx
'use client';

import { useTranslation } from 'react-i18next';
import {
    Alert,
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Chip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useOrder } from '@/src/modules/order/useOrder';
import { OrderItem } from '@/src/utils/types';
import { cutTitle } from '@/src/utils/functions';
import Link from 'next/link';

type OrderStatus = 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED' | 'COMPLETED' | 'ABORTED' | 'EXPIRED';

const STATUS_COLOR: Record<OrderStatus, 'warning' | 'success' | 'error' | 'default'> = {
    PENDING:   'warning',
    PAID:      'success',
    COMPLETED: 'success',
    FAILED:    'error',
    CANCELLED: 'error',
    ABORTED:   'error',
    EXPIRED:   'error',
};

const isTerminal = (status: OrderStatus) =>
    ['PAID', 'COMPLETED', 'FAILED', 'CANCELLED', 'ABORTED', 'EXPIRED'].includes(status);

const canPay = (status: OrderStatus) => status === 'PENDING';
const canCancel = (status: OrderStatus) => status === 'PENDING';

export default function OrderPage() {
    const { t, i18n } = useTranslation();
    const {
        order,
        loading,
        serverError,
        paramError,
        cancelDialogOpen,
        cancelling,
        openCancelDialog,
        closeCancelDialog,
        confirmCancel,
    } = useOrder();

    // ── Error states ─────────────────────────────────────────────────────────
    if (paramError === 'no_order_id') {
        return (
            <div className="p-8 max-w-lg mx-auto">
                <Alert severity="error">{t('order.errors.no_order_id')}</Alert>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-64">
                <CircularProgress />
            </div>
        );
    }

    if (!order && serverError) {
        return (
            <div className="p-8 max-w-lg mx-auto">
                <Alert severity="error">{t('order.errors.fetch_failed')}</Alert>
            </div>
        );
    }

    if (!order) return null;

    // ── Derived values ───────────────────────────────────────────────────────
    const subtotal = order.items.reduce(
        (sum: number, item: OrderItem) => sum + item.product.price * item.quantity,
        0,
    );
    const shipping = order.deliveryPrice ?? 0;
    const total = order.totalAmount;
    const tax = order.taxes;
    const totalProducts = order.items.reduce((sum: number, item: OrderItem) => sum + item.quantity, 0);

    const totalProductsLabel = totalProducts === 1
        ? `1 ${t('order.item')}`
        : `${totalProducts} ${t('order.items')}`;

    // ── Sub-components ───────────────────────────────────────────────────────
    function OrderItemCard({ item }: { item: OrderItem }) {
        return (
            <div className="grid grid-cols-[64px_1fr_auto] gap-3.5 items-center">
                <div className="relative w-16 h-16 shadow-lg">
                    <img
                        src={item.product.images?.[0]}
                        alt={item.product.name[i18n.language]}
                        className="rounded-md border-[#e0ddd6] border-[0.5px] bg-white object-cover w-full h-full"
                    />
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-(--swamp-green-dark) text-white rounded-full text-xs font-semibold flex items-center justify-center">
                        {item.quantity}
                    </span>
                </div>
                <div>
                    <p className="text-sm font-medium text-(--coal)">
                        {cutTitle(item.product.name[i18n.language])}
                    </p>
                    <p className="text-xs font-medium text-(--beige-grey)">
                        {item.product.price}€
                    </p>
                </div>
                <p className="font-semibold text-(--coal) whitespace-nowrap">
                    €{(item.product.price * item.quantity).toFixed(2)}
                </p>
            </div>
        );
    }

    // ── Render ───────────────────────────────────────────────────────────────
    return (
        <>
            <div className="w-full max-w-125 flex flex-col gap-4 md:px-8 md:py-8 mx-auto mt-25">

                {/* Server error banner (non-fatal, e.g. cancel failed) */}
                {serverError && serverError !== 'fetch_failed' && (
                    <Alert severity="error" onClose={() => {}}>
                        {t(`order.errors.${serverError}`)}
                    </Alert>
                )}

                {/* Order ID */}
                <div className="flex flex-col gap-1">
                    <p className="text-xs text-(--beige-grey) uppercase tracking-wide">
                        {t('order.order_id')}
                    </p>
                    <p className="text-sm font-mono text-(--coal) break-all">{order.id}</p>
                </div>

                {/* Status badge */}
                <div className="flex items-center gap-2">
                    <p className="text-sm text-(--coal-bright)">{t('order.status')}:</p>
                    <Chip
                        label={t(`order.statuses.${order.status.toLowerCase()}`)}
                        color={STATUS_COLOR[order.status as OrderStatus]}
                        size="small"
                    />
                </div>

                {/* Paid success banner */}
                {order.status === 'PAID' && (
                    <Alert severity="success">{t('order.paid_notice')}</Alert>
                )}

                {/* Items accordion */}
                <Accordion
                    disableGutters
                    defaultExpanded
                    sx={{ boxShadow: 'none', background: 'transparent', margin: 0 }}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{
                            padding: 0,
                            margin: 0,
                            borderBottom: '1px solid rgba(0,0,0,0.12)',
                            '& .MuiAccordionSummary-content': { margin: '12px 0' },
                        }}
                    >
                        <h2 className="font-semibold text-base text-(--coal)">
                            {t('order.summary.order')}
                        </h2>
                    </AccordionSummary>
                    <AccordionDetails sx={{ padding: 0, background: 'transparent' }}>
                        <div className="flex flex-col gap-2 max-h-150 overflow-y-auto pt-2">
                            {order.items.map((item: OrderItem) => (
                                <OrderItemCard key={item.product.id} item={item} />
                            ))}
                        </div>
                    </AccordionDetails>
                </Accordion>

                {/* Totals */}
                <div className="flex flex-col gap-2.5">
                    <div className="flex justify-between items-baseline">
                        <span className="text-sm text-(--coal-bright)">
                            {t('order.summary.subtotal')} — {totalProductsLabel}
                        </span>
                        <span className="text-sm text-(--coal-bright)">€{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-baseline">
                        <span className="text-sm text-(--coal-bright)">{t('order.summary.shipping')}</span>
                        <span className="text-sm text-(--coal-bright)">€{shipping.toFixed(2)}</span>
                    </div>
                </div>

                <Divider sx={{ borderColor: '#e0ddd6' }} />

                <div className="flex justify-between items-baseline">
                    <span className="text-base font-semibold text-(--coal)">{t('order.summary.total')}</span>
                    <span className="font-bold text-(--green-pale)">€{total.toFixed(2)}</span>
                </div>

                <p className="text-sm text-(--beige-grey) -mt-2">
                    {t('order.summary.tax_note', { amount: tax.toFixed(2) })}
                </p>

                {/* Actions */}
                <div className="flex flex-col gap-2 pt-2">
                    {/* Pay button */}
                    {canPay(order.status as OrderStatus) && order.paymentUrl && (
                        <Button
                            variant="contained"
                            fullWidth
                            href={order.paymentUrl}
                            disabled={!canPay(order.status as OrderStatus)}
                        >
                            {t('order.actions.pay')}
                        </Button>
                    )}

                    {/* Disabled pay button for terminal states */}
                    {isTerminal(order.status as OrderStatus) && order.status !== 'PAID' && (
                        <Button variant="contained" fullWidth disabled>
                            {t('order.actions.pay')}
                        </Button>
                    )}

                    {/* Cancel button */}
                    {canCancel(order.status as OrderStatus) && (
                        <Button
                            variant="outlined"
                            color="error"
                            fullWidth
                            onClick={openCancelDialog}
                        >
                            {t('order.actions.cancel')}
                        </Button>
                    )}

                    {/* Back to shop (paid or terminal) */}
                    {isTerminal(order.status as OrderStatus) && (
                        <Button
                            component={Link}
                            href="/"
                            variant="outlined"
                            fullWidth
                        >
                            {t('order.actions.back_to_shop')}
                        </Button>
                    )}
                </div>
            </div>

            {/* Cancel confirmation dialog */}
            <Dialog open={cancelDialogOpen} onClose={closeCancelDialog}>
                <DialogTitle>{t('order.cancel_dialog.title')}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{t('order.cancel_dialog.body')}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeCancelDialog} disabled={cancelling}>
                        {t('order.cancel_dialog.back')}
                    </Button>
                    <Button
                        onClick={confirmCancel}
                        color="error"
                        disabled={cancelling}
                        startIcon={cancelling ? <CircularProgress size={14} /> : null}
                    >
                        {t('order.cancel_dialog.confirm')}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}