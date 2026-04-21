import React from 'react'
import {EmblaOptionsType} from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import {
    NextButton,
    PrevButton,
    usePrevNextButtons
} from './CategoriesEmblaCarouselArrowButtons'
import {DotButton, useDotButton} from './CategoriesEmblaCarouselDotButton'
import './categories-embla.css'
import {MOCKED_PRODUCTS} from "@/src/utils/mocks";
import ComplexProductCard from "@/src/modules/product/ComplexProductCard";
import {Typography} from "@mui/material";
import {ArrowRight, Award, Briefcase, Globe} from "lucide-react";
import {useTranslation} from "react-i18next";
import Link from "next/link";

type PropType = {
    slides: number[]
    options?: EmblaOptionsType
}

const OPTIONS: EmblaOptionsType = {align: 'start', loop: false}
const SLIDE_COUNT = 6


const CATEGORIES = [
    { key: 'puer',     image: '/categories/categories-puerh.jpg',     href: '/catalog/puer' },
    { key: 'oolong',   image: '/categories/categories-oolong.webp',   href: '/catalog/oolong' },
    { key: 'green',    image: '/categories/categories-green.jpg',    href: '/catalog/green' },
    { key: 'white',    image: '/categories/categories-white.webp',    href: '/catalog/white' },
    { key: 'ceremony', image: '/categories/categories-stuff.jpg', href: '/catalog/ceremony' },
];

const SLIDES = CATEGORIES;

const CategoryCard = ({ image, href, text }: { image: string; href: string; text: string }) => (
    <Link href={href} className="group flex flex-col gap-6 md:max-h-[300px] max-h-[400px]">
        <div className="overflow-hidden rounded-lg aspect-[4/3] bg-[#08120C]">
            <img
                src={image}
                alt={text}
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
            />
        </div>
        <div className="flex items-center w-full justify-center gap-1">
            <Typography variant={'body2'} style={{fontWeight: 500}}>
                {text}
            </Typography>
            <ArrowRight size={18} strokeWidth={1.5} className="transition-transform group-hover:translate-x-1" />
        </div>
    </Link>
);


const CategoriesCarousel = ({slides = SLIDES, options = OPTIONS}) => {
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
                                <CategoryCard image={category.image} href={category.href} text={t(`categories.items.${category.key}`)}/>

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
