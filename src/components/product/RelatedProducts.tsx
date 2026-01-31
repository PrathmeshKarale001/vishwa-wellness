'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types';
import ProductCard from '@/components/shop/ProductCard';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface RelatedProductsProps {
    categorySlug?: string;
    currentProductId: string;
}

export default function RelatedProducts({ categorySlug, currentProductId }: RelatedProductsProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [scrollPosition, setScrollPosition] = useState(0);

    useEffect(() => {
        async function fetchRelated() {
            try {
                // Try fetching related products from API
                const url = categorySlug
                    ? `/api/products/related?category=${categorySlug}&exclude=${currentProductId}&limit=8`
                    : `/api/products/related?exclude=${currentProductId}&limit=8`;

                const response = await fetch(url);
                if (response.ok) {
                    const data = await response.json();
                    if (data.products && data.products.length > 0) {
                        setProducts(data.products);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch related products:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchRelated();
    }, [categorySlug, currentProductId]);

    const scroll = (direction: 'left' | 'right') => {
        const container = document.getElementById('related-products-container');
        if (container) {
            const scrollAmount = 300;
            const newPosition = direction === 'left'
                ? scrollPosition - scrollAmount
                : scrollPosition + scrollAmount;
            container.scrollTo({ left: newPosition, behavior: 'smooth' });
            setScrollPosition(newPosition);
        }
    };

    if (loading) {
        return (
            <div className="py-12">
                <div className="flex items-center gap-2 mb-6">
                    <Sparkles className="w-6 h-6 text-[var(--color-primary)]" />
                    <h2 className="text-2xl font-bold text-gray-900">You May Also Like</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-gray-100 animate-pulse rounded-xl h-80"></div>
                    ))}
                </div>
            </div>
        );
    }

    // Don't show section if no products
    if (products.length === 0) {
        return null;
    }

    return (
        <div className="py-12 border-t border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-[var(--color-primary)]" />
                    <h2 className="text-2xl font-bold text-gray-900">You May Also Like</h2>
                </div>
                {products.length > 4 && (
                    <div className="flex gap-2">
                        <button
                            onClick={() => scroll('left')}
                            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                            aria-label="Scroll left"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                            aria-label="Scroll right"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>

            <div
                id="related-products-container"
                className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4"
                style={{ scrollSnapType: 'x mandatory' }}
            >
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="flex-shrink-0 w-[250px]"
                        style={{ scrollSnapAlign: 'start' }}
                    >
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
        </div>
    );
}
