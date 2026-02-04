// Review Types

export type ReviewStatus = 'pending' | 'approved' | 'rejected' | 'flagged';

export interface Review {
    id: string;
    product_id: string;
    user_id: string | null;
    user_name: string | null;
    rating: number;
    title: string | null;
    content: string | null;
    is_verified: boolean;
    is_approved: boolean; // Legacy, use status instead
    status: ReviewStatus;
    moderation_notes: string | null;
    moderated_by: string | null;
    moderated_at: string | null;
    created_at: string;
    updated_at: string;
    // Joined fields
    profiles?: {
        full_name: string | null;
        avatar_url: string | null;
    };
}

export interface AdminReview extends Review {
    product_title?: string;
    moderator_name?: string;
}

export interface ReviewStats {
    totalReviews: number;
    pendingCount: number;
    approvedCount: number;
    rejectedCount: number;
    averageRating: number;
}

export interface ReviewFilters {
    status?: ReviewStatus | 'all';
    rating?: number;
    productId?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
}

// Status display configuration
export const REVIEW_STATUS_CONFIG: Record<ReviewStatus, {
    label: string;
    color: string;
    bgColor: string;
    icon: string;
}> = {
    pending: {
        label: 'Pending',
        color: '#92400e',
        bgColor: '#fef3c7',
        icon: 'Clock'
    },
    approved: {
        label: 'Approved',
        color: '#166534',
        bgColor: '#dcfce7',
        icon: 'CheckCircle'
    },
    rejected: {
        label: 'Rejected',
        color: '#991b1b',
        bgColor: '#fee2e2',
        icon: 'XCircle'
    },
    flagged: {
        label: 'Flagged',
        color: '#c2410c',
        bgColor: '#ffedd5',
        icon: 'Flag'
    },
};
