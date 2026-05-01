'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useCartHook from '@/src/modules/cart/useCartHook';
import productApi from '@/src/lib/productApi';
import { Product } from '@/src/utils/types';
import {
    validateContact,
    validateDelivery,
    validateShipping,
    hasErrors,
    ContactSectionErrors,
    DeliverySectionErrors,
    ShippingSectionErrors,
} from '@/src/utils/validations';
import {useUserHook} from "@/src/lib/useUserHook";

export interface CheckoutLineItem {
    product: Product;
    quantity: number;
}

export type ShippingMethodType = 'parcel' | 'courier';

export interface ShippingMethod {
    id:    string;
    type:  ShippingMethodType;
    label: string;
    price: number;
    logo?: string; // text logo label for now
}

export const SHIPPING_METHODS: ShippingMethod[] = [
    { id: 'smartpost_parcel',  type: 'parcel',  label: 'SmartPost parcel machine', price: 2.10, logo: 'smartpost' },
    { id: 'smartpost_courier', type: 'courier', label: 'SmartPost courier',         price: 5.49, logo: 'smartpost' },
    { id: 'omniva_parcel',     type: 'parcel',  label: 'Omniva parcel machine',     price: 3.99, logo: 'omniva'    },
];

// Mocked pickup data per country
export const MOCK_CITIES: Record<string, string[]> = {
    EE: ['Tallinn', 'Tartu', 'Narva', 'Pärnu'],
    LV: ['Riga', 'Daugavpils', 'Liepāja'],
    LT: ['Vilnius', 'Kaunas', 'Klaipėda'],
    FI: ['Helsinki', 'Espoo', 'Tampere'],
};

export const MOCK_PICKUP_POINTS: Record<string, string[]> = {
    Tallinn:    ['Ülemiste City', 'Rocca al Mare', 'Viru Keskus'],
    Tartu:      ['Kvartal', 'Lõunakeskus'],
    Narva:      ['Fama', 'Astri'],
    Pärnu:      ['Port Artur', 'Pärnu Keskus'],
    Riga:       ['Alfa', 'Domina Shopping'],
    Daugavpils: ['Ditton', 'Olimpia'],
    Liepāja:    ['Ostmala', 'Rimi'],
    Vilnius:    ['Akropolis', 'Ozas'],
    Kaunas:     ['Mega', 'Akropolis'],
    Klaipėda:   ['Taikos', 'Minijos'],
    Helsinki:   ['Kamppi', 'Itis'],
    Espoo:      ['Sello', 'Iso Omena'],
    Tampere:    ['Koskikeskus', 'Ratina'],
};

export const COUNTRIES = [
    { code: 'EE', labelKey: 'countries.estonia'   },
    { code: 'LV', labelKey: 'countries.latvia'    },
    { code: 'LT', labelKey: 'countries.lithuania' },
    { code: 'FI', labelKey: 'countries.finland'   },
];

const emptyContactSectionErrors:  ContactSectionErrors  = { email: null };
const emptyDeliverySectionErrors: DeliverySectionErrors = { firstName: null, lastName: null, phone: null, country: null };
const emptyShippingSectionErrors: ShippingSectionErrors = { method: null, city: null, pickupPoint: null, address: null, postalCode: null };

export default function useCheckoutHook() {
    const { t } = useTranslation();
    const { user } = useUserHook();
    const { items } = useCartHook();

    // ── Contact ──
    const [email,       setEmail]       = useState('');
    const [newsletter,  setNewsletter]  = useState(false);
    const [contactErrors, setContactSectionErrors] = useState<ContactSectionErrors>(emptyContactSectionErrors);

    useEffect(() => { if (user?.email) setEmail(user.email); }, [user]);

    function validateContactSection(): boolean {
        const errs = validateContact({ email }, t);
        setContactSectionErrors(errs);
        return !hasErrors(errs);
    }

    // ── Delivery ──
    const [country,    setCountry]    = useState('EE');
    const [firstName,  setFirstName]  = useState('');
    const [lastName,   setLastName]   = useState('');
    const [phone,      setPhone]      = useState('');
    const [saveInfo,   setSaveInfo]   = useState(false);
    const [deliveryErrors, setDeliverySectionErrors] = useState<DeliverySectionErrors>(emptyDeliverySectionErrors);

    function validateDeliverySection(): boolean {
        const errs = validateDelivery({ firstName, lastName, phone, country }, t);
        setDeliverySectionErrors(errs);
        return !hasErrors(errs);
    }

    // ── Shipping ──
    const [shippingMethodId, setShippingMethodId] = useState<string>('');
    const [shippingCity,     setShippingCity]     = useState('');
    const [pickupPoint,      setPickupPoint]      = useState('');
    const [address,          setAddress]          = useState('');
    const [postalCode,       setPostalCode]       = useState('');
    const [shippingErrors,   setShippingSectionErrors]   = useState<ShippingSectionErrors>(emptyShippingSectionErrors);

    const selectedMethod = SHIPPING_METHODS.find(m => m.id === shippingMethodId) ?? null;

    // Reset location fields when method changes
    function handleSetShippingMethod(id: string) {
        setShippingMethodId(id);
        setShippingCity('');
        setPickupPoint('');
        setAddress('');
        setPostalCode('');
        setShippingSectionErrors(emptyShippingSectionErrors);
    }

    function handleSetShippingCity(city: string) {
        setShippingCity(city);
        setPickupPoint(''); // reset pickup when city changes
    }

    function validateShippingSection(): boolean {
        const errs = validateShipping(
            { method: shippingMethodId, city: shippingCity, pickupPoint, address, postalCode },
            selectedMethod?.type ?? null,
            t
        );
        setShippingSectionErrors(errs);
        return !hasErrors(errs);
    }

    // ── Discount ──
    const [discountCode, setDiscountCode] = useState('');

    // ── Line items ──
    const [lineItems,  setLineItems]  = useState<CheckoutLineItem[]>([]);
    const [itemsReady, setItemsReady] = useState(false);
    const [totalProducts, setTotalProduct] = useState(0)

    useEffect(() => {
        if (!items?.length) { setLineItems([]); setItemsReady(true); return; }
        async function load() {
            setItemsReady(false);
            const enriched = await Promise.all(
                items.map(async (ci) => {
                    try {
                        const fresh = await productApi.getById(ci.product.id);
                        setTotalProduct(totalProducts + ci.quantity);
                        return { product: fresh, quantity: ci.quantity };
                        // if (ci.quantity > fresh.stock) ci.quantity = fresh.stock; // clamp — disabled
                    } catch { return { product: ci.product, quantity: ci.quantity }; }
                })

            );
            const duplicated = [];
            for (let i = 0; i < 6; i++) {
                duplicated.push(enriched[0]);
            }
            setLineItems(duplicated);
            setItemsReady(true);
        }
        load();
    }, [items]);

    // ── Totals ──
    const shippingCost = selectedMethod?.price ?? 0;
    const subtotal     = lineItems.reduce((s, i) => s + i.product.price * i.quantity, 0);
    const total        = subtotal + shippingCost;
    const tax          = total * (22 / 122);

    // ── Submit ──
    function handleSubmit() {
        const c = validateContactSection();
        const d = validateDeliverySection();
        const s = validateShippingSection();
        if (!c || !d || !s) return;
        // TODO: submit order
    }

    return {
        // user
        user,
        // contact
        email, setEmail, newsletter, setNewsletter, contactErrors,
        validateContactSection,
        // delivery
        country, setCountry,
        firstName, setFirstName, lastName, setLastName,
        phone, setPhone, saveInfo, setSaveInfo,
        deliveryErrors, validateDeliverySection,
        // shipping
        shippingMethodId, selectedMethod,
        handleSetShippingMethod,
        shippingCity, handleSetShippingCity,
        pickupPoint, setPickupPoint,
        address, setAddress,
        postalCode, setPostalCode,
        shippingErrors, validateShippingSection,
        // discount
        discountCode, setDiscountCode,
        // items & totals
        lineItems, itemsReady,
        totalProducts,
        shippingCost, subtotal, total, tax,
        // submit
        handleSubmit,
    };
}