'use client';

import Link from 'next/link';
import { useTranslation, Trans } from 'react-i18next';

const TELEGRAM_ACCOUNT = '@PuerExpert';
const TELEGRAM_HREF = 'https://t.me/PuerExpert';

const linkClass = 'text-[#8aab9a] text-sm underline underline-offset-2 decoration-transparent transition-colors duration-200 hover:text-white hover:decoration-white';

export default function Footer() {
    const { t } = useTranslation();

    const QUICK_LINKS = [
        { label: t('footer.quick_links.shop'), href: '/catalog/shu-puer' },
        { label: t('footer.quick_links.account'), href: '/account' },
        { label: t('footer.quick_links.home'), href: '/' },
    ];

    const INFORMATION_LINKS = [
        { label: t('footer.information.about'), href: '/about' },
        { label: t('footer.information.returns'), href: '/returns' },
        { label: t('footer.information.terms'), href: '/terms' },

        { label: t('footer.information.cookies'), href: '/cookies' },
        { label: t('footer.information.privacy'), href: '/privacy' },
    ];


    return (
        <footer className='relative'
            style={{
                backgroundColor: 'var(--swamp-green)',
                backgroundImage: `
                    radial-gradient(ellipse 55% 200% at 0% 100%, #254030 0%, transparent 65%),
                    radial-gradient(ellipse 40% 180% at 100% 0%,  #1f3a2c 0%, transparent 60%),
                    radial-gradient(ellipse 30% 120% at 50% 50%,  #1c3329 0%, transparent 80%)
                `,
            }}
        >
            <div className="max-w-375 mx-auto px-4 pt-12">

                {/* ── Main grid ── */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-10">

                    {/* Brand column */}
                    <div className="flex flex-col gap-3">
                        <p className="text-white font-bold tracking-widest uppercase">
                            {"Pu\'er Expert"}
                        </p>
                        <p className="text-[#8aab9a] text-sm leading-relaxed max-w-50 text-justify">
                            {t('footer.promotion_text')}
                        </p>

                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-col gap-2.5">
                        <p className="font-semibold uppercase tracking-[0.1em] text-white mb-1">
                            {t('footer.quick_links.title')}
                        </p>
                        {QUICK_LINKS.map((link) => (
                            <Link key={link.href} href={link.href} className={linkClass}>
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Information */}
                    <div className="flex flex-col gap-2.5">
                        <p className="font-semibold uppercase tracking-[0.1em] text-white mb-1">
                            {t('footer.information.title')}
                        </p>
                        {INFORMATION_LINKS.map((link) => (
                            <Link key={link.href} href={link.href} className={linkClass}>
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Contact */}
                    <div className="flex flex-col gap-2.5">
                        <p className="font-semibold uppercase tracking-[0.1em] text-white mb-1">
                            {t('footer.contact.title')}
                        </p>
                        <span className="text-[#8aab9a] text-sm">
                            {t('footer.contact.phone')}
                        </span>
                        <a href={`mailto:${t('footer.contact.email')}`} className={linkClass}>
                            {t('footer.contact.email')}
                        </a>
                        <p className="text-[#8aab9a] text-sm leading-relaxed max-w-[220px]">
                            <Trans
                                i18nKey="footer.contact.note"
                                components={{ b: <strong className="text-(--mint)" /> }}
                                values={{ telegram: TELEGRAM_ACCOUNT }}
                            />


                        </p>
                    </div>
                </section>

                <div style={{
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent, #2e5242 20%, #2e5242 80%, transparent)'
                }} />

                {/* ── Bottom bar ── */}
                <section className="flex justify-center py-5">
                    <p className="text-[#5a7a6a] text-xs font-semibold">
                        {t('footer.bottom.copyright', { year: new Date().getFullYear() })}
                    </p>

                </section>

            </div>
        </footer>
    );
}