import { createClient } from '@sanity/client';

export const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    useCdn: false, // Disable CDN for real-time updates during dev
});

// Helper to check if Sanity is configured
export const isSanityConfigured = () => {
    return !!(
        process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
        process.env.NEXT_PUBLIC_SANITY_DATASET
    );
};
