'use client';

import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
import CategoriesCarousel from "@/src/modules/landing/categoriesCarousel/CategoriesCarousel";
import {CategoryCard} from "@/src/modules/landing/categoriesCarousel/CategoryCard";

export const CATEGORIES = [
    { slug: 'shu-puer',     image: '/categories/categories-puerh.jpg'},
    { slug: 'shen-puer',   image: '/categories/shen-puer.jpeg', comingSoon: true },

];


export default function Categories() {
    const { t } = useTranslation();

    return (
        <section className="w-full bg-(--mint) py-8 relative z-10">
            <div className="max-w-375 mx-auto">
                <div className='w-full flex md:justify-center justify-start px-4 md:mb-6 mb-4'>
                    <Typography variant="h2" sx={{ fontWeight: 500}}>
                        {t('categoriesSection.title')}
                    </Typography>
                </div>


                {/* Desktop: grid */}
                <div className="hidden lg:grid grid-cols-2 gap-4 mx-auto max-w-170">
                    {CATEGORIES.map((category, index) => (
                        <CategoryCard key={index} comingSoon={category.comingSoon} text={t(`categoriesSection.items.${category.slug}`)} image={category.image} href={`catalog/${category.slug}`} />
                    ))}
                </div>

                {/* Mobile: carousel — 2 cards visible at once */}
                <div className="lg:hidden">
                   <CategoriesCarousel slides={CATEGORIES}/>
                </div>
            </div>
        </section>
    );
}