'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    Package, Search, Filter, ChevronLeft, ChevronRight,
    Eye, ArrowLeft, Download
} from 'lucide-react';
import { useAuthStore } from '@/lib/authStore';
import { getUserRole } from '@/lib/rbac';
import type { Order, OrderStatus, PaymentStatus, UserRole } from '@/types/orders';
import { ORDER_STATUS_CONFIG, PAYMENT_STATUS_CONFIG } from '@/types/orders';

export default function AdminOrdersPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, isInitialized } = useAuthStore();
    const [userRole, setUserRole] = useState<UserRole | null>(null);
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState<Order[]>([]);
    const [totalCount, setTotalCount] = useState(0);

    // Filters
    const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('');
    const [paymentFilter, setPaymentFilter] = useState<PaymentStatus | ''>('');
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const limit = 20;

    useEffect(() => {
        async function checkAccess() {
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
            setLoading(false);
        }

        checkAccess();
    }, [user, isInitialized, router]);

    useEffect(() => {
        if (userRole) {
            fetchOrders();
        }
    }, [userRole, statusFilter, paymentFilter, page]);

    async function fetchOrders() {
        try {
            const params = new URLSearchParams();
            params.set('limit', limit.toString());
            params.set('offset', ((page - 1) * limit).toString());
            if (statusFilter) params.set('status', statusFilter);
            if (paymentFilter) params.set('paymentStatus', paymentFilter);

            const response = await fetch(`/api/admin/orders?${params.toString()}`);
            if (response.ok) {
                const data = await response.json();
                setOrders(data.orders);
                setTotalCount(data.count);
            }
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        }
    }

    async function updateOrderStatus(orderId: string, newStatus: OrderStatus) {
        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                fetchOrders();
            }
        } catch (error) {
            console.error('Failed to update order:', error);
        }
    }

    const totalPages = Math.ceil(totalCount / limit);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <Link href="/admin" className="text-gray-500 hover:text-gray-700">
                                <ArrowLeft size={20} />
                            </Link>
                            <h1 className="text-lg font-semibold text-gray-900">Orders Management</h1>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium">
                            <Download size={16} />
                            Export CSV
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex-1 min-w-[200px]">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search orders..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter size={18} className="text-gray-400" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as OrderStatus | '')}
                                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
                            >
                                <option value="">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="refunded">Refunded</option>
                            </select>
                            <select
                                value={paymentFilter}
                                onChange={(e) => setPaymentFilter(e.target.value as PaymentStatus | '')}
                                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
                            >
                                <option value="">All Payments</option>
                                <option value="pending">Pending</option>
                                <option value="paid">Paid</option>
                                <option value="failed">Failed</option>
                                <option value="refunded">Refunded</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order</th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Items</th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment</th>
                                    <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                                    <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {orders.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center">
                                            <Package size={48} className="mx-auto mb-4 text-gray-300" />
                                            <p className="text-gray-500">No orders found</p>
                                        </td>
                                    </tr>
                                ) : (
                                    orders.map((order) => {
                                        const statusConfig = ORDER_STATUS_CONFIG[order.status];
                                        const paymentConfig = PAYMENT_STATUS_CONFIG[order.payment_status];
                                        return (
                                            <tr key={order.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <p className="font-medium text-gray-900">{order.order_number}</p>
                                                    <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm text-gray-900">{order.customer_name || 'Guest'}</p>
                                                    <p className="text-xs text-gray-500">{order.customer_email}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm text-gray-900">{order.items?.length || 0} items</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                                                        className="text-xs font-medium px-2 py-1 rounded-full border-0 focus:ring-2 focus:ring-offset-2"
                                                        style={{
                                                            backgroundColor: statusConfig.bgColor,
                                                            color: statusConfig.color
                                                        }}
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="confirmed">Confirmed</option>
                                                        <option value="processing">Processing</option>
                                                        <option value="shipped">Shipped</option>
                                                        <option value="delivered">Delivered</option>
                                                        <option value="cancelled">Cancelled</option>
                                                        <option value="refunded">Refunded</option>
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className="inline-flex px-2 py-1 text-xs font-medium rounded-full"
                                                        style={{ backgroundColor: paymentConfig.bgColor, color: paymentConfig.color }}
                                                    >
                                                        {paymentConfig.label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right font-medium text-gray-900">
                                                    {formatCurrency(order.total)}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <Link
                                                        href={`/admin/orders/${order.id}`}
                                                        className="inline-flex items-center gap-1 text-[var(--color-primary)] hover:underline text-sm"
                                                    >
                                                        <Eye size={14} />
                                                        View
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                            <p className="text-sm text-gray-500">
                                Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, totalCount)} of {totalCount} orders
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <span className="text-sm text-gray-600">
                                    Page {page} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
