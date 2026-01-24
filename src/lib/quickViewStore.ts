'use client';

import { create } from 'zustand';
import { Product } from '@/types';

interface QuickViewState {
    product: Product | null;
    isOpen: boolean;
    openQuickView: (product: Product) => void;
    closeQuickView: () => void;
}

export const useQuickViewStore = create<QuickViewState>((set) => ({
    product: null,
    isOpen: false,
    openQuickView: (product) => set({ product, isOpen: true }),
    closeQuickView: () => set({ product: null, isOpen: false }),
}));
