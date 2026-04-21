'use client';

import {useState, useRef, useCallback, useEffect} from 'react';
import {Button, Typography} from '@mui/material';
import Link from 'next/link';
import {ArrowUpRight} from "lucide-react";
import {Product} from "@/src/types";
import {useTranslation} from "react-i18next";
import {cutTitle} from "@/src/utils/functions";

// Inject keyframes once into the document head
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

// The gradient is always present on the button — we just animate it on card hover.
// This eliminates the flash caused by toggling backgroundImage on/off.
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

export default function ComplexProductCard({product}: { product: Product }) {
    const [hovered, setHovered] = useState(false);
    const [imageOffset, setImageOffset] = useState({x: 0, y: 0});
    const cardRef = useRef<HTMLDivElement>(null);
    const {i18n} = useTranslation();

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

    useEffect(() => {
        console.log(product)
    }, []);

    if (!product) return null;

    return (
        <Link
            href={`/product/${product.slug}`}
            ref={cardRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
            style={{
                height: '100%',          // ← add this
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '12px',
                overflow: 'hidden',
                backgroundColor: '#ffffff',
                border: '1px solid #e8ede9',
                cursor: 'pointer',
                transition: 'box-shadow 0.25s ease, transform 0.25s ease',
                boxShadow: hovered ? '0 8px 24px rgba(26,60,46,0.12)' : '0 1px 4px rgba(0,0,0,0.06)',
                transform: hovered ? 'translateY(-2px)' : 'none',
            }}
        >

            {/* Square image area */}
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '1 / 1',
                    background: '#f2f5f2',
                    overflow: 'hidden',
                }}
            >
                {/* Base image */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `url(${product.images[0]})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        opacity: hovered ? 0 : 1,
                        transition: 'opacity 0.5s ease',
                    }}
                />

                {/* Hover image — parallax layer */}
                <div
                    style={{
                        position: 'absolute',
                        inset: '-20px',
                        backgroundImage: `url(${product.images[2]})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        opacity: hovered ? 1 : 0,
                        transform: hovered
                            ? `translate(${imageOffset.x}px, ${imageOffset.y}px) scale(1.01)`
                            : 'translate(0px, 0px) scale(1)',
                        transition: hovered
                            ? 'opacity 0.5s ease, transform 0.12s ease-out'
                            : 'opacity 0.5s ease, transform 0.6s ease',
                    }}
                />
            </div>

            {/* Green accent divider */}
            <div style={{height: '3px', background: '#1a3c2e'}}/>

            {/* Card body */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,                          // ← add this
                justifyContent: 'space-between',  // ← add this
                backgroundColor: '#ffffff',
                gap: 10,
                padding: '14px 16px 16px',
            }}>
                {/* Name */}
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <Typography
                        variant="body2"
                        style={{
                            fontWeight: 600,
                            letterSpacing: '0.02em',
                            lineHeight: 1.4,
                            color: '#1a1a14',
                        }}
                    >
                        {cutTitle(product.name[i18n.language])}
                    </Typography>
                </div>

                {/* Price */}
                <Typography
                    variant="h6"
                    style={{
                        fontWeight: 700,
                        fontSize: '1.35rem',
                        letterSpacing: '-0.01em',
                        lineHeight: 1.2,
                        fontStyle: 'italic',
                        color: '#1a3c2e',
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
                        color: '#fff',

                        // Always-on gradient — toggling backgroundImage is what caused the flash
                        backgroundImage: BUTTON_GRADIENT,
                        backgroundSize: '300% 100%',
                        // At rest: clamp position so only the dark-left segment is visible
                        backgroundPosition: hovered ? undefined : '0% 50%',
                        // On card hover: run the sweep
                        animation: hovered ? 'greenSlide 5.6s linear infinite' : 'none',

                        // Must stay transparent — any opaque backgroundColor will flash on MUI hover
                        backgroundColor: 'transparent',

                        transition: 'box-shadow 0.2s ease',

                        '&:hover': {
                            boxShadow: 'none',
                            backgroundColor: 'transparent',
                        },
                    }}
                >
                    Learn More
                </Button>
            </div>
        </Link>
    );
}