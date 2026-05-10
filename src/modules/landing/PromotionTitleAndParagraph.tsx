'use client';

import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';


export default function PromotionTitleAndParagraph() {
    const { t } = useTranslation();

    return (
        <div className="w-full bg-white text-center relative z-10">
            <div className="max-w-375 mx-auto md:py-16 py-8 px-4">
                <Typography variant="h2" sx={{ fontWeight: 600, marginBottom: 4 }}>
                    {t('promo.title')}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 700, color: 'rgba(25, 48, 40, 0.75)' }}>
                    {t('promo.subtitle')}
                </Typography>
            </div>
        </div>
    );
}
