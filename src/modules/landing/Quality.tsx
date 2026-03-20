'use client';

import { useState, useEffect } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Typography } from '@mui/material';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { usePrevNextButtons } from '@/src/modules/landing/achievementsCarousel/AchievementsCarouselArrows';

function LeafPattern({ color }: { color: string }) {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
            style={{
                position: 'absolute',
                bottom: -20,
                right: -20,
                width: 160,
                height: 160,
                opacity: 0.18,
                pointerEvents: 'none',
            }}
        >
            <g fill="none" stroke={color} strokeWidth="1.2">
                <path d="M100 170 C100 170 60 140 55 100 C50 60 80 30 100 20 C120 30 150 60 145 100 C140 140 100 170 100 170Z" />
                <path d="M100 170 C100 170 40 130 30 90 C20 50 50 20 70 30 C60 60 70 110 100 170Z" />
                <path d="M100 170 C100 170 160 130 170 90 C180 50 150 20 130 30 C140 60 130 110 100 170Z" />
                <path d="M100 170 C100 170 20 120 18 75 C16 40 45 10 60 20 C50 55 65 115 100 170Z" />
                <path d="M100 170 C100 170 180 120 182 75 C184 40 155 10 140 20 C150 55 135 115 100 170Z" />
                <line x1="100" y1="170" x2="100" y2="20" />
                <line x1="100" y1="120" x2="60" y2="80" />
                <line x1="100" y1="120" x2="140" y2="80" />
                <line x1="100" y1="140" x2="55" y2="110" />
                <line x1="100" y1="140" x2="145" y2="110" />
            </g>
        </svg>
    );
}

interface CardConfig {
    key: string;
    badgeBg: string;
    badgeText: string;
    cardBg: string;
}

const CARDS: CardConfig[] = [
    { key: 'quality',   badgeBg: '#7dc242', badgeText: '#fff',    cardBg: '#193028' },
    { key: 'certified', badgeBg: '#b0c4c8', badgeText: '#193028', cardBg: '#193028' },
    { key: 'delivery',  badgeBg: '#f5a623', badgeText: '#fff',    cardBg: '#193028' },
    { key: 'customs',   badgeBg: '#e05c4b', badgeText: '#fff',    cardBg: '#193028' },
];

function PromoCard({ keyName, badgeBg, badgeText, cardBg }: {
    keyName: string;
    badgeBg: string;
    badgeText: string;
    cardBg: string;
}) {
    const { t } = useTranslation();

    return (
        <div
            className="relative rounded-xl overflow-hidden flex flex-col gap-3 p-5 min-h-[160px] h-full"
            style={{ backgroundColor: cardBg }}
        >
            <LeafPattern color={badgeBg} />

            <div className="relative z-10 self-start">
                <span
                    className="inline-block text-xs font-semibold px-3 py-1 rounded-full"
                    style={{ backgroundColor: badgeBg, color: badgeText }}
                >
                    {t(`quality.cards.${keyName}.badge`)}
                </span>
            </div>

            <Typography
                variant="body1"
                className="relative z-10"
                sx={{ fontWeight: 700, color: badgeBg, lineHeight: 1.3, textTransform: 'uppercase' }}
            >
                <Trans i18nKey={`quality.cards.${keyName}.title`} components={{ br: <br /> }} />
            </Typography>

            <Typography
                variant="body2"
                className="relative z-10"
                sx={{ color: '#fff', opacity: 0.9 }}
            >
                {t(`quality.cards.${keyName}.body`)}
            </Typography>
        </div>
    );
}

export default function Promotion() {
    const { t } = useTranslation();
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
    const { onPrevButtonClick, onNextButtonClick, prevBtnDisabled, nextBtnDisabled } = usePrevNextButtons(emblaApi);
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (!emblaApi) return;
        emblaApi.on('select', () => setCurrent(emblaApi.selectedScrollSnap()));
    }, [emblaApi]);

    return (
        <div className="relative w-full bg-white" style={{ zIndex: 2 }}>

            {/* Desktop: 4-column grid */}
            <div className="hidden md:block max-w-6xl mx-auto px-4 py-12">
                <div className="grid grid-cols-4 gap-5">
                    {CARDS.map(({ key, badgeBg, badgeText, cardBg }) => (
                        <PromoCard key={key} keyName={key} badgeBg={badgeBg} badgeText={badgeText} cardBg={cardBg} />
                    ))}
                </div>
            </div>

            {/* Mobile: Embla carousel */}
            <div className="md:hidden py-10 px-4">
                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex gap-4">
                        {CARDS.map(({ key, badgeBg, badgeText, cardBg }) => (
                            <div key={key} className="flex-[0_0_85%] min-w-0">
                                <PromoCard keyName={key} badgeBg={badgeBg} badgeText={badgeText} cardBg={cardBg} />
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
                        {current + 1} / {CARDS.length}
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

            {/* Centred paragraph with bold highlights */}
            <div className="max-w-2xl mx-auto px-6 pb-16 text-center">
                <Typography variant="body1" sx={{ color: '#444', lineHeight: 1.8 }}>
                    <Trans
                        i18nKey="quality.paragraph"
                        components={{ b: <strong style={{ color: '#08120C' }} /> }}
                    />
                </Typography>
            </div>
        </div>
    );
}