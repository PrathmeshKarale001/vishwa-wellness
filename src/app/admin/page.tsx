'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Package, DollarSign, Clock, TrendingUp,
    ChevronRight, Users, ShoppingBag, Settings,
    BarChart3, LogOut, ArrowRight
} from 'lucide-react';
import { useAuthStore } from '@/lib/authStore';
import { getUserRole } from '@/lib/rbac';
import type { Order, UserRole } from '@/types/orders';
import { ORDER_STATUS_CONFIG } from '@/types/orders';

interface OrderStats {
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    todayOrders: number;
}

export default function AdminDashboard() {
    const router = useRouter();
    const { user, signOut } = useAuthStore();
    const [userRole, setUserRole] = useState<UserRole | null>(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<OrderStats | null>(null);
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);

    useEffect(() => {
        async function checkAccess() {
            console.log('[ADMIN] Checking access, user:', user?.email);

            if (!user) {
                console.log('[ADMIN] No user, redirecting to login');
                router.push('/account/login');
                return;
            }

            const role = await getUserRole();
            console.log('[ADMIN] User role:', role);

            if (role !== 'admin' && role !== 'super_admin' && role !== 'staff') {
                console.log('[ADMIN] Insufficient role, redirecting to account');
                router.push('/account');
                return;
            }

            console.log('[ADMIN] Access granted');
            setUserRole(role);
            await fetchData();
            setLoading(false);
        }

        checkAccess();
    }, [user, router]);

    async function fetchData() {
        try {
            const response = await fetch('/api/admin/orders?stats=true&limit=5');
            if (response.ok) {
                const data = await response.json();
                setStats(data.stats);
                setRecentOrders(data.orders);
            }
        } catch (error) {
            console.error('Failed to fetch admin data:', error);
        }
    }

    const handleLogout = async () => {
        await signOut();
        router.push('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
            </div>
        );
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <Link href="/" className="font-bold text-xl text-[var(--color-primary)]">
                                Vishwa Wellness
                            </Link>
                            <span className="text-sm text-gray-500">Admin Panel</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600 capitalize">
                                {userRole?.replace('_', ' ')}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="text-gray-500 hover:text-red-500"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Orders</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">
                                    {stats?.totalOrders || 0}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Package className="text-blue-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">
                                    {formatCurrency(stats?.totalRevenue || 0)}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <DollarSign className="text-green-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Pending Orders</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">
                                    {stats?.pendingOrders || 0}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <Clock className="text-yellow-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Today&apos;s Orders</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">
                                    {stats?.todayOrders || 0}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <TrendingUp className="text-purple-600" size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Quick Actions */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                        <div className="space-y-3">
                            <Link
                                href="/admin/orders"
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                            >
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                    <ShoppingBag className="text-blue-600" size={20} />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">Manage Orders</p>
                                    <p className="text-sm text-gray-500">View and update orders</p>
                                </div>
                                <ChevronRight className="text-gray-400" size={20} />
                            </Link>
                            <Link
                                href="/studio"
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                            >
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                                    <Settings className="text-purple-600" size={20} />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">Content Studio</p>
                                    <p className="text-sm text-gray-500">Manage products & content</p>
                                </div>
                                <ChevronRight className="text-gray-400" size={20} />
                            </Link>
                            <Link
                                href="/admin/customers"
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                            >
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                                    <Users className="text-green-600" size={20} />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">Customers</p>
                                    <p className="text-sm text-gray-500">View customer list</p>
                                </div>
                                <ChevronRight className="text-gray-400" size={20} />
                            </Link>
                        </div>
                    </div>

                    {/* Recent Orders */}
                    <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                            <Link
                                href="/admin/orders"
                                className="text-sm text-[var(--color-primary)] hover:underline flex items-center gap-1"
                            >
                                View All
                                <ArrowRight size={14} />
                            </Link>
                        </div>

                        {recentOrders.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <Package size={48} className="mx-auto mb-4 text-gray-300" />
                                <p>No orders yet</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left text-sm text-gray-500 border-b border-gray-200">
                                            <th className="pb-3 font-medium">Order</th>
                                            <th className="pb-3 font-medium">Customer</th>
                                            <th className="pb-3 font-medium">Status</th>
                                            <th className="pb-3 font-medium text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentOrders.map((order) => {
                                            const statusConfig = ORDER_STATUS_CONFIG[order.status];
                                            return (
                                                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="py-3">
                                                        <Link
                                                            href={`/admin/orders/${order.id}`}
                                                            className="font-medium text-gray-900 hover:text-[var(--color-primary)]"
                                                        >
                                                            {order.order_number}
                                                        </Link>
                                                        <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
                                                    </td>
                                                    <td className="py-3">
                                                        <p className="text-sm text-gray-900">{order.customer_name || 'Guest'}</p>
                                                        <p className="text-xs text-gray-500 truncate max-w-[150px]">{order.customer_email}</p>
                                                    </td>
                                                    <td className="py-3">
                                                        <span
                                                            className="inline-flex px-2 py-1 text-xs font-medium rounded-full"
                                                            style={{ backgroundColor: statusConfig.bgColor, color: statusConfig.color }}
                                                        >
                                                            {statusConfig.label}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 text-right font-medium text-gray-900">
                                                        {formatCurrency(order.total)}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
