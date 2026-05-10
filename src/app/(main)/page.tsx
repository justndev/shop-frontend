'use client'

import BannerCarousel from "@/src/modules/landing/bannerCarousel/BannerCarousel";
import PromotionTitleAndParagraph from "@/src/modules/landing/PromotionTitleAndParagraph";
import WhyUs from "@/src/modules/landing/WhyUs";
import Categories from "@/src/modules/landing/Categories";
import QualityCards from "@/src/modules/landing/Qualities";
import FAQ from "@/src/modules/landing/FAQ";
import ExpertiseParagraph from "@/src/modules/landing/ExpertiseParagraph";
import ReadMore from "@/src/modules/landing/ReadMore";
import OurProducts from "@/src/modules/landing/OurProducts";
import QualityParagraph from "@/src/modules/landing/QualityParagraph";
import Achievements from "@/src/modules/landing/Achievements";
import ContactUs from "@/src/modules/landing/ContactUs";


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
            <QualityParagraph/>

            <FAQ/>
            <ExpertiseParagraph/>


            <QualityCards/>


            {/*<HowToBuy/>*/}
            {/*<AdvantagesText/>*/}

            <ReadMore/>

            <ContactUs/>
        </>
    )
}
