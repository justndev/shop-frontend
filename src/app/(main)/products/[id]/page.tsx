'use client';

import {useState, useRef} from 'react';
import {
    Button,
    IconButton,
    Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import BoltIcon from '@mui/icons-material/Bolt';
import {MOCKED_PRODUCT} from "@/src/utils/mocks";
import BreadcrumbNav from "@/src/modules/product/BreadcrumbNav";


export default function ProductPage() {
    const product = MOCKED_PRODUCT;

    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);

    const totalPrice = product.price * quantity;

    const descRef = useRef<HTMLDivElement>(null);

    return (
        <>
            {/* ─── Google Font import ─────────────────────────────────────────── */}
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

        :root {
          --cream: #f7f5f0;
          --ink: #1a1a18;
          --sage: #3d5c3a;
          --sage-light: #5a7d56;
          --sage-pale: #e8efe7;
          --accent: #c8a96e;
          --muted: #6b6b60;
        }

        body { background: var(--white); }

        .product-page * { font-family: 'DM Sans', sans-serif; }
        .product-page h1,
        .product-page h2 { font-family: 'DM Serif Display', serif; }

        .product-desc h3 {
          font-family: 'DM Serif Display', serif;
          font-size: 1.15rem;
          color: var(--ink);
          margin: 1.5rem 0 0.5rem;
        }
        .product-desc p { color: var(--muted); line-height: 1.75; margin-bottom: 0.75rem; }
        .product-desc ul { color: var(--muted); padding-left: 1.25rem; line-height: 1.9; }
        .product-desc strong { color: var(--ink); }

        .thumb-btn { transition: all 0.2s ease; }
        .thumb-btn:hover { transform: scale(1.04); }
        .thumb-btn.active { outline: 2px solid var(--sage); outline-offset: 2px; }

        .unit-btn {
          border: 1.5px solid var(--border) !important;
          border-radius: 999px !important;
          color: var(--ink) !important;
          text-transform: none !important;
          font-size: 0.82rem !important;
          font-weight: 500 !important;
          padding: 5px 16px !important;
          transition: all 0.18s ease !important;
          font-family: 'DM Sans', sans-serif !important;
        }
        .unit-btn:hover { border-color: var(--sage) !important; color: var(--sage) !important; }
        .unit-btn.selected {
          background: var(--sage) !important;
          border-color: var(--sage) !important;
          color: #fff !important;
        }

        .add-cart-btn {
          border: 1.5px solid var(--ink) !important;
          color: var(--ink) !important;
          border-radius: 6px !important;
          text-transform: none !important;
          font-size: 0.95rem !important;
          font-weight: 500 !important;
          padding: 12px 0 !important;
          font-family: 'DM Sans', sans-serif !important;
          letter-spacing: 0.01em !important;
          transition: all 0.2s ease !important;
        }
        .add-cart-btn:hover { background: var(--ink) !important; color: #fff !important; }

        .buy-btn {
          background: var(--sage) !important;
          color: #fff !important;
          border-radius: 6px !important;
          text-transform: none !important;
          font-size: 0.95rem !important;
          font-weight: 500 !important;
          padding: 12px 0 !important;
          font-family: 'DM Sans', sans-serif !important;
          letter-spacing: 0.01em !important;
          box-shadow: none !important;
          transition: background 0.2s ease !important;
        }
        .buy-btn:hover { background: var(--sage-light) !important; }

        .qty-btn {
          border: 1.5px solid var(--border) !important;
          border-radius: 4px !important;
          color: var(--ink) !important;
          transition: background 0.15s !important;
        }
        .qty-btn:hover { background: var(--sage-pale) !important; }

        .trust-badge {
          display: flex; align-items: center; gap: 8px;
          font-size: 0.8rem; color: var(--muted);
        }

        /* sticky layout */
        .product-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          align-items: start;
          min-height: 100vh;
        }
        .image-col {
          position: sticky;
          top: 0;
          height: 100vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: var(--mint);
          padding: 2rem;
        }
        .info-col {
          padding: 3rem 3.5rem 6rem 3rem;
          min-height: 100vh;
        }

        @media (max-width: 900px) {
          .product-layout { grid-template-columns: 1fr; }
          .image-col { position: relative; height: 55vw; min-height: 280px; }
          .info-col { padding: 1.5rem; }
        }

      `}</style>

            <div className="product-page">
                <BreadcrumbNav product={product}/>
                {/* ── Main two-column layout ── */}
                <div className="product-layout">

                    {/* LEFT — sticky image panel */}
                    <div className="image-col">
                        {/* Main image */}
                        <div className="relative w-full flex-1 flex items-center justify-center" style={{maxHeight: 'calc(100vh - 180px)'}}>
                            <img
                                src={product.images[selectedImage]}
                                alt={product.name}
                                style={{
                                    maxHeight: '100%',
                                    maxWidth: '100%',
                                    objectFit: 'contain',
                                    borderRadius: '12px',
                                    transition: 'opacity 0.3s ease',
                                }}
                            />

                        </div>

                        {/* Thumbnails */}
                        <div className="flex gap-3 mt-4 flex-wrap justify-center">
                            {product.thumbnails.map((thumb, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedImage(i)}
                                    className={`thumb-btn rounded-lg overflow-hidden border-2 ${i === selectedImage ? 'active' : 'border-transparent'}`}
                                    style={{width: 72, height: 72, flexShrink: 0}}
                                >
                                    <img src={thumb} alt={`View ${i + 1}`} className="w-full h-full object-cover"/>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT — scrollable info */}
                    <div className="info-col" ref={descRef}>

                        {/* Title */}
                        <h1 className="mb-3" style={{
                            fontFamily: "'DM Serif Display', serif",
                            fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
                            lineHeight: 1.15,
                            color: 'var(--ink)'
                        }}>
                            {product.name}
                        </h1>

                        {/* Short description */}
                        <p className="mb-5 text-sm leading-relaxed" style={{color: 'var(--muted)'}}
                           dangerouslySetInnerHTML={{__html: product.shortDescription}}/>

                        {/* Price */}
                        <div className="flex items-baseline gap-3 mb-3">
                          <span style={{fontFamily: "'DM Serif Display', serif", fontSize: '2rem', color: 'var(--ink)'}}>
                            {totalPrice.toFixed(2)}€
                          </span>
                        </div>

                        {/* Divider */}
                        <div className="mb-5" style={{borderTop: '1px solid var(--border)'}}/>

                        {/* Quantity */}
                        <div className="mb-6">
                            <p className="text-xs font-semibold uppercase tracking-widest mb-3"
                               style={{color: 'var(--muted)'}}>Quantity</p>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center rounded-lg overflow-hidden"
                                     style={{border: '1.5px solid var(--border)'}}>
                                    <IconButton
                                        className="qty-btn"
                                        size="small"
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        sx={{borderRadius: 0, px: 1.5}}
                                    >
                                        <RemoveIcon fontSize="small"/>
                                    </IconButton>
                                    <span className="w-10 text-center font-medium"
                                          style={{color: 'var(--ink)', fontSize: '0.95rem'}}>
                    {quantity}
                  </span>
                                    <IconButton
                                        className="qty-btn"
                                        size="small"
                                        onClick={() => setQuantity(q => q + 1)}
                                        sx={{borderRadius: 0, px: 1.5}}
                                    >
                                        <AddIcon fontSize="small"/>
                                    </IconButton>
                                </div>
                                <span className="text-sm" style={{color: 'var(--muted)'}}>
                  {product.stockStatus === 'IN_STOCK' ? (
                      <span style={{color: 'var(--sage)'}}>● In stock</span>
                  ) : (
                      <span style={{color: '#c0392b'}}>● Out of stock</span>
                  )}
                </span>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col gap-3 mb-6">
                            <Button
                                fullWidth
                                variant="outlined"
                                className="add-cart-btn"
                                startIcon={<ShoppingCartOutlinedIcon/>}
                                disabled={product.stockStatus !== 'IN_STOCK'}
                            >
                                Add to cart
                            </Button>
                            <Button
                                fullWidth
                                variant="contained"
                                className="buy-btn"
                                startIcon={<BoltIcon/>}
                                disabled={product.stockStatus !== 'IN_STOCK'}
                            >
                                Buy now
                            </Button>
                        </div>


                        {/* Divider */}
                        <div className="mb-6" style={{borderTop: '1px solid var(--border)'}}/>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-8">
                            {product.tags.map(tag => (
                                <Chip
                                    key={tag}
                                    label={tag}
                                    size="small"
                                    sx={{
                                        background: 'transparent',
                                        border: '1px solid var(--border)',
                                        color: 'var(--muted)',
                                        fontSize: '0.75rem',
                                        fontFamily: "'DM Sans', sans-serif",
                                    }}
                                />
                            ))}
                        </div>

                        {/* Long description */}
                        <div className="product-desc" dangerouslySetInnerHTML={{__html: product.description}}/>
                    </div>
                </div>
            </div>
        </>
    );
}