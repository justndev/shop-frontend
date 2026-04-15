'use client'

import BannerCarousel from "@/src/modules/landing/carousel/BannerCarousel";
import PromotionTitleAndParagraph from "@/src/modules/landing/PromotionTitleAndParagraph";
import WhyUs from "@/src/modules/landing/WhyUs";
import Categories from "@/src/modules/landing/Categories";
import QualityCards from "@/src/modules/landing/Qualities";
import FAQ from "@/src/modules/landing/FAQ";
import ExpertiseParagraph from "@/src/modules/landing/ExpertiseParagraph";
import HowToBuy from "@/src/modules/landing/HowToBuy";
import ReadMore from "@/src/modules/landing/ReadMore";
import AdvantagesText from "@/src/modules/landing/AdvantagesText";
import OurProducts from "@/src/modules/landing/OurProducts";
import QualityParagraph from "@/src/modules/landing/QualityParagraph";
import Achievements from "@/src/modules/landing/Achievements";


export default function HomePage() {
    return (
        <>
            {/* Sliding Banner */}
            <BannerCarousel/>

            {/* h1. Prem Tea p. The fines-origin... */}
            <PromotionTitleAndParagraph/>

            {/* [() Shipped Across EU] [! 100% Auth] [& Order to u]*/}
            <Achievements/>

            {/* Picture and card with texts */}
            <WhyUs/>

            <Categories/>
            <OurProducts/>
            <QualityCards/>
                <QualityParagraph/>



            <FAQ/>


            <ExpertiseParagraph/>

            <HowToBuy/>
            <AdvantagesText/>
            <FAQ/>

            <ReadMore/>
        </>
    )
}
