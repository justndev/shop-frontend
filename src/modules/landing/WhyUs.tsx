'use client';

import { useTranslation, Trans } from 'react-i18next';
import { Typography } from '@mui/material';

export default function WhyUs() {
    const { t } = useTranslation();

    return (
        <section className="w-full md:py-16 py-8 relative z-10"
                 style={{
                     backgroundColor: '#193028',
                     backgroundImage: `
                    radial-gradient(ellipse 55% 200% at 5% 100%, #254030 0%, transparent 85%),
                    radial-gradient(ellipse 40% 180% at 50% 0%,  #1f3a2c 0%, transparent 90%),
                    radial-gradient(ellipse 30% 120% at 20% 50%,  #1c3329 0%, transparent 40%)`,
                 }}
        >

            {/* Desktop layout */}
            <div className="hidden md:grid md:grid-cols-2 max-w-400 mx-auto px-8 items-start">

                {/* Image */}
                <div className="h-[480px] rounded-2xl overflow-hidden relative z-10">
                    <img
                        src="/slide1.jpg"
                        alt={"Shu Pu'er zoomed"}
                        className="absolute inset-0 w-full h-full object-cover object-center"
                    />
                </div>

                {/* Card */}
                <div className="relative z-20 -ml-6 mt-8  bg-(--mint)
                    rounded-2xl p-10 flex flex-col gap-4
                    shadow-[0_8px_40px_rgba(0,0,0,0.2)] text-(--swamp-green) max-w-200 min-w-120 text-justify">

                    <Typography sx={{ fontWeight: 500, fontSize: 38, lineHeight: 1.3 }}>
                        <Trans i18nKey="why_us.title" components={{ b: <strong /> }} />
                    </Typography>
                    <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
                        <Trans i18nKey="why_us.paragraph_1" components={{ b: <strong /> }} />
                    </Typography>
                    <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
                        <Trans i18nKey="why_us.paragraph_2" components={{ b: <strong /> }} />
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(25,48,40,0.65)' }}>
                        {t('why_us.tagline')}
                    </Typography>
                </div>
            </div>

            {/* Mobile layout */}
            <div className="flex md:hidden flex-col px-2">

                {/* Image */}
                <div className="w-full h-50 rounded-xl overflow-hidden relative z-10 mb-[-2rem]">
                    <img
                        src="/slide1.jpg"
                        alt={t('why_us.image_alt')}
                        className="absolute inset-0 w-full h-full object-cover object-center"
                    />
                </div>

                {/* Card */}
                <div className="relative z-20 bg-(--mint) rounded-2xl px-6 py-8 flex flex-col gap-4 shadow-[0_8px_40px_rgba(0,0,0,0.25)] text-(--swamp-green) text-justify">
                    <Typography sx={{ fontWeight: 500, fontSize: 28, lineHeight: 1.3 }}>
                        <Trans i18nKey="why_us.title" components={{ b: <strong /> }} />
                    </Typography>
                    <Typography variant="body2" sx={{  lineHeight: 1.7 }}>
                        <Trans i18nKey="why_us.paragraph_1" components={{ b: <strong /> }} />
                    </Typography>
                    <Typography variant="body2" sx={{lineHeight: 1.7 }}>
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
