'use client';

import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { useSearchParams } from 'next/navigation';

import { useAuthHook } from '@/src/modules/auth/useAuthHook';

import Link from 'next/link';
import { Typography } from '@mui/material';


export default function VerifyEmailPage() {
    const { t } = useTranslation();
    const { errors, loadings, handleVerifyEmail } = useAuthHook();

    const searchParams = useSearchParams();
    const token = searchParams.get('token') || '';
    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;
        handleVerifyEmail(token);
    }, []);

    return (
        <div className="account-page justify-center">
            <div className="backend-response-card">

                {loadings.verifyEmail && (
                    <>
                        <div className="text-5xl mb-4 animate-pulse">⏳</div>
                        <Typography variant="h6">{t('auth.verify_email.loading')}</Typography>
                    </>
                )}

                {errors.verifyEmail && (
                    <>
                        <div className="text-5xl mb-4">❌</div>
                        <Typography variant="h6" fontWeight={700} className="mb-2">
                            {t('auth.verify_email.error_title')}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" className="mb-6">
                            {t('auth.verify_email.error_desc')}
                        </Typography>
                        <Link
                            href="/register"
                            className="text-[#1a3c2e] font-semibold hover:underline text-sm"
                        >
                            {t('auth.verify_email.go_to_register')}
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}
