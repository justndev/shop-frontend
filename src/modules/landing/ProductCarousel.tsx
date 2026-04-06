'use client';

import { useRef, useState, useEffect } from 'react';
import { Typography, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '@/src/modules/product/ProductCard';
import { MOCKED_PRODUCTS } from '@/src/utils/mocks';

export default function ProductCarousel() {
    const trackRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);

    const CARD_WIDTH = 260; // px, matches minmax in grid
    const GAP = 20;

    const checkScroll = () => {
        const el = trackRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 4);
        setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
        const page = Math.round(el.scrollLeft / (CARD_WIDTH + GAP));
        setCurrentPage(page);
    };

    useEffect(() => {
        const el = trackRef.current;
        if (!el) return;
        el.addEventListener('scroll', checkScroll, { passive: true });
        checkScroll();
        return () => el.removeEventListener('scroll', checkScroll);
    }, []);

    const scroll = (dir: 'left' | 'right') => {
        const el = trackRef.current;
        if (!el) return;
        const amount = (CARD_WIDTH + GAP) * 2; // scroll 2 cards at a time
        el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
    };

    const totalPages = Math.ceil(MOCKED_PRODUCTS.length / 2);

    return (
        <div className="product-carousel-wrapper">
            {/* Header row */}
            <div className="carousel-header">
                <Typography
                    variant="overline"
                    sx={{
                        color: '#1a3c2e',
                        fontWeight: 700,
                        letterSpacing: '0.12em',
                        fontSize: '0.7rem',
                    }}
                >
                    Our Selection
                </Typography>

                {/* Nav buttons */}
                <div className="carousel-nav">
                    <IconButton
                        onClick={() => scroll('left')}
                        disabled={!canScrollLeft}
                        className="nav-btn"
                        sx={{
                            border: '1.5px solid',
                            borderColor: canScrollLeft ? '#1a3c2e' : '#ccc',
                            borderRadius: '50%',
                            width: 40,
                            height: 40,
                            color: canScrollLeft ? '#1a3c2e' : '#ccc',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                backgroundColor: '#1a3c2e',
                                color: '#fff',
                                borderColor: '#1a3c2e',
                            },
                        }}
                    >
                        <ChevronLeft size={18} />
                    </IconButton>
                    <IconButton
                        onClick={() => scroll('right')}
                        disabled={!canScrollRight}
                        sx={{
                            border: '1.5px solid',
                            borderColor: canScrollRight ? '#1a3c2e' : '#ccc',
                            borderRadius: '50%',
                            width: 40,
                            height: 40,
                            color: canScrollRight ? '#1a3c2e' : '#ccc',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                backgroundColor: '#1a3c2e',
                                color: '#fff',
                                borderColor: '#1a3c2e',
                            },
                        }}
                    >
                        <ChevronRight size={18} />
                    </IconButton>
                </div>
            </div>

            {/* Scrollable track */}
            <div className="carousel-track-wrapper">
                <div className="carousel-track" ref={trackRef}>
                    {MOCKED_PRODUCTS.map(product => (
                        <div className="carousel-item" key={product.id}>
                            <ProductCard
                                id={product.id}
                                name={product.name}
                                price={product.salePrice ?? product.price}
                                image={product.images[0]}
                                hoverImage={product.images[1] ?? product.images[0]}
                                slug={product.slug}
                            />
                        </div>
                    ))}
                </div>

                {/* Fade edge right */}
                <div className="fade-right" />
            </div>

            {/* Pagination dots */}
            <div className="carousel-dots">
                {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                        key={i}
                        onClick={() => {
                            const el = trackRef.current;
                            if (!el) return;
                            el.scrollTo({ left: i * 2 * (CARD_WIDTH + GAP), behavior: 'smooth' });
                        }}
                        className={`dot ${currentPage === i * 2 || currentPage === i * 2 + 1 ? 'dot-active' : ''}`}
                    />
                ))}
            </div>

            <style jsx>{`
                .product-carousel-wrapper {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .carousel-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 4px;
                }

                .carousel-nav {
                    display: flex;
                    gap: 8px;
                }

                .carousel-track-wrapper {
                    position: relative;
                    overflow: hidden;
                }

                .carousel-track {
                    display: flex;
                    gap: ${GAP}px;
                    overflow-x: auto;
                    scroll-snap-type: x mandatory;
                    -webkit-overflow-scrolling: touch;
                    scrollbar-width: none;
                    padding-bottom: 8px;
                }

                .carousel-track::-webkit-scrollbar {
                    display: none;
                }

                .carousel-item {
                    flex: 0 0 ${CARD_WIDTH}px;
                    scroll-snap-align: start;
                    display: flex;
                }

                /* make ProductCard fill its container */
                .carousel-item > a {
                    width: 100% !important;
                    margin-top: 0 !important;
                }

                .fade-right {
                    position: absolute;
                    right: 0;
                    top: 0;
                    bottom: 8px;
                    width: 80px;
                    background: linear-gradient(to right, transparent, white);
                    pointer-events: none;
                }

                .carousel-dots {
                    display: flex;
                    justify-content: center;
                    gap: 6px;
                    padding-top: 4px;
                }

                .dot {
                    width: 7px;
                    height: 7px;
                    border-radius: 50%;
                    border: none;
                    background: #ccc;
                    cursor: pointer;
                    padding: 0;
                    transition: background 0.2s ease, transform 0.2s ease;
                }

                .dot-active {
                    background: #1a3c2e;
                    transform: scale(1.3);
                }

                @media (max-width: 600px) {
                    .carousel-item {
                        flex: 0 0 200px;
                    }
                }
            `}</style>
        </div>
    );
}