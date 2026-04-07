import React from 'react'
import {EmblaOptionsType} from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import {
    NextButton,
    PrevButton,
    usePrevNextButtons
} from './QualitiesEmblaCarouselArrowButtons'
import {DotButton, useDotButton} from './QualitiesEmblaCarouselDotButton'
import './qualities-embla.css'
import {Typography} from "@mui/material";
import {Award, Briefcase, Globe} from "lucide-react";
import {useTranslation} from "react-i18next";
import {QUALITIES, QualityCard} from "@/src/modules/landing/Qualities";

type PropType = {
    slides: number[]
    options?: EmblaOptionsType
}

const OPTIONS: EmblaOptionsType = {align: 'start', loop: false}
const SLIDE_COUNT = 6

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

const QualitiesEmblaCarousel = ({slides = QUALITIES, options = OPTIONS}) => {
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
        <div className="qualities_embla">
            <div className="qualities_embla__viewport" ref={emblaRef}>
                <div className="qualities_embla__container">
                    {QUALITIES.map(({ key, badgeBg, badgeColor, cardBg }, index) => (
                        <div className="qualities_embla__slide" key={index}>
                                <QualityCard
                                    title={t(`quality.cards.${key}.title`)}
                                    bodyText={t(`quality.cards.${key}.body`)}
                                    badgeText={t(`quality.cards.${key}.badge`)}

                                    badgeBg={badgeBg} badgeColor={badgeColor} cardBg={cardBg} />

                        </div>
                    ))}
                </div>
            </div>

            <div className="qualities_embla__controls">
                <div className="qualities_embla__buttons">
                    <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled}/>
                    <div className="w-full flex justify-center">
                        <Typography variant="body2" sx={{ color: '#666', alignSelf: 'center', alignItems: 'center' }}>
                            {selectedIndex + 1} / {scrollSnaps.length}
                        </Typography>
                    </div>
                    <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled}/>
                </div>

                {/*<div className="qualities_embla__dots">*/}
                {/*    {scrollSnaps.map((_, index) => (*/}
                {/*        <DotButton*/}
                {/*            key={index}*/}
                {/*            onClick={() => onDotButtonClick(index)}*/}
                {/*            className={'qualities_embla__dot'.concat(*/}
                {/*                index === selectedIndex ? ' qualities_embla__dot--selected' : ''*/}
                {/*            )}*/}
                {/*        />*/}
                {/*    ))}*/}
                {/*</div>*/}
            </div>
        </div>
    )
}

export default QualitiesEmblaCarousel
