import {t} from "i18next";
import {useTranslation} from "react-i18next";
import {Button, Typography} from "@mui/material";
import {ArrowUpRight} from "lucide-react";
import {useState} from "react";

const BUTTON_GRADIENT = `linear-gradient(
    90deg,
    #1a3c2e 0%,
    #1a3c2e 20%,
    #2d6648 35%,
    #3a8f62 48%,
    #52c48a 56%,
    #3a8f62 64%,
    #2d6648 76%,
    #1a3c2e 90%,
    #1a3c2e 100%
)`;

export default function ContactUs() {
    const [hovered, setHovered] = useState(false);
    const {t} = useTranslation();

    const handleMouseEnter = () => setHovered(true);
    const handleMouseLeave = () => setHovered(false);


    return (
        <section className='bg-(--mint) w-full relative z-10'>
            <div className="mx-auto max-w-375 flex flex-col items-center px-8 py-12 gap-4">
                <Typography variant="h2" className="text-[#193028]" sx={{fontWeight: 600}}>
                    {t('contact_us.title')}
                </Typography>
                <Typography variant="body2" className="text-[#193028]" sx={{fontWeight: 600}}>
                    {t('contact_us.body')}
                </Typography>
                <Button
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    fullWidth
                    variant="contained"
                    endIcon={<ArrowUpRight size={16}/>}
                    sx={{
                        maxWidth: 400,
                        borderRadius: '6px',
                        textTransform: 'uppercase',
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                        py: 1.25,
                        fontFamily: "'DM Sans', sans-serif",
                        boxShadow: 'none',
                        color: 'white',
                        backgroundImage: BUTTON_GRADIENT,
                        backgroundSize: '300% 100%',
                        backgroundPosition: hovered ? undefined : '0% 50%',
                        animation: hovered ? 'greenSlide 5.6s linear infinite' : 'none',
                        backgroundColor: 'transparent',
                        transition: 'box-shadow 0.2s ease',
                        '&:hover': {
                            boxShadow: 'none',
                            backgroundColor: 'transparent',
                        },
                    }}
                >
                    {t('contact_us.button')}

                </Button>


            </div>

    </section>)
}