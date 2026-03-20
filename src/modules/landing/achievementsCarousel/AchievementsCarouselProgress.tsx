'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { EmblaCarouselType } from 'embla-carousel';
import { CarouselSlide } from './EmblaCarousel';

type Props = {
    emblaApi: EmblaCarouselType | undefined;
    slides: CarouselSlide[];
    interval: number;
};

export default function CarouselProgress({ emblaApi, slides, interval }: Props) {
    const [current, setCurrent] = useState(0);
    const [progress, setProgress] = useState(0); // 0–100 for current slide
    const rafRef = useRef<number>(0);
    const startTimeRef = useRef<number>(Date.now());

    // Sync current slide index
    const onSelect = useCallback((api: EmblaCarouselType) => {
        setCurrent(api.selectedScrollSnap());
        setProgress(0);
        startTimeRef.current = Date.now();
    }, []);

    useEffect(() => {
        if (!emblaApi) return;
        setCurrent(emblaApi.selectedScrollSnap());
        emblaApi.on('select', onSelect).on('reInit', onSelect);
        return () => { emblaApi.off('select', onSelect).off('reInit', onSelect); };
    }, [emblaApi, onSelect]);

    // Animate progress bar for current slide
    useEffect(() => {
        const tick = () => {
            const elapsed = Date.now() - startTimeRef.current;
            setProgress(Math.min((elapsed / interval) * 100, 100));
            rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafRef.current);
    }, [current, interval]);

    const goTo = useCallback((index: number) => {
        if (!emblaApi) return;
        emblaApi.scrollTo(index);
    }, [emblaApi]);

    return (
        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {slides.map((_, i) => (
                <button
                    key={i}
                    onClick={() => goTo(i)}
                    className="relative h-[2px] overflow-hidden cursor-pointer bg-white/25 transition-all duration-300"
                    style={{ width: i === current ? '64px' : '40px' }}
                >
                    {/* Filled portion */}
                    <div
                        className="absolute inset-y-0 left-0 bg-white transition-none"
                        style={{
                            width: i < current
                                ? '100%'
                                : i === current
                                    ? `${progress}%`
                                    : '0%',
                        }}
                    />
                </button>
            ))}
        </div>
    );
}