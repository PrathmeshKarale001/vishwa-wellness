'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft, Package, Truck, Clock, CheckCircle, XCircle,
    MapPin, CreditCard, Save, RefreshCw, User, Mail, Phone
} from 'lucide-react';
import { useAuthStore } from '@/lib/authStore';
import { getUserRole } from '@/lib/rbac';
import type { Order, OrderStatus, UserRole } from '@/types/orders';
import { ORDER_STATUS_CONFIG, PAYMENT_STATUS_CONFIG } from '@/types/orders';

export default function AdminOrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user, isInitialized } = useAuthStore();
    const [userRole, setUserRole] = useState<UserRole | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [order, setOrder] = useState<Order | null>(null);

    // Editable fields
    const [status, setStatus] = useState<OrderStatus>('pending');
    const [trackingNumber, setTrackingNumber] = useState('');
    const [trackingUrl, setTrackingUrl] = useState('');
    const [adminNotes, setAdminNotes] = useState('');

    useEffect(() => {
        async function init() {
            // Wait for auth to initialize
            if (!isInitialized) {
                return;
            }

            if (!user) {
                router.push('/auth/login');
                return;
            }

            const role = await getUserRole();
            if (role !== 'admin' && role !== 'super_admin' && role !== 'staff') {
                router.push('/account');
                return;
            }

            setUserRole(role);
            await fetchOrder();
            setLoading(false);
        }

        init();
    }, [user, isInitialized, router, params.id]);

    async function fetchOrder() {
        try {
            const response = await fetch(`/api/orders/${params.id}`);
            if (response.ok) {
                const data = await response.json();
                setOrder(data.order);
                setStatus(data.order.status);
                setTrackingNumber(data.order.tracking_number || '');
                setTrackingUrl(data.order.tracking_url || '');
                setAdminNotes(data.order.admin_notes || '');
            } else {
                router.push('/admin/orders');
            }
        } catch (error) {
            console.error('Failed to fetch order:', error);
        }
    }

    async function handleSave() {
        if (!order) return;

        setSaving(true);
        try {
            const response = await fetch(`/api/orders/${order.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status,
                    tracking_number: trackingNumber,
                    tracking_url: trackingUrl,
                    admin_notes: adminNotes,
                }),
            });

            if (response.ok) {
                await fetchOrder();
            }
        } catch (error) {
            console.error('Failed to update order:', error);
        } finally {
            setSaving(false);
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const getStatusIcon = (s: OrderStatus) => {
        switch (s) {
            case 'pending': return <Clock size={16} />;
            case 'confirmed':
            case 'processing': return <RefreshCw size={16} />;
            case 'shipped': return <Truck size={16} />;
            case 'delivered': return <CheckCircle size={16} />;
            case 'cancelled':
            case 'refunded': return <XCircle size={16} />;
            default: return <Package size={16} />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p>Order not found</p>
            </div>
        );
    }

    const statusConfig = ORDER_STATUS_CONFIG[order.status];
    const paymentConfig = PAYMENT_STATUS_CONFIG[order.payment_status];
    const isAdmin = userRole === 'admin' || userRole === 'super_admin';

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <Link href="/admin/orders" className="text-gray-500 hover:text-gray-700">
                                <ArrowLeft size={20} />
                            </Link>
                            <div>
                                <h1 className="text-lg font-semibold text-gray-900">Order {order.order_number}</h1>
                                <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
                            </div>
                        </div>
                        {isAdmin && (
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 disabled:opacity-50"
                            >
                                <Save size={16} />
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        )}
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Status Card */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Status
                                    </label>
                                    {isAdmin ? (
                                        <select
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value as OrderStatus)}
                                            className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="confirmed">Confirmed</option>
                                            <option value="processing">Processing</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>
                                            <option value="refunded">Refunded</option>
                                        </select>
                                    ) : (
                                        <span
                                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium"
                                            style={{ backgroundColor: statusConfig.bgColor, color: statusConfig.color }}
                                        >
                                            {getStatusIcon(order.status)}
                                            {statusConfig.label}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Payment Status
                                    </label>
                                    <span
                                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium"
                                        style={{ backgroundColor: paymentConfig.bgColor, color: paymentConfig.color }}
                                    >
                                        <CreditCard size={16} />
                                        {paymentConfig.label}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Tracking Info */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Truck size={20} className="text-[var(--color-primary)]" />
                                Shipping Information
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tracking Number
                                    </label>
                                    {isAdmin ? (
                                        <input
                                            type="text"
                                            value={trackingNumber}
                                            onChange={(e) => setTrackingNumber(e.target.value)}
                                            placeholder="Enter tracking number"
                                            className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
                                        />
                                    ) : (
                                        <p className="text-gray-900">{trackingNumber || '-'}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tracking URL
                                    </label>
                                    {isAdmin ? (
                                        <input
                                            type="url"
                                            value={trackingUrl}
                                            onChange={(e) => setTrackingUrl(e.target.value)}
                                            placeholder="https://..."
                                            className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
                                        />
                                    ) : (
                                        <p className="text-gray-900">{trackingUrl || '-'}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
                            <div className="space-y-4">
                                {order.items?.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0">
                                        <div className="w-16 h-16 bg-gray-100 relative flex-shrink-0 rounded-lg overflow-hidden">
                                            {item.product_image ? (
                                                <Image
                                                    src={item.product_image}
                                                    alt={item.product_name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Package size={24} className="text-gray-300" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-gray-900">{item.product_name}</h4>
                                            {item.product_sku && (
                                                <p className="text-xs text-gray-500">SKU: {item.product_sku}</p>
                                            )}
                                            <p className="text-sm text-gray-600">
                                                {formatCurrency(item.unit_price)} × {item.quantity}
                                            </p>
                                        </div>
                                        <p className="font-semibold text-gray-900">
                                            {formatCurrency(item.total_price)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Admin Notes */}
                        {isAdmin && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Admin Notes</h2>
                                <textarea
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    placeholder="Add internal notes about this order..."
                                    rows={4}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
                                />
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Customer Info */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <User size={20} className="text-[var(--color-primary)]" />
                                Customer
                            </h2>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-2">
                                    <User size={16} className="text-gray-400" />
                                    <span>{order.customer_name || 'Guest'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail size={16} className="text-gray-400" />
                                    <a href={`mailto:${order.customer_email}`} className="text-[var(--color-primary)] hover:underline">
                                        {order.customer_email}
                                    </a>
                                </div>
                                {order.customer_phone && (
                                    <div className="flex items-center gap-2">
                                        <Phone size={16} className="text-gray-400" />
                                        <a href={`tel:${order.customer_phone}`} className="text-[var(--color-primary)] hover:underline">
                                            {order.customer_phone}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <MapPin size={20} className="text-[var(--color-primary)]" />
                                Shipping Address
                            </h2>
                            <div className="text-sm text-gray-600">
                                <p className="font-medium text-gray-900">
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
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span>{formatCurrency(order.subtotal)}</span>
                                </div>
                                {order.discount_amount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Discount</span>
                                        <span>-{formatCurrency(order.discount_amount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping</span>
                                    <span>{order.shipping_cost === 0 ? 'Free' : formatCurrency(order.shipping_cost)}</span>
                                </div>
                                {order.tax_amount > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Tax (included)</span>
                                        <span>{formatCurrency(order.tax_amount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2 mt-2">
                                    <span>Total</span>
                                    <span className="text-[var(--color-primary)]">{formatCurrency(order.total)}</span>
                                </div>
                                <p className="text-xs text-gray-500 text-center mt-1">All prices are inclusive of GST</p>
                            </div>
                        </div>

                        {/* Razorpay Info */}
                        {order.razorpay_payment_id && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h2>
                                <div className="space-y-2 text-sm">
                                    <div>
                                        <span className="text-gray-500">Payment ID:</span>
                                        <p className="font-mono text-xs">{order.razorpay_payment_id}</p>
                                    </div>
                                    {order.razorpay_order_id && (
                                        <div>
                                            <span className="text-gray-500">Order ID:</span>
                                            <p className="font-mono text-xs">{order.razorpay_order_id}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
