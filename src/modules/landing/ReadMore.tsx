import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {Typography} from "@mui/material";
import AccordionDetails from "@mui/material/AccordionDetails";
import {Trans, useTranslation} from "react-i18next";
import {useState} from "react";

const FAQ_KEYS = [
    'organic_farming',
    'certified_quality',
    'expertise_catalog',
    'packaging_delivery',
];

export default function ReadMore() {
    const { t } = useTranslation();
    const [expanded, setExpanded] = useState<string | false>(false);

    const handleChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <section className="relative w-full bg-white py-16 px-4 z-10 flex flex-col items-center gap-4">
            <div className="max-w-375 w-full flex flex-col justify-start">
                <Typography variant="h2" className="text-[#193028] mb-15 leading-snug" sx={{fontWeight: 400}}>
                    <Trans i18nKey="read_more.title" components={{ b: <strong /> }} />
                </Typography>
            </div>

            <div className="flex flex-col gap-3 max-w-375 w-full">
                {FAQ_KEYS.map((key) => (
                    <Accordion
                        key={key}
                        expanded={expanded === key}
                        onChange={handleChange(key)}
                        disableGutters
                        elevation={0}
                        sx={{
                            background: '#f0f7f2',
                            backdropFilter: 'blur(8px)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '12px !important',
                            color: '#193028',
                            transition: 'background 0.2s ease',
                            '&:before': { display: 'none' },
                            '&.Mui-expanded': {
                                background: '#CDD4CF',
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
                                {t(`faq.items.${key}.question`)}
                            </Typography>
                        </AccordionSummary>

                        <AccordionDetails sx={{ px: 3, pb: 3, pt: 0 }}>
                            <Typography
                                variant="body2"
                                sx={{ color: '#193028', lineHeight: 1.8 }}
                            >
                                {t(`faq.items.${key}.answer`)}
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </div>
            <div className="max-w-375 mx-auto flex items-stretch justify-center gap-0 md:flex-row flex-col">
            </div>
        </section>
    )
}