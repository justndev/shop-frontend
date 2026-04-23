'use client';

import {useState, useRef, useEffect} from 'react';
import {Button, IconButton, Chip} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import BreadcrumbNav from "@/src/modules/product/BreadcrumbNav";
import {addItem} from "@/src/store/slices/cartSlice";
import {useDispatch} from "react-redux";
import {Product} from "@/src/types";
import productApi from "@/src/lib/productApi";
import {usePathname} from "next/dist/client/components/navigation";
import {useTranslation} from "react-i18next";

export default function ProductPage() {
    const {i18n} = useTranslation();
    const dispatch = useDispatch();
    const path = usePathname();

    const productSlug = path.split('/').pop();

    const [product, setProduct] = useState<Product>(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
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

    function addProductToCart() {
        dispatch(addItem({product, quantity}));
    }

    const totalPrice = (product?.price || 0) * quantity;

    if (loading) return <div>Loading...</div>;
    if (!product) return <div>Product not found</div>;

    return (
        <div style={{fontFamily: "'DM Sans', sans-serif"}}>
            <BreadcrumbNav product={product}/>

            {/* ── Main two-column layout ── */}
            <div className="grid items-start min-h-screen max-[900px]:grid-cols-1" style={{gridTemplateColumns: '1fr 1fr'}}>

                {/* LEFT — sticky image panel */}
                <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center items-center p-8 bg-[#f7f5f0] max-[900px]:relative max-[900px]:h-[55vw] max-[900px]:min-h-[280px]">

                    {/* Main image */}
                    <div
                        className="relative w-full flex-1 flex items-center justify-center"
                        style={{maxHeight: 'calc(100vh - 180px)'}}
                    >
                        <img
                            src={product.images[selectedImage]}
                            alt={product.name}
                            className="max-h-full max-w-full object-contain rounded-xl transition-opacity duration-300"
                        />
                    </div>

                    {/* Thumbnails */}
                    <div className="flex gap-3 mt-4 flex-wrap justify-center">
                        {product.images.map((image, i) => (
                            <button
                                key={i}
                                onClick={() => setSelectedImage(i)}
                                className="transition-all duration-200 ease-in-out rounded-lg overflow-hidden border-2 hover:scale-[1.04]"
                                style={{
                                    width: 72,
                                    height: 72,
                                    flexShrink: 0,
                                    // Dynamic: active state border
                                    borderColor: i === selectedImage ? '#3d5c3a' : 'transparent',
                                    outline: i === selectedImage ? '2px solid #3d5c3a' : 'none',
                                    outlineOffset: '2px',
                                }}
                            >
                                <img
                                    src={getThumbnailUrl(image)}
                                    alt={`View ${i + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* RIGHT — scrollable info */}
                <div
                    className="min-h-screen max-[900px]:p-6"
                    style={{padding: '3rem 3.5rem 6rem 3rem'}}
                    ref={descRef}
                >
                    {/* Title */}
                    <h1
                        className="mb-3 leading-[1.15] text-[#1a1a18]"
                        style={{
                            fontFamily: "'DM Serif Display', serif",
                            // Dynamic: clamp() not possible in Tailwind
                            fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
                        }}
                    >
                        {product.name[i18n.language]}
                    </h1>

                    {/* Short description */}
                    <p
                        className="mb-5 text-sm leading-relaxed text-[#6b6b60]"
                        dangerouslySetInnerHTML={{__html: product.shortDescription[i18n.language]}}
                    />

                    {/* Price */}
                    <div className="flex items-baseline gap-3 mb-3">
                        <span
                            className="text-[2rem] text-[#1a1a18]"
                            style={{fontFamily: "'DM Serif Display', serif"}}
                        >
                            {totalPrice.toFixed(2)}€
                        </span>
                    </div>

                    {/* Divider */}
                    <div className="mb-5 border-t border-[#e0e0d8]"/>

                    {/* Quantity */}
                    <div className="mb-6">
                        <p className="text-xs font-semibold uppercase tracking-widest mb-3 text-[#6b6b60]">
                            Quantity
                        </p>
                        <div className="flex items-center gap-3">
                            <div
                                className="flex items-center rounded-lg overflow-hidden"
                                style={{border: '1.5px solid #e0e0d8'}}
                            >
                                <IconButton
                                    size="small"
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    sx={{
                                        borderRadius: 0,
                                        px: 1.5,
                                        color: '#1a1a18',
                                        '&:hover': {background: '#e8efe7'},
                                    }}
                                >
                                    <RemoveIcon fontSize="small"/>
                                </IconButton>

                                <span className="w-10 text-center font-medium text-[0.95rem] text-[#1a1a18]">
                                    {quantity}
                                </span>

                                <IconButton
                                    size="small"
                                    onClick={() => setQuantity(q => q + 1)}
                                    sx={{
                                        borderRadius: 0,
                                        px: 1.5,
                                        color: '#1a1a18',
                                        '&:hover': {background: '#e8efe7'},
                                    }}
                                >
                                    <AddIcon fontSize="small"/>
                                </IconButton>
                            </div>

                            <span className="text-sm">
                                {product.stockStatus === 'IN_STOCK'
                                    ? <span className="text-[#3d5c3a]">● In stock</span>
                                    : <span className="text-[#c0392b]">● Out of stock</span>
                                }
                            </span>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <div className="flex flex-col gap-3 mb-6">
                        <Button
                            onClick={addProductToCart}
                            fullWidth
                            variant="contained"
                            startIcon={<ShoppingCartOutlinedIcon/>}
                            disabled={product.stockStatus !== 'IN_STOCK'}
                            sx={{
                                background: '#3d5c3a',
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
                            Add to cart
                        </Button>
                    </div>

                    {/* Divider */}
                    <div className="mb-6 border-t border-[#e0e0d8]"/>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-8">
                        {product.tags.map(tag => (
                            <Chip
                                key={tag}
                                label={tag[i18n.language]}
                                size="small"
                                sx={{
                                    background: 'transparent',
                                    border: '1px solid #e0e0d8',
                                    color: '#6b6b60',
                                    fontSize: '0.75rem',
                                    fontFamily: "'DM Sans', sans-serif",
                                }}
                            />
                        ))}
                    </div>

                    {/* Long description — rich text needs global styles, minimal inline possible */}
                    <div
                        className="text-[#6b6b60] leading-[1.75]"
                        dangerouslySetInnerHTML={{__html: product.description[i18n.language]}}
                    />
                </div>
            </div>
        </div>
    );
}

function getThumbnailUrl(url: string) {
    return url.replace('/uploads/', '/thumbs/');
}