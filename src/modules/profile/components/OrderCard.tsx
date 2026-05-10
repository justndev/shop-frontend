'use client';

import {useTranslation} from 'react-i18next';
import useCheckout from "@/src/modules/checkout/useCheckout";

import {Divider, TextField, Button, AccordionDetails, AccordionSummary, Accordion, Typography} from '@mui/material';
import {ShieldCheck} from 'lucide-react';

import {MUI_INPUT_SX} from "@/src/app/(main)/checkout/page";
import {cutTitle} from "@/src/utils/functions";
import {CartItem} from "@/src/store/slices/cartSlice";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {useEffect, useState} from "react";
import {Order} from "@/src/utils/types";
import config from "@/src/config";

function calcTotal(order: Order): number {
    let total = 0;
    order.items.forEach((item: CartItem) => {
        total += item.quantity;
    })
    return total;
}

function formatDate(date: Date) {
    return new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
    }).format(new Date(date))
}

export default function OrderCard({order}: { order: Order }) {
    const {t, i18n} = useTranslation();
    const totalProducts = calcTotal(order);


    function OrderItemCard({item}: { item: CartItem }) {
        return (
            <div key={item.product.id} className="grid grid-cols-[64px_1fr_auto] gap-3.5 items-center">
                <div className="relative w-16 h-16 shadow-lg">
                    <img
                        src={item.product.images?.[0]}
                        alt={item.product.name[i18n.language]}
                        className="rounded-md border-[#e0ddd6] border-[0.5px] bg-white"
                    />
                    <span
                        className="absolute -top-2 -right-2 w-5 h-5 bg-(--swamp-green-dark) text-white rounded-full text-xs font-semibold flex items-center justify-center">
                {item.quantity}
              </span>
                </div>
                <div>
                    <p className="text-sm font-medium text-(--coal)">
                        {cutTitle(item.product.name[i18n.language])}
                    </p>
                    <p className="text-xs font-medium text-(--beige-grey)">
                        {item.product.weight || '50g'} / {item.product.price}€
                    </p>
                    <p className="text-sm font-medium text-(--coal)">
                    </p>

                </div>
                <p className="font-semibold text-(--coal) whitespace-nowrap">
                    €{(item.product.price * item.quantity).toFixed(2)}
                </p>
            </div>
        )
    }

    function getTotalProductsLabel() {
        return totalProducts === 1
            ? `1 ${t('checkout.item')}`
            : `${totalProducts} ${t('checkout.items')}`;
    }

    return (
        <div className="w-full flex flex-col gap-4 px-8 py-8 bg-white rounded-sm shadow-sm">
            <h3 className="font-semibold text-base text-(--coal)">
                {order.id}
            </h3>
            <h3 className="font-semibold text-base text-(--coal)">
                {formatDate(order.createdAt)}
            </h3>
            <h3 className="font-semibold text-base text-(--coal)">
                {order.deliveryMethod}
            </h3>
            <h3 className="font-semibold text-base text-(--coal)">
                {order.mkPaymentMethod}
            </h3>

            {/* Items */}
            <div className="flex flex-col gap-4">

                <Accordion disableGutters sx={{boxShadow: 'none', background: 'transparent', margin: 0}}>
                    <AccordionSummary
                        sx={{
                            padding: 0,
                            margin: 0,
                            borderBottom: '1px solid rgba(0,0,0,0.12)', // always visible
                            '& .MuiAccordionSummary-content': {margin: '12px 0'},
                        }}
                        expandIcon={<ExpandMoreIcon/>}
                    >
                        <h3 className="font-semibold text-base text-(--coal)">
                            {t('checkout.summary.order')}
                        </h3>
                    </AccordionSummary>

                    <AccordionDetails sx={{padding: 0, background: 'transparent'}}>
                        <div className='flex flex-col gap-2 max-h-150 overflow-x-auto pt-2'>
                            {order.items.map((item: CartItem) =>
                                <OrderItemCard key={item.product.id} item={item}/>
                            )}
                        </div>
                    </AccordionDetails>
                </Accordion>

            </div>


            {/* Totals */}
            <div className="flex flex-col gap-2.5">

                <div className="flex justify-between items-baseline">
                    <span className="text-sm text-(--coal-bright) ">{t('checkout.summary.shipping')}</span>
                    <span className="text-sm text-(--coal-bright) ">€{order.deliveryPrice}</span>
                </div>
            </div>

            <Divider sx={{borderColor: '#e0ddd6'}}/>

            <div className="flex justify-between items-baseline">
                <span className="text-base font-semibold text-(--coal) ">{t('checkout.summary.total')}</span>
                <span className="font-bold text-(--green-pale)">
                    €{order.totalAmount}
                </span>
            </div>

            <p className="text-sm text-(--beige-grey) -mt-2 ">
                {t('checkout.summary.tax_note', {amount: order.totalAmount * config.TAX_RATE})}
            </p>
            {/* All transactions are secured */}

            {/*<div className="flex items-center gap-1.5 text-[0.78rem] text-(--beige-grey) mt-auto pt-2 ">*/}
            {/*    <ShieldCheck size={14} className="text-(--beige-grey)"/>*/}
            {/*    <span>{t('checkout.summary.secure')}</span>*/}
            {/*</div>*/}
        </div>
    );
}