'use client';

import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

import CarouselProgress from "@/src/modules/landing/bannerCarousel/EmblaCarouselAutoplayProgress";
import {Button} from "@mui/material";
import Link from 'next/link';

import {EmblaOptionsType} from 'embla-carousel';

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

const SLIDE_CONFIGS: Array<{
    key: string;
    image: string;
    href?: string;
    contentPosition?: CarouselSlide['contentPosition'];
}> = [
    {key: 'slide1', image: '/slide1.jpg', href: '/catalog/shu-puer', contentPosition: 'left'},
    {key: 'slide2', image: '/slide2.webp', href: '/catalog/shu-puer', contentPosition: 'right'},
    {key: 'slide3', image: '/slide3.webp', href: '/about-us?section=3', contentPosition: 'left'},
];

const CONTENT_STYLES: Record<NonNullable<CarouselSlide['contentPosition']>, {
    outer: string;
    inner: string;
}> = {
    left: {
        outer: "absolute bottom-[22%] left-[8%] max-w-xl",
        inner: "",
    },
    right: {
        outer: "absolute bottom-[22%] right-[28%] max-w-xl",
        inner: "flex flex-col items-center justify-center text-center",
    },
};

const MOBILE_CONTENT_STYLES: Record<NonNullable<CarouselSlide['contentPosition']>, {
    outer: string;
    inner: string;
}> = {
    left: {
        outer: "absolute bottom-[12%] w-full",
        inner: "flex flex-col items-center justify-center text-center self-center",
    },
    right: {
        outer: "absolute bottom-[12%] w-full",
        inner: "flex flex-col items-center justify-center text-center self-center",
    },
};

export default function BannerCarousel({slides, options, interval = 5000}: PropType) {
    const {t} = useTranslation();

    // Build slides from translation keys unless overridden via props
    const resolvedSlides: CarouselSlide[] = slides ?? SLIDE_CONFIGS.map(({key, image, href, contentPosition}) => ({
        image,
        contentPosition,
        eyebrow: t(`banner-slider.${key}.eyebrow`, {defaultValue: ''}) || undefined,
        title: t(`banner-slider.${key}.title`),
        subtitle: t(`banner-slider.${key}.subtitle`, {defaultValue: ''}) || undefined,
        cta: href && t(`banner-slider.${key}.cta`, {defaultValue: ''})
            ? {label: t(`banner-slider.${key}.cta`), href}
            : undefined,
    }));

    const [emblaRef, emblaApi] = useEmblaCarousel(
        {loop: true, duration: 0, ...options},
        [Autoplay({delay: interval})]
    );

    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        if (!emblaApi) return;
        emblaApi.on('select', () => setSelectedIndex(emblaApi.selectedScrollSnap()));
    }, [emblaApi]);

    return (
        <div className="relative w-full md:h-175 h-135 overflow-hidden bg-(--swamp-green-dark) z-10">

            {/* Invisible embla viewport — drives logic only */}
            <div className="absolute inset-0 opacity-0 pointer-events-none" ref={emblaRef}>
                <div className="flex h-full">
                    {resolvedSlides.map((_, index) => (
                        <div key={index} className="flex-[0_0_100%] min-w-0 h-full"/>
                    ))}
                </div>
            </div>

            {/* Visible slides — stacked, fade via opacity */}
            {resolvedSlides.map((slide, index) => {
                const position = slide.contentPosition ?? 'left';
                const styles = MOBILE_CONTENT_STYLES[position];

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

                        {/* Dark overlay */}
                        <div
                            className="absolute inset-0 bg-gradient-to-r from-[#08120C]/70 via-[#08120C]/30 to-transparent"/>

                        {/* Content */}
                        <div className={
                            position === 'left'
                                ? "absolute bottom-[12%] w-full md:bottom-[22%] md:left-[8%] md:w-auto md:max-w-xl"
                                : "absolute bottom-[12%] w-full md:bottom-[22%] md:right-[28%] md:w-auto md:max-w-xl"
                        }>
                            <div className={
                                position === 'right'
                                    ? "flex flex-col items-center justify-center text-center md:items-center md:justify-center md:text-center"
                                    : "flex flex-col items-center justify-center text-center md:items-start md:text-left"
                            }>
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
                                                '&:hover': {backgroundColor: 'var(--mint)'},
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
                    </div>
                );
            })}

            <CarouselProgress emblaApi={emblaApi} slides={resolvedSlides} interval={interval}/>
        </div>
    );
}
