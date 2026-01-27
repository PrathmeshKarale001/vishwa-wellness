'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistStore {
    wishlistIds: Set<string>;
    isInWishlist: (productId: string) => boolean;
    addToWishlist: (productId: string) => Promise<void>;
    removeFromWishlist: (productId: string) => Promise<void>;
    syncWithServer: () => Promise<void>;
    isLoading: boolean;
}

export const useWishlist = create<WishlistStore>()(
    persist(
        (set, get) => ({
            wishlistIds: new Set<string>(),
            isLoading: false,

            isInWishlist: (productId: string) => {
                return get().wishlistIds.has(productId);
            },

            addToWishlist: async (productId: string) => {
                set({ isLoading: true });
                try {
                    const response = await fetch('/api/wishlist', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ productId }),
                    });

                    if (!response.ok) throw new Error('Failed to add to wishlist');

                    set((state) => {
                        const newIds = new Set(state.wishlistIds);
                        newIds.add(productId);
                        return { wishlistIds: newIds };
                    });
                } catch (error) {
                    console.error('Add to wishlist error:', error);
                    throw error;
                } finally {
                    set({ isLoading: false });
                }
            },

            removeFromWishlist: async (productId: string) => {
                set({ isLoading: true });
                try {
                    const response = await fetch(`/api/wishlist?productId=${productId}`, {
                        method: 'DELETE',
                    });

                    if (!response.ok) throw new Error('Failed to remove from wishlist');

                    set((state) => {
                        const newIds = new Set(state.wishlistIds);
                        newIds.delete(productId);
                        return { wishlistIds: newIds };
                    });
                } catch (error) {
                    console.error('Remove from wishlist error:', error);
                    throw error;
                } finally {
                    set({ isLoading: false });
                }
            },

            syncWithServer: async () => {
                try {
                    const response = await fetch('/api/wishlist');
                    if (!response.ok) {
                        // User not authenticated, clear wishlist
                        set({ wishlistIds: new Set<string>() });
                        return;
                    }

                    const data = await response.json();
                    const serverIds = new Set<string>(data.items.map((item: { product_id: string }) => item.product_id));
                    set({ wishlistIds: serverIds });
                } catch (error) {
                    console.error('Sync wishlist error:', error);
                }
            },
        }),
        {
            name: 'wishlist-storage',
            partialize: (state) => ({ wishlistIds: Array.from(state.wishlistIds) }),
            merge: (persistedState: any, currentState) => ({
                ...currentState,
                wishlistIds: new Set<string>(persistedState?.wishlistIds || []),
            }),
        }
    )
);
