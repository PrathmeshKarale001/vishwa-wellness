'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { X, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/lib/cartStore';
import { urlFor } from '@/lib/sanity.image';

export default function CartDrawer() {
    const {
        items,
        isOpen,
        closeCart,
        removeItem,
        updateQuantity,
        getSubtotal,
        getShipping,
        getTotal,
        getItemCount
    } = useCartStore();

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent body scroll when cart is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!mounted) return null;

    const subtotal = getSubtotal();
    const shipping = getShipping();
    const total = getTotal();
    const itemCount = getItemCount();



    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/20 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={closeCart}
            />

            {/* Sidebar */}
            <div
                className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-end px-6 py-5 border-b border-gray-200">
                        <button
                            onClick={closeCart}
                            className="text-sm text-gray-600 hover:text-gray-900 font-medium uppercase tracking-wider"
                        >
                            CLOSE
                        </button>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto px-6 py-6">
                        {items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center px-4">
                                <ShoppingBag className="w-16 h-16 text-gray-200 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                                <p className="text-gray-500 text-sm mb-6">
                                    Add products to get started
                                </p>
                                <button
                                    onClick={closeCart}
                                    className="px-6 py-3 bg-[#222] text-white text-sm font-medium uppercase tracking-wider hover:bg-[#333] transition-colors"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {items.map((item) => {
                                    const price = item.variant?.price ?? item.product.price;

                                    return (
                                        <div
                                            key={`${item.product.id}-${item.variant?.id || 'default'}`}
                                            className="flex gap-3 pb-4 border-b border-gray-200 last:border-0"
                                        >
                                            {/* Image */}
                                            <Link
                                                href={`/products/${item.product.slug}`}
                                                onClick={closeCart}
                                                className="flex-shrink-0"
                                            >
                                                <div className="w-16 h-20 bg-gray-50 relative overflow-hidden">
                                                    {(() => {
                                                        const firstImage = item.product.images?.[0];
                                                        // Handle both url (from Sanity) and src (from type definition)
                                                        const imageUrl = firstImage?.src || (firstImage as any)?.url;

                                                        return imageUrl ? (
                                                            <img
                                                                src={imageUrl}
                                                                alt={firstImage?.alt || item.product.title}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                                                <ShoppingBag className="w-6 h-6 text-gray-300" />
                                                            </div>
                                                        );
                                                    })()}
                                                </div>
                                            </Link>

                                            {/* Details */}
                                            <div className="flex-1 min-w-0 flex flex-col">
                                                <div className="flex items-start justify-between gap-2 mb-1">
                                                    <Link
                                                        href={`/products/${item.product.slug}`}
                                                        onClick={closeCart}
                                                    >
                                                        <h4 className="font-medium text-gray-900 text-xs hover:text-gray-600 transition-colors line-clamp-2">
                                                            {item.product.title}
                                                        </h4>
                                                    </Link>
                                                    <button
                                                        onClick={() => removeItem(item.product.id, item.variant?.id)}
                                                        className="text-gray-400 hover:text-gray-900 transition-colors flex-shrink-0"
                                                        aria-label="Remove item"
                                                    >
                                                        <X className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>

                                                {item.variant && (
                                                    <p className="text-[10px] text-gray-500 mb-1">
                                                        {item.variant.size && `Size: ${item.variant.size}`}
                                                        {item.variant.color && ` • ${item.variant.color}`}
                                                    </p>
                                                )}

                                                <div className="mt-auto">
                                                    <p className="text-xs text-gray-900">
                                                        {item.quantity} × ₹{Math.round(price).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {items.length > 0 && (
                        <div className="border-t border-gray-200 px-6 py-6 bg-white">
                            {/* Subtotal */}
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-sm text-gray-600">Subtotal:</span>
                                <span className="text-lg font-medium text-gray-900">
                                    ₹{Math.round(total).toLocaleString()}
                                </span>
                            </div>

                            {/* Buttons */}
                            <div className="space-y-3">
                                <Link
                                    href="/cart"
                                    onClick={closeCart}
                                    className="btn-outline w-full"
                                >
                                    View Cart
                                </Link>
                                <Link
                                    href="/checkout"
                                    onClick={closeCart}
                                    className="btn-solid w-full"
                                >
                                    Checkout
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
