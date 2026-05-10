import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {Typography} from "@mui/material";
import AccordionDetails from "@mui/material/AccordionDetails";
import {Trans, useTranslation} from "react-i18next";
import {useState} from "react";

const FAQ_KEYS = [
    'what_is_puer',
    'energy_vs_coffee',
    'sleep_quality',
    'fair_pricing',
    'tea_origin',
    'delivery_speed',
    'returns',
    'health_benefits',
];

export default function ReadMore() {
    const { t } = useTranslation();
    const [expanded, setExpanded] = useState<string | false>(false);

    const handleChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <section className="relative w-full bg-white z-11">
            <div className="max-w-375 flex flex-col mx-auto py-16 px-8 gap-4">
                <div className="w-full flex flex-col justify-start">
                    <Typography variant="h2" className="text-[#193028]" sx={{fontWeight: 600}}>
                        {t('read_more.title')}
                    </Typography>
                </div>

                <div className="flex flex-col gap-3 w-full">
                    {FAQ_KEYS.map((key) => (
                        <Accordion
                            key={key}
                            expanded={expanded === key}
                            onChange={handleChange(key)}
                            disableGutters
                            elevation={0}
                            sx={{
                                background: 'var(--mint)',
                                borderRadius: '12px !important',
                                transition: 'background 0.2s ease',
                                '&:before': { display: 'none' },
                                '&.Mui-expanded': {
                                    background: '#EBF5EE',
                                },
                            }}
                        >
                            <AccordionSummary
                                expandIcon={
                                    <ExpandMoreIcon sx={{ color: '#193028' }} />
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
                                <Typography variant="body1" sx={{ color: '#193028', fontWeight: 400 }}>
                                    {t(`read_more.items.${key}.question`)}
                                </Typography>
                            </AccordionSummary>

                            <AccordionDetails sx={{ px: 3, pb: 3, pt: 0 }}>
                                <Typography
                                    variant="body2"
                                    sx={{ color: '#193028', lineHeight: 1.8 }}
                                >
                                    {t(`read_more.items.${key}.answer`)}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </div>
            </div>

        </section>
    )
}