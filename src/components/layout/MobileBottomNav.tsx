'use client';

import { Home, ShoppingBag, ShoppingCart, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/lib/cartStore';
import { useEffect, useState } from 'react';

export default function MobileBottomNav() {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const { items } = useCartStore();

    useEffect(() => {
        setMounted(true);
    }, []);

    const cartCount = mounted ? items.reduce((sum, item) => sum + item.quantity, 0) : 0;

    const navItems = [
        {
            href: '/',
            icon: Home,
            label: 'Home',
            active: pathname === '/'
        },
        {
            href: '/shop',
            icon: ShoppingBag,
            label: 'Shop',
            active: pathname.startsWith('/shop') || pathname.startsWith('/products')
        },
        {
            href: '/cart',
            icon: ShoppingCart,
            label: 'Cart',
            active: pathname === '/cart',
            badge: cartCount
        },
        {
            href: '/account',
            icon: User,
            label: 'Account',
            active: pathname.startsWith('/account') || pathname.startsWith('/profile')
        }
    ];

    return (
        <nav
            className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[var(--color-border)] pb-safe md:hidden"
            role="navigation"
            aria-label="Mobile navigation"
        >
            <div className="grid grid-cols-4 h-16">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center relative transition-colors ${item.active
                                ? 'text-[var(--color-primary)]'
                                : 'text-[var(--color-muted)] hover:text-[var(--color-dark)]'
                                }`}
                            aria-label={item.label}
                            aria-current={item.active ? 'page' : undefined}
                        >
                            <div className="relative">
                                <Icon
                                    size={22}
                                    className={`transition-transform ${item.active ? 'scale-110' : 'scale-100 hover:scale-105'
                                        }`}
                                    strokeWidth={item.active ? 2.5 : 2}
                                />
                                {/* Cart Badge */}
                                {item.badge !== undefined && item.badge > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-[var(--color-primary)] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-fadeIn">
                                        {item.badge > 9 ? '9+' : item.badge}
                                    </span>
                                )}
                            </div>
                            <span className={`text-[10px] mt-1 font-medium uppercase tracking-wide ${item.active ? 'font-bold' : ''
                                }`}>
                                {item.label}
                            </span>
                            {/* Active Indicator */}
                            {item.active && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[var(--color-primary)] rounded-b-full animate-fadeInDown" />
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
