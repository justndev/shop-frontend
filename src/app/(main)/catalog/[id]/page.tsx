'use client';

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from 'next/navigation';
import { useTranslation } from "react-i18next";

import productApi from "@/src/lib/productApi";
import ComplexProductCard from "@/src/modules/product/ComplexProductCard";

export default function CatalogPage() {
    const { t } = useTranslation();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const categorySlug = pathname.split('/').pop();
    const sort = searchParams.get("sort") ?? "new";
    const inStock = searchParams.get("inStock") === "true";
    const page = Number(searchParams.get("page") ?? "1");
    const limit = 20;

    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchProducts() {
            setLoading(true);
            try {
                const responseData = await productApi.getAll({
                    slug: categorySlug,
                    sort,
                    inStock,
                });
                setProducts(responseData.data);
                setTotal(responseData.total);
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, [categorySlug, sort, inStock, page]);

    const rangeStart = total === 0 ? 0 : (page - 1) * limit + 1;
    const rangeEnd = Math.min(page * limit, total);

    return (
        <div className="flex flex-col gap-5 w-full">

            {/* Top bar */}
            <div className="flex items-center justify-between px-4">
                <p className="text-sm font-medium tracking-wide m-0">
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

            {/* Product grid */}
            <div
                className={`grid grid-cols-2 md:grid-cols-3 w-full gap-4 px-4 transition-opacity duration-200 ${
                    loading ? "opacity-50" : "opacity-100"
                }`}
            >
                {products.map((product, index) => (
                    <ComplexProductCard
                        key={product.slug ?? index}
                        product={product}
                    />
                ))}
                {products.map((product, index) => (
                    <ComplexProductCard
                        key={product.slug ?? index}
                        product={product}
                    />
                ))}
                {products.map((product, index) => (
                    <ComplexProductCard
                        key={product.slug ?? index}
                        product={product}
                    />
                ))}
                {products.map((product, index) => (
                    <ComplexProductCard
                        key={product.slug ?? index}
                        product={product}
                    />
                ))}
                {products.map((product, index) => (
                    <ComplexProductCard
                        key={product.slug ?? index}
                        product={product}
                    />
                ))}

            </div>

        </div>
    );
}