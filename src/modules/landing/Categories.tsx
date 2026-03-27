'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import { usePrevNextButtons } from '@/src/modules/landing/achievementsCarousel/AchievementsCarouselArrows';

const CATEGORIES = [
    { key: 'puer',     image: '/categories/categories-puerh.jpg',     href: '/catalog/puer' },
    { key: 'oolong',   image: '/categories/categories-oolong.webp',   href: '/catalog/oolong' },
    { key: 'green',    image: '/categories/categories-green.jpg',    href: '/catalog/green' },
    { key: 'white',    image: '/categories/categories-white.webp',    href: '/catalog/white' },
    { key: 'ceremony', image: '/categories/categories-stuff.jpg', href: '/catalog/ceremony' },
];

export default function Categories() {
    const { t } = useTranslation();
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start' });
    const { onPrevButtonClick, onNextButtonClick, prevBtnDisabled, nextBtnDisabled } = usePrevNextButtons(emblaApi);
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (!emblaApi) return;
        emblaApi.on('select', () => setCurrent(emblaApi.selectedScrollSnap()));
    }, [emblaApi]);

    const CategoryCard = ({ key: _key, image, href, itemKey }: { key?: string; image: string; href: string; itemKey: string }) => (
        <Link href={href} className="group flex flex-col gap-6 max-h-[300px]">
            <div className="overflow-hidden rounded-lg aspect-[4/3] bg-[#08120C]">
                <img
                    src={image}
                    alt={t(`categories.items.${itemKey}`)}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                />
            </div>
            <div className="flex items-center w-full justify-center gap-1">
                <Typography variant={'body2'} style={{fontWeight: 500}}>
                    {t(`categories.items.${itemKey}`)}
                </Typography>
                <ArrowRight size={18} strokeWidth={1.5} className="transition-transform group-hover:translate-x-1" />
            </div>
        </Link>
    );

    return (
        <section className="w-full bg-[#f0f7f2] py-8 z-10">
            <div className="max-w-375 mx-auto">
                <Typography variant="h2" sx={{ fontWeight: 500, marginBottom: 4 }} className="px-16 lg:font-3xl md:text-2xl lg:px-8">
                    {t('categories.title')}
                </Typography>

                {/* Desktop: grid */}
                <div className="hidden lg:grid grid-cols-5 gap-4 px-8">
                    {CATEGORIES.map(({ key, image, href }) => (
                        <CategoryCard key={key} itemKey={key} image={image} href={href} />
                    ))}
                </div>

                {/* Mobile: carousel — 2 cards visible at once */}
                <div className="lg:hidden">
                    <div className="overflow-hidden " ref={emblaRef}>
                        <div className="flex gap-4">
                            {CATEGORIES.map(({ key, image, href }) => (
                                <div key={key} className="flex-[0_0_100%] min-w-0 px-4">
                                    <CategoryCard itemKey={key} image={image} href={href} />
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
                            {current + 1} / {CATEGORIES.length}
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