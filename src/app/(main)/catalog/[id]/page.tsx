'use client';

import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import ComplexProductCard from "@/src/modules/product/ComplexProductCard";
import { useEffect, useState, useCallback } from "react";
import productsApi from "@/src/api/productsApi";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductsResponse {
    data: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export default function CatalogPage() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const { t } = useTranslation();

    const categorySlug = pathname.split('/').pop();
    const sort = searchParams.get("sort") ?? "new";
    const inStock = searchParams.get("inStock") === "true";
    const page = Number(searchParams.get("page") ?? "1");
    const limit = 20;

    const [products, setProducts] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchProducts() {
            setLoading(true);
            try {
                const responseData: ProductsResponse = await productsApi.getAll({
                    slug: categorySlug,
                    sort,
                    inStock,
                    page,
                    limit,
                });
                setProducts(responseData.data);
                setTotal(responseData.total);
                setTotalPages(responseData.totalPages);
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, [categorySlug, sort, inStock, page]);

    const goToPage = useCallback((newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(newPage));
        router.push(`${pathname}?${params.toString()}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [pathname, router, searchParams]);

    const isFirstPage = page <= 1;
    const isLastPage = page >= totalPages;

    // "Showing X–Y of Z products"
    const rangeStart = total === 0 ? 0 : (page - 1) * limit + 1;
    const rangeEnd = Math.min(page * limit, total);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>

            {/* ── Top bar: count label ── */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 16px',
            }}>
                <p style={{
                    fontSize: '0.85rem',
                    color: '#6b7a6e',
                    fontWeight: 500,
                    letterSpacing: '0.02em',
                    margin: 0,
                }}>
                    {total > 0
                        ? t('catalog.showing', {
                            start: rangeStart,
                            end: rangeEnd,
                            total,
                            defaultValue: `Showing {{start}}–{{end}} of {{total}}`,
                        })
                        : t('catalog.noProducts', { defaultValue: 'No products found' })
                    }
                </p>
            </div>

            {/* ── Product grid ── */}
            <div
                className="grid grid-cols-2 md:grid-cols-3 w-full gap-4 px-4"
                style={{ opacity: loading ? 0.5 : 1, transition: 'opacity 0.2s ease' }}
            >
                {products.map((product, index) => (
                    <ComplexProductCard key={product.slug ?? index} product={product} />
                ))}
                {products.map((product, index) => (
                    <ComplexProductCard key={product.slug ?? index} product={product} />
                ))}
                {products.map((product, index) => (
                    <ComplexProductCard key={product.slug ?? index} product={product} />
                ))}
                {products.map((product, index) => (
                    <ComplexProductCard key={product.slug ?? index} product={product} />
                ))}
            </div>

        </div>
    );
}