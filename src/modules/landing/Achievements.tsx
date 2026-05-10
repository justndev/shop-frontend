'use client';

import {useTranslation} from "react-i18next";

import {Typography} from "@mui/material";
import {Award, Briefcase, Globe, LucideIcon} from "lucide-react";
import AchievementsCarousel from "@/src/modules/landing/achievementsCarousel/AchievementsCarousel";


export const ACHIEVEMENTS: { Icon: LucideIcon; key: string }[] = [
    {Icon: Globe, key: 'made_in_europe'},
    {Icon: Award, key: 'certified'},
    {Icon: Briefcase, key: 'tailored'},
];

export default function Achievements() {
    const {t} = useTranslation();

    return (
        <div className="w-full bg-(--mint) text-center  relative z-10">
            {/* DESKTOP */}
            <div className="hidden md:flex py-8 px-6 grid-cols-3 gap-10 justify-center">
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
            <div className="md:hidden md:py-8 py-4">
               <AchievementsCarousel slides={ACHIEVEMENTS}/>
            </div>
        </div>
    )
}
