'use client';

import { useTranslation, Trans } from 'react-i18next';
import { Typography } from '@mui/material';

export default function WhyUs() {
    const { t } = useTranslation();

    return (
        <section className="w-full bg-[#193028] py-16  z-10">
            <div className="max-w-400 mx-auto flex items-stretch justify-center gap-0 md:flex-row flex-col">

                {/* Image — slightly raised */}
                <div className="hidden md:block w-[500px] -mt-8 -ml-4 mb-8 min-w-[400px]">
                    <img
                        src="/slide1.jpg"
                        alt={t('why_us.image_alt')}
                        className="w-full h-full object-cover rounded-lg"
                    />
                </div>
                {/* Image — slightly raised */}
                <div className="block md:hidden w-full px-7 -mb-8">
                    <img
                        src="/slide1.jpg"
                        alt={t('why_us.image_alt')}
                        className="w-full h-full object-cover rounded-lg"
                    />
                </div>
                {/* Text card */}
                <div className="bg-[#f0f7f2] mr-4 rounded-2xl p-8 md:p-12 flex-1 md:-ml-8 z-10 flex flex-col justify-center gap-4 max-w-[1000px]">
                    <Typography  className="text-[#193028] mb-5 leading-snug" sx={{fontWeight: 500, fontSize: 40, lineHeight: 1.3}}>
                        <Trans i18nKey="why_us.title" components={{ b: <strong /> }} />
                    </Typography>

                    <Typography variant="body2" className="text-[#193028] mb-3 leading-relaxed" sx={{lineHeight: 1.7}}>
                        <Trans i18nKey="why_us.paragraph_1" components={{ b: <strong className="text-[#193028]" /> }} />
                    </Typography>

                    <Typography variant="body2" className="text-[#193028] mb-3 leading-relaxed" sx={{lineHeight: 1.7}}>
                        <Trans i18nKey="why_us.paragraph_2" components={{ b: <strong className="text-[#193028]" /> }} />
                    </Typography>

                    <Typography variant="body2" className="font-bold  uppercase tracking-wide text-xs"
                        style={{fontWeight: 700, color: 'rgba(25, 48, 40, 0.75)'}}
                    >
                        {t('why_us.tagline')}
                    </Typography>
                </div>
            </div>
        </section>
    );
}