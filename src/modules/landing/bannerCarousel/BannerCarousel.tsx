'use client';

import {EmblaOptionsType} from 'embla-carousel';
import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import Link from 'next/link';
import CarouselProgress from "@/src/modules/landing/bannerCarousel/EmblaCarouselAutoplayProgress";
import {Button} from "@mui/material";
import {useEffect, useState} from "react";

export interface CarouselSlide {
    image: string;
    eyebrow?: string;
    title: string;
    subtitle?: string;
    cta?: { label: string; href: string };
    contentPosition?: 'left' | 'right';
}

type PropType = {
    slides?: CarouselSlide[];
    options?: EmblaOptionsType;
    interval?: number;
};

const SLIDES: CarouselSlide[] = [
    {
        id: 1,
        image: '/slide1.jpg',
        eyebrow: 'New arrival',
        title: 'Aged Puer\nFrom Yunnan',
        subtitle: 'Deep, earthy complexity — 10 years in the making.',
        cta: {label: 'Shop now', href: '/catalog/puer'},
        contentPosition: 'left'
    },
    {
        id: 2,
        image: '/slide2.webp',
        eyebrow: 'Premium collection',
        title: 'White Oolong',
        cta: {label: 'Explore', href: '/catalog/oolong'},
        contentPosition: 'right'

    },
    {
        id: 3,
        image: '/slide3.webp',
        eyebrow: 'Learn',
        title: 'The Art of\nTea Ceremony',
        subtitle: 'Guides, rituals, and everything in between.',
        cta: {label: 'Read more', href: '/blog'},
        contentPosition: 'left'
    },
];

const CONTENT_STYLES: Record<NonNullable<CarouselSlide['contentPosition']>, {
    outer: string;
    inner: string;
}> = {
    'left': {
        outer: "absolute bottom-[22%] left-[8%] max-w-xl",
        inner: "",
    },
    'right': {
        outer: "absolute bottom-[22%] right-[28%] max-w-xl",
        inner: "flex flex-col items-center justify-center text-center",
    },
};

export default function BannerCarousel({slides = SLIDES, options, interval = 5000}: PropType) {
    const [emblaRef, emblaApi] = useEmblaCarousel(
        {loop: true, duration: 0, ...options},  // duration: 0 disaables embla's own animation
        [Autoplay({delay: interval})]
    );

    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        if (!emblaApi) return;
        emblaApi.on('select', () => setSelectedIndex(emblaApi.selectedScrollSnap()));
    }, [emblaApi]);

    return (
        <div className="relative w-full md:h-175 h-135 overflow-hidden bg-[#08120C] z-10">

            {/* Invisible embla viewport — drives logic only */}
            <div className="absolute inset-0 opacity-0 pointer-events-none" ref={emblaRef}>
                <div className="flex h-full">
                    {slides.map((_, index) => (
                        <div key={index} className="flex-[0_0_100%] min-w-0 h-full"/>
                    ))}
                </div>
            </div>

            {/* Visible slides — stacked, fade via opacity */}
            {slides.map((slide, index) => {
                    const position = slide.contentPosition ?? 'left';
                    const styles = CONTENT_STYLES[position];

                    return (
                        <div
                            key={index}
                            className="absolute inset-0 h-full"
                            style={{
                                opacity: index === selectedIndex ? 1 : 0,
                                transition: 'opacity 0.8s ease',
                                pointerEvents: index === selectedIndex ? 'auto' : 'none',
                            }}
                        >
                            {/* Image */}
                            <div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{backgroundImage: `url(${slide.image})`}}
                            />

                            {/* Dark Cover */}
                            <div
                                className="absolute inset-0 bg-gradient-to-r from-[#08120C]/70 via-[#08120C]/30 to-transparent"/>

                            {/* Content */}
                            <div className={styles.outer}>
                                <div className={styles.inner}>
                                    {slide.eyebrow && (
                                        <p className="text-lg font-semibold italic tracking-[0.18em] uppercase text-white/90 mb-2">
                                            {slide.eyebrow}
                                        </p>
                                    )}
                                    <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-tight tracking-tight whitespace-pre-line">
                                        {slide.title}
                                    </h2>
                                    {slide.subtitle && (
                                        <p className="mt-3 text-lg font-semibold text-white/90 leading-relaxed">
                                            {slide.subtitle}
                                        </p>
                                    )}
                                    {slide.cta && (
                                        <Link href={slide.cta.href}>
                                            <Button
                                                sx={{
                                                    width: '200px',
                                                    borderRadius: 0,
                                                    textTransform: 'uppercase',
                                                    padding: 1.5,
                                                    paddingX: 4,
                                                    marginTop: 3,
                                                    '&:hover': {
                                                        backgroundColor: 'var(--mint)',
                                                        // color: '#fff',
                                                    }
                                                }}
                                                color="white"

                                                variant="contained"
                                            >
                                                {slide.cta.label}
                                            </Button>
                                        </Link>
                                    )}
                                </div>


                            </div>
                        </div>)
                }
            )}

            <CarouselProgress emblaApi={emblaApi} slides={slides} interval={interval}/>
        </div>
    );
}