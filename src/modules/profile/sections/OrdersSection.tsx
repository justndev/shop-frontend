'use client';

import { useTranslation } from 'react-i18next';
import {Typography, Skeleton, CircularProgress} from '@mui/material';
import OrderCard from '@/src/modules/profile/components/OrderCard';
import {useOrdersHook} from "@/src/hooks/useOrderHook";

export default function OrdersSection() {
    const { t } = useTranslation();
    const { orders, loading, expandedId, toggleExpand } = useOrdersHook();

    return (
        <section className="flex flex-col gap-4 w-full h-full">
            <div className=" flex justify-between items-end h-[32]">
                <Typography variant="h5">{t('account.orders.title', 'My Orders')}</Typography>
            </div>

            {loading && (
                <div className="flex w-full h-full justify-center items-center">
                    <CircularProgress aria-label="Loading…" />

                </div>

                // <div className="flex flex-col gap-3">
                //     {[1, 2, 3].map((i) => (
                //         <Skeleton key={i} variant="rounded" height={96} sx={{ borderRadius: '12px' }} />
                //     ))}
                // </div>
            )}

            {!loading && orders.length === 0 && (
                <div className="bg-white border border-[#e8eeeb] rounded-xl p-8 shadow-sm flex flex-col items-center gap-3">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                        <rect width="48" height="48" rx="12" fill="#f0f5f2" />
                        <path d="M16 18h16M16 24h10M16 30h8" stroke="#1a3c2e" strokeWidth="2" strokeLinecap="round" />
                        <rect x="12" y="12" width="24" height="28" rx="3" stroke="#1a3c2e" strokeWidth="1.5" fill="none" />
                    </svg>
                    <Typography variant="h6" sx={{ color: '#1a3c2e', fontWeight: 600 }}>
                        {t('account.orders.empty_title', 'No orders yet')}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6b7280', textAlign: 'center' }}>
                        {t('account.orders.empty_subtitle', "Your order history will appear here once you've made a purchase.")}
                    </Typography>
                </div>
            )}

            {!loading && orders.length > 0 && (
                <div className="flex flex-col gap-3">
                    {orders.map((order) => (
                        <OrderCard
                            key={order.id}
                            order={order}
                            expanded={expandedId === order.id}
                            onToggle={() => toggleExpand(order.id)}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}