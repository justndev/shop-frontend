'use client';

import {Button} from '@mui/material';
import Link from 'next/link';
import {useTranslation} from 'react-i18next';
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
        '& fieldset': {borderColor: '#d8d4cc', borderWidth: '0.5px'},
        '&:hover fieldset': {borderColor: '#a8a49c'},
        '&.Mui-focused fieldset': {borderColor: '#1a3c2e', borderWidth: '1px'},
    },
    '& .MuiInputLabel-root': {
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '0.9rem',
        color: '#888880',
        '&.Mui-focused': {color: '#1a3c2e'},
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
    const {t} = useTranslation();
    const checkout = useCheckoutHook();

    return (
        <div className="md:grid-cols-[55%_45%] justify-center min-h-screen bg-(--beige) grid grid-cols-1">

            {/* ── Left column — scrollable ── */}
            <div className="flex lg:justify-end justify-center pt-26">
                <div className="w-full max-w-150 flex flex-col gap-10 md:px-8 px-4 py-8">

                    <ContactInfoSection
                        user={checkout.user}
                        email={checkout.email} setEmail={checkout.setEmail}
                        newsletter={checkout.newsletter} setNewsletter={checkout.setNewsletter}
                        contactErrors={checkout.contactErrors}
                    />

                    <DeliverySection
                        country={checkout.country} setCountry={checkout.setCountry}
                        firstName={checkout.firstName} setFirstName={checkout.setFirstName}
                        lastName={checkout.lastName} setLastName={checkout.setLastName}
                        phone={checkout.phone} setPhone={checkout.setPhone}
                        saveInfo={checkout.saveInfo} setSaveInfo={checkout.setSaveInfo}
                        deliveryErrors={checkout.deliveryErrors}
                    />

                    <ShippingMethodSection
                        shippingMethods={checkout.shippingMethods}
                        country={checkout.country}
                        handleSetShippingMethod={checkout.handleSetShippingMethod}
                        selectedShippingMethod={checkout.selectedShippingMethod}
                        shippingCity={checkout.shippingCity}
                        handleSetShippingCity={checkout.handleSetShippingCity}
                        pickupPoint={checkout.pickupPoint} setPickupPoint={checkout.setPickupPoint}
                        address={checkout.address} setAddress={checkout.setAddress}
                        postalCode={checkout.postalCode} setPostalCode={checkout.setPostalCode}
                        shippingErrors={checkout.shippingErrors}
                    />

                    <PaymentSection
                        paymentBanks={checkout.paymentBanks}
                        paymentCards={checkout.paymentCards}
                        selected={checkout.selectedPayment}
                        onSelect={checkout.handleSelectPayment}
                        paymentErrors={checkout.paymentErrors}
                    />

                    {/* Mobile-only summary */}
                    <div className="lg:hidden">
                        <OrderSummary
                            totalProducts={checkout.totalProducts}
                            lineItems={checkout.lineItems} itemsReady={checkout.itemsReady}
                            subtotal={checkout.subtotal} shippingCost={checkout.shippingCost}
                            total={checkout.total} tax={checkout.tax}
                            discountCode={checkout.discountCode} setDiscountCode={checkout.setDiscountCode}
                        />
                    </div>

                    <Button
                        fullWidth variant="contained" size="large"
                        onClick={checkout.handleSubmit}
                        sx={{
                            backgroundColor: 'var(--green-pale)', color: '#fff',
                            fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
                            fontSize: '1rem', letterSpacing: '0.2em',
                            textTransform: 'uppercase', borderRadius: '8px',
                            py: 1.75, boxShadow: 'none',
                            '&:hover': {backgroundColor: 'var(--green-pale-lighter)', boxShadow: 'none'},
                        }}
                    >
                        {t('checkout.pay_now')}
                    </Button>

                    <div className="grid grid-cols-2 md:grid-cols-4 pt-2 border-t border-t-(--border-checkout) justify-around">
                        {([
                            ['checkout.footer.refund_policy', '/returns'],
                            ['checkout.footer.terms_of_service', '/terms'],
                            ['checkout.footer.privacy_policy', '/privacy'],
                            ['checkout.footer.cookie_policy', '/cookies'],
                        ] as const).map(([key, href]) => (
                            <Link key={key} href={href}
                                  className="w-full text-center text-xs text-(--beige-grey) no-underline py-2 transition-colors hover:text-(--green-pale) font-['DM_Sans',sans-serif]">
                                {t(key)}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Vertical divider — desktop only */}
            {/*<div className="hidden lg:block border-r border-r-(--border-checkout)"/>*/}

            {/* ── Right column — sticky on desktop ── */}
            {/*
              * The column itself is NOT min-h-screen anymore.
              * Instead we use `self-start sticky top-0` so it sticks at the
              * top of the viewport while the left column scrolls past it.
              * The inner wrapper adds the padding/bg — no height needed.
              */}
            <div className="hidden lg:flex bg-(--beige-light) h-full min-h-screen pt-24">
                <div className="self-start sticky top-15">
                    <OrderSummary
                        totalProducts={checkout.totalProducts}
                        lineItems={checkout.lineItems} itemsReady={checkout.itemsReady}
                        subtotal={checkout.subtotal} shippingCost={checkout.shippingCost}
                        total={checkout.total} tax={checkout.tax}
                        discountCode={checkout.discountCode} setDiscountCode={checkout.setDiscountCode}
                    />
                </div>

            </div>
        </div>
    );
}