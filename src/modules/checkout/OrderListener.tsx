// src/modules/checkout/OrderListener.tsx
'use client';

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/store";
import {useCallback, useEffect} from "react";
import { clearCart, clearOrder } from "@/src/store/slices/cartSlice";
import {useWebSocketListener} from "@/src/lib/useWebsocketListener";
import paymentApi from "@/src/modules/checkout/paymentApi";

type OrderStatus = 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED' | 'COMPLETED' | 'ABORTED' | 'EXPIRED';

export default function OrderListener() {
    const dispatch = useDispatch();
    const { currentOrder } = useSelector((state: RootState) => state.cart);

    const handleStatusChange = useCallback((status: OrderStatus) => {
        console.log('Handling status', status);
        switch (status) {
            case "PAID":
                dispatch(clearOrder());
                dispatch(clearCart());
                alert("Order was paid! Check your email.");
                break;
            case "ABORTED":
            case "EXPIRED":
            case "FAILED":
            case "CANCELLED":
                dispatch(clearOrder());
                break;
            case "PENDING":
            default:
                break;
        }
    }, [dispatch]);


    useEffect(() => {
        async function initialCheck() {
            if (!currentOrder) return;
            const order = await paymentApi.checkOrder(currentOrder.id);
            handleStatusChange(order.status)
        }
        initialCheck()
    }, []);

    useWebSocketListener({
        orderId: currentOrder?.id ?? null,
        enabled: !!currentOrder,
        onStatusChange: handleStatusChange,
    });

    return null;
}