import { useState, useEffect } from 'react';
import orderApi from '@/src/modules/profile/orderApi';
import {Order} from "@/src/utils/types";
import {Axios, AxiosError} from "axios";
import {MOCKED_ORDERS} from "@/src/utils/mocks";
import productApi from "@/src/lib/productApi";
import paymentApi from "@/src/modules/checkout/paymentApi";

export function useOrdersHook() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    useEffect(() => {
        async function fetchOrders() {
            setLoading(true);

            try {
                const orders = await paymentApi.getOrders();
                // setOrders(responseData.data)
                setOrders(orders)
            } catch (err: AxiosError) {
                console.error(err);
                // TODO: Handle backend errors
            } finally {
                setLoading(false);
            }

        }
        fetchOrders();

    }, [])

    function toggleExpand(id: string) {
        setExpandedId((prev) => (prev === id ? null : id));
    }

    return { orders, loading, error, expandedId, toggleExpand };
}