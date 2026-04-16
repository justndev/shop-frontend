'use client';

import {useEffect, useState} from 'react';
import {Button, Typography} from '@mui/material';
import Link from 'next/link';
import {ArrowUpRight, User} from "lucide-react";
import {Product} from "@/src/types";
import {useTranslation} from "react-i18next";


export default function ProductCard({product}: {product: Product}) {
    const [hovered, setHovered] = useState(false);
    const { i18n } = useTranslation();

    const lastImageIndex = product.images.length - 1

    return (
        <Link href={`/product/${product.slug}`} style={{width: '100%', marginTop: 10}}>

            <div
                onClick={() => setHovered(!hovered)}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'var(--color-background-primary, #fff)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'box-shadow 0.25s ease',
                }}
            >
                {/* Square image area */}
                <div
                    style={{
                        position: 'relative',
                        width: '100%',
                        aspectRatio: '1 / 1',
                        background: '#ffffff',
                        overflow: 'hidden',
                    }}
                >
                    {/* MASK WRAPPER */}
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,

                            WebkitMaskImage: 'url(/puerh-mask.png)',
                            WebkitMaskRepeat: 'no-repeat',
                            WebkitMaskSize: 'contain',
                            WebkitMaskPosition: 'center',

                            maskImage: 'url(/puerh-mask.png)',
                            maskRepeat: 'no-repeat',
                            maskSize: 'contain',
                            maskPosition: 'center',
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

                        {/* Hover image */}
                        <div
                            style={{
                                position: 'absolute',
                                inset: 0,
                                backgroundImage: `url(${product.images[lastImageIndex]})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                opacity: hovered ? 1 : 0,
                                transform: hovered ? 'scale(1.2)' : 'scale(1)',
                                transition: 'opacity 0.5s ease, transform 0.6s ease',
                            }}
                        />
                    </div>
                </div>

                {/* Divider */}
                <div className='border-2 my-2 rounded-3xl border-[var(--swamp-green)]'/>

                {/* Card body */}
                <div style={{display: 'flex', flexDirection: 'column', gap: 4, padding: '14px 16px 16px'}}>
                    {/* Name */}
                    <div className='h-10 flex items-center'>
                        <Typography
                            variant="body2"
                            style={{
                                fontWeight: 600,
                                letterSpacing: '0.02em',
                                lineHeight: 1.4,
                            }}
                        >
                            {product.name[i18n.language]}
                        </Typography>
                    </div>


                    {/* Price — larger and bold, below name */}
                    <Typography
                        variant="h6"
                        style={{
                            fontWeight: 700,
                            fontSize: '1.35rem',
                            letterSpacing: '-0.01em',
                            lineHeight: 1.2,
                            fontStyle: 'italic'
                        }}
                    >
                        €{product.price}
                    </Typography>

                    {/* CTA button */}
                    <Button
                        fullWidth
                        variant="contained"
                        endIcon={
                            <ArrowUpRight/>
                        }
                        sx={{
                            marginTop: 1,
                            backgroundColor: '#1a3c2e',
                            color: '#fff',
                            borderRadius: '6px',
                            textTransform: 'uppercase',
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            letterSpacing: '0.06em',
                            py: 1.25,
                            fontFamily: "'DM Sans', sans-serif",
                            boxShadow: 'none',
                            transition: 'background 0.2s ease',
                            '&:hover': {
                                backgroundColor: '#2d5c46',
                                boxShadow: 'none',
                            },
                        }}
                    >
                        Learn More
                    </Button>

                </div>
            </div>
        </Link>
    );
}