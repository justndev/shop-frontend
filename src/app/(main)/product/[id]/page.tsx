'use client';

import {useState, useRef, useEffect} from 'react';
import {Button, IconButton, Chip, Divider} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import {Product} from "@/src/utils/types";
import productApi from "@/src/lib/productApi";
import {usePathname} from "next/dist/client/components/navigation";
import {useTranslation} from "react-i18next";
import useCartHook from "@/src/modules/cart/useCartHook";
import {CartItem} from "@/src/store/slices/cartSlice";
import AppBreadcrumb from "@/src/modules/layout/AppBreadcrumb";
import ProductImagesCarousel from "@/src/modules/product/productImagesCarousel/ProductImagesCarousel";
import {getThumbnailUrl} from "@/src/utils/functions";

export default function ProductPage() {
    const {t, i18n} = useTranslation();
    const {items, handleAddItem} = useCartHook();
    const path = usePathname();

    const productSlug = path.split('/').pop();

    const [product, setProduct] = useState<Product>(null);
    const [selectedImage, setSelectedImage] = useState(3);
    const [quantity, setQuantity] = useState(1);
    const [currentQuantity, setCurrentQuantity] = useState(0);
    const [loading, setLoading] = useState(true);

    const descRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function fetchProduct() {
            try {
                const responseData = await productApi.getBySlug(productSlug);
                setProduct(responseData);
            } finally {
                setLoading(false);
            }
        }

        fetchProduct();
    }, []);

    useEffect(() => {
        if (items && product) {
            items.map((item: CartItem) => {
                if (item.product.id === product.id) {
                    setCurrentQuantity(item.quantity);
                }
            });
        }
    }, [items]);

    function handleAddToCart() {
        handleAddItem({product, quantity});
        setQuantity(1);
    }

    const totalPrice = (product?.price || 0) * quantity;

    if (loading) return <div>{t('product.loading')}</div>;
    if (!product) return <div>{t('product.not_found')}</div>;

    return (
        <div style={{fontFamily: "'DM Sans', sans-serif"}}>
            {/* ── Main two-column layout ── */}
            <div className="grid items-start min-h-screen md:grid-cols-2 grid-cols-1">

                {/* LEFT — sticky image panel (hidden on mobile) */}
                <div
                    className="sticky top-0 h-screen overflow-hidden md:flex flex-col justify-center items-center p-8 bg-(--cream) hidden">

                    {/* Main image */}
                    <div
                        className="relative w-full flex-1 flex items-center justify-center pt-20"
                        style={{maxHeight: 'calc(100vh - 180px)'}}
                    >
                        <img
                            src={product.images[selectedImage]}
                            alt={product.name['en']}
                            className="max-h-full max-w-full object-contain rounded-xl transition-opacity duration-300"
                        />
                    </div>

                    {/* Thumbnails */}
                    <div className="flex gap-3 mt-4 flex-wrap justify-center">
                        {product.images.slice(3).map((image, i) => (
                            <button
                                key={i + 3}
                                onClick={() => setSelectedImage(i + 3)}
                                className="transition-all duration-200 ease-in-out rounded-lg overflow-hidden border-2 hover:scale-[1.04]"
                                style={{
                                    width: 72,
                                    height: 72,
                                    flexShrink: 0,
                                    borderColor: i + 3 === selectedImage ? 'var(--green-pine)' : 'transparent',
                                    outline: i + 3 === selectedImage ? '2px solid var(--green-pine)' : 'none',
                                    outlineOffset: '2px',
                                }}
                            >
                                <img
                                    src={getThumbnailUrl(image)}
                                    alt={`${t('product.view')} ${i + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* RIGHT — scrollable info
                  * Padding breakdown:
                  *   pt-28  (7rem)  — clears the fixed navbar height
                  *   pb-24  (6rem)  — generous bottom breathing room
                  *   px-5   (1.25rem) — tight but readable on mobile
                  *   md:px-14 (3.5rem) — wider gutters on desktop
                  */}
                <div
                    className="min-h-screen pt-28 pb-24 px-5 md:px-14"
                    ref={descRef}
                >
                    {/* Breadcrumb */}
                    <div className="overflow-hidden -mx-2 md:mx-0">
                        <AppBreadcrumb product={product}/>

                    </div>

                    {/* ── Mobile-only image carousel ── */}
                    {/* -mx-5 bleeds the carousel edge-to-edge past the column padding */}
                    <div className="block md:hidden overflow-hidden mt-4 -mx-5">
                        <ProductImagesCarousel
                            images={product.images}
                            alt={product.name[i18n.language]}
                        />
                    </div>

                    {/* Title */}
                    {/* mt-6 on mobile (space after carousel), mt-3 on desktop (space after breadcrumb) */}
                    <h1
                        className="text-(--ink) text-2xl md:text-4xl mt-6 md:mt-3 mb-3 leading-tight"
                        style={{fontFamily: "'DM Serif Display', serif"}}
                    >
                        {product.name[i18n.language]}
                    </h1>

                    {/* Short description */}
                    <p className="text-sm leading-relaxed text-muted mb-4 text-justify"
                        dangerouslySetInnerHTML={{__html: product.shortDescription[i18n.language]}}
                    />

                    {/* Price */}
                    <div className="flex gap-3 items-center">
                        <span
                            className="md:text-3xl text-2xl text-(--ink)"
                            style={{fontFamily: "'DM Serif Display', serif"}}
                        >
                            {totalPrice.toFixed(2)}€
                        </span>
                    </div>

                    <Divider sx={{marginY: 2,}}/>

                    {/* Quantity */}
                    <div className="mb-6">
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">
                            {t('product.quantity')}{currentQuantity !== 0 && (
                            <span> ({`${currentQuantity} ${t('product.in_basket')}`})</span>
                        )}
                        </p>

                        <div className="flex items-center gap-3">
                            <div
                                className="flex items-center rounded-lg overflow-hidden"
                                style={{border: '1.5px solid var(--border)'}}
                            >
                                <IconButton
                                    size="small"
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    sx={{
                                        borderRadius: 0,
                                        px: 1.5,
                                        color: 'var(--ink)',
                                        '&:hover': {background: 'var(--sage-pale)'},
                                    }}
                                >
                                    <RemoveIcon fontSize="small"/>
                                </IconButton>

                                <span className="w-10 text-center font-medium text-(--ink)">
                                    {quantity}
                                </span>

                                <IconButton
                                    size="small"
                                    onClick={() => setQuantity(q => q + 1)}
                                    sx={{
                                        borderRadius: 0,
                                        px: 1.5,
                                        color: 'var(--ink)',
                                        '&:hover': {background: 'var(--sage-pale)'},
                                    }}
                                >
                                    <AddIcon fontSize="small"/>
                                </IconButton>
                            </div>

                            <span className="text-sm tracking-widest font-semibold">
                                {product.stockStatus === 'IN_STOCK'
                                    ? <span className="text-(--green-pine)">● {t('product.in_stock')}</span>
                                    : <span className="text-[#c0392b]">● {t('product.out_of_stock')}</span>
                                }
                            </span>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <Button
                        onClick={handleAddToCart}
                        fullWidth
                        variant="contained"
                        startIcon={<ShoppingCartOutlinedIcon/>}
                        disabled={product.stockStatus !== 'IN_STOCK'}
                        sx={{
                            background: 'var(--green-pine)',
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
                                background: '#5a7d56',
                                boxShadow: 'none',
                            },
                        }}
                    >
                        {t('product.add_to_cart')}
                    </Button>

                    <Divider sx={{marginTop: 3, marginBottom: 2}}/>

                    {/* Long description */}
                    <div
                        className="text-(--muted) leading-[1.75] text-justify"
                        dangerouslySetInnerHTML={{__html: product.description[i18n.language]}}
                    />
                </div>
            </div>
        </div>
    );
}