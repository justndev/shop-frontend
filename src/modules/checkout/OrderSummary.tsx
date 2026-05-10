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


type Props = Pick<ReturnType<typeof useCheckout>,
    'lineItems' | 'itemsReady' | 'subtotal' | 'shippingCost' | 'total' | 'tax' | 'discountCode' | 'setDiscountCode' | 'totalProducts'
>;

export default function OrderSummary(props: Props) {
    const {t, i18n} = useTranslation();
    const {
        lineItems,
        itemsReady,
        subtotal,
        shippingCost,
        total,
        tax,
        discountCode,
        totalProducts,
        setDiscountCode
    } = props;


// Add this instead:
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth <= 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

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
        <aside className="w-full max-w-125 flex flex-col gap-4 md:px-8  md:py-8">


        {/* Items */}
            <div className="flex flex-col gap-4">
                {!itemsReady ? (
                    <p className="text-sm text-(--beige-grey) ">
                        {t('checkout.summary.loading')}
                    </p>
                ) : lineItems.length === 0 ? (
                        <p className="text-sm text-(--beige-grey)">
                            {t('checkout.summary.empty')}
                        </p>
                    ) :
                    (
                        <Accordion disableGutters sx={{ boxShadow: 'none', background: 'transparent', margin: 0 }} defaultExpanded={!isMobile}>
                            <AccordionSummary
                                sx={{
                                    padding: 0,
                                    margin: 0,
                                    borderBottom: '1px solid rgba(0,0,0,0.12)', // always visible
                                    '& .MuiAccordionSummary-content': { margin: '12px 0' },
                                }}
                                expandIcon={<ExpandMoreIcon />}
                            >
                                <h2 className="font-semibold text-base text-(--coal)">
                                    {t('checkout.summary.order')}
                                </h2>
                            </AccordionSummary>

                            <AccordionDetails sx={{ padding: 0, background: 'transparent' }}>
                                <div className='flex flex-col gap-2 max-h-150 overflow-x-auto pt-2'>
                                    {lineItems.map((item: CartItem) =>
                                        <OrderItemCard key={item.product.id} item={item} />
                                    )}
                                </div>
                            </AccordionDetails>
                        </Accordion>
                    )
                    }
            </div>


            {/* Discount */}
            <div className="flex gap-2.5 items-start hidden">
                <TextField
                    fullWidth
                    size="small"
                    placeholder={t('checkout.summary.discount_placeholder')}
                    value={discountCode}
                    onChange={e => setDiscountCode(e.target.value)}
                    sx={{
                        ...MUI_INPUT_SX,
                        '& .MuiOutlinedInput-root': {
                            ...MUI_INPUT_SX['& .MuiOutlinedInput-root'],
                            fontSize: '0.85rem',
                        },
                    }}
                />
                <Button
                    variant="outlined"
                    sx={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 500,
                        fontSize: '0.85rem',
                        textTransform: 'none',
                        borderRadius: '8px',
                        borderColor: '#d8d4cc',
                        color: '#1a1a14',
                        whiteSpace: 'nowrap',
                        px: 2.5,
                        '&:hover': {borderColor: '#1a3c2e', color: '#1a3c2e', background: 'transparent'},
                    }}
                >
                    {t('checkout.summary.apply')}
                </Button>
            </div>


            {/* Totals */}
            <div className="flex flex-col gap-2.5">
                <div className="flex justify-between items-baseline">
                    <span
                        className="text-sm text-(--coal-bright) ">{t('checkout.summary.subtotal')} - {getTotalProductsLabel()}</span>
                    <span className="text-sm text-(--coal-bright) ">€{subtotal.toFixed(2)}</span>

                </div>
                <div className="flex justify-between items-baseline">
                    <span className="text-sm text-(--coal-bright) ">{t('checkout.summary.shipping')}</span>
                    <span className="text-sm text-(--coal-bright) ">€{shippingCost.toFixed(2)}</span>
                </div>
            </div>

            <Divider sx={{borderColor: '#e0ddd6'}}/>

            <div className="flex justify-between items-baseline">
                <span className="text-base font-semibold text-(--coal) ">{t('checkout.summary.total')}</span>
                <span className="font-bold text-(--green-pale)">
                    €{total.toFixed(2)}
                </span>
            </div>

            <p className="text-sm text-(--beige-grey) -mt-2 ">
                {t('checkout.summary.tax_note', {amount: tax.toFixed(2)})}
            </p>
            {/* All transactions are secured */}

            {/*<div className="flex items-center gap-1.5 text-[0.78rem] text-(--beige-grey) mt-auto pt-2 ">*/}
            {/*    <ShieldCheck size={14} className="text-(--beige-grey)"/>*/}
            {/*    <span>{t('checkout.summary.secure')}</span>*/}
            {/*</div>*/}
        </aside>
    );
}