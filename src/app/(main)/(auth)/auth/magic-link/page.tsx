'use client';

import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'next/navigation';

import { useAuthHook } from '@/src/modules/auth/useAuthHook';

import { Typography } from '@mui/material';
import Link from 'next/link';


export default function MagicLinkPage() {
    const { t } = useTranslation();
    const { handleVerifyMagicLink, errors, loadings } = useAuthHook();

    const searchParams = useSearchParams();
    const token = searchParams.get('token') || '';

    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return
        hasRun.current = true
        handleVerifyMagicLink(token)
    }, []);

    return (
        <div className="account-page justify-center">
            <div className="backend-response-card">

                {loadings.verifyMagicLink && (
                    <>
                        <div className="text-5xl mb-4 animate-pulse">⏳</div>
                        <Typography variant="h6">{t('auth.magic_link.loading')}</Typography>
                    </>
                )}

                {errors.verifyMagicLink && (
                    <>
                        <div className="text-5xl mb-4">❌</div>
                        <Typography variant="h6" fontWeight={700} className="mb-2">
                            {t('auth.magic_link.error_title')}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" className="mb-6">
                            {t('auth.magic_link.error_desc')}
                        </Typography>
                        <Link
                            href="/login"
                            className="text-[#1a3c2e] font-semibold hover:underline text-sm"
                        >
                            {t('auth.magic_link.go_to_login')}
                        </Link>
                    </>
                )}

            </div>
        </div>
    );
}
