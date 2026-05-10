// src/modules/order/useOrderPage.ts
import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import paymentApi from '@/src/modules/checkout/paymentApi';
import { Order } from '@/src/utils/types';
import {useWebSocketListener} from "@/src/lib/useWebsocketListener";

type OrderStatus = 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED' | 'COMPLETED' | 'ABORTED' | 'EXPIRED';

interface UseOrderReturn {
    order: Order | null;
    loading: boolean;
    serverError: string | null;
    paramError: string | null;
    cancelDialogOpen: boolean;
    cancelling: boolean;
    openCancelDialog: () => void;
    closeCancelDialog: () => void;
    confirmCancel: () => Promise<void>;
}

export function useOrder(): UseOrderReturn {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [paramError, setParamError] = useState<string | null>(null);
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [cancelling, setCancelling] = useState(false);

    // Load order on mount
    useEffect(() => {
        if (!orderId || !orderId.trim()) {
            setParamError('no_order_id');
            return;
        }

        async function loadOrder() {
            setLoading(true);
            setServerError(null);
            try {
                const fetched = await paymentApi.checkOrder(orderId!);
                setOrder(fetched);
            } catch {
                setServerError('fetch_failed');
            } finally {
                setLoading(false);
            }
        }

        loadOrder();
    }, [orderId]);



    const openCancelDialog = useCallback(() => setCancelDialogOpen(true), []);
    const closeCancelDialog = useCallback(() => setCancelDialogOpen(false), []);

    const confirmCancel = useCallback(async () => {
        if (!order) return;
        setCancelling(true);
        try {
            await paymentApi.abortOrder(order.id);
            setOrder((prev) => prev ? { ...prev, status: 'CANCELLED' } : prev);
            setCancelDialogOpen(false);
        } catch {
            setServerError('cancel_failed');
            setCancelDialogOpen(false);
        } finally {
            setCancelling(false);
        }
    }, [order]);

    return {
        order,
        loading,
        serverError,
        paramError,
        cancelDialogOpen,
        cancelling,
        openCancelDialog,
        closeCancelDialog,
        confirmCancel,
    };
}