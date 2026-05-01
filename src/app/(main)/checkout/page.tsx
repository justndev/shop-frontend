'use client';

import {Button, Divider} from '@mui/material';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import useCheckoutHook from "@/src/modules/checkout/useCheckout";
import ContactInfoSection from "@/src/modules/checkout/ContactInfoSection";
import DeliverySection from "@/src/modules/checkout/DeliverySection";
import ShippingMethodSection from "@/src/modules/checkout/ShippingMethodSection";
import PaymentSection from "@/src/modules/checkout/PaymentSection";
import OrderSummary from "@/src/modules/checkout/OrderSummary";


export const MUI_INPUT_SX = {
    '& .MuiOutlinedInput-root': {
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '0.9rem',
        borderRadius: '8px',
        background: '#fff',
        '& fieldset': { borderColor: '#d8d4cc', borderWidth: '0.5px' },
        '&:hover fieldset': { borderColor: '#a8a49c' },
        '&.Mui-focused fieldset': { borderColor: '#1a3c2e', borderWidth: '1px' },
    },
    '& .MuiInputLabel-root': {
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '0.9rem',
        color: '#888880',
        '&.Mui-focused': { color: '#1a3c2e' },
    },
};

export const MUI_SELECT_SX = {
    ...MUI_INPUT_SX,
    '& .MuiSelect-select': {
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '0.9rem',
        background: '#fff',
        borderRadius: '8px',
    },
};

export default function CheckoutPage() {
    const { t } = useTranslation();
    const checkout = useCheckoutHook();

    return (
        <div className="lg:flex-row justify-center min-h-screen bg-[#faf9f7] flex flex-col">
            {/* ── Left column ── */}
            <div className='lg:w-[55%] flex lg:justify-end justify-center'>
                <div className="w-full max-w-[600px] px-6 lg:px-14 py-12 pt-18 lg:py-18 flex flex-col gap-10">

                <ContactInfoSection
                        user={checkout.user}
                        email={checkout.email}             setEmail={checkout.setEmail}
                        newsletter={checkout.newsletter}   setNewsletter={checkout.setNewsletter}
                        contactErrors={checkout.contactErrors}
                    />

                    <DeliverySection
                        country={checkout.country}         setCountry={checkout.setCountry}
                        firstName={checkout.firstName}     setFirstName={checkout.setFirstName}
                        lastName={checkout.lastName}       setLastName={checkout.setLastName}
                        phone={checkout.phone}             setPhone={checkout.setPhone}
                        saveInfo={checkout.saveInfo}       setSaveInfo={checkout.setSaveInfo}
                        deliveryErrors={checkout.deliveryErrors}
                    />

                    <ShippingMethodSection
                        country={checkout.country}
                        shippingMethodId={checkout.shippingMethodId}
                        handleSetShippingMethod={checkout.handleSetShippingMethod}
                        selectedMethod={checkout.selectedMethod}
                        shippingCity={checkout.shippingCity}
                        handleSetShippingCity={checkout.handleSetShippingCity}
                        pickupPoint={checkout.pickupPoint}   setPickupPoint={checkout.setPickupPoint}
                        address={checkout.address}           setAddress={checkout.setAddress}
                        postalCode={checkout.postalCode}     setPostalCode={checkout.setPostalCode}
                        shippingErrors={checkout.shippingErrors}
                    />

                    <PaymentSection />

                    {/* Mobile-only summary — shown between shipping and payment */}
                    <div className="lg:hidden">
                        <OrderSummary
                            totalProducts={checkout.totalProducts}
                            lineItems={checkout.lineItems}       itemsReady={checkout.itemsReady}
                            subtotal={checkout.subtotal}         shippingCost={checkout.shippingCost}
                            total={checkout.total}               tax={checkout.tax}
                            discountCode={checkout.discountCode} setDiscountCode={checkout.setDiscountCode}
                        />                    </div>
                    <Button
                        fullWidth variant="contained" size="large"
                        onClick={checkout.handleSubmit}
                        sx={{
                            backgroundColor: '#1a3c2e', color: '#fff',
                            fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                            fontSize: '1rem', letterSpacing: '0.04em',
                            textTransform: 'uppercase', borderRadius: '8px',
                            py: 1.75, boxShadow: 'none',
                            '&:hover': { backgroundColor: '#2d5c46', boxShadow: 'none' },
                        }}
                    >
                        {t('checkout.pay_now')}
                    </Button>

                    <div className="flex flex-wrap gap-y-2 gap-x-5 pt-2 border-t border-t-[#e0ddd6] border-t-[0.5px]">
                        {([
                            ['checkout.footer.refund_policy',   '/legal/returns'],
                            ['checkout.footer.terms_of_service','/legal/terms'],
                            ['checkout.footer.privacy_policy',  '/legal/privacy'],
                            ['checkout.footer.cookie_policy',   '/legal/cookies'],
                        ] as const).map(([key, href]) => (
                            <Link key={key} href={href}
                                  className="text-[0.78rem] text-[#888880] no-underline transition-colors hover:text-[#1a3c2e] font-['DM_Sans',sans-serif]">
                                {t(key)}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Vertical divider — desktop only */}
            <div className='hidden lg:block border-r border-r-[#e0ddd6] border-r-[0.5px]'/>

            {/* ── Right column — desktop only ── */}
            <div className='hidden lg:flex bg-(--beige-light) lg:w-[45%] min-h-screen justify-start sticky top-2 h-screen overflow-y-auto'>
            <OrderSummary
                    totalProducts={checkout.totalProducts}
                    lineItems={checkout.lineItems}       itemsReady={checkout.itemsReady}
                    subtotal={checkout.subtotal}         shippingCost={checkout.shippingCost}
                    total={checkout.total}               tax={checkout.tax}
                    discountCode={checkout.discountCode} setDiscountCode={checkout.setDiscountCode}
                />
            </div>


        </div>
    );
}