'use client';

import { useState, useEffect } from 'react';
import { Ticket, Copy, Check, Gift, ChevronDown } from 'lucide-react';

interface Coupon {
    id: string;
    code: string;
    description: string | null;
    discount_type: 'percentage' | 'fixed';
    discount_value: number;
    min_order_value: number | null;
    max_discount: number | null;
}

export default function CouponHighlight() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [copiedCode, setCopiedCode] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        async function fetchCoupons() {
            try {
                const response = await fetch('/api/coupons/public');
                if (response.ok) {
                    const data = await response.json();
                    if (data.coupons && data.coupons.length > 0) {
                        setCoupons(data.coupons);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch coupons:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchCoupons();
    }, []);

    const handleCopyCode = async (code: string) => {
        try {
            await navigator.clipboard.writeText(code);
            setCopiedCode(code);
            setTimeout(() => setCopiedCode(null), 2000);
        } catch (error) {
            console.error('Failed to copy code:', error);
        }
    };

    const formatDiscount = (coupon: Coupon) => {
        if (coupon.discount_type === 'percentage') {
            return `${coupon.discount_value}% OFF`;
        }
        return `₹${coupon.discount_value} OFF`;
    };

    // Show loading skeleton
    if (loading) {
        return (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 animate-pulse">
                <div className="h-4 bg-amber-200 rounded w-24 mb-2"></div>
                <div className="h-6 bg-amber-200 rounded w-32 mb-1"></div>
                <div className="h-3 bg-amber-100 rounded w-48"></div>
            </div>
        );
    }

    // If we have coupons from API, show them
    if (coupons.length > 0) {
        const displayCoupons = showAll ? coupons : [coupons[0]];

        return (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 relative overflow-hidden">
                <div className="absolute -right-4 -top-4 w-20 h-20 bg-amber-100/50 rounded-full"></div>
                <div className="absolute -right-2 -bottom-2 w-12 h-12 bg-orange-100/50 rounded-full"></div>

                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Gift className="w-5 h-5 text-amber-600" />
                            <span className="text-sm font-semibold text-amber-800">Available Offers</span>
                        </div>
                        {coupons.length > 1 && (
                            <button
                                onClick={() => setShowAll(!showAll)}
                                className="text-xs text-amber-700 hover:text-amber-900 flex items-center gap-1"
                            >
                                {showAll ? 'Show less' : `+${coupons.length - 1} more`}
                                <ChevronDown className={`w-3 h-3 transition-transform ${showAll ? 'rotate-180' : ''}`} />
                            </button>
                        )}
                    </div>

                    <div className="space-y-2">
                        {displayCoupons.map((coupon) => (
                            <div
                                key={coupon.id}
                                className="flex items-center justify-between gap-3 bg-white/60 rounded-lg p-3 border border-amber-100"
                            >
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-gray-900">{formatDiscount(coupon)}</p>
                                    {coupon.description && (
                                        <p className="text-xs text-gray-600 truncate">{coupon.description}</p>
                                    )}
                                    {coupon.min_order_value && (
                                        <p className="text-xs text-amber-700">
                                            Min. order: ₹{coupon.min_order_value}
                                        </p>
                                    )}
                                </div>

                                <button
                                    onClick={() => handleCopyCode(coupon.code)}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-white border-2 border-dashed border-amber-400 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition-all group shrink-0"
                                >
                                    <Ticket className="w-3.5 h-3.5 text-amber-600" />
                                    <span className="font-mono font-bold text-amber-800 text-xs">{coupon.code}</span>
                                    {copiedCode === coupon.code ? (
                                        <Check className="w-3.5 h-3.5 text-green-600" />
                                    ) : (
                                        <Copy className="w-3.5 h-3.5 text-gray-400 group-hover:text-amber-600 transition-colors" />
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>

                    {copiedCode && (
                        <p className="text-xs text-green-600 font-medium mt-2 animate-fadeIn">
                            ✓ Code copied! Apply at checkout
                        </p>
                    )}
                </div>
            </div>
        );
    }

    // Fallback: Show a generic promo message when no coupons from API
    return (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-emerald-100/50 rounded-full"></div>

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1">
                    <Gift className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm font-semibold text-emerald-800">Exclusive Offers</span>
                </div>
                <p className="text-sm text-gray-700">
                    Check out our <span className="font-semibold text-emerald-700">special discounts</span> at checkout!
                </p>
                <p className="text-xs text-emerald-600 mt-1">Free shipping on orders above ₹499</p>
            </div>
        </div>
    );
}
