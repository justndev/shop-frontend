'use client';

import { useState } from 'react';
import { useDispatch } from "react-redux";
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation';

import authApi from '@/src/modules/auth/authApi'
import { setUser, clearUser } from '@/src/store/slices/userSlice'
import {validateLogin} from "@/src/utils/validations";

import {Alert} from "@/src/utils/types";


export interface LoginFields {
    email: string;
    password: string;
}

export interface LoginErrors {
    email: string | null;
    password: string | null;
}

export function useLoginHook() {
    const { t } = useTranslation();
    const router = useRouter();
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<LoginErrors>({ email: null, password: null});
    const [loginAlert, setLoginAlert] = useState<Alert | null>();

    async function handleLogin(fields: LoginFields) {
        if (!validate(fields)) return;

        setLoading(true);
        setErrors({ email: null, password: null });

        try {
            const res = await authApi.login(fields.email, fields.password);
            authApi.saveTokens(res.data);
            const meRes = await authApi.getMe();
            dispatch(setUser(meRes.data));
            router.push('/account');
        } catch (err: any) {
            const key = 'errors.' + (err.response?.data?.details || 'login_failed');
            setLoginAlert({type: 'error', message: t(key)});
        } finally {
            setLoading(false);
        }
    }

    async function handleLogout() {
        try {
            const refreshToken = authApi.getRefreshToken();
            if (refreshToken) await authApi.logout(refreshToken);
        } finally {
            authApi.clearTokens();
            dispatch(clearUser());
            router.push('/');
        }
    }

    async function handleLoginWithEmailLink(email: string) {
        if (!validate({email, password: 'password'})) return;

        setLoading(true);
        setErrors({ email: null, password: null });

        try {
            await authApi.loginWithEmailLink(email);
            setLoginAlert({
                type: 'success',
                message: t('auth.login.email_link_was_sent')
            })
        } catch (err) {
            const key = 'errors.' + (err.response?.data?.details || 'email_link_sending_failed');
            setLoginAlert({type: 'error', message: t(key)});
        } finally {
            setLoading(false);
        }
    }

    function validate(fields: LoginFields): boolean {
        const result = validateLogin(fields, t);
        setErrors(result);
        return !result.email && !result.password;
    }

    return {
        loading,
        errors,
        loginAlert,

        handleLogin,
        handleLoginWithEmailLink,
        handleLogout,
    }
}
