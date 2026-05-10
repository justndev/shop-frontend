import {Typography} from "@mui/material";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";

const MESSAGES = [
    "header.top.promo1",
    "header.top.promo2",
    "header.top.promo3",
];

export default function SmallHeader() {
    const [atTop, setAtTop] = useState(true);
    const [index, setIndex] = useState(0);
    const {t} = useTranslation();

    const [slide, setSlide] = useState<'idle' | 'exit' | 'enter'>('idle');


    useEffect(() => {
        const onScroll = () => setAtTop(window.scrollY < 10);
        window.addEventListener('scroll', onScroll, {passive: true});
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setSlide('exit');
            setTimeout(() => {
                setIndex(prev => (prev + 1) % MESSAGES.length);
                setSlide('enter');
                setTimeout(() => {
                    setSlide('idle');
                }, 50);
            }, 400);
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    const transforms: Record<typeof slide, string> = {
        idle:  'translateX(0)',
        exit:  'translateX(25%)',
        enter: 'translateX(-25%)',
    };

    return (
        <div className={`bg-white text-(--swamp-green-dark) text-sm overflow-hidden transition-all duration-300 ease-in-out ${atTop ? 'max-h-14 opacity-100' : 'max-h-0'}`}>
            <div className="max-w-6xl mx-auto px-4 h-10 flex items-center justify-center gap-4">
                <Typography
                    style={{
                        fontSize: '12px',
                        fontWeight: '600',
                        transform: transforms[slide],
                        opacity: slide === 'idle' ? 1 : 0,
                        transition: slide === 'enter'
                            ? 'none'                              // snap to left instantly, no transition
                            : 'transform 0.4s ease, opacity 0.4s ease',
                    }}
                >
                    {t(MESSAGES[index])}
                </Typography>
            </div>
        </div>
    );
}
