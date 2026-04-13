import React from 'react'
import { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import {
    NextButton,
    PrevButton,
    usePrevNextButtons
} from './ProductEmblaCarouselArrowButtons'
import { DotButton, useDotButton } from './ProductEmblaCarouselDotButton'
import './product-embla.css'
import {MOCKED_PRODUCTS} from "@/src/utils/mocks";
import ProductCard from "@/src/modules/product/ProductCard";
import {Typography} from "@mui/material";

type PropType = {
    slides: number[]
    options?: EmblaOptionsType
}

const OPTIONS: EmblaOptionsType = { align: 'start' }
const SLIDE_COUNT = 6
const SLIDES = MOCKED_PRODUCTS;

const EmblaCarousel = ({slides = SLIDES, options = OPTIONS}) => {
    const [emblaRef, emblaApi] = useEmblaCarousel(options)

    const { selectedIndex, scrollSnaps, onDotButtonClick } =
        useDotButton(emblaApi)

    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick
    } = usePrevNextButtons(emblaApi)

    return (
        <div className="products_embla">
            <div className="products_embla__viewport" ref={emblaRef}>
                <div className="products_embla__container">
                    {slides.map((product, index) => (
                        <div className="products_embla__slide" key={index}>
                            <div key={index} className="sm:pl-8">
                                <ProductCard product={product} />

                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="products_embla__controls">
                <div className="products_embla__buttons">
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

export default EmblaCarousel
