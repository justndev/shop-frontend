'use client';

import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import CategoriesCarousel from "@/src/modules/landing/categoriesCarousel/CategoriesCarousel";

export const CATEGORIES = [
    { key: 'puer',     image: '/categories/categories-puerh.jpg',     href: '/catalog/puer' },
    { key: 'oolong',   image: '/categories/categories-oolong.webp',   href: '/catalog/oolong' },
    { key: 'green',    image: '/categories/categories-green.jpg',    href: '/catalog/green' },
    { key: 'white',    image: '/categories/categories-white.webp',    href: '/catalog/white' },
    { key: 'ceremony', image: '/categories/categories-stuff.jpg', href: '/catalog/ceremony' },
];

export function CategoryCard ({ image, href, text }: { image: string; href: string; text: string }) {
    return (
        <Link href={href} className="group flex flex-col gap-6 max-h-[300px]">
            <div className="overflow-hidden rounded-lg aspect-[4/3] bg-[#08120C]">
                <img
                    src={image}
                    alt={text}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                />
            </div>
            <div className="flex items-center w-full justify-center gap-1">
                <Typography variant={'body2'} style={{fontWeight: 500}}>
                    {text}
                </Typography>
                <ArrowRight size={18} strokeWidth={1.5} className="transition-transform group-hover:translate-x-1"/>
            </div>
        </Link>
    );
}

export default function Categories() {
    const { t } = useTranslation();

    return (
        <section className="w-full bg-[#f0f7f2] py-8 z-10">
            <div className="max-w-375 mx-auto">
                <Typography variant="h2" sx={{ fontWeight: 500, marginBottom: 4 }} className="px-8 lg:font-3xl md:text-2xl lg:px-8">
                    {t('categories.title')}
                </Typography>

                {/* Desktop: grid */}
                <div className="hidden lg:grid grid-cols-5 gap-4 mx-8">
                    {CATEGORIES.map(({ key, image, href }) => (
                        <CategoryCard key={key} text={t(`categories.items.${key}`)} image={image} href={href} />
                    ))}
                </div>

                {/* Mobile: carousel — 2 cards visible at once */}
                <div className="lg:hidden">
                   <CategoriesCarousel/>
                </div>
            </div>
        </section>
    );
}