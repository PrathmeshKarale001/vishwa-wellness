'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Minus, Plus, Ticket } from 'lucide-react';
import { getImageUrl } from '@/lib/image-utils';

interface CartItem {
    product: {
        id: string;
        slug: string;
        title: string;
        price: number;
        comparePrice?: number;
        images: Array<{ url?: string; src?: string; alt?: string }>;
    };
    quantity: number;
    variant?: {
        price?: number;
    };
}

interface AppliedCoupon {
    code: string;
    description?: string;
}

interface CheckoutOrderSummaryProps {
    items: CartItem[];
    subtotal: number;
    shipping: number;
    tax?: number;
    discount?: number;
    total: number;
    couponCode: string;
    onCouponChange: (code: string) => void;
    onApplyCoupon: () => void;
    onRemoveCoupon: () => void;
    appliedCoupon?: AppliedCoupon | null;
    couponError?: string;
    couponLoading?: boolean;
    editable?: boolean;
    onUpdateQuantity?: (productId: string, quantity: number) => void;
    onRemoveItem?: (productId: string) => void;
}

export default function CheckoutOrderSummary({
    items,
    subtotal,
    shipping,
    tax = 0,
    discount = 0,
    total,
    couponCode,
    onCouponChange,
    onApplyCoupon,
    onRemoveCoupon,
    appliedCoupon,
    couponError,
    couponLoading = false,
    editable = false,
    onUpdateQuantity,
    onRemoveItem,
}: CheckoutOrderSummaryProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-[#eee] overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-[#eee] bg-[#f9f9f9]">
                <h2 className="text-lg font-semibold text-[#222]">
                    Order Summary
                </h2>
                <p className="text-sm text-[#777]">
                    {items.length} item{items.length !== 1 ? 's' : ''} in cart
                </p>
            </div>

            {/* Items */}
            <div className="p-6 space-y-4 max-h-[300px] overflow-y-auto">
                {items.map((item) => {
                    const imageUrl = getImageUrl(item.product.images[0]);
                    const unitPrice = item.variant?.price ?? item.product.price;
                    return (
                        <div key={item.product.id} className="flex gap-4">
                            {/* Image */}
                            <div className="relative w-16 h-16 bg-[#f9f9f9] rounded-lg overflow-hidden flex-shrink-0">
                                {imageUrl && (
                                    <Image
                                        src={imageUrl}
                                        alt={item.product.title}
                                        fill
                                        className="object-cover"
                                        sizes="64px"
                                    />
                                )}
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#222] text-white text-xs rounded-full flex items-center justify-center">
                                    {item.quantity}
                                </span>
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0">
                                <Link
                                    href={`/products/${item.product.slug}`}
                                    className="text-sm font-medium text-[#222] hover:text-[var(--color-primary)] line-clamp-2"
                                >
                                    {item.product.title}
                                </Link>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-sm font-semibold">
                                        ₹{(unitPrice * item.quantity).toLocaleString('en-IN')}
                                    </span>
                                    {item.quantity > 1 && (
                                        <span className="text-xs text-[#777]">
                                            (₹{unitPrice.toLocaleString('en-IN')} each)
                                        </span>
                                    )}
                                </div>

                                {/* Editable Controls */}
                                {editable && (
                                    <div className="flex items-center gap-3 mt-2">
                                        <div className="flex items-center border border-[#ddd] rounded">
                                            <button
                                                type="button"
                                                onClick={() => onUpdateQuantity?.(item.product.id, item.quantity - 1)}
                                                className="w-7 h-7 flex items-center justify-center hover:bg-[#f9f9f9]"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                                            <button
                                                type="button"
                                                onClick={() => onUpdateQuantity?.(item.product.id, item.quantity + 1)}
                                                className="w-7 h-7 flex items-center justify-center hover:bg-[#f9f9f9]"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => onRemoveItem?.(item.product.id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Coupon Section */}
            <div className="px-6 py-4 border-t border-[#eee]">
                {appliedCoupon ? (
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2">
                            <Ticket size={18} className="text-green-600" />
                            <div>
                                <p className="text-sm font-medium text-green-800">
                                    {appliedCoupon.code}
                                </p>
                                {appliedCoupon.description && (
                                    <p className="text-xs text-green-600">
                                        {appliedCoupon.description}
                                    </p>
                                )}
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={onRemoveCoupon}
                            className="text-sm text-red-500 hover:underline"
                        >
                            Remove
                        </button>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={couponCode}
                                onChange={(e) => onCouponChange(e.target.value.toUpperCase())}
                                placeholder="Enter coupon code"
                                className="flex-1 px-3 py-2 text-sm border border-[#ddd] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                            />
                            <button
                                type="button"
                                onClick={onApplyCoupon}
                                disabled={!couponCode || couponLoading}
                                className="px-4 py-2 text-sm font-medium text-white bg-[var(--color-primary)] rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {couponLoading ? 'Applying...' : 'Apply'}
                            </button>
                        </div>
                        {couponError && (
                            <p className="text-sm text-red-500">{couponError}</p>
                        )}
                    </div>
                )}
            </div>

            {/* Totals */}
            <div className="px-6 py-4 border-t border-[#eee] space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="text-[#777]">Subtotal</span>
                    <span className="font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                        <span>Discount</span>
                        <span>-₹{discount.toLocaleString('en-IN')}</span>
                    </div>
                )}
                <div className="flex justify-between text-sm">
                    <span className="text-[#777]">Shipping</span>
                    <span className="font-medium">
                        {shipping === 0 ? (
                            <span className="text-green-600">Free</span>
                        ) : (
                            `₹${shipping.toLocaleString('en-IN')}`
                        )}
                    </span>
                </div>
                {tax > 0 && (
                    <div className="flex justify-between text-sm">
                        <span className="text-[#777]">Tax</span>
                        <span className="font-medium">₹{tax.toLocaleString('en-IN')}</span>
                    </div>
                )}
                <div className="flex justify-between pt-3 border-t border-[#eee]">
                    <span className="text-lg font-semibold text-[#222]">Total</span>
                    <span className="text-lg font-bold text-[var(--color-primary)]">
                        ₹{total.toLocaleString('en-IN')}
                    </span>
                </div>
            </div>

            {/* Free Shipping Progress */}
            {subtotal < 999 && (
                <div className="px-6 py-4 bg-[#f9f9f9] border-t border-[#eee]">
                    <p className="text-sm text-[#777] mb-2">
                        Add ₹{(999 - subtotal).toLocaleString('en-IN')} more for{' '}
                        <span className="text-green-600 font-medium">FREE shipping</span>
                    </p>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-green-500 transition-all duration-300"
                            style={{ width: `${Math.min((subtotal / 999) * 100, 100)}%` }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
