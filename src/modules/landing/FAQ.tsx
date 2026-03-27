'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const FAQ_KEYS = [
    'organic_farming',
    'certified_quality',
    'expertise_catalog',
    'packaging_delivery',
];

export default function FAQ() {
    const { t } = useTranslation();
    const [expanded, setExpanded] = useState<string | false>(false);

    const handleChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <section
            className="relative w-full "
            style={{ background: '#08120C' }}
        >
            {/* Sticky zero-height anchor — video stays pinned while section is in view.
                pointerEvents: none is CRITICAL — without it the sticky div intercepts
                all clicks and the accordions become unclickable. */}
            <div
                aria-hidden="true"
                style={{
                    position: 'sticky',
                    top: 0,
                    height: 0,
                    overflow: 'visible',
                    pointerEvents: 'none',
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100vh',
                        marginLeft: 'calc(-50vw + 50%)',
                        transform: 'translateZ(0)',
                        willChange: 'transform',
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
                            opacity: 0.35,
                            display: 'block',
                        }}
                    >
                        <source src="faq-bg-2.mp4" type="video/mp4" />
                    </video>

                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            background:
                                'linear-gradient(to bottom, rgba(8,18,12,0.55) 0%, rgba(8,18,12,0.3) 50%, rgba(8,18,12,0.7) 100%)',
                        }}
                    />
                </div>
            </div>

            {/* Content — zIndex: 1 ensures it sits above the sticky video (zIndex: 0).
                position: relative is required for zIndex to take effect. */}
            <div
                className="relative max-w-3xl mx-auto py-20 px-4"
                style={{ zIndex: 1 }}
            >
                <Typography
                    variant="h2"
                    sx={{
                        fontWeight: 400,
                        color: '#fff',
                        textAlign: 'center',
                        marginBottom: 6,
                    }}
                >
                    {t('faq.title')}
                </Typography>

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
                                <Typography variant="body1" sx={{ color: '#fff', fontWeight: 400 }}>
                                    {t(`faq.items.${key}.question`)}
                                </Typography>
                            </AccordionSummary>

                            <AccordionDetails sx={{ px: 3, pb: 3, pt: 0 }}>
                                <Typography
                                    variant="body2"
                                    sx={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.8 }}
                                >
                                    {t(`faq.items.${key}.answer`)}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </div>
            </div>
        </section>
    );
}