'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types';
import { getSupabaseClient } from '@/lib/supabase';

interface WishlistState {
    items: Product[];
    isLoading: boolean;

    // Actions
    addItem: (product: Product) => void;
    removeItem: (productId: string) => void;
    toggleItem: (product: Product) => void;
    clearWishlist: () => void;
    isInWishlist: (productId: string) => boolean;

    // Sync actions
    syncWithDatabase: (userId: string) => Promise<void>;
    uploadToDatabase: (userId: string) => Promise<void>;
    clearAndUpload: (userId: string) => Promise<void>;

    // Computed
    getItemCount: () => number;
}

export const useWishlistStore = create<WishlistState>()(
    persist(
        (set, get) => ({
            items: [],
            isLoading: false,

            addItem: (product) => {
                set((state) => {
                    const exists = state.items.some((item) => item.id === product.id);
                    if (exists) return state;
                    return { items: [...state.items, product] };
                });
            },

            removeItem: (productId) => {
                set((state) => ({
                    items: state.items.filter((item) => item.id !== productId),
                }));
            },

            toggleItem: (product) => {
                const exists = get().isInWishlist(product.id);
                if (exists) {
                    get().removeItem(product.id);
                } else {
                    get().addItem(product);
                }
            },

            clearWishlist: () => set({ items: [] }),

            isInWishlist: (productId) => {
                return get().items.some((item) => item.id === productId);
            },

            getItemCount: () => {
                return get().items.length;
            },

            // Sync wishlist from database (merge with local)
            syncWithDatabase: async (userId: string) => {
                set({ isLoading: true });
                const supabase = getSupabaseClient();

                try {
                    // Fetch wishlist from database
                    const { data, error } = await supabase
                        .from('wishlists')
                        .select('product_id, product_data')
                        .eq('user_id', userId);

                    if (error) {
                        console.error('Error fetching wishlist:', error);
                        set({ isLoading: false });
                        return;
                    }

                    // Get current local items
                    const localItems = get().items;
                    const localProductIds = new Set(localItems.map(item => item.id));

                    // Merge: add database items that aren't in local
                    const dbProducts: Product[] = (data || [])
                        .map((item: { product_data: Product }) => item.product_data as Product)
                        .filter((product: Product | null) => product && !localProductIds.has(product.id));

                    // Combine local and new database items
                    const mergedItems = [...localItems, ...dbProducts];

                    set({ items: mergedItems, isLoading: false });

                    // Upload any local-only items to database
                    const dbProductIds = new Set((data || []).map((item: { product_id: string }) => item.product_id));
                    const localOnlyItems = localItems.filter(item => !dbProductIds.has(item.id));

                    if (localOnlyItems.length > 0) {
                        const insertData = localOnlyItems.map(product => ({
                            user_id: userId,
                            product_id: product.id,
                            product_data: product,
                        }));

                        await supabase.from('wishlists').upsert(insertData, {
                            onConflict: 'user_id,product_id'
                        });
                    }
                } catch (err) {
                    console.error('Wishlist sync error:', err);
                    set({ isLoading: false });
                }
            },

            // Upload current wishlist to database
            uploadToDatabase: async (userId: string) => {
                const supabase = getSupabaseClient();
                const items = get().items;

                if (items.length === 0) return;

                try {
                    const insertData = items.map(product => ({
                        user_id: userId,
                        product_id: product.id,
                        product_data: product,
                    }));

                    await supabase.from('wishlists').upsert(insertData, {
                        onConflict: 'user_id,product_id'
                    });
                } catch (err) {
                    console.error('Wishlist upload error:', err);
                }
            },

            // Clear local wishlist and sync fresh from database
            clearAndUpload: async (userId: string) => {
                set({ isLoading: true });
                const supabase = getSupabaseClient();

                try {
                    // First, delete all existing wishlist items for this user
                    await supabase
                        .from('wishlists')
                        .delete()
                        .eq('user_id', userId);

                    // Then upload current local items
                    await get().uploadToDatabase(userId);

                    set({ isLoading: false });
                } catch (err) {
                    console.error('Clear and upload error:', err);
                    set({ isLoading: false });
                }
            },
        }),
        {
            name: 'vishwa-wishlist',
        }
    )
);

// Helper function to add to database when user is logged in
export const addToWishlistWithSync = async (product: Product, userId?: string) => {
    const { addItem, uploadToDatabase } = useWishlistStore.getState();
    addItem(product);

    if (userId) {
        const supabase = getSupabaseClient();
        await supabase.from('wishlists').upsert({
            user_id: userId,
            product_id: product.id,
            product_data: product,
        }, { onConflict: 'user_id,product_id' });
    }
};

// Helper function to remove from database when user is logged in
export const removeFromWishlistWithSync = async (productId: string, userId?: string) => {
    const { removeItem } = useWishlistStore.getState();
    removeItem(productId);

    if (userId) {
        const supabase = getSupabaseClient();
        await supabase
            .from('wishlists')
            .delete()
            .eq('user_id', userId)
            .eq('product_id', productId);
    }
};
