import {PasswordErrors, PasswordFields, ProfileInfo, ProfileInfoErrors} from "@/src/modules/profile/useProfileHook"
import {RegisterErrors, RegisterFields} from "@/src/modules/auth/useRegisterHook"
import {LoginErrors, LoginFields} from "@/src/modules/auth/useLoginHook";
import {ContactMessageData} from "@/src/modules/contact/contactApi";
import {t} from "i18next";

type T = (key: string) => string;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LIMITS = {
    name: {max: 100},      // was 50, corrected to match Zod schema
    email: {max: 254},
    password: {min: 8, max: 128},
    subject: {max: 200},   // new
    message: {max: 2000}   // new
};


// ─── Error interfaces ────────────────────────────────────────────────────────
// Kept here alongside validators so the shape of errors is always co-located
// with the logic that produces them.

export interface ContactErrors {
    name: string | null;
    email: string | null;
    subject: string | null;
    message: string | null;
}

export interface ContactSectionErrors {
    email: string | null;
}

export interface DeliverySectionErrors {
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    country: string | null;
}

export interface ShippingSectionErrors {
    method: string | null;
    city: string | null;
    pickupPoint: string | null;
    address: string | null;
    postalCode: string | null;
}

export interface PaymentSectionErrors {
    general: string | null;
}

export function hasErrors(e: Record<string, string | null>): boolean {
    return Object.values(e).some(v => v !== null);
}


// ─── Primitive field validators ──────────────────────────────────────────────
// Each validates exactly one field and returns a translated error string or
// null when valid. Composed by the form-level validators below.


function validateName(value: string | undefined, t: T): string | null {
    if (!value || !value.trim()) return t("validation.name_required");
    if (value.length > LIMITS.name.max) return t("validation.name_too_long");
    return null;
}

function validateSubject(value: string | undefined, t: T): string | null {
    if (!value || !value.trim()) return t("validation.required");
    if (value.length > LIMITS.subject.max) return t("validation.subject_too_long");
    return null;
}

function validateMessage(value: string | undefined, t: T): string | null {
    if (!value || !value.trim()) return t("validation.required");
    if (value.length > LIMITS.message.max) return t("validation.message_too_long");
    return null;
}

export function validateEmail(value: string | undefined, t: T): string | null {
    if (!value) return t("validation.email_required");
    if (!EMAIL_REGEX.test(value)) return t("validation.email_invalid");
    if (value.length > LIMITS.email.max) return t("validation.email_too_long");
    return null;
}

export function validateNewPassword(value: string | undefined, t: T): string | null {
    if (!value) return t("validation.password_required");
    if (value.length < LIMITS.password.min) return t("validation.password_too_short");
    if (value.length > LIMITS.password.max) return t("validation.password_too_long");
    return null;
}

function validateRepeatPassword(password: string, repeat: string | undefined, t: T): string | null {
    if (!repeat) return t("validation.repeat_password_required");
    if (password !== repeat) return t("validation.passwords_do_not_match");
    return null;
}

// ─── Checkout validators ─────────────────────────────────────────────────────

export function validateContact(fields: { email: string }, t: (k: string) => string): ContactSectionErrors {
    return {
        email: !fields.email
            ? t('errors.email_required')
            : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)
                ? t('errors.email_invalid')
                : null,
    };
}

export function validateDelivery(
    fields: { firstName: string; lastName: string; phone: string; country: string },
    t: (k: string) => string
): DeliverySectionErrors {
    return {
        firstName: !fields.firstName.trim() ? t('validation.first_name_required') : null,
        lastName: !fields.lastName.trim() ? t('validation.last_name_required') : null,
        phone: !fields.phone.trim()
            ? t('validation.phone_required')
            : !/^\+?[\d\s\-()]{7,}$/.test(fields.phone)
                ? t('validation.phone_invalid')
                : null,
        country: !fields.country ? t('validation.country_required') : null,
    };
}

export function validateShipping(
    fields: {
        method: string;
        city?: string;
        pickupPoint?: string;
        address?: string;
        postalCode?: string;
    },
    t: (k: string) => string
): ShippingSectionErrors {
    const errors: ShippingSectionErrors = {
        method: !fields.method ? t('validation.shipping_method_required') : null,
        city: null,
        pickupPoint: null,
        address: null,
        postalCode: null,
    };

    // if (methodType === 'parcel') {
    //     if (!fields.city) errors.city = t('validation.city_required');
    //     if (!fields.pickupPoint) errors.pickupPoint = t('validation.pickup_point_required');
    // }
    //
    // if (methodType === 'courier') {
    //     if (!fields.address) errors.address = t('validation.address_required');
    //     if (!fields.postalCode) errors.postalCode = t('validation.postal_code_required');
    //     if (!fields.city) errors.city = t('validation.city_required');
    // }

    return errors;
}

export function validatePayment(selectedPayment: string, t: (k: string) => string): PaymentSectionErrors {
    if (!selectedPayment) return {
        general: t("validation.payment_required")
    };
    return {general: null}
}

// ─── Form-level validators ───────────────────────────────────────────────────
// Accept all fields for a form, run the relevant primitive validators, and
// return a typed error map (null = no error for that field).

export function validateProfileInfo(info: ProfileInfo, t: T): ProfileInfoErrors {
    return {
        firstName: validateName(info.firstName, t),
        lastName: validateName(info.lastName, t)
    };
}

export function validatePassword(fields: PasswordFields, t: T): PasswordErrors {
    return {
        currentPassword: !fields.currentPassword ? t("validation.current_password_required") : null,
        newPassword: validateNewPassword(fields.newPassword, t),
        repeatPassword: validateRepeatPassword(fields.newPassword, fields.repeatPassword, t)
    };
}

export function validateRegister(fields: RegisterFields, t: T): RegisterErrors {
    return {
        firstName: validateName(fields.firstName, t),
        lastName: validateName(fields.lastName, t),
        email: validateEmail(fields.email, t),
        password: validateNewPassword(fields.password, t)
    };
}

export function validateLogin(fields: LoginFields, t: T): LoginErrors {
    return {
        email: validateEmail(fields.email, t),
        password: validateNewPassword(fields.password, t)
    };
}

export function validateContactMessage(fields: ContactMessageData, t: T): ContactErrors {
    return {
        name: validateName(fields.name, t),
        email: validateEmail(fields.email, t),
        subject: validateSubject(fields.subject, t),
        message: validateMessage(fields.message, t),
    };
}