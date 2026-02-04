'use client';

import { useState, useEffect } from 'react';
import StarRating from '@/components/product/StarRating';
import RatingDistribution from './RatingDistribution';
import ReviewCard, { Review } from './ReviewCard';
import ReviewForm from './ReviewForm';
import { createClient } from '@/lib/supabase-client';
import { ReviewsSkeleton } from '@/components/skeletons/ProductSkeletons';

interface ReviewsSectionProps {
    productId: string;
    initialRating?: number;
    initialReviewCount?: number;
}

export default function ReviewsSection({ productId, initialRating = 0, initialReviewCount = 0 }: ReviewsSectionProps) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [filterRating, setFilterRating] = useState<number | 'all'>('all');
    const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'highest' | 'lowest'>('recent');

    const [stats, setStats] = useState({
        averageRating: initialRating,
        totalReviews: initialReviewCount,
        distribution: {
            5: 0,
            4: 0,
            3: 0,
            2: 0,
            1: 0,
        },
    });

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    useEffect(() => {
        applyFiltersAndSort();
    }, [reviews, filterRating, sortBy]);

    const fetchReviews = async () => {
        setIsLoading(true);
        try {
            const supabase = createClient();
            const { data, error } = await supabase
                .from('reviews')
                .select(`
                    id,
                    product_id,
                    rating,
                    title,
                    content,
                    is_verified,
                    created_at,
                    user_name,
                    profiles (
                        full_name,
                        avatar_url
                    )
                `)
                .eq('product_id', productId)
                .eq('status', 'approved')
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Map to expected Review format
            const mappedReviews: Review[] = (data || []).map((r: any) => ({
                id: r.id,
                product_id: r.product_id,
                user_name: r.user_name || r.profiles?.full_name || 'Anonymous',
                rating: r.rating,
                title: r.title,
                review_text: r.content,
                verified_purchase: r.is_verified,
                created_at: r.created_at
            }));

            setReviews(mappedReviews);
            calculateStats(mappedReviews);
        } catch (err) {
            console.error('Error fetching reviews:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const calculateStats = (reviewsData: Review[]) => {
        if (reviewsData.length === 0) {
            setStats({
                averageRating: 0,
                totalReviews: 0,
                distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
            });
            return;
        }

        const distribution = reviewsData.reduce(
            (acc, review) => {
                acc[review.rating as keyof typeof acc]++;
                return acc;
            },
            { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        );

        const totalRating = reviewsData.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / reviewsData.length;

        setStats({
            averageRating: Math.round(averageRating * 10) / 10,
            totalReviews: reviewsData.length,
            distribution,
        });
    };

    const applyFiltersAndSort = () => {
        let filtered = [...reviews];

        // Apply rating filter
        if (filterRating !== 'all') {
            filtered = filtered.filter((review) => review.rating === filterRating);
        }

        // Apply sorting
        switch (sortBy) {
            case 'recent':
                filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                break;
            case 'highest':
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            case 'lowest':
                filtered.sort((a, b) => a.rating - b.rating);
                break;
            // 'helpful' would require a helpful_count field
        }

        setFilteredReviews(filtered);
    };

    if (isLoading) {
        return <ReviewsSkeleton />;
    }

    return (
        <div className="space-y-8">
            {/* Overview Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-8 border-b border-gray-200">
                {/* Left: Average Rating */}
                <div className="flex flex-col items-center justify-center text-center p-6 bg-gray-50 rounded-lg">
                    <div className="text-6xl font-bold text-gray-900 mb-2">
                        {stats.averageRating.toFixed(1)}
                    </div>
                    <StarRating rating={stats.averageRating} size="lg" />
                    <p className="text-sm text-gray-600 mt-2">
                        Based on {stats.totalReviews} {stats.totalReviews === 1 ? 'review' : 'reviews'}
                    </p>
                </div>

                {/* Right: Rating Distribution */}
                <div className="flex flex-col justify-center">
                    <h4 className="font-semibold text-gray-900 mb-4">Rating Breakdown</h4>
                    <RatingDistribution ratings={stats.distribution} totalReviews={stats.totalReviews} />
                </div>
            </div>

            {/* Write Review Button */}
            <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-900">Customer Reviews</h3>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn-outline px-6 py-2"
                >
                    {showForm ? 'Cancel' : 'Write a Review'}
                </button>
            </div>

            {/* Review Form */}
            {showForm && (
                <ReviewForm
                    productId={productId}
                    onSuccess={() => {
                        setShowForm(false);
                        fetchReviews(); // Refresh reviews
                    }}
                />
            )}

            {/* Filters & Sort */}
            {reviews.length > 0 && (
                <div className="flex flex-wrap gap-4 items-center justify-between">
                    {/* Filter by Rating */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">Filter:</span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilterRating('all')}
                                className={`px-3 py-1 text-sm rounded-lg transition-colors ${filterRating === 'all'
                                    ? 'bg-[var(--color-primary)] text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                All
                            </button>
                            {[5, 4, 3, 2, 1].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setFilterRating(star)}
                                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${filterRating === star
                                        ? 'bg-[var(--color-primary)] text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {star}★
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sort Options */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">Sort by:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                            className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                        >
                            <option value="recent">Most Recent</option>
                            <option value="highest">Highest Rating</option>
                            <option value="lowest">Lowest Rating</option>
                        </select>
                    </div>
                </div>
            )}

            {/* Reviews List */}
            {filteredReviews.length > 0 ? (
                <div className="space-y-6">
                    {filteredReviews.map((review) => (
                        <ReviewCard key={review.id} review={review} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-gray-600">
                        {filterRating === 'all'
                            ? 'No reviews yet. Be the first to review this product!'
                            : `No ${filterRating}-star reviews yet.`}
                    </p>
                </div>
            )}
        </div>
    );
}
