'use client';

import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Product } from '@/src/utils/types';

const SLUG_TRANSLATION_MAP: Record<string, string> = {
    'catalog':    'pages.catalog',
    'shu-puer':   'categories.shu-puer',
    'shen-puer': 'categories.shen-puer',


    'about-us':   'pages.about-us',
    'contact':    'pages.contact',
    'legal':      'pages.legal',
    'returns':    'pages.returns',
    'privacy':    'pages.privacy',
    'terms':      'pages.terms',
    'cookies':    'pages.cookies',
};

function formatSlug(slug: string): string {
    return slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function Chevron() {
    return (
        <svg
            width="12" height="12" viewBox="0 0 12 12"
            fill="none" xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className="flex-shrink-0 text-[#c8c4bc]"
        >
            <path
                d="M4.5 2.5L7.5 6L4.5 9.5"
                stroke="currentColor" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round"
            />
        </svg>
    );
}

type Crumb = { label: string; href: string; isLast: boolean };

interface BreadcrumbProps {
    product?: Product;
}

export default function AppBreadcrumb({ product }: BreadcrumbProps) {
    const pathname = usePathname();
    const { t, i18n } = useTranslation();
    const lang = i18n.language as keyof typeof i18n.language;

    const segments = pathname.split('/').filter(Boolean);

    let crumbs: Crumb[];

    if (product) {
        // Product page: Home > Catalog > [Category] > [Product Name]
        const categorySlug = product.category?.slug ?? 'catalog';
        const categoryName =
            product.category?.name?.[lang as keyof typeof product.category.name]
            ?? t(SLUG_TRANSLATION_MAP[categorySlug] ?? 'breadcrumb.catalog');

        const productName =
            product.name?.[lang as keyof typeof product.name]
            ?? formatSlug(product.slug);

        crumbs = [
            { label: t('pages.home'),    href: '/',                              isLast: false },
            { label: t('pages.catalog'), href: '/catalog/shu-puer',                       isLast: false },
            { label: categoryName,            href: `/catalog/${categorySlug}`,       isLast: false },
            { label: productName,             href: `/product/${categorySlug}/${product.slug}`, isLast: true  },
        ];
    } else {
        // Generic path-based breadcrumb
        crumbs = [
            { label: t('pages.home'), href: '/', isLast: segments.length === 0 },
        ];

        segments.forEach((segment, index) => {
            const href = '/' + segments.slice(0, index + 1).join('/');
            const isLast = index === segments.length - 1;
            const label = SLUG_TRANSLATION_MAP[segment]
                ? t(SLUG_TRANSLATION_MAP[segment])
                : formatSlug(segment);
            crumbs.push({ label, href, isLast });
        });
    }

    if (segments.length === 0) return null;

    return (
        <nav aria-label="Breadcrumb">
            <ol className="flex items-cente gap-0.5">
                {crumbs.map((crumb, index) => (
                    <li key={crumb.href} className="flex items-center gap-0.5">
                        {index > 0 && <Chevron />}

                        {crumb.isLast ? (
                            <span
                                aria-current="page"
                                className="text-xs md:text-sm font-medium text-(--green-pale) truncate max-w-50"
                            >
                                {crumb.label}
                            </span>
                        ) : (
                            <Link
                                href={crumb.href}
                                className="text-xs md:text-sm text-(--beige-grey) hover:text-(--green-pale) py-2 transition-colors duration-150 truncate max-w-50"
                            >
                                {crumb.label}
                            </Link>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}