import React, {useEffect} from 'react'
import {EmblaOptionsType} from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import {
    NextButton,
    PrevButton,
    usePrevNextButtons
} from './AchievementsEmblaCarouselArrowButtons'
import {useDotButton} from './AchievementsEmblaCarouselDotButton'
import './achievements-embla.css'
import {Typography} from "@mui/material";
import {Award, Briefcase, Globe} from "lucide-react";
import {useTranslation} from "react-i18next";

const OPTIONS: EmblaOptionsType = {align: 'start', loop: false}

const ACHIEVEMENTS = [
    { icon: <Globe size={48} strokeWidth={1} />, key: 'made_in_europe' },
    { icon: <Award size={48} strokeWidth={1} />, key: 'certified' },
    { icon: <Briefcase size={48} strokeWidth={1} />, key: 'tailored' },
];
const SLIDES = ACHIEVEMENTS;

function AchievementCard({icon, text}) {
    return (
        <div className="flex-[0_0_100%] min-w-0 flex flex-col items-center gap-4 px-4">
            <div className="text-[#193028]">{icon}</div>
            <Typography variant="body1" className="font-semibold text-[#08120C]">
                {text}
            </Typography>
        </div>
    )
}

const AchievementsEmblaCarousel = ({slides = SLIDES, options = OPTIONS}) => {
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
                                <AchievementCard icon={achievement.icon} text={t(`promo.achievements.${achievement.key}`)}/>

                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="achievements_embla__controls">
                <div className="achievements_embla__buttons">
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

export default AchievementsEmblaCarousel
