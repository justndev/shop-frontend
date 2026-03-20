'use client';

import { EmblaOptionsType } from 'embla-carousel';
import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import Link from 'next/link';
import CarouselProgress from "@/src/modules/landing/carousel/EmblaCarouselAutoplayProgress";

export interface CarouselSlide {
    image: string;
    eyebrow?: string;
    title: string;
    subtitle?: string;
    cta?: { label: string; href: string };
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
        cta: { label: 'Shop now', href: '/catalog/puer' },
    },
    {
        id: 2,
        image: '/slide2.webp',
        eyebrow: 'Premium collection',
        title: 'High Mountain\nOolong',
        cta: { label: 'Explore', href: '/catalog/oolong' },
    },
    {
        id: 3,
        image: '/slide3.webp',
        eyebrow: 'Learn',
        title: 'The Art of\nTea Ceremony',
        subtitle: 'Guides, rituals, and everything in between.',
        cta: { label: 'Read more', href: '/blog' },
    },
];

export default function EmblaCarousel({ slides = SLIDES, options, interval = 5000 }: PropType) {
    const [emblaRef, emblaApi] = useEmblaCarousel(
        { loop: true, ...options },
        [Autoplay({ delay: interval })]
    );


    return (
        <div className="relative w-full md:h-175 h-135 overflow-hidden bg-[#08120C] z-10">

            {/* Embla viewport */}
            <div className="h-full" ref={emblaRef}>
                <div className="flex h-full touch-pan-y">
                    {slides.map((slide, index) => (
                        <div key={index} className="relative flex-[0_0_100%] min-w-0 h-full">
                            {/* Background image */}
                            <div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{ backgroundImage: `url(${slide.image})` }}
                            />
                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-r from-[#08120C]/70 via-[#08120C]/30 to-transparent" />

                            {/* Slide content */}
                            <div className="absolute bottom-[22%] left-[8%] max-w-xl z-10">
                                {slide.eyebrow && (
                                    <p className="text-xs font-semibold tracking-[0.18em] uppercase text-white/60 mb-2">
                                        {slide.eyebrow}
                                    </p>
                                )}
                                <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-tight tracking-tight whitespace-pre-line">
                                    {slide.title}
                                </h2>
                                {slide.subtitle && (
                                    <p className="mt-3 text-base text-white/75 leading-relaxed">
                                        {slide.subtitle}
                                    </p>
                                )}
                                {slide.cta && (
                                    <Link href={slide.cta.href}>
                                        <button className="mt-6 px-8 py-3 border border-white text-white text-sm font-semibold uppercase tracking-widest hover:bg-white hover:text-[#193028] transition-all duration-250">
                                            {slide.cta.label}
                                        </button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Arrow buttons */}
            {/*<PrevButton*/}
            {/*    onClick={() => onAutoplayButtonClick(onPrevButtonClick)}*/}
            {/*    className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center border border-white/30 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all"*/}
            {/*/>*/}
            {/*<NextButton*/}
            {/*    onClick={() => onAutoplayButtonClick(onNextButtonClick)}*/}
            {/*    className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center border border-white/30 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all"*/}
            {/*/>*/}

            {/* Custom progress indicators */}
            <CarouselProgress emblaApi={emblaApi} slides={slides} interval={interval} />
        </div>
    );
}