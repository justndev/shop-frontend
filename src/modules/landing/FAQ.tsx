'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const FAQ_KEYS = [
    'fast_delivery',
    'fair_prices',
    'high_quality',
    'puer_effect',
];

export default function FAQ() {
    const { t } = useTranslation();
    const [expanded, setExpanded] = useState<string | false>(false);

    const handleChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <section
            className="relative w-full overflow-hidden"
            style={{ background: '#08120C' }}
        >
            {/* Fixed video — clipped to section bounds by overflow:hidden on parent */}
            <div
                aria-hidden="true"
                style={{
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                }}
            >
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100vh',
                    }}
                >
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block',
                        }}
                    >
                        <source src="/faq-bg-2.mp4" type="video/mp4" />
                    </video>

                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'rgba(8,12,12,0.82)',  // tweak this value to taste
                        }}
                    />
                </div>
            </div>

            {/* Content — zIndex: 1 ensures it sits above the sticky video (zIndex: 0).
                position: relative is required for zIndex to take effect. */}
            <div
                className="relative max-w-3xl mx-auto md:py-20 py-8 px-2"
                style={{ zIndex: 1 }}
            >
                <div className='md:mb-6 mb-3'>
                    <Typography
                        variant="h2"
                        sx={{
                            fontWeight: 400,
                            color: '#fff',
                            textAlign: 'center',
                        }}
                    >
                        {t('faq.title')}
                    </Typography>
                </div>


                <div className="flex flex-col gap-3">
                    {FAQ_KEYS.map((key) => (
                        <Accordion
                            key={key}
                            expanded={expanded === key}
                            onChange={handleChange(key)}
                            disableGutters
                            elevation={0}
                            sx={{
                                background: 'rgba(25, 48, 40, 0.75)',
                                backdropFilter: 'blur(8px)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '12px !important',
                                color: '#fff',
                                transition: 'background 0.2s ease',
                                '&:before': { display: 'none' },
                                '&.Mui-expanded': {
                                    background: 'rgba(25, 48, 40, 0.95)',
                                },
                            }}
                        >
                            <AccordionSummary
                                expandIcon={
                                    <ExpandMoreIcon sx={{ color: 'rgba(255,255,255,0.6)' }} />
                                }
                                aria-controls={`faq-${key}-content`}
                                id={`faq-${key}-header`}
                                sx={{
                                    px: 3,
                                    py: 0.5,
                                    minHeight: 56,
                                    '& .MuiAccordionSummary-content': { my: 1.5 },
                                }}
                            >
                                <Typography variant="body1" sx={{ color: '#fff', fontWeight: 500 }}>
                                    {t(`faq.items.${key}.title`)}
                                </Typography>
                            </AccordionSummary>

                            <AccordionDetails sx={{ px: 3, pb: 3, pt: 0 }}>
                                <Typography
                                    variant="body2"
                                    sx={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.8 }}
                                >
                                    {t(`faq.items.${key}.body`)}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </div>
            </div>
        </section>
    );
}