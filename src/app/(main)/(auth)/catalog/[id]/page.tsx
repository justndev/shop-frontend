'use client';

import { usePathname } from 'next/dist/client/components/navigation';
import { MOCKED_PRODUCTS } from '@/src/utils/mocks';
import ProductCard from "@/src/modules/product/ProductCard";

export default function CatalogPage() {
    const path = usePathname();
    const catalogSlug = path.split('/').pop();
    const products = MOCKED_PRODUCTS;

    return (
        <div className="catalog-page">
            <main className="catalog-main">
                <aside className="catalog-aside">
                    {/* filters go here */}
                </aside>

                <section className="catalog-grid">
                    {products.map(product => (
                        <ProductCard
                            key={product.id}
                            id={product.id}
                            name={product.name}
                            price={product.price}
                            image={product.images[0]}
                            hoverImage={product.images[1]}
                            slug={product.slug}
                        />
                    ))}
                </section>
            </main>

            <style jsx>{`
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

                .buy-btn:hover {
                    background: var(--sage-light) !important;
                }

                .catalog-page {
                    background: #f5f4f0;
                }

                .catalog-main {
                    display: flex;
                    gap: 32px;
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 40px 24px;
                }

                .catalog-aside {
                    width: 220px;
                    flex-shrink: 0;
                }

                .catalog-grid {
                    flex: 1;
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
                    gap: 24px;
                }

                @media (max-width: 768px) {
                    .catalog-main {
                        flex-direction: column;
                    }

                    .catalog-aside {
                        width: 100%;
                    }

                    .catalog-grid {
                        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
                        gap: 16px;
                    }
                }
            `}</style>
        </div>
    );
}