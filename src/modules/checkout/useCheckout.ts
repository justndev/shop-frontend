'use client';

import {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import useCartHook from '@/src/modules/cart/useCartHook';
import productApi from '@/src/lib/productApi';
import {Product} from '@/src/utils/types';
import {
    validateContact,
    validateDelivery,
    validateShipping,
    validatePayment,
    hasErrors,
    ContactSectionErrors,
    DeliverySectionErrors,
    ShippingSectionErrors,
    PaymentSectionErrors
} from '@/src/utils/validations';
import {useUserHook} from "@/src/lib/useUserHook";
import paymentApi, {
    Banklink,
    Card,
    CreatePaymentRequest,
    OtherPaymentMethod,
    PayLater
} from "@/src/modules/checkout/paymentApi";
import {useRouter} from "next/navigation";
import {clearCart, clearOrder, setOrder} from "@/src/store/slices/cartSlice";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/store";

export interface CheckoutLineItem {
    product: Product;
    quantity: number;
}

export type ShippingMethodType = 'parcel' | 'courier';

export interface ShippingMethod {
    id: string;
    type: ShippingMethodType;
    label: string;
    price: number;
    logo?: string; // text logo label for now
}

// Mocked pickup data per country
export const MOCK_CITIES: Record<string, string[]> = {
    EE: ['Tallinn', 'Tartu', 'Narva', 'Pärnu'],
    LV: ['Riga', 'Daugavpils', 'Liepāja'],
    LT: ['Vilnius', 'Kaunas', 'Klaipėda'],
    FI: ['Helsinki', 'Espoo', 'Tampere'],
};

export const MOCK_PICKUP_POINTS: Record<string, string[]> = {
    Tallinn: ['Ülemiste City', 'Rocca al Mare', 'Viru Keskus'],
    Tartu: ['Kvartal', 'Lõunakeskus'],
    Narva: ['Fama', 'Astri'],
    Pärnu: ['Port Artur', 'Pärnu Keskus'],
    Riga: ['Alfa', 'Domina Shopping'],
    Daugavpils: ['Ditton', 'Olimpia'],
    Liepāja: ['Ostmala', 'Rimi'],
    Vilnius: ['Akropolis', 'Ozas'],
    Kaunas: ['Mega', 'Akropolis'],
    Klaipėda: ['Taikos', 'Minijos'],
    Helsinki: ['Kamppi', 'Itis'],
    Espoo: ['Sello', 'Iso Omena'],
    Tampere: ['Koskikeskus', 'Ratina'],
};

export const COUNTRIES = [
    {code: 'EE', labelKey: 'countries.estonia'},
    {code: 'LV', labelKey: 'countries.latvia'},
    {code: 'LT', labelKey: 'countries.lithuania'},
    {code: 'FI', labelKey: 'countries.finland'},
];

const emptyContactSectionErrors: ContactSectionErrors = {email: null};
const emptyDeliverySectionErrors: DeliverySectionErrors = {firstName: null, lastName: null, phone: null, country: null};
const emptyShippingSectionErrors: ShippingSectionErrors = {
    method: null,
    city: null,
    pickupPoint: null,
    address: null,
    postalCode: null
};
const emptyPaymentSectionErrors: PaymentSectionErrors = {general: null};

export default function useCheckoutHook() {
    const {t, i18n} = useTranslation();
    const router = useRouter();
    const { currentOrder } = useSelector((state: RootState) => state.cart);
    const dispatch = useDispatch();
    const {user} = useUserHook();
    const {items} = useCartHook();

    // ── Contact ──
    const [email, setEmail] = useState('');
    const [newsletter, setNewsletter] = useState(false);
    const [contactErrors, setContactSectionErrors] = useState<ContactSectionErrors>(emptyContactSectionErrors);

    useEffect(() => {
        if (user?.email) setEmail(user.email);
    }, [user]);

    function validateContactSection(): boolean {
        const errs = validateContact({email}, t);
        setContactSectionErrors(errs);
        return !hasErrors(errs);
    }

    // ── Delivery ──
    const [country, setCountry] = useState('EE');
    const [firstName, setFirstName] = useState('test');
    const [lastName, setLastName] = useState('test');
    const [phone, setPhone] = useState('+3726363636');
    const [saveInfo, setSaveInfo] = useState(false);
    const [deliveryErrors, setDeliverySectionErrors] = useState<DeliverySectionErrors>(emptyDeliverySectionErrors);

    function validateDeliverySection(): boolean {
        const errs = validateDelivery({firstName, lastName, phone, country}, t);
        setDeliverySectionErrors(errs);
        return !hasErrors(errs);
    }

    // ── Shipping ──
    const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
    const [selectedShippingMethod, setSelectedShippingMethod] = useState<ShippingMethod | null>(null);
    const [shippingCity, setShippingCity] = useState('');
    const [pickupPoint, setPickupPoint] = useState('');
    const [address, setAddress] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [shippingErrors, setShippingSectionErrors] = useState<ShippingSectionErrors>(emptyShippingSectionErrors);

    // ── Payments ──
    const [paymentCards, setPaymentMethodCards] = useState<Card[]>([]);
    const [paymentBanks, setPaymentBanks] = useState<Banklink[]>([]);
    const [selectedPayment, setSelectedPayment] = useState<string>('');
    const [paymentErrors, setPaymentErrors] = useState<PaymentSectionErrors>(emptyPaymentSectionErrors);


    // Reset location fields when method changes
    function handleSetShippingMethod(methodId: string) {
        const selected = shippingMethods.find((method) => method.id === methodId);

        setSelectedShippingMethod(selected);
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
            {method: selectedShippingMethod, city: shippingCity, pickupPoint, address, postalCode},
            t
        );
        setShippingSectionErrors(errs);
        return !hasErrors(errs);
    }

    // ── Discount ──
    const [discountCode, setDiscountCode] = useState('');

    // ── Line items ──
    const [lineItems, setLineItems] = useState<CheckoutLineItem[]>([]);
    const [itemsReady, setItemsReady] = useState(false);
    const [totalProducts, setTotalProduct] = useState(0)

    // TODO handle server errors
    useEffect(() => {
        if (currentOrder) router.push(`/order?orderId=${currentOrder.id}`);

        if (!items?.length) {
            setLineItems([]);
            setItemsReady(true);
            return;
        }

        async function load() {
            /*  Refresh product stock quantity  */
            setItemsReady(false);
            const enriched = await Promise.all(
                items.map(async (ci) => {
                    try {
                        const fresh = await productApi.getById(ci.product.id);
                        setTotalProduct(totalProducts + ci.quantity);
                        return {product: fresh, quantity: ci.quantity};
                        // if (ci.quantity > fresh.stock) ci.quantity = fresh.stock; // clamp — disabled
                    } catch {
                        return {product: ci.product, quantity: ci.quantity};
                    }
                })
            );

            setLineItems(enriched);
            setItemsReady(true);

            /*  Get payment methods  */
            const paymentMethods = await paymentApi.getPaymentMethods();
            setPaymentBanks(paymentMethods.banklinks);
            setPaymentMethodCards(paymentMethods.cards);

            /*  Get shipping methods  */
            const shippingMethods = await paymentApi.getShippingMethods();
            setShippingMethods(shippingMethods);

        }

        load();
    }, [items]);

    // ── Totals ──
    const shippingCost = selectedShippingMethod?.price ?? 0;
    const subtotal = lineItems.reduce((s, i) => s + i.product.price * i.quantity, 0);
    const total = subtotal + shippingCost;
    const tax = total * (22 / 122);

    // ── Submit ──
    async function handleSubmit() {
        const c = validateContactSection();
        const d = validateDeliverySection();
        const s = validateShippingSection();
        const p = validatePaymentSection();
        if (!c || !d || !s || !p) return;
        // TODO: submit order

        const parsedCartItems = lineItems.map((lineItem) => {
            return {quantity: lineItem.quantity, productId: lineItem.product.id}
        })

        const rq: CreatePaymentRequest = {
            currentOrderId: currentOrder ? currentOrder.id : undefined,
            contactInfo: {
                firstName,
                lastName,
                phone,
                email,
            },
            estimatedTotal: total,
            items: parsedCartItems,
            locale: i18n.language,
            paymentChannel: selectedPayment,
            shippingMethodId: selectedShippingMethod.id

        }
        const resData = await paymentApi.initiateCheckout(rq);
        dispatch(setOrder(resData.order));
        router.push(`/mkMock?orderId=${resData.order.id}&mkTransactionId=${resData.order.mkTransactionId}`)
    }

    // ── Select Payment ──
    function handleSelectPayment(paymentName: string) {
        setSelectedPayment(paymentName);
    }

    function validatePaymentSection(): boolean {
        const errs = validatePayment(selectedPayment, t);
        setPaymentErrors(errs);
        return !hasErrors(errs);
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
        shippingMethods,
        selectedShippingMethod,
        handleSetShippingMethod,
        shippingCity, handleSetShippingCity,
        pickupPoint, setPickupPoint,
        address, setAddress,
        postalCode, setPostalCode,
        shippingErrors, validateShippingSection,
        // payments
        paymentBanks,
        paymentCards,
        selectedPayment,
        handleSelectPayment,
        paymentErrors,
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