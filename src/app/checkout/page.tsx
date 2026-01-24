'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Check, CreditCard, Truck, MapPin, ShieldCheck, Tag, X, Loader2 } from 'lucide-react';
import { useCartStore } from '@/lib/cartStore';
import { useAuthStore } from '@/lib/authStore';
import { getSupabaseClient } from '@/lib/supabase';

type CheckoutStep = 'shipping' | 'payment' | 'review';

interface ShippingForm {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
}

interface Coupon {
    id: string;
    code: string;
    description: string;
    discount_type: 'percentage' | 'fixed';
    discount_value: number;
    min_order_value: number;
    max_discount: number | null;
}

const initialShippingForm: ShippingForm = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
};

const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

// Generate unique order number
const generateOrderNumber = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `VW-${timestamp}-${random}`;
};

export default function CheckoutPage() {
    const { items, getSubtotal, getShipping, getTotal, getItemCount, clearCart } = useCartStore();
    const { user, profile } = useAuthStore();
    const [mounted, setMounted] = useState(false);
    const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
    const [shippingForm, setShippingForm] = useState<ShippingForm>(initialShippingForm);
    const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi' | 'card'>('cod');
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderNumber, setOrderNumber] = useState('');

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

    const subtotal = getSubtotal();
    const shipping = getShipping();

    // Calculate discount
    const calculateDiscount = () => {
        if (!appliedCoupon) return 0;

        if (appliedCoupon.discount_type === 'percentage') {
            const discount = (subtotal * appliedCoupon.discount_value) / 100;
            return appliedCoupon.max_discount ? Math.min(discount, appliedCoupon.max_discount) : discount;
        }
        return appliedCoupon.discount_value;
    };

    const discount = calculateDiscount();
    const total = subtotal + shipping - discount;
    const itemCount = getItemCount();

    const steps: { id: CheckoutStep; label: string; icon: React.ElementType }[] = [
        { id: 'shipping', label: 'Shipping', icon: MapPin },
        { id: 'payment', label: 'Payment', icon: CreditCard },
        { id: 'review', label: 'Review', icon: Check },
    ];

    const getStepIndex = (step: CheckoutStep) => steps.findIndex(s => s.id === step);
    const isStepComplete = (step: CheckoutStep) => getStepIndex(step) < getStepIndex(currentStep);
    const isStepActive = (step: CheckoutStep) => step === currentStep;

    const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setShippingForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const isShippingValid = () => {
        return Object.values(shippingForm).every(val => val.trim() !== '');
    };

    // Apply coupon
    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;

        setCouponLoading(true);
        setCouponError('');

        const supabase = getSupabaseClient();
        const { data, error } = await supabase
            .from('coupons')
            .select('*')
            .eq('code', couponCode.toUpperCase())
            .eq('is_active', true)
            .single();

        if (error || !data) {
            setCouponError('Invalid or expired coupon code');
            setCouponLoading(false);
            return;
        }

        // Check minimum order value
        if (data.min_order_value && subtotal < data.min_order_value) {
            setCouponError(`Minimum order value is ₹${data.min_order_value}`);
            setCouponLoading(false);
            return;
        }

        // Check validity period
        const now = new Date();
        if (data.valid_from && new Date(data.valid_from) > now) {
            setCouponError('This coupon is not yet active');
            setCouponLoading(false);
            return;
        }
        if (data.valid_until && new Date(data.valid_until) < now) {
            setCouponError('This coupon has expired');
            setCouponLoading(false);
            return;
        }

        // Check usage limit
        if (data.usage_limit && data.used_count >= data.usage_limit) {
            setCouponError('This coupon has reached its usage limit');
            setCouponLoading(false);
            return;
        }

        setAppliedCoupon(data as Coupon);
        setCouponLoading(false);
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode('');
        setCouponError('');
    };

    const handlePlaceOrder = async () => {
        setIsProcessing(true);

        const newOrderNumber = generateOrderNumber();

        // Prepare order data
        const orderData = {
            user_id: user?.id,
            order_number: newOrderNumber,
            status: 'pending',
            subtotal: subtotal,
            discount: discount,
            shipping: shipping,
            total: total,
            items: items.map(item => ({
                product_id: item.product.id,
                product_title: item.product.title,
                variant_id: item.variant?.id || null,
                quantity: item.quantity,
                price: item.variant?.price ?? item.product.price,
                image: item.product.images[0]?.src || null,
            })),
            shipping_address: {
                full_name: `${shippingForm.firstName} ${shippingForm.lastName}`,
                email: shippingForm.email,
                phone: shippingForm.phone,
                address_line1: shippingForm.address,
                city: shippingForm.city,
                state: shippingForm.state,
                pincode: shippingForm.pincode,
                country: shippingForm.country,
            },
            payment_method: paymentMethod,
            coupon_code: appliedCoupon?.code || null,
        };

        // If user is logged in, save to Supabase
        if (user) {
            const supabase = getSupabaseClient();
            const { error } = await supabase.from('orders').insert(orderData);

            if (error) {
                console.error('Order creation error:', error);
                setIsProcessing(false);
                return;
            }

            // Update coupon usage if used
            if (appliedCoupon) {
                await supabase
                    .from('coupons')
                    .update({ used_count: (appliedCoupon as { used_count?: number }).used_count || 0 + 1 })
                    .eq('id', appliedCoupon.id);
            }
        }

        setOrderNumber(newOrderNumber);
        setOrderPlaced(true);
        clearCart();
        setIsProcessing(false);
    };

    const getDiscountedPrice = (price: number, discountPercent?: number) => {
        if (!discountPercent) return price;
        return price - (price * discountPercent / 100);
    };

    // If cart is empty and order not placed, redirect
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
                    <div className="flex items-center justify-center mb-12">
                        {steps.map((step, index) => (
                            <div key={step.id} className="flex items-center">
                                <div
                                    className={`flex items-center gap-2 px-4 py-2 rounded ${isStepActive(step.id)
                                        ? 'bg-[var(--color-primary)] text-white'
                                        : isStepComplete(step.id)
                                            ? 'bg-green-100 text-green-600'
                                            : 'bg-[#f5f5f5] text-[#999]'
                                        }`}
                                >
                                    <step.icon size={18} />
                                    <span className="font-medium hidden sm:inline">{step.label}</span>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`w-8 sm:w-16 h-0.5 ${isStepComplete(steps[index + 1].id) || isStepActive(steps[index + 1].id)
                                        ? 'bg-[var(--color-primary)]'
                                        : 'bg-[#ddd]'
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Form */}
                        <div className="lg:col-span-2">
                            {/* Shipping Step */}
                            {currentStep === 'shipping' && (
                                <div className="bg-white border border-[#eee] p-6">
                                    <h2 className="text-xl font-semibold text-[#222] mb-6 flex items-center gap-2">
                                        <MapPin size={20} className="text-[var(--color-primary)]" />
                                        Shipping Address
                                    </h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-[#222] mb-1">First Name *</label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={shippingForm.firstName}
                                                onChange={handleShippingChange}
                                                className="w-full px-4 py-3 border border-[#ddd] focus:outline-none focus:border-[var(--color-primary)]"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#222] mb-1">Last Name *</label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={shippingForm.lastName}
                                                onChange={handleShippingChange}
                                                className="w-full px-4 py-3 border border-[#ddd] focus:outline-none focus:border-[var(--color-primary)]"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#222] mb-1">Email *</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={shippingForm.email}
                                                onChange={handleShippingChange}
                                                className="w-full px-4 py-3 border border-[#ddd] focus:outline-none focus:border-[var(--color-primary)]"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#222] mb-1">Phone *</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={shippingForm.phone}
                                                onChange={handleShippingChange}
                                                className="w-full px-4 py-3 border border-[#ddd] focus:outline-none focus:border-[var(--color-primary)]"
                                                required
                                            />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-medium text-[#222] mb-1">Address *</label>
                                            <input
                                                type="text"
                                                name="address"
                                                value={shippingForm.address}
                                                onChange={handleShippingChange}
                                                className="w-full px-4 py-3 border border-[#ddd] focus:outline-none focus:border-[var(--color-primary)]"
                                                placeholder="House number, Street, Landmark"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#222] mb-1">City *</label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={shippingForm.city}
                                                onChange={handleShippingChange}
                                                className="w-full px-4 py-3 border border-[#ddd] focus:outline-none focus:border-[var(--color-primary)]"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#222] mb-1">State *</label>
                                            <select
                                                name="state"
                                                value={shippingForm.state}
                                                onChange={handleShippingChange}
                                                className="w-full px-4 py-3 border border-[#ddd] focus:outline-none focus:border-[var(--color-primary)] bg-white"
                                                required
                                            >
                                                <option value="">Select State</option>
                                                {indianStates.map(state => (
                                                    <option key={state} value={state}>{state}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#222] mb-1">Pincode *</label>
                                            <input
                                                type="text"
                                                name="pincode"
                                                value={shippingForm.pincode}
                                                onChange={handleShippingChange}
                                                className="w-full px-4 py-3 border border-[#ddd] focus:outline-none focus:border-[var(--color-primary)]"
                                                maxLength={6}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#222] mb-1">Country</label>
                                            <input
                                                type="text"
                                                name="country"
                                                value={shippingForm.country}
                                                className="w-full px-4 py-3 border border-[#ddd] bg-[#f9f9f9]"
                                                disabled
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-6 flex justify-end">
                                        <button
                                            onClick={() => setCurrentStep('payment')}
                                            disabled={!isShippingValid()}
                                            className="btn-solid disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Continue to Payment
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Payment Step */}
                            {currentStep === 'payment' && (
                                <div className="bg-white border border-[#eee] p-6">
                                    <h2 className="text-xl font-semibold text-[#222] mb-6 flex items-center gap-2">
                                        <CreditCard size={20} className="text-[var(--color-primary)]" />
                                        Payment Method
                                    </h2>
                                    <div className="space-y-4">
                                        {[
                                            { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when you receive your order' },
                                            { id: 'upi', label: 'UPI Payment', desc: 'Pay using any UPI app' },
                                            { id: 'card', label: 'Credit/Debit Card', desc: 'Visa, Mastercard, Rupay' },
                                        ].map(method => (
                                            <label
                                                key={method.id}
                                                className={`flex items-start gap-4 p-4 border-2 cursor-pointer transition-colors ${paymentMethod === method.id
                                                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                                                    : 'border-[#ddd] hover:border-[#bbb]'
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="payment"
                                                    value={method.id}
                                                    checked={paymentMethod === method.id}
                                                    onChange={() => setPaymentMethod(method.id as 'cod' | 'upi' | 'card')}
                                                    className="mt-1"
                                                />
                                                <div>
                                                    <p className="font-medium text-[#222]">{method.label}</p>
                                                    <p className="text-sm text-[#777]">{method.desc}</p>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                    <div className="mt-6 flex justify-between">
                                        <button
                                            onClick={() => setCurrentStep('shipping')}
                                            className="btn-outline"
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={() => setCurrentStep('review')}
                                            className="btn-solid"
                                        >
                                            Review Order
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Review Step */}
                            {currentStep === 'review' && (
                                <div className="bg-white border border-[#eee] p-6">
                                    <h2 className="text-xl font-semibold text-[#222] mb-6 flex items-center gap-2">
                                        <Check size={20} className="text-[var(--color-primary)]" />
                                        Review Your Order
                                    </h2>

                                    {/* Shipping Summary */}
                                    <div className="mb-6 p-4 bg-[#f9f9f9] border border-[#eee]">
                                        <h3 className="font-medium text-[#222] mb-2">Shipping To:</h3>
                                        <p className="text-[#777] text-sm">
                                            {shippingForm.firstName} {shippingForm.lastName}<br />
                                            {shippingForm.address}<br />
                                            {shippingForm.city}, {shippingForm.state} {shippingForm.pincode}<br />
                                            {shippingForm.phone}
                                        </p>
                                    </div>

                                    {/* Payment Summary */}
                                    <div className="mb-6 p-4 bg-[#f9f9f9] border border-[#eee]">
                                        <h3 className="font-medium text-[#222] mb-2">Payment Method:</h3>
                                        <p className="text-[#777] text-sm">
                                            {paymentMethod === 'cod' && 'Cash on Delivery'}
                                            {paymentMethod === 'upi' && 'UPI Payment'}
                                            {paymentMethod === 'card' && 'Credit/Debit Card'}
                                        </p>
                                    </div>

                                    {/* Order Items */}
                                    <div className="mb-6">
                                        <h3 className="font-medium text-[#222] mb-4">Order Items ({itemCount})</h3>
                                        <div className="space-y-4">
                                            {items.map(item => {
                                                const price = item.variant?.price ?? item.product.price;
                                                const discountedPrice = getDiscountedPrice(price, item.product.discount);
                                                return (
                                                    <div key={`${item.product.id}-${item.variant?.id || 'default'}`} className="flex gap-4">
                                                        <div className="w-16 h-16 bg-[#f9f9f9] relative flex-shrink-0">
                                                            <Image
                                                                src={item.product.images[0]?.src || '/placeholder-product.jpg'}
                                                                alt={item.product.title}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="font-medium text-[#222] text-sm">{item.product.title}</p>
                                                            <p className="text-[#777] text-sm">Qty: {item.quantity}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-medium text-[#222]">
                                                                ₹{(discountedPrice * item.quantity).toLocaleString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="mt-6 flex justify-between">
                                        <button
                                            onClick={() => setCurrentStep('payment')}
                                            className="btn-outline"
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={handlePlaceOrder}
                                            disabled={isProcessing}
                                            className="btn-solid disabled:opacity-50 flex items-center gap-2"
                                        >
                                            {isProcessing && <Loader2 size={18} className="animate-spin" />}
                                            {isProcessing ? 'Processing...' : 'Place Order'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-[#f9f9f9] p-6 border border-[#eee] sticky top-24">
                                <h3 className="font-semibold text-[#222] text-lg mb-6 uppercase tracking-wider">
                                    Order Summary
                                </h3>

                                {/* Items Preview */}
                                <div className="space-y-3 mb-6 pb-4 border-b border-[#ddd]">
                                    {items.slice(0, 3).map(item => (
                                        <div key={`${item.product.id}-${item.variant?.id || 'default'}`} className="flex gap-3">
                                            <div className="w-12 h-12 bg-white relative flex-shrink-0 border border-[#eee]">
                                                <Image
                                                    src={item.product.images[0]?.src || '/placeholder-product.jpg'}
                                                    alt={item.product.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                                <span className="absolute -top-2 -right-2 w-5 h-5 bg-[var(--color-primary)] text-white text-xs flex items-center justify-center rounded-full">
                                                    {item.quantity}
                                                </span>
                                            </div>
                                            <p className="text-sm text-[#222] line-clamp-2">{item.product.title}</p>
                                        </div>
                                    ))}
                                    {items.length > 3 && (
                                        <p className="text-sm text-[#777]">+{items.length - 3} more items</p>
                                    )}
                                </div>

                                {/* Coupon Code */}
                                <div className="mb-6 pb-4 border-b border-[#ddd]">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Tag size={16} className="text-[var(--color-primary)]" />
                                        <span className="font-medium text-[#222] text-sm">Coupon Code</span>
                                    </div>
                                    {appliedCoupon ? (
                                        <div className="flex items-center justify-between bg-green-50 border border-green-200 p-3">
                                            <div>
                                                <p className="font-medium text-green-700 text-sm">{appliedCoupon.code}</p>
                                                <p className="text-xs text-green-600">{appliedCoupon.description}</p>
                                            </div>
                                            <button onClick={handleRemoveCoupon} className="text-red-500 hover:text-red-700">
                                                <X size={18} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={couponCode}
                                                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                    placeholder="Enter code"
                                                    className="flex-1 px-3 py-2 border border-[#ddd] text-sm focus:outline-none focus:border-[var(--color-primary)]"
                                                />
                                                <button
                                                    onClick={handleApplyCoupon}
                                                    disabled={couponLoading || !couponCode}
                                                    className="px-4 py-2 bg-[var(--color-primary)] text-white text-sm disabled:opacity-50"
                                                >
                                                    {couponLoading ? '...' : 'Apply'}
                                                </button>
                                            </div>
                                            {couponError && (
                                                <p className="text-red-500 text-xs mt-2">{couponError}</p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Totals */}
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[#777]">Subtotal</span>
                                        <span className="text-[#222]">₹{subtotal.toLocaleString()}</span>
                                    </div>
                                    {discount > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-green-600">Discount</span>
                                            <span className="text-green-600">-₹{discount.toLocaleString()}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[#777]">Shipping</span>
                                        <span className="text-[#222]">
                                            {shipping === 0 ? <span className="text-green-600">Free</span> : `₹${shipping}`}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-lg font-semibold border-t border-[#ddd] pt-3">
                                        <span>Total</span>
                                        <span className="text-[var(--color-primary)]">₹{total.toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* Trust Badges */}
                                <div className="mt-6 pt-4 border-t border-[#ddd]">
                                    <div className="flex items-center gap-2 text-sm text-[#777]">
                                        <ShieldCheck size={16} className="text-green-600" />
                                        <span>Secure checkout</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
