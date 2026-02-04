'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, ProductVariant } from '@/types';

export interface CartItem {
    product: Product;
    quantity: number;
    variant?: ProductVariant;
    addedAt: number; // Timestamp for expiration
}

interface CartState {
    items: CartItem[];
    isOpen: boolean;
    lastUpdated: number;

    // Actions
    addItem: (product: Product, quantity?: number, variant?: ProductVariant) => void;
    removeItem: (productId: string, variantId?: string) => void;
    updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
    clearCart: () => void;
    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;

    // New features
    validateAndCleanCart: () => Promise<{ valid: boolean; removedItems: string[] }>;
    syncWithDatabase: (userId: string) => Promise<void>;
    loadFromDatabase: (userId: string) => Promise<void>;
    checkExpiration: () => void;

    // Computed
    getItemCount: () => number;
    getSubtotal: () => number;
    getShipping: () => number;
    getTotal: () => number;
    isExpired: () => boolean;
}

// Cart expiration time (24 hours for guests)
const CART_EXPIRATION_MS = 24 * 60 * 60 * 1000;

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,
            lastUpdated: Date.now(),

            addItem: (product, quantity = 1, variant) => {
                // Check stock before adding
                const currentStock = product.stock ?? 999;
                const existingItem = get().items.find(
                    (item) => item.product.id === product.id && item.variant?.id === variant?.id
                );
                const currentQty = existingItem?.quantity ?? 0;

                if (currentQty + quantity > currentStock) {
                    console.warn(`Cannot add ${quantity} items. Only ${currentStock - currentQty} available.`);
                    return;
                }

                set((state) => {
                    const existingIndex = state.items.findIndex(
                        (item) =>
                            item.product.id === product.id &&
                            item.variant?.id === variant?.id
                    );

                    if (existingIndex > -1) {
                        const newItems = [...state.items];
                        newItems[existingIndex] = {
                            ...newItems[existingIndex],
                            quantity: newItems[existingIndex].quantity + quantity,
                        };
                        return { items: newItems, isOpen: true, lastUpdated: Date.now() };
                    }

                    return {
                        items: [...state.items, { product, quantity, variant, addedAt: Date.now() }],
                        isOpen: true,
                        lastUpdated: Date.now(),
                    };
                });
            },

            removeItem: (productId, variantId) => {
                set((state) => ({
                    items: state.items.filter(
                        (item) =>
                            !(item.product.id === productId && item.variant?.id === variantId)
                    ),
                    lastUpdated: Date.now(),
                }));
            },

            updateQuantity: (productId, quantity, variantId) => {
                if (quantity <= 0) {
                    get().removeItem(productId, variantId);
                    return;
                }

                // Check stock before updating
                const item = get().items.find(
                    (i) => i.product.id === productId && i.variant?.id === variantId
                );
                if (item) {
                    const maxStock = item.product.stock ?? 999;
                    if (quantity > maxStock) {
                        console.warn(`Cannot set quantity to ${quantity}. Max stock: ${maxStock}`);
                        return;
                    }
                }

                set((state) => ({
                    items: state.items.map((item) =>
                        item.product.id === productId && item.variant?.id === variantId
                            ? { ...item, quantity }
                            : item
                    ),
                    lastUpdated: Date.now(),
                }));
            },

            clearCart: () => set({ items: [], lastUpdated: Date.now() }),

            openCart: () => set({ isOpen: true }),
            closeCart: () => set({ isOpen: false }),
            toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

            // Validate cart items against current inventory
            validateAndCleanCart: async () => {
                const items = get().items;
                if (items.length === 0) return { valid: true, removedItems: [] };

                try {
                    const response = await fetch('/api/cart/validate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            items: items.map(i => ({
                                productId: i.product.id,
                                variantId: i.variant?.id,
                                quantity: i.quantity,
                            })),
                        }),
                    });

                    if (!response.ok) {
                        return { valid: false, removedItems: [] };
                    }

                    const result = await response.json();

                    if (result.invalidItems?.length > 0) {
                        // Remove invalid items from cart
                        set((state) => ({
                            items: state.items.filter(
                                (item) => !result.invalidItems.includes(item.product.id)
                            ),
                            lastUpdated: Date.now(),
                        }));
                    }

                    return {
                        valid: result.invalidItems?.length === 0,
                        removedItems: result.invalidItems ?? [],
                    };
                } catch (error) {
                    console.error('Failed to validate cart:', error);
                    return { valid: true, removedItems: [] }; // Fail open
                }
            },

            // Sync cart to database for logged-in users
            syncWithDatabase: async (userId: string) => {
                const items = get().items;

                try {
                    await fetch('/api/cart', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId, items }),
                    });
                } catch (error) {
                    console.error('Failed to sync cart:', error);
                }
            },

            // Load cart from database for logged-in users
            loadFromDatabase: async (userId: string) => {
                try {
                    const response = await fetch(`/api/cart?userId=${userId}`);
                    if (response.ok) {
                        const data = await response.json();
                        if (data.items?.length > 0) {
                            // Merge with local cart (prefer higher quantities)
                            const localItems = get().items;
                            const mergedItems = [...data.items];

                            localItems.forEach((localItem) => {
                                const dbItem = mergedItems.find(
                                    (i) => i.product.id === localItem.product.id &&
                                        i.variant?.id === localItem.variant?.id
                                );
                                if (!dbItem) {
                                    mergedItems.push(localItem);
                                } else if (localItem.quantity > dbItem.quantity) {
                                    dbItem.quantity = localItem.quantity;
                                }
                            });

                            set({ items: mergedItems, lastUpdated: Date.now() });
                        }
                    }
                } catch (error) {
                    console.error('Failed to load cart from database:', error);
                }
            },

            // Check and handle cart expiration
            checkExpiration: () => {
                const { lastUpdated, items } = get();
                const now = Date.now();

                if (items.length > 0 && now - lastUpdated > CART_EXPIRATION_MS) {
                    console.log('Cart expired, clearing items');
                    set({ items: [], lastUpdated: now });
                }
            },

            getItemCount: () => {
                return get().items.reduce((total, item) => total + item.quantity, 0);
            },

            getSubtotal: () => {
                return get().items.reduce((total, item) => {
                    const price = item.variant?.price ?? item.product.price;
                    return total + price * item.quantity;
                }, 0);
            },

            getShipping: () => {
                return 0; // Free shipping
            },

            getTotal: () => {
                return get().getSubtotal() + get().getShipping();
            },

            isExpired: () => {
                const { lastUpdated, items } = get();
                return items.length > 0 && Date.now() - lastUpdated > CART_EXPIRATION_MS;
            },
        }),
        {
            name: 'vishwa-cart',
            partialize: (state) => ({
                items: state.items,
                lastUpdated: state.lastUpdated,
            }),
        }
    )
);
