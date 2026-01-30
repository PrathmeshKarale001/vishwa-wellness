'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Package, Clock, Truck, CheckCircle, XCircle, Eye, RefreshCw, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/lib/authStore';
import { AuthGuard } from '@/components/auth/AuthGuard';
import type { Order, OrderStatus } from '@/types/orders';
import { ORDER_STATUS_CONFIG } from '@/types/orders';

function OrdersContent() {
    const { user } = useAuthStore();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchOrders() {
            try {
                const response = await fetch('/api/orders');
                if (response.ok) {
                    const data = await response.json();
                    setOrders(data.orders || []);
                }
            } catch (error) {
                console.error('Failed to fetch orders:', error);
            } finally {
                setLoading(false);
            }
        }

        if (user) {
            fetchOrders();
        }
    }, [user]);

    const getStatusIcon = (status: OrderStatus) => {
        switch (status) {
            case 'pending':
                return <Clock size={16} />;
            case 'confirmed':
            case 'processing':
                return <RefreshCw size={16} />;
            case 'shipped':
                return <Truck size={16} />;
            case 'delivered':
                return <CheckCircle size={16} />;
            case 'cancelled':
            case 'refunded':
                return <XCircle size={16} />;
            default:
                return <Package size={16} />;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

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
                        <span className="text-[#222]">My Orders</span>
                    </div>
                </div>
            </div>

            {/* Page Header */}
            <div className="bg-[#f5f2f2] py-8">
                <div className="max-w-7xl mx-auto px-4">
                    <h1 className="text-3xl font-bold text-[#222]" style={{ fontFamily: 'var(--font-heading)' }}>
                        My Orders
                    </h1>
                    <p className="text-[#777] mt-2">Track and manage your orders</p>
                </div>
            </div>

            <section className="section-padding">
                <div className="max-w-6xl mx-auto px-4">
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-white border border-[#eee] p-6 animate-pulse">
                                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                                    <div className="h-20 bg-gray-200 rounded mb-4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-16 bg-white border border-[#eee]">
                            <Package size={64} className="mx-auto text-[#ddd] mb-6" />
                            <h2 className="text-2xl font-semibold text-[#222] mb-4">No Orders Yet</h2>
                            <p className="text-[#777] mb-8">You haven&apos;t placed any orders yet.</p>
                            <Link href="/shop" className="btn-solid">
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => {
                                const statusConfig = ORDER_STATUS_CONFIG[order.status];
                                return (
                                    <div key={order.id} className="bg-white border border-[#eee] overflow-hidden">
                                        {/* Order Header */}
                                        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[#f9f9f9] border-b border-[#eee]">
                                            <div className="flex flex-wrap items-center gap-4">
                                                <div>
                                                    <span className="text-xs text-[#777]">Order #</span>
                                                    <p className="font-semibold text-[#222]">{order.order_number}</p>
                                                </div>
                                                <div className="h-8 w-px bg-[#ddd] hidden sm:block"></div>
                                                <div>
                                                    <span className="text-xs text-[#777]">Placed on</span>
                                                    <p className="text-sm text-[#222]">{formatDate(order.created_at)}</p>
                                                </div>
                                                <div className="h-8 w-px bg-[#ddd] hidden sm:block"></div>
                                                <div>
                                                    <span className="text-xs text-[#777]">Total</span>
                                                    <p className="font-semibold text-[var(--color-primary)]">₹{Math.round(order.total).toLocaleString()}</p>
                                                </div>
                                            </div>
                                            <div
                                                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium"
                                                style={{
                                                    backgroundColor: statusConfig.bgColor,
                                                    color: statusConfig.color
                                                }}
                                            >
                                                {getStatusIcon(order.status)}
                                                {statusConfig.label}
                                            </div>
                                        </div>

                                        {/* Order Items */}
                                        <div className="p-4">
                                            <div className="space-y-3">
                                                {order.items?.slice(0, 2).map((item) => (
                                                    <div key={item.id} className="flex items-center gap-4">
                                                        <div className="w-16 h-16 bg-[#f9f9f9] relative flex-shrink-0 border border-[#eee]">
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
                                                            <h4 className="font-medium text-[#222] truncate">{item.product_name}</h4>
                                                            <p className="text-sm text-[#777]">
                                                                Qty: {item.quantity} × ₹{Math.round(item.unit_price).toLocaleString()}
                                                            </p>
                                                        </div>
                                                        <p className="font-medium text-[#222]">
                                                            ₹{Math.round(item.total_price).toLocaleString()}
                                                        </p>
                                                    </div>
                                                ))}
                                                {order.items && order.items.length > 2 && (
                                                    <p className="text-sm text-[#777]">
                                                        +{order.items.length - 2} more item(s)
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Order Actions */}
                                        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[#fafafa] border-t border-[#eee]">
                                            <div className="flex flex-wrap gap-2">
                                                {order.tracking_number && (
                                                    <a
                                                        href={order.tracking_url || '#'}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-[var(--color-primary)] hover:underline flex items-center gap-1"
                                                    >
                                                        <Truck size={14} />
                                                        Track Package
                                                    </a>
                                                )}
                                            </div>
                                            <Link
                                                href={`/account/orders/${order.id}`}
                                                className="flex items-center gap-1 text-sm font-medium text-[var(--color-primary)] hover:underline"
                                            >
                                                View Details
                                                <ArrowRight size={14} />
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}

export default function OrdersPage() {
    return (
        <AuthGuard>
            <OrdersContent />
        </AuthGuard>
    );
}
