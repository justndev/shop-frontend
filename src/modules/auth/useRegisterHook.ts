'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import authApi from '@/src/modules/auth/authApi';
import {validateRegister} from "@/src/utils/validations";
import {Alert} from "@/src/types";


export interface RegisterFields {
    email: string
    password: string
    firstName?: string
    lastName?: string
}

export interface RegisterErrors {
    firstName: string | null
    lastName: string | null
    email: string | null
    password: string | null
}

export function useRegisterHook() {
    const { t } = useTranslation();

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState<RegisterErrors>({
        firstName: null,
        lastName: null,
        email: null,
        password: null
    });
    const [signupAlert, setSignupAlert] = useState<Alert | null>();

    function validate(fields: RegisterFields): boolean {
        const result = validateRegister(fields, t);
        setErrors(result);
        return !hasErrors(result);
    };

    async function handleRegister(fields: RegisterFields, onSuccess: () => void) {
        setSuccess(false);
        if (!validate(fields)) return;

        setLoading(true);

        try {
            await authApi.register({
                email: fields.email,
                password: fields.password,
                firstName: fields.firstName || undefined,
                lastName: fields.lastName || undefined,
            });
            setSignupAlert({type: 'success', message: t('auth.register.check_email') });
            onSuccess();
        } catch (err: any) {
            const key = "errors." + (err.response?.data?.details || "user_not_added");
            setSignupAlert({type: 'error', message: t(key) });
        } finally {
            setLoading(false);
        }
    }

    return {
        loading,
        errors,
        success,
        handleRegister,
        signupAlert
    }
}

function hasErrors(errors: RegisterErrors): boolean {
    return Object.values(errors).some(v => v !== null);
}
