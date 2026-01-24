'use client';

import { useEffect, useState } from 'react';
import { useQuickViewStore } from '@/lib/quickViewStore';
import QuickViewModal from './QuickViewModal';

export default function QuickViewWrapper() {
    const { product, isOpen, closeQuickView } = useQuickViewStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <QuickViewModal
            product={product}
            isOpen={isOpen}
            onClose={closeQuickView}
        />
    );
}
