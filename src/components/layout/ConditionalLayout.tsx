'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import QuickViewWrapper from '@/components/shop/QuickViewWrapper';

export default function ConditionalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    // Hide Header and Footer on Studio routes
    const isStudioRoute = pathname?.startsWith('/studio');

    if (isStudioRoute) {
        return <div data-studio-route="true">{children}</div>;
    }

    return (
        <>
            <Header />
            <main>{children}</main>
            <Footer />
            <CartDrawer />
            <QuickViewWrapper />
        </>
    );
}
