'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Star, Package, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/lib/authStore';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { getSupabaseClient } from '@/lib/supabase';

interface Review {
    id: string;
    product_id: string;
    rating: number;
    title: string | null;
    content: string | null;
    is_verified: boolean;
    is_approved: boolean;
    created_at: string;
}

interface Order {
    id: string;
    order_number: string;
    items: Array<{
        product_id: string;
        product_title: string;
        image: string | null;
    }>;
    status: string;
    created_at: string;
}

function ReviewsContent() {
    const { user } = useAuthStore();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [eligibleProducts, setEligibleProducts] = useState<Order['items']>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Order['items'][0] | null>(null);
    const [submitLoading, setSubmitLoading] = useState(false);

    const [reviewForm, setReviewForm] = useState({
        rating: 5,
        title: '',
        content: '',
    });

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        const supabase = getSupabaseClient();

        // Fetch user's reviews
        const { data: reviewsData } = await supabase
            .from('reviews')
            .select('*')
            .eq('user_id', user?.id)
            .order('created_at', { ascending: false });

        if (reviewsData) {
            setReviews(reviewsData as Review[]);
        }

        // Fetch delivered orders to find products eligible for review
        const { data: ordersData } = await supabase
            .from('orders')
            .select('id, order_number, items, status, created_at')
            .eq('user_id', user?.id)
            .eq('status', 'delivered');

        if (ordersData) {
            const reviewedProductIds = new Set((reviewsData || []).map((r: Review) => r.product_id));
            const eligible: Order['items'] = [];

            (ordersData as Order[]).forEach(order => {
                order.items.forEach(item => {
                    if (!reviewedProductIds.has(item.product_id) &&
                        !eligible.some(e => e.product_id === item.product_id)) {
                        eligible.push(item);
                    }
                });
            });

            setEligibleProducts(eligible);
        }

        setIsLoading(false);
    };

    const handleSubmitReview = async () => {
        if (!selectedProduct || !user) return;

        setSubmitLoading(true);
        const supabase = getSupabaseClient();

        const { error } = await supabase.from('reviews').insert({
            user_id: user.id,
            product_id: selectedProduct.product_id,
            rating: reviewForm.rating,
            title: reviewForm.title || null,
            content: reviewForm.content || null,
            is_verified: true,
            is_approved: true,
        });

        if (!error) {
            setShowReviewForm(false);
            setSelectedProduct(null);
            setReviewForm({ rating: 5, title: '', content: '' });
            fetchData();
        }

        setSubmitLoading(false);
    };

    const renderStars = (rating: number, interactive = false, onChange?: (r: number) => void) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => interactive && onChange?.(star)}
                        className={interactive ? 'cursor-pointer' : 'cursor-default'}
                        disabled={!interactive}
                    >
                        <Star
                            size={interactive ? 24 : 16}
                            className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                        />
                    </button>
                ))}
            </div>
        );
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
                        <span className="text-[#222]">My Reviews</span>
                    </div>
                </div>
            </div>

            {/* Page Header */}
            <div className="bg-[#f5f2f2] py-8">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-3xl font-bold text-[#222]" style={{ fontFamily: 'var(--font-heading)' }}>
                        My Reviews
                    </h1>
                    <p className="text-[#777] mt-2">Rate and review your purchased products</p>
                </div>
            </div>

            <section className="section-padding">
                <div className="max-w-4xl mx-auto px-4">
                    {isLoading ? (
                        <div className="text-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[var(--color-primary)]" />
                            <p className="text-[#777]">Loading reviews...</p>
                        </div>
                    ) : (
                        <>
                            {/* Products Eligible for Review */}
                            {eligibleProducts.length > 0 && (
                                <div className="mb-8">
                                    <h2 className="text-lg font-semibold text-[#222] mb-4">Products to Review</h2>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {eligibleProducts.map(product => (
                                            <div key={product.product_id} className="bg-white border border-[#eee] p-4 flex items-center gap-4">
                                                <div className="w-16 h-16 bg-[#f5f5f5] flex items-center justify-center flex-shrink-0">
                                                    <Package className="text-[#999]" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium text-[#222] text-sm">{product.product_title}</p>
                                                </div>
                                                <button
                                                    onClick={() => { setSelectedProduct(product); setShowReviewForm(true); }}
                                                    className="btn-outline text-xs px-3 py-1"
                                                >
                                                    Write Review
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Review Form Modal */}
                            {showReviewForm && selectedProduct && (
                                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                                    <div className="bg-white max-w-lg w-full p-6">
                                        <h2 className="text-xl font-semibold text-[#222] mb-4">
                                            Review: {selectedProduct.product_title}
                                        </h2>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-[#222] mb-2">Rating</label>
                                                {renderStars(reviewForm.rating, true, (r) => setReviewForm(prev => ({ ...prev, rating: r })))}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-[#222] mb-1">Title (Optional)</label>
                                                <input
                                                    type="text"
                                                    value={reviewForm.title}
                                                    onChange={(e) => setReviewForm(prev => ({ ...prev, title: e.target.value }))}
                                                    className="w-full px-4 py-2 border border-[#ddd] focus:outline-none focus:border-[var(--color-primary)]"
                                                    placeholder="Summarize your experience"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-[#222] mb-1">Your Review</label>
                                                <textarea
                                                    value={reviewForm.content}
                                                    onChange={(e) => setReviewForm(prev => ({ ...prev, content: e.target.value }))}
                                                    className="w-full px-4 py-2 border border-[#ddd] focus:outline-none focus:border-[var(--color-primary)] h-32"
                                                    placeholder="Share your experience with this product..."
                                                />
                                            </div>
                                        </div>

                                        <div className="flex gap-4 mt-6">
                                            <button
                                                onClick={handleSubmitReview}
                                                disabled={submitLoading}
                                                className="btn-solid flex items-center gap-2"
                                            >
                                                {submitLoading && <Loader2 size={16} className="animate-spin" />}
                                                Submit Review
                                            </button>
                                            <button
                                                onClick={() => { setShowReviewForm(false); setSelectedProduct(null); }}
                                                className="btn-outline"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Existing Reviews */}
                            <div>
                                <h2 className="text-lg font-semibold text-[#222] mb-4">Your Reviews ({reviews.length})</h2>
                                {reviews.length === 0 ? (
                                    <div className="bg-white border border-[#eee] p-8 text-center">
                                        <Star className="w-12 h-12 text-[#ddd] mx-auto mb-4" />
                                        <p className="text-[#777]">You haven&apos;t written any reviews yet</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {reviews.map(review => (
                                            <div key={review.id} className="bg-white border border-[#eee] p-4">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        {renderStars(review.rating)}
                                                        {review.title && (
                                                            <h3 className="font-medium text-[#222] mt-1">{review.title}</h3>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {review.is_verified && (
                                                            <span className="text-xs bg-green-100 text-green-600 px-2 py-1">Verified Purchase</span>
                                                        )}
                                                        {!review.is_approved && (
                                                            <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1">Pending Approval</span>
                                                        )}
                                                    </div>
                                                </div>
                                                {review.content && (
                                                    <p className="text-sm text-[#777]">{review.content}</p>
                                                )}
                                                <p className="text-xs text-[#999] mt-2">
                                                    {new Date(review.created_at).toLocaleDateString('en-IN', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </section>
        </>
    );
}

export default function ReviewsPage() {
    return (
        <AuthGuard>
            <ReviewsContent />
        </AuthGuard>
    );
}
