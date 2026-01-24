'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCartStore } from '@/lib/cartStore';

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

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const subtotal = getSubtotal();
    const shipping = getShipping();
    const total = getTotal();
    const itemCount = getItemCount();

    const getDiscountedPrice = (price: number, discount?: number) => {
        if (!discount) return price;
        return price - (price * discount / 100);
    };

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 z-50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={closeCart}
            />

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 transform transition-transform duration-300 shadow-2xl ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-[#eee]">
                    <div className="flex items-center gap-2">
                        <ShoppingBag size={20} className="text-[var(--color-primary)]" />
                        <h2 className="font-semibold text-[#222] text-lg">
                            Shopping Cart ({itemCount})
                        </h2>
                    </div>
                    <button
                        onClick={closeCart}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Close cart"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-4" style={{ maxHeight: 'calc(100vh - 280px)' }}>
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-center">
                            <ShoppingBag size={64} className="text-[#ddd] mb-4" />
                            <h3 className="text-lg font-medium text-[#222] mb-2">Your cart is empty</h3>
                            <p className="text-[#777] text-sm mb-6">
                                Looks like you haven&apos;t added any products yet.
                            </p>
                            <button
                                onClick={closeCart}
                                className="btn-solid"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        <ul className="space-y-4">
                            {items.map((item) => {
                                const price = item.variant?.price ?? item.product.price;
                                const discountedPrice = getDiscountedPrice(price, item.product.discount);

                                return (
                                    <li
                                        key={`${item.product.id}-${item.variant?.id || 'default'}`}
                                        className="flex gap-4 pb-4 border-b border-[#eee]"
                                    >
                                        {/* Image */}
                                        <Link
                                            href={`/product/${item.product.slug}`}
                                            onClick={closeCart}
                                            className="flex-shrink-0"
                                        >
                                            <div className="w-20 h-20 bg-[#f9f9f9] relative overflow-hidden">
                                                <Image
                                                    src={item.product.images[0]?.src || '/placeholder-product.jpg'}
                                                    alt={item.product.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        </Link>

                                        {/* Details */}
                                        <div className="flex-1 min-w-0">
                                            <Link
                                                href={`/product/${item.product.slug}`}
                                                onClick={closeCart}
                                            >
                                                <h4 className="font-medium text-[#222] text-sm line-clamp-2 hover:text-[var(--color-primary)] transition-colors">
                                                    {item.product.title}
                                                </h4>
                                            </Link>

                                            {item.variant && (
                                                <p className="text-xs text-[#777] mt-1">
                                                    {item.variant.size && `Size: ${item.variant.size}`}
                                                    {item.variant.color && ` / Color: ${item.variant.color}`}
                                                </p>
                                            )}

                                            {/* Price */}
                                            <div className="mt-1">
                                                {item.product.discount ? (
                                                    <span className="text-sm">
                                                        <span className="text-[var(--color-primary)] font-semibold">
                                                            ₹{discountedPrice.toLocaleString()}
                                                        </span>
                                                        <del className="text-[#999] ml-2 text-xs">
                                                            ₹{price.toLocaleString()}
                                                        </del>
                                                    </span>
                                                ) : (
                                                    <span className="text-[var(--color-primary)] font-semibold text-sm">
                                                        ₹{price.toLocaleString()}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-3 mt-2">
                                                <div className="flex items-center border border-[#ddd]">
                                                    <button
                                                        onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.variant?.id)}
                                                        className="w-7 h-7 flex items-center justify-center hover:bg-[#f5f5f5] transition-colors"
                                                        aria-label="Decrease quantity"
                                                    >
                                                        <Minus size={12} />
                                                    </button>
                                                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.variant?.id)}
                                                        className="w-7 h-7 flex items-center justify-center hover:bg-[#f5f5f5] transition-colors"
                                                        aria-label="Increase quantity"
                                                    >
                                                        <Plus size={12} />
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeItem(item.product.id, item.variant?.id)}
                                                    className="text-[#999] hover:text-red-500 transition-colors"
                                                    aria-label="Remove item"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Line Total */}
                                        <div className="text-right">
                                            <span className="font-semibold text-[#222]">
                                                ₹{(discountedPrice * item.quantity).toLocaleString()}
                                            </span>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#eee] p-4">
                        {/* Totals */}
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-[#777]">Subtotal</span>
                                <span className="text-[#222]">₹{subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-[#777]">Shipping</span>
                                <span className="text-[#222]">
                                    {shipping === 0 ? (
                                        <span className="text-green-600">Free</span>
                                    ) : (
                                        `₹${shipping}`
                                    )}
                                </span>
                            </div>
                            {shipping > 0 && (
                                <p className="text-xs text-[#999]">
                                    Add ₹{(999 - subtotal).toLocaleString()} more for free shipping
                                </p>
                            )}
                            <div className="flex justify-between text-base font-semibold border-t border-[#eee] pt-2">
                                <span>Total</span>
                                <span className="text-[var(--color-primary)]">₹{total.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="space-y-2">
                            <Link
                                href="/cart"
                                onClick={closeCart}
                                className="block w-full text-center btn-outline py-3"
                            >
                                View Cart
                            </Link>
                            <Link
                                href="/checkout"
                                onClick={closeCart}
                                className="block w-full text-center btn-solid py-3"
                            >
                                Checkout
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
