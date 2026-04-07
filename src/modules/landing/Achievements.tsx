import {Typography} from "@mui/material";
import {Award, Briefcase, ChevronLeft, ChevronRight, Globe, LucideIcon} from "lucide-react";
import {useTranslation} from "react-i18next";
import useEmblaCarousel from "embla-carousel-react";
import {usePrevNextButtons} from "@/src/modules/landing/achievementsCarousel/AchievementsEmblaCarouselArrowButtons";
import {useEffect, useState} from "react";
import AchievementsCarousel from "@/src/modules/landing/achievementsCarousel/AchievementsCarousel";

const ACHIEVEMENTS: { Icon: LucideIcon; key: string }[] = [
    {Icon: Globe, key: 'made_in_europe'},
    {Icon: Award, key: 'certified'},
    {Icon: Briefcase, key: 'tailored'},
];

export default function Achievements() {
    const {t} = useTranslation();
    const [emblaRef, emblaApi] = useEmblaCarousel({loop: false});
    const {onPrevButtonClick, onNextButtonClick, prevBtnDisabled, nextBtnDisabled} = usePrevNextButtons(emblaApi);
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (!emblaApi) return;
        emblaApi.on('select', () => setCurrent(emblaApi.selectedScrollSnap()));
    }, [emblaApi]);

    return (
        <div className="w-full bg-(--mint) text-center">
            {/* DESKTOP */}
            <div className="hidden md:flex py-12 px-6 grid-cols-3 gap-10 justify-center">
                <div className='grid grid-cols-3 max-w-375 w-full'>
                    {ACHIEVEMENTS.map(({Icon, key}) => (
                        <div key={key} className="flex flex-col items-center gap-4">
                            <Icon size={58} strokeWidth={1} className="text-[#193028]"/>
                            <Typography variant="body1" sx={{fontWeight: 600, color: '#08120C'}}>
                                {t(`promo.achievements.${key}`)}
                            </Typography>
                        </div>
                    ))}
                </div>
            </div>

            {/* MOBILE */}
            <div className="md:hidden py-10">
               <AchievementsCarousel/>
            </div>
        </div>
    )
}