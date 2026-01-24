'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, Tag, ChevronRight } from 'lucide-react';
import { useCartStore } from '@/lib/cartStore';

export default function CartPage() {
    const {
        items,
        removeItem,
        updateQuantity,
        clearCart,
        getSubtotal,
        getShipping,
        getTotal,
        getItemCount
    } = useCartStore();

    const [mounted, setMounted] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [couponApplied, setCouponApplied] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="section-padding">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
                        <div className="h-64 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    const subtotal = getSubtotal();
    const shipping = getShipping();
    const total = getTotal();
    const itemCount = getItemCount();

    const getDiscountedPrice = (price: number, discount?: number) => {
        if (!discount) return price;
        return price - (price * discount / 100);
    };

    const handleApplyCoupon = (e: React.FormEvent) => {
        e.preventDefault();
        if (couponCode.toLowerCase() === 'wellness10') {
            setCouponApplied(true);
        }
    };

    const couponDiscount = couponApplied ? subtotal * 0.1 : 0;
    const finalTotal = total - couponDiscount;

    return (
        <>
            {/* Breadcrumb */}
            <div className="bg-[#f9f9f9] py-4 border-b border-[#eee]">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center gap-2 text-sm text-[#777]">
                        <Link href="/" className="hover:text-[var(--color-primary)]">Home</Link>
                        <ChevronRight size={14} />
                        <span className="text-[#222]">Shopping Cart</span>
                    </div>
                </div>
            </div>

            {/* Page Header */}
            <div className="bg-[#f5f2f2] py-8">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-3xl font-bold text-[#222]" style={{ fontFamily: 'var(--font-heading)' }}>
                        Shopping Cart
                    </h1>
                    <p className="text-[#777] mt-2">
                        {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
                    </p>
                </div>
            </div>

            <section className="section-padding">
                <div className="max-w-7xl mx-auto px-4">
                    {items.length === 0 ? (
                        /* Empty Cart */
                        <div className="text-center py-16">
                            <ShoppingBag size={80} className="mx-auto text-[#ddd] mb-6" />
                            <h2 className="text-2xl font-semibold text-[#222] mb-4">Your cart is empty</h2>
                            <p className="text-[#777] mb-8">
                                Looks like you haven&apos;t added any products yet.
                            </p>
                            <Link href="/shop" className="btn-solid">
                                Continue Shopping
                            </Link>
                        </div>
                    ) : (
                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Cart Items */}
                            <div className="lg:col-span-2">
                                {/* Desktop Table Header */}
                                <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-[#eee] text-sm font-semibold text-[#222] uppercase tracking-wider">
                                    <div className="col-span-6">Product</div>
                                    <div className="col-span-2 text-center">Price</div>
                                    <div className="col-span-2 text-center">Quantity</div>
                                    <div className="col-span-2 text-right">Total</div>
                                </div>

                                {/* Cart Items List */}
                                <div className="divide-y divide-[#eee]">
                                    {items.map((item) => {
                                        const price = item.variant?.price ?? item.product.price;
                                        const discountedPrice = getDiscountedPrice(price, item.product.discount);
                                        const lineTotal = discountedPrice * item.quantity;

                                        return (
                                            <div
                                                key={`${item.product.id}-${item.variant?.id || 'default'}`}
                                                className="py-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
                                            >
                                                {/* Product Info */}
                                                <div className="md:col-span-6 flex gap-4">
                                                    <Link href={`/product/${item.product.slug}`} className="flex-shrink-0">
                                                        <div className="w-24 h-24 bg-[#f9f9f9] relative overflow-hidden">
                                                            <Image
                                                                src={item.product.images[0]?.src || '/placeholder-product.jpg'}
                                                                alt={item.product.title}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                    </Link>
                                                    <div className="flex-1">
                                                        <Link href={`/product/${item.product.slug}`}>
                                                            <h4 className="font-medium text-[#222] hover:text-[var(--color-primary)] transition-colors">
                                                                {item.product.title}
                                                            </h4>
                                                        </Link>
                                                        <p className="text-sm text-[#777] mt-1">{item.product.category}</p>
                                                        {item.variant && (
                                                            <p className="text-sm text-[#777] mt-1">
                                                                {item.variant.size && `Size: ${item.variant.size}`}
                                                                {item.variant.color && ` / Color: ${item.variant.color}`}
                                                            </p>
                                                        )}
                                                        {/* Mobile Remove Button */}
                                                        <button
                                                            onClick={() => removeItem(item.product.id, item.variant?.id)}
                                                            className="md:hidden text-sm text-red-500 hover:underline mt-2"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Price */}
                                                <div className="md:col-span-2 text-center">
                                                    <span className="md:hidden text-sm text-[#777]">Price: </span>
                                                    {item.product.discount ? (
                                                        <span>
                                                            <span className="text-[var(--color-primary)] font-medium">
                                                                ₹{discountedPrice.toLocaleString()}
                                                            </span>
                                                            <del className="text-[#999] text-sm ml-2">
                                                                ₹{price.toLocaleString()}
                                                            </del>
                                                        </span>
                                                    ) : (
                                                        <span className="font-medium">₹{price.toLocaleString()}</span>
                                                    )}
                                                </div>

                                                {/* Quantity */}
                                                <div className="md:col-span-2 flex items-center justify-center gap-2">
                                                    <div className="flex items-center border border-[#ddd]">
                                                        <button
                                                            onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.variant?.id)}
                                                            className="w-8 h-8 flex items-center justify-center hover:bg-[#f5f5f5] transition-colors"
                                                            aria-label="Decrease quantity"
                                                        >
                                                            <Minus size={14} />
                                                        </button>
                                                        <input
                                                            type="text"
                                                            value={item.quantity}
                                                            onChange={(e) => updateQuantity(
                                                                item.product.id,
                                                                Math.max(1, parseInt(e.target.value) || 1),
                                                                item.variant?.id
                                                            )}
                                                            className="w-10 h-8 text-center border-x border-[#ddd] text-sm focus:outline-none"
                                                        />
                                                        <button
                                                            onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.variant?.id)}
                                                            className="w-8 h-8 flex items-center justify-center hover:bg-[#f5f5f5] transition-colors"
                                                            aria-label="Increase quantity"
                                                        >
                                                            <Plus size={14} />
                                                        </button>
                                                    </div>
                                                    {/* Desktop Remove Button */}
                                                    <button
                                                        onClick={() => removeItem(item.product.id, item.variant?.id)}
                                                        className="hidden md:flex text-[#999] hover:text-red-500 transition-colors"
                                                        aria-label="Remove item"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>

                                                {/* Line Total */}
                                                <div className="md:col-span-2 text-right">
                                                    <span className="md:hidden text-sm text-[#777]">Total: </span>
                                                    <span className="font-semibold text-[#222]">
                                                        ₹{lineTotal.toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Cart Actions */}
                                <div className="flex flex-wrap justify-between items-center gap-4 mt-6 pt-6 border-t border-[#eee]">
                                    <Link href="/shop" className="btn-outline">
                                        Continue Shopping
                                    </Link>
                                    <button
                                        onClick={clearCart}
                                        className="text-sm text-red-500 hover:underline"
                                    >
                                        Clear Cart
                                    </button>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-[#f9f9f9] p-6 border border-[#eee]">
                                    <h3 className="font-semibold text-[#222] text-lg mb-6 uppercase tracking-wider">
                                        Order Summary
                                    </h3>

                                    {/* Coupon Code */}
                                    <form onSubmit={handleApplyCoupon} className="mb-6">
                                        <label className="block text-sm font-medium text-[#222] mb-2">
                                            Coupon Code
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value)}
                                                placeholder="Enter code"
                                                className="flex-1 px-3 py-2 border border-[#ddd] text-sm focus:outline-none focus:border-[var(--color-primary)]"
                                                disabled={couponApplied}
                                            />
                                            <button
                                                type="submit"
                                                className="px-4 py-2 bg-[#222] text-white text-sm font-medium hover:bg-[#333] transition-colors"
                                                disabled={couponApplied}
                                            >
                                                Apply
                                            </button>
                                        </div>
                                        {couponApplied && (
                                            <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
                                                <Tag size={14} />
                                                WELLNESS10 applied - 10% off!
                                            </p>
                                        )}
                                        <p className="text-xs text-[#999] mt-2">Try: WELLNESS10</p>
                                    </form>

                                    {/* Totals */}
                                    <div className="space-y-3 border-t border-[#ddd] pt-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[#777]">Subtotal</span>
                                            <span className="text-[#222]">₹{subtotal.toLocaleString()}</span>
                                        </div>
                                        {couponApplied && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-green-600">Coupon Discount</span>
                                                <span className="text-green-600">-₹{couponDiscount.toLocaleString()}</span>
                                            </div>
                                        )}
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
                                        <div className="flex justify-between text-lg font-semibold border-t border-[#ddd] pt-3">
                                            <span>Total</span>
                                            <span className="text-[var(--color-primary)]">
                                                ₹{finalTotal.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Checkout Button */}
                                    <Link
                                        href="/checkout"
                                        className="block w-full text-center btn-solid mt-6 py-4"
                                    >
                                        Proceed to Checkout
                                    </Link>

                                    {/* Trust Badges */}
                                    <div className="mt-6 pt-6 border-t border-[#ddd] text-center">
                                        <p className="text-xs text-[#777] mb-2">Secure Checkout</p>
                                        <div className="flex justify-center gap-2 text-xs text-[#777]">
                                            <span className="px-2 py-1 bg-white border border-[#eee] rounded">Visa</span>
                                            <span className="px-2 py-1 bg-white border border-[#eee] rounded">MC</span>
                                            <span className="px-2 py-1 bg-white border border-[#eee] rounded">UPI</span>
                                            <span className="px-2 py-1 bg-white border border-[#eee] rounded">COD</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
