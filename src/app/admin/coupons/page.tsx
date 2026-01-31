'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft, Plus, Search, Ticket, Percent, DollarSign,
    Calendar, Users, Edit2, Trash2, ToggleLeft, ToggleRight,
    X, Check, AlertCircle
} from 'lucide-react';
import { useAuthStore } from '@/lib/authStore';
import { getUserRole } from '@/lib/rbac';
import type { UserRole } from '@/types/orders';

interface Coupon {
    id: string;
    code: string;
    description: string | null;
    discount_type: 'percentage' | 'fixed';
    discount_value: number;
    min_order_value: number | null;
    max_discount: number | null;
    valid_from: string | null;
    valid_until: string | null;
    usage_limit: number | null;
    used_count: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface CouponStats {
    total: number;
    active: number;
    inactive: number;
    totalUsage: number;
}

type CouponFormData = Omit<Coupon, 'id' | 'used_count' | 'created_at' | 'updated_at'>;

const initialFormData: CouponFormData = {
    code: '',
    description: '',
    discount_type: 'percentage',
    discount_value: 10,
    min_order_value: null,
    max_discount: null,
    valid_from: null,
    valid_until: null,
    usage_limit: null,
    is_active: true,
};

export default function AdminCouponsPage() {
    const router = useRouter();
    const { user, isInitialized } = useAuthStore();
    const [userRole, setUserRole] = useState<UserRole | null>(null);
    const [loading, setLoading] = useState(true);
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [stats, setStats] = useState<CouponStats | null>(null);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
    const [formData, setFormData] = useState<CouponFormData>(initialFormData);
    const [formError, setFormError] = useState('');
    const [saving, setSaving] = useState(false);

    const fetchCoupons = useCallback(async () => {
        try {
            const params = new URLSearchParams();
            if (statusFilter !== 'all') params.set('status', statusFilter);
            if (search) params.set('search', search);

            const response = await fetch(`/api/admin/coupons?${params}`);
            if (response.ok) {
                const data = await response.json();
                setCoupons(data.coupons);
                setStats(data.stats);
            }
        } catch (error) {
            console.error('Failed to fetch coupons:', error);
        }
    }, [statusFilter, search]);

    useEffect(() => {
        async function checkAccess() {
            if (!isInitialized) {
                return;
            }

            if (!user) {
                router.push('/account/login');
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
        if (!loading && userRole) {
            fetchCoupons();
        }
    }, [loading, userRole, fetchCoupons]);

    const openCreateModal = () => {
        setEditingCoupon(null);
        setFormData(initialFormData);
        setFormError('');
        setShowModal(true);
    };

    const openEditModal = (coupon: Coupon) => {
        setEditingCoupon(coupon);
        setFormData({
            code: coupon.code,
            description: coupon.description || '',
            discount_type: coupon.discount_type,
            discount_value: coupon.discount_value,
            min_order_value: coupon.min_order_value,
            max_discount: coupon.max_discount,
            valid_from: coupon.valid_from,
            valid_until: coupon.valid_until,
            usage_limit: coupon.usage_limit,
            is_active: coupon.is_active,
        });
        setFormError('');
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        setSaving(true);

        try {
            const url = editingCoupon
                ? `/api/admin/coupons/${editingCoupon.id}`
                : '/api/admin/coupons';
            const method = editingCoupon ? 'PATCH' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                setFormError(data.error || 'Failed to save coupon');
                setSaving(false);
                return;
            }

            setShowModal(false);
            fetchCoupons();
        } catch {
            setFormError('An error occurred');
        } finally {
            setSaving(false);
        }
    };

    const toggleCouponStatus = async (coupon: Coupon) => {
        try {
            const response = await fetch(`/api/admin/coupons/${coupon.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_active: !coupon.is_active }),
            });

            if (response.ok) {
                fetchCoupons();
            }
        } catch (error) {
            console.error('Failed to toggle coupon status:', error);
        }
    };

    const deleteCoupon = async (coupon: Coupon) => {
        if (!confirm(`Are you sure you want to deactivate coupon "${coupon.code}"?`)) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/coupons/${coupon.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchCoupons();
            }
        } catch (error) {
            console.error('Failed to delete coupon:', error);
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
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
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/admin"
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft size={20} />
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Coupon Management</h1>
                                <p className="text-sm text-gray-500">Create and manage discount coupons</p>
                            </div>
                        </div>
                        <button
                            onClick={openCreateModal}
                            className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-opacity"
                        >
                            <Plus size={20} />
                            <span>Create Coupon</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats */}
                {stats && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white p-4 rounded-xl shadow-sm border">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Ticket size={20} className="text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Total Coupons</p>
                                    <p className="text-xl font-bold">{stats.total}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm border">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Check size={20} className="text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Active</p>
                                    <p className="text-xl font-bold">{stats.active}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm border">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-100 rounded-lg">
                                    <X size={20} className="text-gray-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Inactive</p>
                                    <p className="text-xl font-bold">{stats.inactive}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm border">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <Users size={20} className="text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Total Usage</p>
                                    <p className="text-xl font-bold">{stats.totalUsage}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Filters */}
                <div className="bg-white p-4 rounded-xl shadow-sm border mb-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by code or description..."
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                            />
                        </div>
                        <div className="flex gap-2">
                            {(['all', 'active', 'inactive'] as const).map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === status
                                        ? 'bg-[var(--color-primary)] text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Coupons Table */}
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Validity</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {coupons.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                            <Ticket size={48} className="mx-auto mb-4 text-gray-300" />
                                            <p className="text-lg font-medium">No coupons found</p>
                                            <p className="text-sm">Create your first coupon to get started</p>
                                        </td>
                                    </tr>
                                ) : (
                                    coupons.map((coupon) => (
                                        <tr key={coupon.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-mono font-bold text-[var(--color-primary)]">
                                                        {coupon.code}
                                                    </p>
                                                    {coupon.description && (
                                                        <p className="text-sm text-gray-500 line-clamp-1">
                                                            {coupon.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {coupon.discount_type === 'percentage' ? (
                                                        <Percent size={16} className="text-blue-500" />
                                                    ) : (
                                                        <DollarSign size={16} className="text-green-500" />
                                                    )}
                                                    <span className="font-medium">
                                                        {coupon.discount_type === 'percentage'
                                                            ? `${coupon.discount_value}%`
                                                            : formatCurrency(coupon.discount_value)
                                                        }
                                                    </span>
                                                </div>
                                                {coupon.min_order_value && (
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Min: {formatCurrency(coupon.min_order_value)}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                                    <Calendar size={14} />
                                                    <span>
                                                        {formatDate(coupon.valid_from)} - {formatDate(coupon.valid_until)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm">
                                                    {coupon.used_count}
                                                    {coupon.usage_limit && ` / ${coupon.usage_limit}`}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => toggleCouponStatus(coupon)}
                                                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${coupon.is_active
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-gray-100 text-gray-600'
                                                        }`}
                                                >
                                                    {coupon.is_active ? (
                                                        <ToggleRight size={16} />
                                                    ) : (
                                                        <ToggleLeft size={16} />
                                                    )}
                                                    {coupon.is_active ? 'Active' : 'Inactive'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => openEditModal(coupon)}
                                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                        title="Edit coupon"
                                                    >
                                                        <Edit2 size={16} className="text-gray-600" />
                                                    </button>
                                                    {userRole !== 'staff' && (
                                                        <button
                                                            onClick={() => deleteCoupon(coupon)}
                                                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Delete coupon"
                                                        >
                                                            <Trash2 size={16} className="text-red-500" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b flex items-center justify-between">
                            <h2 className="text-xl font-bold">
                                {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {formError && (
                                <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg">
                                    <AlertCircle size={20} />
                                    <span>{formError}</span>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Coupon Code *
                                </label>
                                <input
                                    type="text"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                    placeholder="E.g., SAVE20"
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] font-mono uppercase"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <input
                                    type="text"
                                    value={formData.description || ''}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="E.g., Get 20% off on your first order"
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Discount Type *
                                    </label>
                                    <select
                                        value={formData.discount_type}
                                        onChange={(e) => setFormData({ ...formData, discount_type: e.target.value as 'percentage' | 'fixed' })}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                    >
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed">Fixed Amount (₹)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Discount Value *
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.discount_value}
                                        onChange={(e) => setFormData({ ...formData, discount_value: Number(e.target.value) })}
                                        min={0}
                                        max={formData.discount_type === 'percentage' ? 100 : undefined}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Min Order Value (₹)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.min_order_value || ''}
                                        onChange={(e) => setFormData({ ...formData, min_order_value: e.target.value ? Number(e.target.value) : null })}
                                        min={0}
                                        placeholder="No minimum"
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Max Discount (₹)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.max_discount || ''}
                                        onChange={(e) => setFormData({ ...formData, max_discount: e.target.value ? Number(e.target.value) : null })}
                                        min={0}
                                        placeholder="No maximum"
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Valid From
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={formData.valid_from?.slice(0, 16) || ''}
                                        onChange={(e) => setFormData({ ...formData, valid_from: e.target.value ? new Date(e.target.value).toISOString() : null })}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Valid Until
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={formData.valid_until?.slice(0, 16) || ''}
                                        onChange={(e) => setFormData({ ...formData, valid_until: e.target.value ? new Date(e.target.value).toISOString() : null })}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Usage Limit
                                </label>
                                <input
                                    type="number"
                                    value={formData.usage_limit || ''}
                                    onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value ? Number(e.target.value) : null })}
                                    min={1}
                                    placeholder="Unlimited"
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={formData.is_active}
                                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                    className="w-4 h-4 text-[var(--color-primary)] rounded"
                                />
                                <label htmlFor="is_active" className="text-sm text-gray-700">
                                    Active (coupon can be used by customers)
                                </label>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                                >
                                    {saving ? 'Saving...' : editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
