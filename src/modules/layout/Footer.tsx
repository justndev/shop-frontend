'use client';

import Link from 'next/link';
import {useTranslation, Trans} from 'react-i18next';
import {Divider} from "@mui/material";

const TELEGRAM_ACCOUNT = '@PuerExpert';
const TELEGRAM_HREF = 'https://t.me/PuerExpert';

export default function Footer() {
    const {t} = useTranslation();

    const QUICK_LINKS = [
        {label: t('footer.quick_links.shop'), href: '/catalog/shu-puer'},
        {label: t('footer.quick_links.account'), href: '/account'},
        {label: t('footer.quick_links.home'), href: '/'},
    ];

    const INFORMATION_LINKS = [
        {label: t('footer.information.who_are_we'), href: '/about'},
        {label: t('footer.information.shipping'), href: '/shipping'},
        {label: t('footer.information.legal'), href: '/legal'},
        {label: t('footer.information.privacy'), href: '/privacy'},
    ];

    const linkClass = "text-(--mint-pale) text-sm underline underline-offset-2 decoration-transparent transition-colors duration-200 hover:text-white hover:decoration-white";

    return (
        <footer className="relative bg-(--footer-bg) text-(--mint) w-full">
            <div className="flex flex-col max-w-375 mx-auto px-4 pt-10">
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 pb-6">

                    {/* Quick Links */}
                    <div className="flex flex-col gap-2.5">
                        <p className="font-bold text-white">
                            {t('footer.quick_links.title')}
                        </p>
                        {QUICK_LINKS.map(link => (
                            <div key={link.href}>
                                <Link href={link.href} className={linkClass}>
                                    {link.label}
                                </Link>
                            </div>
                        ))}
                    </div>

                    {/* Information */}
                    <div className="flex flex-col gap-2.5">
                        <p className="font-bold text-white">
                            {t('footer.information.title')}
                        </p>
                        {INFORMATION_LINKS.map(link => (
                            <div key={link.href}>
                                <Link href={link.href} className={linkClass}>
                                    {link.label}
                                </Link>
                            </div>
                        ))}
                    </div>

                    {/* Contact */}
                    <div className="flex flex-col gap-2.5">
                        <p className="text-base font-bold text-white">
                            {t('footer.contact.title')}
                        </p>
                        <div className="text-(--mint-pale) text-sm">
                            {t('footer.contact.phone')}
                        </div>
                        <a href={`mailto:${t('footer.contact.email')}`} className={linkClass}>
                            {t('footer.contact.email')}
                        </a>
                        <div className="text-(--mint-pale) text-sm leading-[1.6] max-w-100">
                            <Trans i18nKey='footer.contact.note' components={{b: <strong/>}}
                                   values={{telegram: TELEGRAM_ACCOUNT}}
                            />

                        </div>
                    </div>
                </section>

                <Divider sx={{backgroundColor: 'var(--green-pale)', borderBottomWidth: 0.5}}/>

                {/* Bottom bar */}
                <section className="max-w-375 mx-auto px-12 py-5">
                    <p className="text-(--mint-pale) text-xs">
                        {t('footer.bottom.copyright', {year: new Date().getFullYear()})}
                    </p>
                </section>
            </div>
        </footer>
    );
}