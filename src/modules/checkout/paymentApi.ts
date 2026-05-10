import {Category, Order, TranslatedStrings} from '@/src/utils/types'
import apiClient from "@/src/lib/apiClient";
import {ShippingMethod} from "@/src/modules/checkout/useCheckout";

interface BasePaymentMethod {
    name: string;
    url: string;
    channel: string;
    display_name: string;
    logo_url: string;
}

interface WithCountry {
    country: string;
    countries: string[];
}

interface WithMaxAmount {
    max_amount: number;
}

interface WithMinMaxAmount extends WithMaxAmount {
    min_amount: number;
}

export interface Banklink extends BasePaymentMethod, WithCountry, WithMaxAmount {}
export interface Card extends BasePaymentMethod, WithMaxAmount {}
export interface PayLater extends BasePaymentMethod, WithCountry, WithMinMaxAmount {}
export type OtherPaymentMethod = Record<string, unknown>;

export interface GetPaymentMethodsResponse {
    banklinks: Banklink[];
    cards: Card[];
    payLater: PayLater[];
    other: OtherPaymentMethod[];
}

export interface CheckoutItem {
    productId: string;
    quantity:  number;
}

export interface ContactInfo {
    firstName: string;
    lastName:  string;
    email:     string;
    phone:     string;
    note?:     string;
}

export interface CreatePaymentRequest {
    currentOrderId?: string;
    items:          CheckoutItem[];
    shippingMethodId: string;     // e.g. 'omniva', 'dpd', 'pickup'
    paymentChannel: string;       // e.g. 'swedbank', 'visa' — passed to MK as channel
    estimatedTotal: number;       // client-calculated total; validated server-side
    contactInfo:    ContactInfo;
    locale?:        string;       // ISO 639-1, e.g. 'en' — passed to MK
}

export interface CheckoutResult {
    order:    Order;
    paymentUrl: string;           // MK redirect URL for the chosen payment channel
}

const paymentApi = {
    async getPaymentMethods(): Promise<GetPaymentMethodsResponse> {
        const res = await apiClient.get(`/payments/methods`);
        return res.data.data;
    },

    async getShippingMethods(): Promise<ShippingMethod[]> {
        const res = await apiClient.get(`/payments/shipping`);
        return res.data.data;
    },

    async initiateCheckout(rq: CreatePaymentRequest): Promise<CheckoutResult> {
        const res = await apiClient.post(`/payments/checkout`, rq);
        return res.data.data;
    },

    async checkOrder(orderId: string): Promise<Order> {
        const res = await apiClient.get(`/payments/${orderId}`);
        return res.data.data;
    },

    async abortOrder(orderId: string): Promise<Order> {
        const res = await apiClient.delete(`/payments/${orderId}`);
        return res.data.data;
    },

    async getOrders(): Promise<Order[]> {
        const res = await apiClient.get(`/payments`);
        return res.data.data;
    }
}

export default paymentApi;
