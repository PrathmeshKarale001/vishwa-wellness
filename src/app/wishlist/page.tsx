'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, ChevronRight, ShoppingBag, Trash2 } from 'lucide-react';
import { useWishlistStore } from '@/lib/wishlistStore';
import { useCartStore } from '@/lib/cartStore';
import ProductCard from '@/components/shop/ProductCard';

export default function WishlistPage() {
    const { items, removeItem, clearWishlist, getItemCount } = useWishlistStore();
    const { addItem: addToCart } = useCartStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="section-padding">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-64 bg-gray-200 rounded"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const itemCount = getItemCount();

    const handleMoveToCart = (productId: string) => {
        const product = items.find((item) => item.id === productId);
        if (product) {
            addToCart(product, 1);
            removeItem(productId);
        }
    };

    const handleMoveAllToCart = () => {
        items.forEach((product) => {
            addToCart(product, 1);
        });
        clearWishlist();
    };

    return (
        <>
            {/* Breadcrumb */}
            <div className="bg-[#f9f9f9] py-4 border-b border-[#eee]">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center gap-2 text-sm text-[#777]">
                        <Link href="/" className="hover:text-[var(--color-primary)]">Home</Link>
                        <ChevronRight size={14} />
                        <span className="text-[#222]">Wishlist</span>
                    </div>
                </div>
            </div>

            {/* Page Header */}
            <div className="bg-[#f5f2f2] py-8">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-3xl font-bold text-[#222]" style={{ fontFamily: 'var(--font-heading)' }}>
                        My Wishlist
                    </h1>
                    <p className="text-[#777] mt-2">
                        {itemCount} {itemCount === 1 ? 'item' : 'items'} saved
                    </p>
                </div>
            </div>

            <section className="section-padding">
                <div className="max-w-7xl mx-auto px-4">
                    {items.length === 0 ? (
                        /* Empty Wishlist */
                        <div className="text-center py-16">
                            <Heart size={80} className="mx-auto text-[#ddd] mb-6" />
                            <h2 className="text-2xl font-semibold text-[#222] mb-4">Your wishlist is empty</h2>
                            <p className="text-[#777] mb-8">
                                Save items you love by clicking the heart icon on any product.
                            </p>
                            <Link href="/shop" className="btn-solid">
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        <>
                            {/* Actions Bar */}
                            <div className="flex flex-wrap justify-between items-center gap-4 mb-8 pb-4 border-b border-[#eee]">
                                <p className="text-[#777]">
                                    Showing <strong>{itemCount}</strong> saved {itemCount === 1 ? 'item' : 'items'}
                                </p>
                                <div className="flex gap-4">
                                    <button
                                        onClick={handleMoveAllToCart}
                                        className="btn-solid flex items-center gap-2"
                                    >
                                        <ShoppingBag size={16} />
                                        Add All to Cart
                                    </button>
                                    <button
                                        onClick={clearWishlist}
                                        className="text-sm text-red-500 hover:underline flex items-center gap-1"
                                    >
                                        <Trash2 size={14} />
                                        Clear All
                                    </button>
                                </div>
                            </div>

                            {/* Wishlist Grid */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                {items.map((product) => (
                                    <div key={product.id} className="relative group">
                                        <ProductCard product={product} />
                                        {/* Quick Actions Overlay */}
                                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/95 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleMoveToCart(product.id)}
                                                    className="flex-1 py-2 text-xs font-semibold uppercase bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] transition-colors"
                                                >
                                                    Move to Cart
                                                </button>
                                                <button
                                                    onClick={() => removeItem(product.id)}
                                                    className="px-3 py-2 border border-[#ddd] hover:border-red-500 hover:text-red-500 transition-colors"
                                                    aria-label="Remove from wishlist"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </section>
        </>
    );
}
