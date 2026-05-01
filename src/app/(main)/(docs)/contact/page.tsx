// src/app/(main)/(docs)/contact/page.tsx
'use client';

import {useTranslation} from 'react-i18next';
import {Divider, Typography} from '@mui/material';
import ContactForm from "@/src/modules/contact/ContactForm";
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import TelegramIcon from '@mui/icons-material/Telegram';

const EMAIL = 'puer-expert@puerhexpert.com';
const TELEGRAM = '@puer-expert';
const BUSINESS_NAME = 'NDEV OÜ';

export default function ContactPage() {
    const {t} = useTranslation();

    return (
        <div className="h-screen bg-(--white-dim)">
            <section className="flex flex-col gap-4 w-full max-w-2xl mx-auto px-4 pt-14">

                {/* Header */}
                <div className="flex justify-between items-end">
                    <div>
                        <Typography variant="overline" className="text-gray-400 tracking-widest">
                            {t('contact.badge')}
                        </Typography>
                        <Typography variant="h5">{t('contact.heading')}</Typography>
                        <Typography variant="body2" className="text-gray-500 mt-1">
                            {t('contact.subheading')}
                        </Typography>
                    </div>
                </div>

                <Divider/>

                {/* Contact info */}
                <div className="flex flex-col gap-4">
                    <Typography variant="h6">{t('contact.info_heading')}</Typography>

                    {/* Customer commitment blurb */}
                    <Typography variant="body2" className="text-gray-500">
                        {t('contact.commitment')}
                    </Typography>

                    <Divider sx={{opacity: 0.5}}/>

                    <div className="flex flex-col md:flex-row md:justify-start gap-6 px-2">

                        {/* Email */}
                        <div className="flex gap-3 items-center">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full shrink-0 bg-(--mint)">
                                <EmailOutlinedIcon fontSize="small" sx={{color: 'var(--swamp-green)'}}/>
                            </div>
                            <div>
                                <Typography className="font-semibold leading-tight">
                                    {t('contact.email_label')}
                                </Typography>
                                <Typography
                                    component="a"
                                    href={`mailto:${EMAIL}`}
                                    variant="body2"
                                    className="no-underline transition-colors duration-150"
                                    sx={{
                                        color: '#1a3c2e',
                                        borderBottom: '1px  #1a3c2e',
                                        '&:hover': {
                                            color: '#1a3c2e',
                                            borderBottomStyle: 'solid',
                                            borderBottomColor: '#1a3c2e',
                                        },
                                    }}
                                >
                                    {EMAIL}
                                </Typography>
                            </div>
                        </div>

                        {/* Telegram */}
                        <div className="flex gap-3 items-center">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full shrink-0 bg-(--blue-light) pr-0.5">
                                <TelegramIcon fontSize="small" sx={{color: 'var(--blue-sky)'}}/>
                            </div>
                            <div>
                                <Typography className="font-semibold leading-tight">
                                    {t('contact.telegram_label')}
                                </Typography>
                                <Typography
                                    component="a"
                                    href={`https://t.me/${TELEGRAM.replace('@', '')}`}
                                    variant="body2"
                                    className="no-underline transition-colors duration-150"
                                    sx={{
                                        color: 'var(--blue-sky)',
                                        borderBottom: '1px',
                                        '&:hover': {
                                            color: 'var(--blue-sky)',
                                            borderBottomStyle: 'solid',
                                            borderBottomColor: 'var(--blue-sky)',
                                        },
                                    }}
                                >
                                    {TELEGRAM}
                                </Typography>
                            </div>
                        </div>

                    </div>
                </div>

                <ContactForm/>

                <Typography variant="caption" className="text-center text-gray-400">
                    © {new Date().getFullYear()} {BUSINESS_NAME}
                </Typography>
            </section>
        </div>
    );
}
