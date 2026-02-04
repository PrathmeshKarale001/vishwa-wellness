'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Star, CheckCircle, XCircle, Clock, Flag, Trash2,
    ChevronLeft, Search, Filter, ChevronDown, Loader2,
    ArrowLeft, Eye
} from 'lucide-react';
import { useAuthStore } from '@/lib/authStore';
import { getUserRole } from '@/lib/rbac';
import type { UserRole } from '@/types/orders';
import type { Review, ReviewStatus, ReviewStats, REVIEW_STATUS_CONFIG } from '@/types/reviews';

const STATUS_CONFIG: Record<ReviewStatus, {
    label: string;
    color: string;
    bgColor: string;
    icon: typeof Clock;
}> = {
    pending: { label: 'Pending', color: '#92400e', bgColor: '#fef3c7', icon: Clock },
    approved: { label: 'Approved', color: '#166534', bgColor: '#dcfce7', icon: CheckCircle },
    rejected: { label: 'Rejected', color: '#991b1b', bgColor: '#fee2e2', icon: XCircle },
    flagged: { label: 'Flagged', color: '#c2410c', bgColor: '#ffedd5', icon: Flag },
};

export default function AdminReviewsPage() {
    const router = useRouter();
    const { user, isInitialized } = useAuthStore();
    const [userRole, setUserRole] = useState<UserRole | null>(null);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [stats, setStats] = useState<ReviewStats | null>(null);
    const [selectedReviews, setSelectedReviews] = useState<string[]>([]);

    // Filters
    const [statusFilter, setStatusFilter] = useState<ReviewStatus | 'all'>('all');
    const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    // Pagination
    const [page, setPage] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const limit = 20;

    // Action states
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        async function checkAccess() {
            if (!isInitialized) return;

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
            await Promise.all([fetchReviews(), fetchStats()]);
            setLoading(false);
        }

        checkAccess();
    }, [user, isInitialized, router]);

    useEffect(() => {
        if (userRole) {
            fetchReviews();
        }
    }, [statusFilter, ratingFilter, searchQuery, page]);

    async function fetchReviews() {
        try {
            const params = new URLSearchParams();
            if (statusFilter !== 'all') params.set('status', statusFilter);
            if (ratingFilter !== 'all') params.set('rating', String(ratingFilter));
            if (searchQuery) params.set('search', searchQuery);
            params.set('limit', String(limit));
            params.set('offset', String(page * limit));

            const response = await fetch(`/api/admin/reviews?${params}`);
            if (response.ok) {
                const data = await response.json();
                setReviews(data.reviews || []);
                setTotalCount(data.count || 0);
            }
        } catch (error) {
            console.error('Failed to fetch reviews:', error);
        }
    }

    async function fetchStats() {
        try {
            const response = await fetch('/api/admin/reviews/stats');
            if (response.ok) {
                const data = await response.json();
                setStats(data);
            }
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    }

    async function handleStatusUpdate(reviewId: string, status: ReviewStatus) {
        setActionLoading(reviewId);
        try {
            const response = await fetch(`/api/admin/reviews/${reviewId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });

            if (response.ok) {
                await Promise.all([fetchReviews(), fetchStats()]);
            }
        } catch (error) {
            console.error('Failed to update review:', error);
        } finally {
            setActionLoading(null);
        }
    }

    async function handleBulkAction(status: ReviewStatus) {
        if (selectedReviews.length === 0) return;

        setActionLoading('bulk');
        try {
            const response = await fetch('/api/admin/reviews', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reviewIds: selectedReviews, status })
            });

            if (response.ok) {
                setSelectedReviews([]);
                await Promise.all([fetchReviews(), fetchStats()]);
            }
        } catch (error) {
            console.error('Failed to bulk update:', error);
        } finally {
            setActionLoading(null);
        }
    }

    async function handleDelete(reviewId: string) {
        if (!confirm('Are you sure you want to delete this review?')) return;

        setActionLoading(reviewId);
        try {
            const response = await fetch(`/api/admin/reviews/${reviewId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                await Promise.all([fetchReviews(), fetchStats()]);
            }
        } catch (error) {
            console.error('Failed to delete review:', error);
        } finally {
            setActionLoading(null);
        }
    }

    function toggleSelectAll() {
        if (selectedReviews.length === reviews.length) {
            setSelectedReviews([]);
        } else {
            setSelectedReviews(reviews.map(r => r.id));
        }
    }

    function toggleSelect(reviewId: string) {
        setSelectedReviews(prev =>
            prev.includes(reviewId)
                ? prev.filter(id => id !== reviewId)
                : [...prev, reviewId]
        );
    }

    function renderStars(rating: number) {
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map(star => (
                    <Star
                        key={star}
                        size={14}
                        className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                    />
                ))}
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
            </div>
        );
    }

    const totalPages = Math.ceil(totalCount / limit);

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
                            <h1 className="text-xl font-bold text-gray-900">Reviews Management</h1>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                {stats && (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <p className="text-sm text-gray-500">Total Reviews</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalReviews}</p>
                        </div>
                        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                            <p className="text-sm text-yellow-700">Pending</p>
                            <p className="text-2xl font-bold text-yellow-900">{stats.pendingCount}</p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                            <p className="text-sm text-green-700">Approved</p>
                            <p className="text-2xl font-bold text-green-900">{stats.approvedCount}</p>
                        </div>
                        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                            <p className="text-sm text-red-700">Rejected</p>
                            <p className="text-2xl font-bold text-red-900">{stats.rejectedCount}</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <p className="text-sm text-gray-500">Avg Rating</p>
                            <div className="flex items-center gap-2">
                                <p className="text-2xl font-bold text-gray-900">{stats.averageRating.toFixed(1)}</p>
                                <Star size={20} className="fill-yellow-400 text-yellow-400" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Filters & Search */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                    <div className="flex flex-wrap gap-4 items-center justify-between">
                        <div className="flex items-center gap-4">
                            {/* Status Filter */}
                            <select
                                value={statusFilter}
                                onChange={(e) => { setStatusFilter(e.target.value as ReviewStatus | 'all'); setPage(0); }}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[var(--color-primary)]"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                                <option value="flagged">Flagged</option>
                            </select>

                            {/* Rating Filter */}
                            <select
                                value={ratingFilter}
                                onChange={(e) => { setRatingFilter(e.target.value === 'all' ? 'all' : parseInt(e.target.value)); setPage(0); }}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[var(--color-primary)]"
                            >
                                <option value="all">All Ratings</option>
                                <option value="5">5 Stars</option>
                                <option value="4">4 Stars</option>
                                <option value="3">3 Stars</option>
                                <option value="2">2 Stars</option>
                                <option value="1">1 Star</option>
                            </select>
                        </div>

                        {/* Search */}
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search reviews..."
                                value={searchQuery}
                                onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
                                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[var(--color-primary)] w-64"
                            />
                        </div>
                    </div>

                    {/* Bulk Actions */}
                    {selectedReviews.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-4">
                            <span className="text-sm text-gray-600">{selectedReviews.length} selected</span>
                            <button
                                onClick={() => handleBulkAction('approved')}
                                disabled={actionLoading === 'bulk'}
                                className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50"
                            >
                                Approve All
                            </button>
                            <button
                                onClick={() => handleBulkAction('rejected')}
                                disabled={actionLoading === 'bulk'}
                                className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-50"
                            >
                                Reject All
                            </button>
                        </div>
                    )}
                </div>

                {/* Reviews Table */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr className="text-left text-sm text-gray-500">
                                <th className="p-4 w-12">
                                    <input
                                        type="checkbox"
                                        checked={reviews.length > 0 && selectedReviews.length === reviews.length}
                                        onChange={toggleSelectAll}
                                        className="rounded border-gray-300"
                                    />
                                </th>
                                <th className="p-4">Review</th>
                                <th className="p-4 w-32">Rating</th>
                                <th className="p-4 w-32">Status</th>
                                <th className="p-4 w-40">Date</th>
                                <th className="p-4 w-44">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reviews.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-500">
                                        <Star size={48} className="mx-auto mb-4 text-gray-300" />
                                        <p>No reviews found</p>
                                    </td>
                                </tr>
                            ) : (
                                reviews.map(review => {
                                    const statusConfig = STATUS_CONFIG[review.status || 'pending'];
                                    const StatusIcon = statusConfig.icon;
                                    return (
                                        <tr key={review.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="p-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedReviews.includes(review.id)}
                                                    onChange={() => toggleSelect(review.id)}
                                                    className="rounded border-gray-300"
                                                />
                                            </td>
                                            <td className="p-4">
                                                <div>
                                                    <p className="font-medium text-gray-900 line-clamp-1">
                                                        {review.title || 'No title'}
                                                    </p>
                                                    <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                                                        {review.content || 'No content'}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        By: {review.user_name || review.profiles?.full_name || 'Anonymous'}
                                                        {review.is_verified && (
                                                            <span className="ml-2 text-green-600">✓ Verified</span>
                                                        )}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                {renderStars(review.rating)}
                                            </td>
                                            <td className="p-4">
                                                <span
                                                    className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full"
                                                    style={{ backgroundColor: statusConfig.bgColor, color: statusConfig.color }}
                                                >
                                                    <StatusIcon size={12} />
                                                    {statusConfig.label}
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm text-gray-500">
                                                {new Date(review.created_at).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    {review.status !== 'approved' && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(review.id, 'approved')}
                                                            disabled={actionLoading === review.id}
                                                            className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                                                            title="Approve"
                                                        >
                                                            <CheckCircle size={18} />
                                                        </button>
                                                    )}
                                                    {review.status !== 'rejected' && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(review.id, 'rejected')}
                                                            disabled={actionLoading === review.id}
                                                            className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                                            title="Reject"
                                                        >
                                                            <XCircle size={18} />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDelete(review.id)}
                                                        disabled={actionLoading === review.id}
                                                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="p-4 border-t border-gray-200 flex items-center justify-between">
                            <p className="text-sm text-gray-500">
                                Showing {page * limit + 1} - {Math.min((page + 1) * limit, totalCount)} of {totalCount}
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setPage(p => Math.max(0, p - 1))}
                                    disabled={page === 0}
                                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                                >
                                    Previous
                                </button>
                                <span className="text-sm text-gray-600">
                                    Page {page + 1} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                                    disabled={page >= totalPages - 1}
                                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
