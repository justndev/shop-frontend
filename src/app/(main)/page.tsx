'use client'

import Link from 'next/link'
import {useRouter} from 'next/navigation'
import {useAppSelector} from '@/src/hooks/redux'
import {useShopHook} from '@/src/hooks/useShopHook'
import {useEffect} from "react";
import {useSelector} from "react-redux";
import {RootState} from "@/src/store";
import BannerCarousel, {CarouselSlide} from "@/src/modules/landing/carousel/BannerCarousel";
import PromotionText from "@/src/modules/landing/PromotionText";
import WhyUs from "@/src/modules/landing/WhyUs";
import Categories from "@/src/modules/landing/Categories";
import Quality from "@/src/modules/landing/Quality";
import FAQ from "@/src/modules/landing/FAQ";
import ExpertiseText from "@/src/modules/landing/ExpertiseText";
import HowToBuy from "@/src/modules/landing/HowToBuy";
import ReadMore from "@/src/modules/landing/ReadMore";
import AdvantagesText from "@/src/modules/landing/AdvantagesText";
import OurProducts from "@/src/modules/landing/OurProducts";


export default function HomePage() {
    return (
        <>
            {/* Hero */}
            <BannerCarousel/>
            <PromotionText/>
            <WhyUs/>
            <Categories/>
            <Quality/>
            <FAQ/>

            <ExpertiseText/>

            <OurProducts/>
            <HowToBuy/>
            <ReadMore/>
            <AdvantagesText/>
        </>
    )
}
