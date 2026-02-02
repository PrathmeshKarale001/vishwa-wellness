'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, ProductVariant } from '@/types';

export interface CartItem {
    product: Product;
    quantity: number;
    variant?: ProductVariant;
}

interface CartState {
    items: CartItem[];
    isOpen: boolean;

    // Actions
    addItem: (product: Product, quantity?: number, variant?: ProductVariant) => void;
    removeItem: (productId: string, variantId?: string) => void;
    updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
    clearCart: () => void;
    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;

    // Computed
    getItemCount: () => number;
    getSubtotal: () => number;
    getShipping: () => number;
    getTotal: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,

            addItem: (product, quantity = 1, variant) => {
                set((state) => {
                    const existingIndex = state.items.findIndex(
                        (item) =>
                            item.product.id === product.id &&
                            item.variant?.id === variant?.id
                    );

                    if (existingIndex > -1) {
                        // Update existing item quantity
                        const newItems = [...state.items];
                        newItems[existingIndex] = {
                            ...newItems[existingIndex],
                            quantity: newItems[existingIndex].quantity + quantity,
                        };
                        return { items: newItems, isOpen: true };
                    }

                    // Add new item
                    return {
                        items: [...state.items, { product, quantity, variant }],
                        isOpen: true,
                    };
                });
            },

            removeItem: (productId, variantId) => {
                set((state) => ({
                    items: state.items.filter(
                        (item) =>
                            !(item.product.id === productId && item.variant?.id === variantId)
                    ),
                }));
            },

            updateQuantity: (productId, quantity, variantId) => {
                if (quantity <= 0) {
                    get().removeItem(productId, variantId);
                    return;
                }

                set((state) => ({
                    items: state.items.map((item) =>
                        item.product.id === productId && item.variant?.id === variantId
                            ? { ...item, quantity }
                            : item
                    ),
                }));
            },

            clearCart: () => set({ items: [] }),

            openCart: () => set({ isOpen: true }),
            closeCart: () => set({ isOpen: false }),
            toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

            getItemCount: () => {
                return get().items.reduce((total, item) => total + item.quantity, 0);
            },

            getSubtotal: () => {
                return get().items.reduce((total, item) => {
                    // product.price is already the sale/discounted price from Sanity
                    const price = item.variant?.price ?? item.product.price;
                    return total + price * item.quantity;
                }, 0);
            },

            getShipping: () => {
                // Free shipping on all orders
                return 0;
            },

            getTotal: () => {
                return get().getSubtotal() + get().getShipping();
            },
        }),
        {
            name: 'vishwa-cart',
            partialize: (state) => ({ items: state.items }), // Only persist items
        }
    )
);
