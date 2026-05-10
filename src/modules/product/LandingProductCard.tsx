
'use client';

import {useState, useRef, useCallback, useEffect} from 'react';
import {useTranslation} from "react-i18next";

import {Product} from "@/src/utils/types";
import {cutTitle} from "@/src/utils/functions";

import Link from 'next/link';
import {Button, Typography} from '@mui/material';
import {ArrowUpRight} from "lucide-react";

const KEYFRAMES = `
@keyframes greenSlide {
  0%   { background-position: 200% 50%; }
  100% { background-position: -100% 50%; }
}
`;

if (typeof document !== 'undefined') {
    const styleId = '__product-card-styles__';
    if (!document.getElementById(styleId)) {
        const tag = document.createElement('style');
        tag.id = styleId;
        tag.textContent = KEYFRAMES;
        document.head.appendChild(tag);
    }
}

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

export default function LandingProductCard({product}: { product: Product }) {
    const [hovered, setHovered] = useState(false);
    const [imageOffset, setImageOffset] = useState({x: 0, y: 0});
    const cardRef = useRef<HTMLDivElement>(null);
    const {i18n, t} = useTranslation();

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const nx = ((e.clientX - rect.left) / rect.width) * 0.7 - 1;
        const ny = ((e.clientY - rect.top) / rect.height) * 0.7 - 1;
        const strength = 14;
        setImageOffset({x: nx * strength, y: ny * strength});
    }, []);

    const handleMouseEnter = () => setHovered(true);

    const handleMouseLeave = () => {
        setHovered(false);
        setImageOffset({x: 0, y: 0});
    };

    if (!product) return null;

    return (
        <Link
            href={`/product/${product.slug}`}
            ref={cardRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
            className="flex flex-col rounded-xl overflow-hidden bg-white  cursor-pointer"
            style={{
                // Dynamic: change on hover state

                transition: 'transform 0.25s ease',
            }}
        >

            {/* Square image area */}
            <div className="relative w-full overflow-hidden " >

                {/* Base image */}
                <img
                    src={`${product.images[0]}`}
                />
                {/* Hover image — parallax layer */}
                {/*<div*/}
                {/*    className="absolute bg-cover bg-center"*/}
                {/*    style={{*/}
                {/*        // Dynamic: transform changes per mouse position + opacity on hover*/}
                {/*        inset: '-20px',*/}
                {/*        backgroundImage: `url(${product.images[2]})`,*/}
                {/*        opacity: hovered ? 1 : 0,*/}
                {/*        transform: hovered*/}
                {/*            ? `translate(${imageOffset.x}px, ${imageOffset.y}px) scale(1.01)`*/}
                {/*            : 'translate(0px, 0px) scale(1)',*/}
                {/*        transition: hovered*/}
                {/*            ? 'opacity 0.5s ease, transform 0.12s ease-out'*/}
                {/*            : 'opacity 0.5s ease, transform 0.6s ease',*/}
                {/*    }}*/}
                {/*/>*/}
            </div>

            {/* Green accent divider */}

            {/* Card body */}
            <div className="flex flex-col justify-center bg-white gap-3 p-4 align-center">
                {/* Name */}
                <Typography
                    variant="body2"
                    sx={{
                        fontWeight: 'bold',
                        color: 'var(--swamp-green)'
                    }}
                >
                    {cutTitle(product.name[i18n.language])}
                </Typography>

                {/* Price */}
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 'bold',
                        color: 'var(--green-pale)',
                        fontStyle: 'italic',
                    }}
                >
                    €{product.price}
                </Typography>

                <Button
                    fullWidth
                    variant="contained"
                    endIcon={<ArrowUpRight size={16}/>}
                    sx={{
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
                    {t('utils.more')}
                </Button>
            </div>
        </Link>
    );
}
