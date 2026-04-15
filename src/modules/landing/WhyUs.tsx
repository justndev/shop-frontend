'use client';

import { useTranslation, Trans } from 'react-i18next';
import { Typography } from '@mui/material';

export default function WhyUs() {
    const { t } = useTranslation();

    return (
        <section className="w-full bg-[#193028] py-16">

            {/* Desktop layout */}
            <div className="hidden md:grid md:grid-cols-[2fr_3fr] max-w-400 mx-auto px-8 items-start">

                {/* Image */}
                <div className="h-[480px] rounded-2xl overflow-hidden relative z-10">
                    <img
                        src="/slide1.jpg"
                        alt={t('why_us.image_alt')}
                        className="absolute inset-0 w-full h-full object-cover object-center"
                    />
                </div>

                {/* Card */}
                <div className="relative z-20 -ml-6 mt-8 self-stretch bg-[#f0f7f2]
                    rounded-2xl p-10 flex flex-col gap-4
                    shadow-[0_8px_40px_rgba(0,0,0,0.2)]">
                    <Typography sx={{ fontWeight: 500, fontSize: 38, lineHeight: 1.3, color: '#193028' }}>
                        <Trans i18nKey="why_us.title" components={{ b: <strong /> }} />
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#193028', lineHeight: 1.7 }}>
                        <Trans i18nKey="why_us.paragraph_1" components={{ b: <strong /> }} />
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#193028', lineHeight: 1.7 }}>
                        <Trans i18nKey="why_us.paragraph_2" components={{ b: <strong /> }} />
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(25,48,40,0.65)' }}>
                        {t('why_us.tagline')}
                    </Typography>
                </div>
            </div>

            {/* Mobile layout */}
            <div className="flex md:hidden flex-col px-5">

                {/* Image */}
                <div className="w-full h-[200px] rounded-xl overflow-hidden relative z-10 mb-[-2rem]">
                    <img
                        src="/slide1.jpg"
                        alt={t('why_us.image_alt')}
                        className="absolute inset-0 w-full h-full object-cover object-center"
                    />
                </div>

                {/* Card */}
                <div className="relative z-20 bg-[#f0f7f2] rounded-2xl pt-12 px-6 pb-8 flex flex-col gap-4 shadow-[0_8px_40px_rgba(0,0,0,0.25)]">
                    <Typography sx={{ fontWeight: 500, fontSize: 28, lineHeight: 1.3, color: '#193028' }}>
                        <Trans i18nKey="why_us.title" components={{ b: <strong /> }} />
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#193028', lineHeight: 1.7 }}>
                        <Trans i18nKey="why_us.paragraph_1" components={{ b: <strong /> }} />
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#193028', lineHeight: 1.7 }}>
                        <Trans i18nKey="why_us.paragraph_2" components={{ b: <strong /> }} />
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(25,48,40,0.65)' }}>
                        {t('why_us.tagline')}
                    </Typography>
                </div>
            </div>

        </section>
    );
}