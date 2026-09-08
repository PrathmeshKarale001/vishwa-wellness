'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight, Check, CreditCard, Truck, MapPin } from 'lucide-react';
import { useCartStore } from '@/lib/cartStore';
import { useAuthStore } from '@/lib/authStore';
import { useRazorpay } from '@/lib/useRazorpay';
import { CheckoutProgress, CompactTrustBadges } from '@/components/ui';
import {
    CheckoutShippingForm,
    CheckoutPaymentMethod,
    CheckoutOrderSummary,
    type ShippingFormData,
    type PaymentMethod,
} from '@/components/checkout';

type CheckoutStep = 'shipping' | 'payment' | 'review';

interface Coupon {
    id: string;
    code: string;
    description: string;
    discount_type: 'percentage' | 'fixed';
    discount_value: number;
    min_order_value: number;
    max_discount: number | null;
    used_count?: number;
}

const initialShippingForm: ShippingFormData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
};

export default function CheckoutPage() {
    const router = useRouter();
    const { items, getSubtotal, getShipping, getTotal, getItemCount, clearCart } = useCartStore();
    const { user, profile } = useAuthStore();
    const { initiatePayment, isLoading: razorpayLoading } = useRazorpay();
    const [mounted, setMounted] = useState(false);
    const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
    const [shippingForm, setShippingForm] = useState<ShippingFormData>(initialShippingForm);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('online');
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderNumber, setOrderNumber] = useState('');
    const [paymentError, setPaymentError] = useState('');

    // Coupon state
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
    const [couponLoading, setCouponLoading] = useState(false);
    const [couponError, setCouponError] = useState('');

    useEffect(() => {
        setMounted(true);

        // Pre-fill form with user data if logged in
        if (user && profile) {
            const nameParts = (profile.full_name || '').split(' ');
            setShippingForm(prev => ({
                ...prev,
                firstName: nameParts[0] || '',
                lastName: nameParts.slice(1).join(' ') || '',
                email: user.email || '',
                phone: profile.phone || '',
            }));
        }
    }, [user, profile]);

    const subtotal = mounted ? getSubtotal() : 0;
    const shipping = mounted ? getShipping() : 0;
    const itemCount = mounted ? getItemCount() : 0;

    // Calculate discount
    const calculateDiscount = useCallback(() => {
        if (!appliedCoupon) return 0;

        if (appliedCoupon.discount_type === 'percentage') {
            const discount = (subtotal * appliedCoupon.discount_value) / 100;
            return appliedCoupon.max_discount ? Math.min(discount, appliedCoupon.max_discount) : discount;
        }
        return appliedCoupon.discount_value;
    }, [appliedCoupon, subtotal]);

    const discount = calculateDiscount();
    const total = subtotal + shipping - discount;

    const steps: { id: CheckoutStep; label: string; icon: React.ElementType }[] = [
        { id: 'shipping', label: 'Shipping', icon: MapPin },
        { id: 'payment', label: 'Payment', icon: CreditCard },
        { id: 'review', label: 'Review', icon: Check },
    ];

    const getStepIndex = (step: CheckoutStep) => steps.findIndex(s => s.id === step);

    // Apply coupon handler - Uses API instead of direct Supabase query for security
    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;

        setCouponLoading(true);
        setCouponError('');

        try {
            const response = await fetch('/api/coupons/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: couponCode.trim(),
                    subtotal,
                }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                setCouponError(data.error || 'Invalid or expired coupon code');
                setCouponLoading(false);
                return;
            }

            // Set the validated coupon from API response
            setAppliedCoupon({
                id: data.coupon.id,
                code: data.coupon.code,
                description: data.coupon.description,
                discount_type: data.coupon.discount_type,
                discount_value: data.coupon.discount_value,
                min_order_value: 0, // Not needed client-side after validation
                max_discount: data.coupon.max_discount,
            });
            setCouponLoading(false);
        } catch (error) {
            console.error('Coupon validation error:', error);
            setCouponError('Failed to validate coupon. Please try again.');
            setCouponLoading(false);
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode('');
        setCouponError('');
    };

    // Place order handler.
    //
    // Flow:
    //   1. Create our order server-side with payment_status 'pending'. The
    //      server re-validates every price against Sanity.
    //   2. Open Razorpay for an amount the SERVER derives from that order.
    //   3. The server verifies the payment (signature + capture + amount) and
    //      settles the order. We only show success if the server says so.
    const handlePlaceOrder = async () => {
        setIsProcessing(true);
        setPaymentError('');

        // Prepare shipping address - must match AddressSchema in validations.ts
        const shippingAddress = {
            firstName: shippingForm.firstName,
            lastName: shippingForm.lastName,
            phone: shippingForm.phone,
            address: shippingForm.address,
            apartment: shippingForm.apartment,
            city: shippingForm.city,
            state: shippingForm.state,
            pincode: shippingForm.pincode,
            country: shippingForm.country,
        };

        // Prepare order items
        const orderItems = items.map(item => ({
            productId: item.product.id,
            productSlug: item.product.slug,
            productTitle: item.product.title,
            productImage: item.product.images[0]?.src || item.product.images[0]?.url || '',
            quantity: item.quantity,
            price: item.variant?.price ?? item.product.price,
        }));

        const orderPayload = {
            items: orderItems,
            shipping_address: shippingAddress,
            customer_email: shippingForm.email,
            customer_phone: shippingForm.phone,
            customer_name: `${shippingForm.firstName} ${shippingForm.lastName}`,
            subtotal,
            shipping_cost: shipping,
            discount: discount,
            total,
            payment_method: 'razorpay' as const,
            coupon_code: appliedCoupon?.code,
            notes: appliedCoupon ? `Coupon: ${appliedCoupon.code}` : undefined,
        };

        // STEP 1: Create the order with pending payment status
        let order: { id: string; order_number: string } | null = null;

        try {
            const orderResponse = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderPayload),
            });

            if (!orderResponse.ok) {
                const errorData = await orderResponse.json();
                throw new Error(errorData.message || errorData.error || 'Failed to create order');
            }

            const data = await orderResponse.json();
            order = data.order;
        } catch (error) {
            console.error('Order creation error:', error);
            const errorMsg = error instanceof Error ? error.message : 'Failed to create order';
            setPaymentError(errorMsg);
            setIsProcessing(false);
            return;
        }

        if (!order) {
            setPaymentError('Failed to create order. Please try again.');
            setIsProcessing(false);
            return;
        }

        // STEP 2 + 3: Pay, then let the server verify and settle the order.
        const result = await initiatePayment({
            orderId: order.id,
            name: 'Vishwa Wellness',
            description: `Order #${order.order_number}`,
            prefill: {
                name: `${shippingForm.firstName} ${shippingForm.lastName}`,
                email: shippingForm.email,
                contact: shippingForm.phone,
            },
            notes: {
                order_id: order.id,
                order_number: order.order_number,
            },
            theme: { color: '#C73C2E' },
        });

        if (!result.success) {
            // Payment failed, was cancelled, or could not be verified.
            // The order stays pending - it is NOT treated as placed.
            setPaymentError(result.error || 'Payment failed. Please try again.');
            setIsProcessing(false);
            return;
        }

        // The server verified and settled the order before returning success.
        setOrderNumber(order.order_number);
        setOrderPlaced(true);
        clearCart();
        setIsProcessing(false);
    };

    // Loading state
    if (!mounted) {
        return (
            <div className="section-padding">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
                        <div className="h-96 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    // Empty cart state
    if (items.length === 0 && !orderPlaced) {
        return (
            <div className="section-padding">
                <div className="max-w-lg mx-auto px-4 text-center py-16">
                    <Truck size={64} className="mx-auto text-[#ddd] mb-6" />
                    <h2 className="text-2xl font-semibold text-[#222] mb-4">Your cart is empty</h2>
                    <p className="text-[#777] mb-8">Add some items to your cart before checking out.</p>
                    <Link href="/shop" className="btn-solid">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    // Order success state
    if (orderPlaced) {
        return (
            <div className="section-padding">
                <div className="max-w-lg mx-auto px-4 text-center py-16">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check size={40} className="text-green-600" />
                    </div>
                    <h2 className="text-2xl font-semibold text-[#222] mb-4">Order Placed Successfully!</h2>
                    <p className="text-[#777] mb-2">
                        Thank you for your order. We&apos;ll send you a confirmation email shortly.
                    </p>
                    <p className="text-[var(--color-primary)] font-medium mb-8">
                        Order Number: {orderNumber}
                    </p>
                    <div className="flex gap-4 justify-center">
                        {user && (
                            <Link href="/account/orders" className="btn-outline">
                                View Orders
                            </Link>
                        )}
                        <Link href="/shop" className="btn-solid">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Breadcrumb */}
            <div className="bg-[#f9f9f9] py-4 border-b border-[#eee]">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center gap-2 text-sm text-[#777]">
                        <Link href="/" className="hover:text-[var(--color-primary)]">Home</Link>
                        <ChevronRight size={14} />
                        <Link href="/cart" className="hover:text-[var(--color-primary)]">Cart</Link>
                        <ChevronRight size={14} />
                        <span className="text-[#222]">Checkout</span>
                    </div>
                </div>
            </div>

            {/* Page Header */}
            <div className="bg-[#f5f2f2] py-8">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-3xl font-bold text-[#222]" style={{ fontFamily: 'var(--font-heading)' }}>
                        Checkout
                    </h1>
                </div>
            </div>

            <section className="section-padding">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Step Indicator */}
                    <CheckoutProgress
                        currentStep={getStepIndex(currentStep) + 2}
                        className="mb-12"
                    />

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Form */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Shipping Step */}
                            {currentStep === 'shipping' && (
                                <CheckoutShippingForm
                                    data={shippingForm}
                                    onChange={setShippingForm}
                                    onContinue={() => setCurrentStep('payment')}
                                    isLoggedIn={!!user}
                                />
                            )}

                            {/* Payment Step */}
                            {currentStep === 'payment' && (
                                <div className="space-y-6">
                                    <CheckoutPaymentMethod
                                        selected={paymentMethod}
                                        onChange={setPaymentMethod}
                                        total={total}
                                    />

                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setCurrentStep('shipping')}
                                            className="btn-outline"
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={() => setCurrentStep('review')}
                                            className="btn-solid flex-1"
                                        >
                                            Continue to Review
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Review Step */}
                            {currentStep === 'review' && (
                                <div className="space-y-6">
                                    {/* Order Review */}
                                    <div className="bg-white border border-[#eee] p-6">
                                        <h2 className="text-xl font-semibold text-[#222] mb-6 flex items-center gap-2">
                                            <Check size={20} className="text-[var(--color-primary)]" />
                                            Review Your Order
                                        </h2>

                                        {/* Shipping Summary */}
                                        <div className="mb-6 pb-6 border-b border-[#eee]">
                                            <h3 className="font-medium text-[#222] mb-2">Shipping Address</h3>
                                            <p className="text-[#777] text-sm">
                                                {shippingForm.firstName} {shippingForm.lastName}<br />
                                                {shippingForm.address}{shippingForm.apartment ? `, ${shippingForm.apartment}` : ''}<br />
                                                {shippingForm.city}, {shippingForm.state} {shippingForm.pincode}<br />
                                                {shippingForm.country}<br />
                                                Phone: {shippingForm.phone}
                                            </p>
                                            <button
                                                onClick={() => setCurrentStep('shipping')}
                                                className="text-[var(--color-primary)] text-sm font-medium mt-2 hover:underline"
                                            >
                                                Edit
                                            </button>
                                        </div>

                                        {/* Payment Summary */}
                                        <div className="mb-6">
                                            <h3 className="font-medium text-[#222] mb-2">Payment Method</h3>
                                            <p className="text-[#777] text-sm">
                                                Razorpay (UPI, Cards, Net Banking, Wallets)
                                            </p>
                                            <button
                                                onClick={() => setCurrentStep('payment')}
                                                className="text-[var(--color-primary)] text-sm font-medium mt-2 hover:underline"
                                            >
                                                Edit
                                            </button>
                                        </div>

                                        {/* Payment Error */}
                                        {paymentError && (
                                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                                                {paymentError}
                                            </div>
                                        )}

                                        {/* Place Order Button */}
                                        <button
                                            onClick={handlePlaceOrder}
                                            disabled={isProcessing || razorpayLoading}
                                            className="btn-solid w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isProcessing || razorpayLoading ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                    </svg>
                                                    Processing...
                                                </span>
                                            ) : (
                                                `Place Order - ₹${Math.round(total).toLocaleString()}`
                                            )}
                                        </button>

                                        <p className="text-xs text-[#777] text-center mt-4">
                                            By placing this order, you agree to our{' '}
                                            <Link href="/terms" className="text-[var(--color-primary)] hover:underline">
                                                Terms of Service
                                            </Link>{' '}
                                            and{' '}
                                            <Link href="/privacy" className="text-[var(--color-primary)] hover:underline">
                                                Privacy Policy
                                            </Link>
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => setCurrentStep('payment')}
                                        className="btn-outline w-full"
                                    >
                                        Back to Payment
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24">
                                <CheckoutOrderSummary
                                    items={items}
                                    subtotal={subtotal}
                                    shipping={shipping}
                                    discount={discount}
                                    total={total}
                                    couponCode={couponCode}
                                    onCouponChange={setCouponCode}
                                    onApplyCoupon={handleApplyCoupon}
                                    onRemoveCoupon={handleRemoveCoupon}
                                    appliedCoupon={appliedCoupon ? {
                                        code: appliedCoupon.code,
                                        description: appliedCoupon.description,
                                    } : null}
                                    couponLoading={couponLoading}
                                    couponError={couponError}
                                />

                                {/* Trust Badges */}
                                <div className="mt-6">
                                    <CompactTrustBadges />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
