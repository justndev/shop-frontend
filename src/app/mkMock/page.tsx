'use client'

import {useParams, usePathname, useSearchParams} from "next/navigation";
import productApi from "@/src/lib/productApi";
import {useEffect} from "react";

export default function McMockPage() {
    const searchParams = useSearchParams();

    const mkTransactionId = searchParams.get("mkTransactionId");
    const orderId = searchParams.get("orderId");

    async function onPay() {
        await productApi.mockWebhook(mkTransactionId, orderId, "COMPLETED")
    }




    return (

        <div className="min-h-screen bg-(--beige)">
            <p> Makse Keskus Mocked page! </p>

            <button onClick={onPay}>Pay</button>

    </div>)
}