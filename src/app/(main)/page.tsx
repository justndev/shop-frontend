'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/src/hooks/redux'
import { useShopHook } from '@/src/hooks/useShopHook'
import {useEffect} from "react";
import {useSelector} from "react-redux";
import {RootState} from "@/src/store";
import EmblaCarousel, {CarouselSlide} from "@/src/modules/landing/carousel/EmblaCarousel";
import Promotion from "@/src/modules/landing/Promotion";
import WhyUs from "@/src/modules/landing/WhyUs";
import Categories from "@/src/modules/landing/Categories";
import Quality from "@/src/modules/landing/Quality";
import FAQ from "@/src/modules/landing/FAQ";



export default function HomePage() {
  const {user} = useSelector((state:RootState) => state.user)



  return (
    <div className={'z-1'}>
      {/* Hero */}
      <EmblaCarousel/>
      <Promotion />
      <WhyUs/>
      <Categories/>
      <Quality/>
        <FAQ/>
        <Quality/>


    </div>
  )
}
