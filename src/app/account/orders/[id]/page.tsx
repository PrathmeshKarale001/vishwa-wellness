'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import {
    ChevronRight, Package, Clock, Truck, CheckCircle, XCircle,
    MapPin, CreditCard, ArrowLeft, Download, MessageCircle,
    RefreshCw
} from 'lucide-react';
import { useAuthStore } from '@/lib/authStore';
import { AuthGuard } from '@/components/auth/AuthGuard';
import type { Order, OrderStatus } from '@/types/orders';
import { ORDER_STATUS_CONFIG, PAYMENT_STATUS_CONFIG } from '@/types/orders';

function OrderDetailContent() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuthStore();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchOrder() {
            try {
                const response = await fetch(`/api/orders/${params.id}`);
                if (response.ok) {
                    const data = await response.json();
                    setOrder(data.order);
                } else if (response.status === 404) {
                    router.push('/account/orders');
                }
            } catch (error) {
                console.error('Failed to fetch order:', error);
            } finally {
                setLoading(false);
            }
        }

        if (user && params.id) {
            fetchOrder();
        }
    }, [user, params.id, router]);

    const getStatusIcon = (status: OrderStatus) => {
        switch (status) {
            case 'pending': return <Clock size={20} />;
            case 'confirmed':
            case 'processing': return <RefreshCw size={20} />;
            case 'shipped': return <Truck size={20} />;
            case 'delivered': return <CheckCircle size={20} />;
            case 'cancelled':
            case 'refunded': return <XCircle size={20} />;
            default: return <Package size={20} />;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const orderTimeline = order ? [
        {
            status: 'pending',
            label: 'Order Placed',
            date: order.created_at,
            completed: true
        },
        {
            status: 'confirmed',
            label: 'Order Confirmed',
            date: order.paid_at,
            completed: ['confirmed', 'processing', 'shipped', 'delivered'].includes(order.status)
        },
        {
            status: 'shipped',
            label: 'Shipped',
            date: order.shipped_at,
            completed: ['shipped', 'delivered'].includes(order.status)
        },
        {
            status: 'delivered',
            label: 'Delivered',
            date: order.delivered_at,
            completed: order.status === 'delivered'
        },
    ] : [];

    if (loading) {
        return (
            <div className="section-padding">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="animate-pulse space-y-8">
                        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-48 bg-gray-200 rounded"></div>
                        <div className="h-64 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="section-padding text-center">
                <p>Order not found</p>
            </div>
        );
    }

    const statusConfig = ORDER_STATUS_CONFIG[order.status];
    const paymentConfig = PAYMENT_STATUS_CONFIG[order.payment_status];

    return (
        <>
            {/* Breadcrumb */}
            <div className="bg-[#f9f9f9] py-4 border-b border-[#eee]">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center gap-2 text-sm text-[#777]">
                        <Link href="/" className="hover:text-[var(--color-primary)]">Home</Link>
                        <ChevronRight size={14} />
                        <Link href="/account" className="hover:text-[var(--color-primary)]">My Account</Link>
                        <ChevronRight size={14} />
                        <Link href="/account/orders" className="hover:text-[var(--color-primary)]">Orders</Link>
                        <ChevronRight size={14} />
                        <span className="text-[#222]">{order.order_number}</span>
                    </div>
                </div>
            </div>

            <section className="section-padding">
                <div className="max-w-6xl mx-auto px-4">
                    {/* Back Button */}
                    <Link
                        href="/account/orders"
                        className="inline-flex items-center gap-2 text-[#777] hover:text-[var(--color-primary)] mb-6"
                    >
                        <ArrowLeft size={18} />
                        Back to Orders
                    </Link>

                    {/* Order Header */}
                    <div className="bg-white border border-[#eee] p-6 mb-6">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-[#222]">Order {order.order_number}</h1>
                                <p className="text-[#777] mt-1">Placed on {formatDate(order.created_at)}</p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <span
                                    className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                                    style={{ backgroundColor: statusConfig.bgColor, color: statusConfig.color }}
                                >
                                    {getStatusIcon(order.status)}
                                    {statusConfig.label}
                                </span>
                                <span
                                    className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                                    style={{ backgroundColor: paymentConfig.bgColor, color: paymentConfig.color }}
                                >
                                    <CreditCard size={16} />
                                    {paymentConfig.label}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Order Timeline */}
                            {order.status !== 'cancelled' && order.status !== 'refunded' && (
                                <div className="bg-white border border-[#eee] p-6">
                                    <h2 className="font-semibold text-[#222] mb-6">Order Timeline</h2>
                                    <div className="relative">
                                        {orderTimeline.map((step, index) => (
                                            <div key={step.status} className="flex gap-4 pb-6 last:pb-0">
                                                <div className="relative">
                                                    <div
                                                        className={`w-8 h-8 rounded-full flex items-center justify-center ${step.completed
                                                                ? 'bg-green-500 text-white'
                                                                : 'bg-gray-200 text-gray-400'
                                                            }`}
                                                    >
                                                        {step.completed ? <CheckCircle size={16} /> : (index + 1)}
                                                    </div>
                                                    {index < orderTimeline.length - 1 && (
                                                        <div
                                                            className={`absolute left-4 top-8 w-0.5 h-full -translate-x-1/2 ${step.completed ? 'bg-green-500' : 'bg-gray-200'
                                                                }`}
                                                        />
                                                    )}
                                                </div>
                                                <div className="flex-1 pt-1">
                                                    <p className={`font-medium ${step.completed ? 'text-[#222]' : 'text-[#999]'}`}>
                                                        {step.label}
                                                    </p>
                                                    {step.date && step.completed && (
                                                        <p className="text-sm text-[#777] mt-0.5">
                                                            {formatDate(step.date)}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Order Items */}
                            <div className="bg-white border border-[#eee] p-6">
                                <h2 className="font-semibold text-[#222] mb-4">Order Items</h2>
                                <div className="space-y-4">
                                    {order.items?.map((item) => (
                                        <div key={item.id} className="flex items-center gap-4 py-4 border-b border-[#eee] last:border-0">
                                            <div className="w-20 h-20 bg-[#f9f9f9] relative flex-shrink-0 border border-[#eee]">
                                                {item.product_image ? (
                                                    <Image
                                                        src={item.product_image}
                                                        alt={item.product_name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Package size={24} className="text-[#ddd]" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium text-[#222]">{item.product_name}</h4>
                                                {item.product_sku && (
                                                    <p className="text-xs text-[#999]">SKU: {item.product_sku}</p>
                                                )}
                                                <p className="text-sm text-[#777] mt-1">
                                                    ₹{item.unit_price.toLocaleString()} × {item.quantity}
                                                </p>
                                            </div>
                                            <p className="font-semibold text-[#222]">
                                                ₹{item.total_price.toLocaleString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Order Summary */}
                            <div className="bg-white border border-[#eee] p-6">
                                <h2 className="font-semibold text-[#222] mb-4">Order Summary</h2>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[#777]">Subtotal</span>
                                        <span>₹{order.subtotal.toLocaleString()}</span>
                                    </div>
                                    {order.discount_amount > 0 && (
                                        <div className="flex justify-between text-sm text-green-600">
                                            <span>Discount</span>
                                            <span>-₹{order.discount_amount.toLocaleString()}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[#777]">Shipping</span>
                                        <span>{order.shipping_cost === 0 ? 'Free' : `₹${order.shipping_cost}`}</span>
                                    </div>
                                    {order.tax_amount > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[#777]">Tax</span>
                                            <span>₹{order.tax_amount.toLocaleString()}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between font-semibold text-lg border-t border-[#eee] pt-3">
                                        <span>Total</span>
                                        <span className="text-[var(--color-primary)]">₹{order.total.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="bg-white border border-[#eee] p-6">
                                <h2 className="font-semibold text-[#222] mb-4 flex items-center gap-2">
                                    <MapPin size={18} className="text-[var(--color-primary)]" />
                                    Shipping Address
                                </h2>
                                <div className="text-sm text-[#777]">
                                    <p className="font-medium text-[#222]">
                                        {order.shipping_address.firstName} {order.shipping_address.lastName}
                                    </p>
                                    <p>{order.shipping_address.addressLine1}</p>
                                    {order.shipping_address.addressLine2 && (
                                        <p>{order.shipping_address.addressLine2}</p>
                                    )}
                                    <p>
                                        {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postalCode}
                                    </p>
                                    <p>{order.shipping_address.country}</p>
                                    {order.shipping_address.phone && (
                                        <p className="mt-2">Phone: {order.shipping_address.phone}</p>
                                    )}
                                </div>
                            </div>

                            {/* Tracking Info */}
                            {order.tracking_number && (
                                <div className="bg-white border border-[#eee] p-6">
                                    <h2 className="font-semibold text-[#222] mb-4 flex items-center gap-2">
                                        <Truck size={18} className="text-[var(--color-primary)]" />
                                        Tracking Information
                                    </h2>
                                    <p className="text-sm text-[#777]">
                                        Tracking Number: <span className="font-mono text-[#222]">{order.tracking_number}</span>
                                    </p>
                                    {order.tracking_url && (
                                        <a
                                            href={order.tracking_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-block mt-3 text-sm text-[var(--color-primary)] hover:underline"
                                        >
                                            Track Package →
                                        </a>
                                    )}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="space-y-3">
                                <button className="w-full btn-outline flex items-center justify-center gap-2">
                                    <Download size={16} />
                                    Download Invoice
                                </button>
                                <button className="w-full btn-outline flex items-center justify-center gap-2">
                                    <MessageCircle size={16} />
                                    Need Help?
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default function OrderDetailPage() {
    return (
        <AuthGuard>
            <OrderDetailContent />
        </AuthGuard>
    );
}
