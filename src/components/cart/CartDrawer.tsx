'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCartStore } from '@/lib/cartStore';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerFooter,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/Button';
import { CompactTrustBadges } from '@/components/ui/trust-badges';

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
        <Drawer open={isOpen} onOpenChange={(open) => !open && closeCart()}>
            <DrawerContent className="max-h-[90vh]">
                <DrawerHeader>
                    <DrawerTitle className="flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-amber-600" />
                        Shopping Cart ({itemCount})
                    </DrawerTitle>
                </DrawerHeader>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto px-4" style={{ maxHeight: 'calc(90vh - 280px)' }}>
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-center">
                            <ShoppingBag className="w-16 h-16 text-stone-200 mb-4" />
                            <h3 className="text-lg font-medium text-stone-900 mb-2">Your cart is empty</h3>
                            <p className="text-stone-500 text-sm mb-6">
                                Looks like you haven&apos;t added any products yet.
                            </p>
                            <DrawerClose asChild>
                                <Button variant="primary">
                                    Continue Shopping
                                </Button>
                            </DrawerClose>
                        </div>
                    ) : (
                        <ul className="space-y-4">
                            {items.map((item) => {
                                const price = item.variant?.price ?? item.product.price;
                                const discountedPrice = getDiscountedPrice(price, item.product.discount);

                                return (
                                    <li
                                        key={`${item.product.id}-${item.variant?.id || 'default'}`}
                                        className="flex gap-4 pb-4 border-b border-stone-100"
                                    >
                                        {/* Image */}
                                        <DrawerClose asChild>
                                            <Link
                                                href={`/product/${item.product.slug}`}
                                                className="flex-shrink-0"
                                            >
                                                <div className="w-20 h-20 bg-stone-50 relative overflow-hidden rounded-lg">
                                                    <Image
                                                        src={item.product.images[0]?.src || '/placeholder-product.jpg'}
                                                        alt={item.product.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            </Link>
                                        </DrawerClose>

                                        {/* Details */}
                                        <div className="flex-1 min-w-0">
                                            <DrawerClose asChild>
                                                <Link href={`/product/${item.product.slug}`}>
                                                    <h4 className="font-medium text-stone-900 text-sm line-clamp-2 hover:text-amber-600 transition-colors">
                                                        {item.product.title}
                                                    </h4>
                                                </Link>
                                            </DrawerClose>

                                            {item.variant && (
                                                <p className="text-xs text-stone-500 mt-1">
                                                    {item.variant.size && `Size: ${item.variant.size}`}
                                                    {item.variant.color && ` / Color: ${item.variant.color}`}
                                                </p>
                                            )}

                                            {/* Price */}
                                            <div className="mt-1">
                                                {item.product.discount ? (
                                                    <span className="text-sm">
                                                        <span className="text-amber-600 font-semibold">
                                                            ₹{discountedPrice.toLocaleString()}
                                                        </span>
                                                        <del className="text-stone-400 ml-2 text-xs">
                                                            ₹{price.toLocaleString()}
                                                        </del>
                                                    </span>
                                                ) : (
                                                    <span className="text-amber-600 font-semibold text-sm">
                                                        ₹{price.toLocaleString()}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-3 mt-2">
                                                <div className="flex items-center bg-stone-100 rounded-lg">
                                                    <button
                                                        onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.variant?.id)}
                                                        className="w-8 h-8 flex items-center justify-center hover:bg-stone-200 rounded-l-lg transition-colors"
                                                        aria-label="Decrease quantity"
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.variant?.id)}
                                                        className="w-8 h-8 flex items-center justify-center hover:bg-stone-200 rounded-r-lg transition-colors"
                                                        aria-label="Increase quantity"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeItem(item.product.id, item.variant?.id)}
                                                    className="text-stone-400 hover:text-red-500 transition-colors"
                                                    aria-label="Remove item"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Line Total */}
                                        <div className="text-right">
                                            <span className="font-semibold text-stone-900">
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
                    <DrawerFooter>
                        {/* Trust Badges */}
                        <CompactTrustBadges />

                        {/* Totals */}
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-stone-500">Subtotal</span>
                                <span className="text-stone-900">₹{subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-stone-500">Shipping</span>
                                <span className="text-stone-900">
                                    {shipping === 0 ? (
                                        <span className="text-green-600">Free</span>
                                    ) : (
                                        `₹${shipping}`
                                    )}
                                </span>
                            </div>
                            {shipping > 0 && (
                                <p className="text-xs text-stone-400">
                                    Add ₹{(999 - subtotal).toLocaleString()} more for free shipping
                                </p>
                            )}
                            <div className="flex justify-between text-base font-semibold border-t border-stone-200 pt-2">
                                <span>Total</span>
                                <span className="text-amber-600">₹{total.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-2">
                            <DrawerClose asChild>
                                <Link href="/cart" className="flex-1">
                                    <Button variant="outline" className="w-full">
                                        View Cart
                                    </Button>
                                </Link>
                            </DrawerClose>
                            <DrawerClose asChild>
                                <Link href="/checkout" className="flex-1">
                                    <Button variant="primary" className="w-full">
                                        Checkout
                                    </Button>
                                </Link>
                            </DrawerClose>
                        </div>
                    </DrawerFooter>
                )}
            </DrawerContent>
        </Drawer>
    );
}
