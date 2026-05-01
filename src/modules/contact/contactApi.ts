// src/modules/contact/contactApi.ts
import apiClient from "@/src/lib/apiClient";

export interface ContactMessageData {
    name: string;
    email: string;
    subject: string;
    message: string;
}
export interface SendContactMessageResponse {
    details: ContactMessageResponseDetails;
}
export type ContactMessageResponseDetails=
    | 'message_delivered'
    | 'validation_failed'
    | 'message_delivery_failed';

const contactApi = {
    /*
     * Possible response statuses from /bot/transport:
     *
     * - message_delivered        → Message was successfully sent
     * - validation_failed        → Input data failed validation
     * - message_delivery_failed  → Server failed to deliver the message
     */
    async sendContactMessage(data: ContactMessageData): Promise<SendContactMessageResponse> {
        const response = await apiClient.post('/bot/transport', data);
        return response.data;
    }
}

export default contactApi;
