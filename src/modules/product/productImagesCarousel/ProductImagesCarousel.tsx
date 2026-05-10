import React from 'react'
import {EmblaOptionsType} from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import {
    NextButton,
    PrevButton,
    usePrevNextButtons
} from './ProductImagesEmblaCarouselArrowButtons'
import {DotButton, useDotButton} from './ProductImagesEmblaCarouselDotButton'
import './product-images-embla.css'
import {Typography} from "@mui/material";


type Props = {
    images: string[];
    alt: string;
};

const OPTIONS: EmblaOptionsType = {align: 'start'}

const ProductImageCarousel = ({images, alt}: Props) => {
    const [emblaRef, emblaApi] = useEmblaCarousel(OPTIONS)

    const {selectedIndex, scrollSnaps, onDotButtonClick} = useDotButton(emblaApi)
    const displayImages = images.slice(3);

    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick
    } = usePrevNextButtons(emblaApi)

    return (
        <div className="product-images_embla">
            <div className="product-images_embla__viewport" ref={emblaRef}>
                <div className="product-images_embla__container">
                    {displayImages.map((image, index) => (
                        <div className="product-images_embla__slide" key={index}>
                            <div key={index} className='w-full flex justify-center items-center '>
                                <img
                                    width={"70%"}
                                    className='rounded-lg'
                                    src={image}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="product-images_embla__controls">
                <div className="product-images_embla__buttons">
                    <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled}/>
                    <div className="w-full flex justify-center">
                        <Typography variant="body1" sx={{color: '#666', alignSelf: 'center', alignItems: 'center'}}>
                            {selectedIndex + 1} / {scrollSnaps.length}
                        </Typography>
                    </div>
                    <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled}/>
                </div>
            </div>
        </div>
    );
};

export default ProductImageCarousel;