'use client';

import {useTranslation} from 'react-i18next';
import {
    Collapse,
    Typography,
    Chip,
    IconButton,
    Divider
} from '@mui/material';
import {Order} from '@/src/api/orderApi';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {OrderItem} from '@/src/types';
import {Minus, Plus, Trash2} from "lucide-react";
import {getThumbnailUrl} from "@/src/utils/functions";

interface Props {
    order: Order;
    expanded: boolean;
    onToggle: () => void;
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; color: string }> = {
    PENDING: {label: 'Pending', bg: '#fef9c3', color: '#854d0e'},
    PAID: {label: 'Paid', bg: '#dcfce7', color: '#166534'},
    FAILED: {label: 'Failed', bg: '#fee2e2', color: '#991b1b'},
    CANCELLED: {label: 'Cancelled', bg: '#f3f4f6', color: '#374151'},
};

const DELIVERY_LABELS: Record<string, string> = {
    omniva: 'Omniva',
    dpd: 'DPD courier',
    dpd_parcel: 'DPD parcel',
    pickup: 'Pickup',
};

const PAYMENT_LABELS: Record<string, string> = {
    swedbank: 'Swedbank',
    seb: 'SEB',
    lhv: 'LHV',
    luminor: 'Luminor',
    card: 'Card',
    google_pay: 'Google Pay',
    apple_pay: 'Apple Pay',
};

function formatDateTime(iso: string) {
    return new Date(iso).toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
}

function formatPrice(n: number) {
    return n.toFixed(2) + ' €';
}

export default function OrderCard({order, expanded, onToggle}: Props) {
    const status = STATUS_CONFIG[order.status];

    const itemsCount = order.items.reduce((sum, i) => sum + i.quantity, 0);

    const delivery = order.deliveryMethod
        ? DELIVERY_LABELS[order.deliveryMethod]
        : '-';

    const payment = order.mkPaymentMethod
        ? PAYMENT_LABELS[order.mkPaymentMethod]
        : '-';

    const deliveryPrice = order.deliveryPrice ?? 0;

    // simple tax estimation (optional placeholder)
    const taxes = order.totalAmount * 0.2;

    return (
        <div className="border rounded-xl px-4 py-6 bg-white gap-2 flex flex-col">
            {/* HEADER */}
            <header
                className="flex justify-between items-start cursor-pointer"
                onClick={onToggle}
            >
                <Typography variant="body2">
                    {formatDateTime(order.createdAt)}
                </Typography>

                <div className="flex sm:flex-col md:flex-row gap-1 items-center">
                    <Typography variant="caption" color="text.secondary">
                        Order ID:
                    </Typography>
                    <Typography variant="subtitle2">#{order.id}</Typography>
                    <IconButton size="small">
                        {expanded ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                    </IconButton>
                </div>
            </header>

            {/* QUICK INFO */}
            <div className="grid grid-cols-3 gap-2">
                <div>
                    <Typography variant="caption" color="text.secondary">
                        Items
                    </Typography>
                    <Typography variant="body2">{itemsCount}</Typography>
                </div>

                <div>
                    <Typography variant="caption" color="text.secondary">
                        Delivery
                    </Typography>
                    <Typography variant="body2">{delivery}</Typography>
                </div>

                <div>
                    <Typography variant="caption" color="text.secondary">
                        Payment
                    </Typography>
                    <Typography variant="body2">{payment}</Typography>
                </div>
            </div>

            <Divider/>

            {/* EXPANDED */}
            <Collapse in={expanded}>
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                        {order.items.map((item) => (
                            <OrderCardItem key={item.id} orderItem={item}/>
                        ))}
                    </div>



                    <Divider/>

                    {/* PRICE BREAKDOWN */}
                    <div className="flex flex-col gap-1">
                        <Row label="Subtotal" value={formatPrice(order.totalAmount - deliveryPrice)}/>
                        <Row label="Delivery" value={formatPrice(deliveryPrice)}/>
                        <Row label="Taxes (est.)" value={formatPrice(taxes)}/>

                        <Divider className="my-1"/>


                    </div>
                </div>
            </Collapse>
            <Row
                label="Total"
                value={formatPrice(order.totalAmount)}
                bold
            />
        </div>
    );
}

/* ------------------ ITEM ------------------ */

function OrderCardItem({orderItem}: { orderItem: OrderItem }) {
    const {i18n} = useTranslation();

    const name =
        orderItem.product?.name?.[i18n.language as 'en' | 'ru' | 'et'] ||
        orderItem.name;

    const image = orderItem.product?.images?.[0];

    return (
        <div key={orderItem.id}>
            <div style={{
                display: 'grid',
                gridTemplateColumns: '72px 1fr auto',
                gap: 10,
                padding: '6px 4px',
                alignItems: 'start',
            }}>
                {/* Image */}
                <div style={{
                    width: 72,
                    height: 72,
                    background: '#ffffff',
                    border: '0.5px solid #e0ddd6',
                    borderRadius: 8,
                    overflow: 'hidden',
                    flexShrink: 0,
                    position: 'relative',
                }}>
                    <img
                        src={getThumbnailUrl(orderItem.product.images[0])}
                        alt={orderItem.name[i18n.language]}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                    />
                </div>

                {/* Info + qty controls */}
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <p style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 500,
                        fontSize: '0.9rem',
                        color: '#1a1a14',
                        margin: 0,
                        lineHeight: 1.3,
                    }}>
                        {orderItem.product.name[i18n.language]}
                    </p>

                    {orderItem.variant && (
                        <p style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: '0.78rem',
                            color: '#888880',
                            margin: 0,
                        }}>
                            {orderItem.variant}
                        </p>
                    )}

                    <p style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: '0.82rem',
                        color: '#6b6b5e',
                        margin: 0,
                    }}>
                        {orderItem.price}€
                    </p>

                    {/* Qty stepper */}
                    <div style={{}}>

                        <Typography>
                            x {orderItem.quantity}
                        </Typography>


                    </div>
                </div>

                {/* Line total + remove */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: 8,
                }}>
                    <p style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        color: '#1a3c2e',
                        margin: 0,
                        whiteSpace: 'nowrap',
                    }}>
                        {(orderItem.price * orderItem.quantity).toFixed(2)}€
                    </p>

                </div>
            </div>


        </div>
    );
}

/* ------------------ ROW ------------------ */

function Row({
                 label,
                 value,
                 bold,
             }: {
    label: string;
    value: string;
    bold?: boolean;
}) {
    return (
        <div className="flex justify-between">
            <Typography variant="body2" color="text.secondary">
                {label}
            </Typography>
            <Typography variant="body2" fontWeight={bold ? 600 : 400}>
                {value}
            </Typography>
        </div>
    );
}