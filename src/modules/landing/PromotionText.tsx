'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
import {Globe, Award, Briefcase, ChevronLeft, ChevronRight, LucideIcon} from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { usePrevNextButtons } from '@/src/modules/landing/achievementsCarousel/AchievementsCarouselArrows';

const ACHIEVEMENTS: { Icon: LucideIcon; key: string }[] = [
    { Icon: Globe, key: 'made_in_europe' },
    { Icon: Award, key: 'certified' },
    { Icon: Briefcase, key: 'tailored' },
];

export default function PromotionText() {
    const { t } = useTranslation();
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
    const { onPrevButtonClick, onNextButtonClick, prevBtnDisabled, nextBtnDisabled } = usePrevNextButtons(emblaApi);
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (!emblaApi) return;
        emblaApi.on('select', () => setCurrent(emblaApi.selectedScrollSnap()));
    }, [emblaApi]);

    return (
        <div className="w-full bg-white text-center">
            <div className="max-w-375 mx-auto py-16 px-4">
                <Typography variant="h2" sx={{ fontWeight: 600, marginBottom: 4 }} className={'lg:font-3xl md:text-2xl'}>
                    {t('promo.title')}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 700, color: 'rgba(25, 48, 40, 0.75)' }}>
                    {t('promo.subtitle')}
                </Typography>
            </div>

            {/* Desktop: 3 columns */}
            <div className="hidden md:flex bg-(--mint) py-12 px-6 grid-cols-3 gap-10 justify-center">
                <div className='grid grid-cols-3 max-w-375 w-full'>
                    {ACHIEVEMENTS.map(({ Icon, key }) => (
                        <div key={key} className="flex flex-col items-center gap-4">
                            <Icon size={58} strokeWidth={1} className="text-[#193028]" />
                            <Typography variant="body1" sx={{ fontWeight: 600, color: '#08120C' }}>
                                {t(`promo.achievements.${key}`)}
                            </Typography>
                        </div>
                    ))}
                </div>

            </div>

            {/* Mobile: carousel */}
            <div className="md:hidden bg-[#f0f7f2] py-10 px-4">
                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex">
                        {ACHIEVEMENTS.map(({ Icon, key }) => (
                            <div key={key} className="flex-[0_0_100%] min-w-0 flex flex-col items-center gap-4 px-4">
                                <Icon size={80} strokeWidth={1} className="text-[#193028]" />
                                <Typography variant="body1" sx={{ fontWeight: 600, color: '#08120C' }}>
                                    {t(`promo.achievements.${key}`)}
                                </Typography>
                            </div>
                        ))}
                    </div>
                </div>

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
    );
}