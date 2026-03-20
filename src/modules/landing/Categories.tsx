'use client';

import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES = [
    { key: 'puer',      image: '/images/cat-puer.jpg',      href: '/catalog/puer' },
    { key: 'oolong',    image: '/images/cat-oolong.jpg',    href: '/catalog/oolong' },
    { key: 'green',     image: '/images/cat-green.jpg',     href: '/catalog/green' },
    { key: 'white',     image: '/images/cat-white.jpg',     href: '/catalog/white' },
    { key: 'ceremony',  image: '/images/cat-ceremony.jpg',  href: '/catalog/ceremony' },
];

export default function Categories() {
    const { t } = useTranslation();

    return (
        <section className="w-full bg-[#f0f7f2] py-16 px-4 z-10">
            <div className="max-w-5xl mx-auto">
                <Typography variant="h5" className="font-bold text-[#08120C] mb-8">
                    {t('categories.title')}
                </Typography>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {CATEGORIES.map(({ key, image, href }) => (
                        <Link key={key} href={href} className="group flex flex-col gap-2">
                            {/* Image */}
                            <div className="overflow-hidden rounded-lg aspect-[4/3] bg-[#08120C]">
                                <img
                                    src={image}
                                    alt={t(`categories.items.${key}`)}
                                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                                />
                            </div>

                            {/* Label */}
                            <div className="flex items-center gap-1 text-sm font-medium text-[#08120C] group-hover:text-[#193028]">
                                <span>{t(`categories.items.${key}`)}</span>
                                <ArrowRight size={14} strokeWidth={1.5} className="transition-transform group-hover:translate-x-1" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}