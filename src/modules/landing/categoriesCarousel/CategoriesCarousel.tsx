'use client';

import './categories-embla.css'

import React from 'react'
import {useTranslation} from "react-i18next";

import useEmblaCarousel from 'embla-carousel-react'
import { useDotButton} from './CategoriesEmblaCarouselDotButton'

import {
    NextButton,
    PrevButton,
    usePrevNextButtons
} from './CategoriesEmblaCarouselArrowButtons'

import {Typography} from "@mui/material";
import {ArrowRight} from "lucide-react";
import Link from "next/link";
import {EmblaOptionsType} from 'embla-carousel'
import {CategoryCard} from "@/src/modules/landing/categoriesCarousel/CategoryCard";


const OPTIONS: EmblaOptionsType = {align: 'start', loop: false}

const CategoriesCarousel = ({slides, options = OPTIONS}) => {
    const {t} = useTranslation();

    const [emblaRef, emblaApi] = useEmblaCarousel(options)

    const {selectedIndex, scrollSnaps, onDotButtonClick} =
        useDotButton(emblaApi)

    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick
    } = usePrevNextButtons(emblaApi)

    return (
        <div className="categories_embla">
            <div className="categories_embla__viewport" ref={emblaRef}>
                <div className="categories_embla__container">
                    {slides.map((category, index) => (
                        <div className="categories_embla__slide" key={index}>
                            <div key={index} className='mx-4'>
                                <CategoryCard key={index} comingSoon={category.comingSoon} text={t(`categoriesSection.items.${category.slug}`)} image={category.image} href={`catalog/${category.slug}`} />

                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="categories_embla__controls">
                <div className="categories_embla__buttons">
                    <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled}/>
                    <div className="w-full flex justify-center">
                        <Typography variant="body2" sx={{ color: '#666', alignSelf: 'center', alignItems: 'center' }}>
                            {selectedIndex + 1} / {scrollSnaps.length}
                        </Typography>
                    </div>
                    <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled}/>
                </div>
            </div>
        </div>
    )
}

export default CategoriesCarousel
