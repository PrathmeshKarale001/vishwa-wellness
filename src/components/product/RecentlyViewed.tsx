'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { getImageUrl, getImageAlt } from '@/lib/image-utils';
import { Clock } from 'lucide-react';

const RECENTLY_VIEWED_KEY = 'vishwa_recently_viewed';
const STORAGE_VERSION = 1; // Increment when data format changes
const MAX_ITEMS = 6;

interface RecentlyViewedProps {
    currentProductId: string;
}

interface RecentlyViewedItem {
    id: string;
    title: string;
    slug: string;
    price: number;
    comparePrice?: number;
    images: { url?: string; src?: string; alt?: string }[];
    rating?: number;
}

interface StorageData {
    version: number;
    items: RecentlyViewedItem[];
}

function getStorageData(): RecentlyViewedItem[] {
    try {
        const raw = localStorage.getItem(RECENTLY_VIEWED_KEY);
        if (!raw) return [];

        const data = JSON.parse(raw);

        // Handle versioned data
        if (data && typeof data === 'object' && 'version' in data) {
            if (data.version === STORAGE_VERSION) {
                return data.items || [];
            }
            // Version mismatch - clear old data
            localStorage.removeItem(RECENTLY_VIEWED_KEY);
            return [];
        }

        // Handle legacy unversioned data - migrate it
        if (Array.isArray(data)) {
            const newData: StorageData = { version: STORAGE_VERSION, items: data };
            localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(newData));
            return data;
        }

        return [];
    } catch {
        return [];
    }
}

function saveStorageData(items: RecentlyViewedItem[]) {
    const data: StorageData = { version: STORAGE_VERSION, items };
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(data));
}

export function addToRecentlyViewed(product: Product) {
    if (typeof window === 'undefined') return;

    try {
        let items = getStorageData();

        // Remove if already exists
        items = items.filter(p => p.id !== product.id);

        // Add to front
        items.unshift({
            id: product.id,
            title: product.title,
            slug: product.slug,
            price: product.price,
            comparePrice: product.comparePrice,
            images: product.images?.slice(0, 1) || [],
            rating: product.rating
        });

        // Keep only MAX_ITEMS
        items = items.slice(0, MAX_ITEMS);

        saveStorageData(items);
    } catch (error) {
        console.error('Failed to save recently viewed:', error);
    }
}

export default function RecentlyViewed({ currentProductId }: RecentlyViewedProps) {
    const [products, setProducts] = useState<RecentlyViewedItem[]>([]);

    useEffect(() => {
        const items = getStorageData();
        // Filter out current product
        setProducts(items.filter(p => p.id !== currentProductId).slice(0, 4));
    }, [currentProductId]);

    if (products.length === 0) {
        return null;
    }

    return (
        <div className="py-12 border-t border-gray-100">
            <div className="flex items-center gap-2 mb-6">
                <Clock className="w-5 h-5 text-gray-500" />
                <h2 className="text-xl font-bold text-gray-900">Recently Viewed</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {products.map((product) => {
                    const imageUrl = product.images?.[0]?.url || product.images?.[0]?.src || '';
                    const imageAlt = product.images?.[0]?.alt || product.title;
                    const hasDiscount = product.comparePrice && product.comparePrice > product.price;

                    return (
                        <Link
                            key={product.id}
                            href={`/products/${product.slug}`}
                            className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
                        >
                            <div className="aspect-square relative bg-gray-50">
                                {imageUrl && (
                                    <Image
                                        src={imageUrl}
                                        alt={imageAlt}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                )}
                            </div>
                            <div className="p-3">
                                <h3 className="text-sm font-medium text-gray-900 line-clamp-1 group-hover:text-[var(--color-primary)] transition-colors">
                                    {product.title}
                                </h3>
                                <div className="mt-1 flex items-center gap-2">
                                    <span className="text-sm font-bold text-gray-900">
                                        ₹{product.price}
                                    </span>
                                    {hasDiscount && (
                                        <span className="text-xs text-gray-500 line-through">
                                            ₹{product.comparePrice}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
