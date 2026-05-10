// src/hooks/useWebSocketListener.ts
import { useEffect, useRef, useCallback } from 'react';

type OrderStatus = 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED' | 'COMPLETED' | 'ABORTED' | 'EXPIRED';

interface OrderStatusMessage {
    type: 'ORDER_STATUS';
    orderId: string;
    status: OrderStatus;
}

interface SubscribedMessage {
    type: 'SUBSCRIBED';
    orderId: string;
}

type WsMessage = OrderStatusMessage | SubscribedMessage;

interface UseWebSocketListenerOptions {
    orderId: string | null;
    onStatusChange: (status: OrderStatus) => void;
    enabled?: boolean;
}

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:4000/ws';
const RECONNECT_DELAY_MS = 3000;
const MAX_RECONNECT_ATTEMPTS = 5;

export function useWebSocketListener({
                                         orderId,
                                         onStatusChange,
                                         enabled = true,
                                     }: UseWebSocketListenerOptions) {
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectAttempts = useRef(0);
    const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isMounted = useRef(true);

    const cleanup = useCallback(() => {
        if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
        if (wsRef.current) {
            wsRef.current.onclose = null; // prevent reconnect on intentional close
            wsRef.current.close();
            wsRef.current = null;
        }
    }, []);

    const connect = useCallback(() => {
        if (!orderId || !isMounted.current) return;

        const ws = new WebSocket(`${WS_URL}?orderId=${orderId}`);
        wsRef.current = ws;

        ws.onopen = () => {
            console.log(`[WS] Connected for orderId=${orderId}`);
            reconnectAttempts.current = 0;
        };

        ws.onmessage = (event) => {
            try {
                const message: WsMessage = JSON.parse(event.data);

                if (message.type === 'ORDER_STATUS') {
                    onStatusChange(message.status);
                }
            } catch {
                console.error('[WS] Failed to parse message:', event.data);
            }
        };

        ws.onerror = (err) => {
            console.error('[WS] Error:', err);
        };

        ws.onclose = () => {
            if (!isMounted.current) return;

            if (reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
                reconnectAttempts.current += 1;
                console.log(`[WS] Reconnecting... attempt ${reconnectAttempts.current}`);
                reconnectTimer.current = setTimeout(connect, RECONNECT_DELAY_MS);
            } else {
                console.warn('[WS] Max reconnect attempts reached.');
            }
        };
    }, [orderId, onStatusChange]);

    useEffect(() => {
        isMounted.current = true;

        if (!enabled || !orderId) return;

        connect();

        return () => {
            isMounted.current = false;
            cleanup();
        };
    }, [orderId, enabled, connect, cleanup]);
}