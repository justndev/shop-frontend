'use client';

import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
import { Globe, Award, Briefcase, ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { usePrevNextButtons } from '@/src/modules/landing/achievementsCarousel/AchievementsCarouselArrows';
import {useEffect, useState} from "react";

const ACHIEVEMENTS = [
    { icon: <Globe size={48} strokeWidth={1} />, key: 'made_in_europe' },
    { icon: <Award size={48} strokeWidth={1} />, key: 'certified' },
    { icon: <Briefcase size={48} strokeWidth={1} />, key: 'tailored' },
];

export default function PromoSection() {
    const { t } = useTranslation();
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
    const { onPrevButtonClick, onNextButtonClick, prevBtnDisabled, nextBtnDisabled } = usePrevNextButtons(emblaApi);

    // derive current index for "1 / 3" counter
    const [current, setCurrent] = useState(0);
    useEffect(() => {
        if (!emblaApi) return;
        emblaApi.on('select', () => setCurrent(emblaApi.selectedScrollSnap()));
    }, [emblaApi]);

    return (
        <section className="w-full py-16 px-4 bg-white text-center">
            <div className="max-w-5xl mx-auto">
                <Typography variant="h4" className="font-bold text-[#08120C] mb-3">
                    {t('promo.title')}
                </Typography>
                <Typography variant="body1" className="text-gray-500 mb-12">
                    {t('promo.subtitle')}
                </Typography>

                {/* Desktop: 3 columns */}
                <div className="hidden md:grid bg-[#f0f7f2] rounded-2xl py-12 px-6 grid-cols-3 gap-10">
                    {ACHIEVEMENTS.map(({ icon, key }) => (
                        <div key={key} className="flex flex-col items-center gap-4">
                            <div className="text-[#193028]">{icon}</div>
                            <Typography variant="body1" className="font-semibold text-[#08120C]">
                                {t(`promo.achievements.${key}`)}
                            </Typography>
                        </div>
                    ))}
                </div>

                {/* Mobile: Embla carousel */}
                <div className="md:hidden bg-[#f0f7f2] rounded-2xl py-10 px-4">
                    <div className="overflow-hidden" ref={emblaRef}>
                        <div className="flex">
                            {ACHIEVEMENTS.map(({ icon, key }) => (
                                <div key={key} className="flex-[0_0_100%] min-w-0 flex flex-col items-center gap-4 px-4">
                                    <div className="text-[#193028]">{icon}</div>
                                    <Typography variant="body1" className="font-semibold text-[#08120C]">
                                        {t(`promo.achievements.${key}`)}
                                    </Typography>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-center gap-4 mt-6">
                        <button
                            onClick={onPrevButtonClick}
                            disabled={prevBtnDisabled}
                            className="w-8 h-8 flex items-center justify-center border border-[#193028]/30 text-[#193028] disabled:opacity-30 rounded-full"
                        >
                            <ChevronLeft size={16} strokeWidth={1.5} />
                        </button>

                        <span className="text-sm font-medium text-[#193028]">
                            {current + 1} / {ACHIEVEMENTS.length}
                        </span>

                        <button
                            onClick={onNextButtonClick}
                            disabled={nextBtnDisabled}
                            className="w-8 h-8 flex items-center justify-center border border-[#193028]/30 text-[#193028] disabled:opacity-30 rounded-full"
                        >
                            <ChevronRight size={16} strokeWidth={1.5} />
                        </button>
                    </div>
                </div>

            </div>
        </section>
    );
}