'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import QuickViewWrapper from '@/components/shop/QuickViewWrapper';
import type { Category } from '@/lib/sanity.types';

interface ConditionalLayoutProps {
    children: React.ReactNode;
    categories?: Category[];
}

export default function ConditionalLayout({
    children,
    categories = [],
}: ConditionalLayoutProps) {
    const pathname = usePathname();

    // Hide Header and Footer on Studio routes
    const isStudioRoute = pathname?.startsWith('/studio');

    if (isStudioRoute) {
        return <div data-studio-route="true">{children}</div>;
    }

    return (
        <>
            <Header categories={categories} />
            <main id="main-content" className="pb-20 md:pb-0">{children}</main>
            <Footer />
            <CartDrawer />
            <QuickViewWrapper />
        </>
    );
}
