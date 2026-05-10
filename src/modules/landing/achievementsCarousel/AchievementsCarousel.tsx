import React from 'react'
import {useTranslation} from "react-i18next";
import useEmblaCarousel from 'embla-carousel-react'
import {useDotButton} from './AchievementsEmblaCarouselDotButton'

import {
    NextButton,
    PrevButton,
    usePrevNextButtons
} from './AchievementsEmblaCarouselArrowButtons'

import './achievements-embla.css'

import {Typography} from "@mui/material";
import {EmblaOptionsType} from 'embla-carousel'

const OPTIONS: EmblaOptionsType = {align: 'start', loop: false}

function AchievementCard({Icon, text}) {
    return (
        <div className="flex flex-col items-center gap-4">
            <Icon size={58} strokeWidth={1} className="text-[#193028]"/>
            <Typography variant="body1" sx={{fontWeight: 600, color: '#08120C'}}>
                {text}
            </Typography>
        </div>
    )
}

const AchievementsEmblaCarousel = ({slides, options = OPTIONS}) => {
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
        <div className="achievements_embla">
            <div className="achievements_embla__viewport" ref={emblaRef}>
                <div className="achievements_embla__container">
                    {slides.map((achievement, index) => (
                        <div className="achievements_embla__slide" key={index}>
                            <div key={index}>
                                <AchievementCard Icon={achievement.Icon} text={t(`promo.achievements.${achievement.key}`)}/>

                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="achievements_embla__controls">
                <div className="achievements_embla__buttons">
                    <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled}/>
                    <div className="w-full flex justify-center">
                        <Typography variant="body1" sx={{ color: '#666', alignSelf: 'center', alignItems: 'center' }}>
                            {selectedIndex + 1} / {scrollSnaps.length}
                        </Typography>
                    </div>
                    <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled}/>
                </div>
            </div>
        </div>
    )
}

export default AchievementsEmblaCarousel;

