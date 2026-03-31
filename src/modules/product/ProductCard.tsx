'use client';

import { useState } from 'react';
import { Button, Typography } from '@mui/material';
import Link from 'next/link';

interface ProductCardProps {
    id: string | number;
    name: string;
    price: number;
    image: string;
    hoverImage: string;
    slug?: string;
}

export default function ProductCard({ id, name, price, image, hoverImage, slug }: ProductCardProps) {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                display: 'flex',
                flexDirection: 'column',
                background: '#faf9f7',
                border: '1px solid #c8c8bc',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'box-shadow 0.3s ease',
                boxShadow: hovered ? '0 8px 32px rgba(0, 0, 0, 0.12)' : 'none',
            }}
        >
            {/* Image wrapper */}
            <div style={{ position: 'relative', width: '100%', aspectRatio: '3/4', overflow: 'hidden' }}>
                {/* Primary image */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `url(${image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        opacity: hovered ? 0 : 1,
                        transform: hovered ? 'scale(1.08)' : 'scale(1)',
                        transition: 'opacity 0.5s ease, transform 0.6s ease',
                    }}
                />
                {/* Hover image */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `url(${hoverImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        opacity: hovered ? 1 : 0,
                        transform: hovered ? 'scale(1.08)' : 'scale(1)',
                        transition: 'opacity 0.5s ease, transform 0.6s ease',
                        zIndex: 1,
                    }}
                />
            </div>

            {/* Card body */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16 }}>
                {/* Name + price row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                    <Typography
                        variant="subtitle1"
                        style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontWeight: 500,
                            fontSize: '0.95rem',
                            letterSpacing: '0.01em',
                            color: '#1a3c2e',
                            lineHeight: 1.3,
                        }}
                    >
                        {name}
                    </Typography>

                    <Typography
                        variant="body2"
                        style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: '0.95rem',
                            color: '#4a6b5a',
                            letterSpacing: '0.01em',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        ${price.toFixed(2)}
                    </Typography>
                </div>

                {/* Button — matches product page .buy-btn exactly */}
                <Link href={`/catalog/${slug ?? id}`} style={{ width: '100%' }}>
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{
                            backgroundColor: 'var(--sage)',
                            color: '#fff',
                            borderRadius: '6px',
                            textTransform: 'none',
                            fontSize: '0.95rem',
                            fontWeight: 500,
                            py: 1.5,
                            fontFamily: "'DM Sans', sans-serif",
                            letterSpacing: '0.01em',
                            boxShadow: 'none',
                            transition: 'background 0.2s ease',
                            '&:hover': {
                                backgroundColor: 'var(--sage-light)',
                                boxShadow: 'none',
                            },
                        }}
                    >
                        Learn More
                    </Button>
                </Link>
            </div>
        </div>
    );
}