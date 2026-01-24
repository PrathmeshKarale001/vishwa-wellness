'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Package, Eye, RotateCcw } from 'lucide-react';
import { useAuthStore } from '@/lib/authStore';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { getSupabaseClient } from '@/lib/supabase';
import { Order } from '@/types/auth';

function OrdersContent() {
    const { user } = useAuthStore();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', user?.id)
            .order('created_at', { ascending: false });

        if (!error && data) {
            setOrders(data as Order[]);
        }
        setIsLoading(false);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered': return 'bg-green-100 text-green-600';
            case 'shipped': return 'bg-blue-100 text-blue-600';
            case 'processing': return 'bg-yellow-100 text-yellow-600';
            case 'confirmed': return 'bg-purple-100 text-purple-600';
            case 'cancelled': return 'bg-red-100 text-red-600';
            default: return 'bg-gray-100 text-gray-600';
        }
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
                        <span className="text-[#222]">Orders</span>
                    </div>
                </div>
            </div>

            {/* Page Header */}
            <div className="bg-[#f5f2f2] py-8">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-3xl font-bold text-[#222]" style={{ fontFamily: 'var(--font-heading)' }}>
                        My Orders
                    </h1>
                    <p className="text-[#777] mt-2">Track and manage your orders</p>
                </div>
            </div>

            <section className="section-padding">
                <div className="max-w-4xl mx-auto px-4">
                    {isLoading ? (
                        <div className="text-center py-12">
                            <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-[#777]">Loading orders...</p>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="bg-white border border-[#eee] p-12 text-center">
                            <Package className="w-16 h-16 text-[#ddd] mx-auto mb-4" />
                            <h2 className="text-xl font-semibold text-[#222] mb-2">No orders yet</h2>
                            <p className="text-[#777] mb-6">
                                Start your wellness journey with our sacred products
                            </p>
                            <Link href="/shop" className="btn-solid inline-block">
                                Browse Products
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map(order => (
                                <div key={order.id} className="bg-white border border-[#eee]">
                                    {/* Order Header */}
                                    <div className="p-4 border-b border-[#eee] flex flex-wrap items-center justify-between gap-4">
                                        <div>
                                            <p className="font-semibold text-[#222]">{order.order_number}</p>
                                            <p className="text-sm text-[#777]">
                                                {new Date(order.created_at).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={`text-xs px-3 py-1 rounded-full capitalize ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                            <span className="font-semibold text-[#222]">₹{order.total}</span>
                                        </div>
                                    </div>

                                    {/* Order Items Preview */}
                                    <div className="p-4">
                                        <div className="flex flex-wrap gap-4">
                                            {order.items.slice(0, 3).map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-3">
                                                    <div className="w-16 h-16 bg-[#f5f5f5] flex items-center justify-center">
                                                        <Package className="w-6 h-6 text-[#999]" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-[#222]">{item.product_title}</p>
                                                        <p className="text-xs text-[#777]">Qty: {item.quantity}</p>
                                                    </div>
                                                </div>
                                            ))}
                                            {order.items.length > 3 && (
                                                <div className="flex items-center text-sm text-[#777]">
                                                    +{order.items.length - 3} more items
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Order Actions */}
                                    <div className="p-4 border-t border-[#eee] flex gap-4">
                                        <button
                                            onClick={() => setSelectedOrder(order)}
                                            className="flex items-center gap-2 text-sm text-[var(--color-primary)] hover:underline"
                                        >
                                            <Eye size={16} />
                                            View Details
                                        </button>
                                        <button className="flex items-center gap-2 text-sm text-[#777] hover:text-[#222]">
                                            <RotateCcw size={16} />
                                            Reorder
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Order Detail Modal */}
                    {selectedOrder && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                                <div className="p-6 border-b border-[#eee] flex items-center justify-between">
                                    <h2 className="text-xl font-semibold text-[#222]">
                                        Order {selectedOrder.order_number}
                                    </h2>
                                    <button
                                        onClick={() => setSelectedOrder(null)}
                                        className="text-[#999] hover:text-[#222]"
                                    >
                                        ✕
                                    </button>
                                </div>
                                <div className="p-6 space-y-6">
                                    {/* Order Items */}
                                    <div>
                                        <h3 className="font-medium text-[#222] mb-4">Items</h3>
                                        <div className="space-y-4">
                                            {selectedOrder.items.map((item, idx) => (
                                                <div key={idx} className="flex justify-between items-center">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 bg-[#f5f5f5] flex items-center justify-center">
                                                            <Package className="w-5 h-5 text-[#999]" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-[#222]">{item.product_title}</p>
                                                            <p className="text-xs text-[#777]">Qty: {item.quantity}</p>
                                                        </div>
                                                    </div>
                                                    <p className="font-medium">₹{item.price * item.quantity}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Order Summary */}
                                    <div className="border-t border-[#eee] pt-4">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-[#777]">Subtotal</span>
                                            <span>₹{selectedOrder.subtotal}</span>
                                        </div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-[#777]">Shipping</span>
                                            <span>{selectedOrder.shipping === 0 ? 'Free' : `₹${selectedOrder.shipping}`}</span>
                                        </div>
                                        <div className="flex justify-between font-semibold text-lg">
                                            <span>Total</span>
                                            <span>₹{selectedOrder.total}</span>
                                        </div>
                                    </div>

                                    {/* Shipping Address */}
                                    {selectedOrder.shipping_address && (
                                        <div className="border-t border-[#eee] pt-4">
                                            <h3 className="font-medium text-[#222] mb-2">Shipping Address</h3>
                                            <p className="text-sm text-[#777]">
                                                {selectedOrder.shipping_address.full_name}<br />
                                                {selectedOrder.shipping_address.address_line1}<br />
                                                {selectedOrder.shipping_address.address_line2 && <>{selectedOrder.shipping_address.address_line2}<br /></>}
                                                {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} {selectedOrder.shipping_address.pincode}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
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
