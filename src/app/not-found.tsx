'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Search, ShoppingBag, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-gradient-to-b from-[var(--color-bg-light)] to-white">
            <div className="max-w-lg w-full text-center">
                {/* Animated 404 */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <h1
                        className="text-[120px] md:text-[180px] font-bold leading-none text-gradient"
                        style={{ fontFamily: 'var(--font-heading)' }}
                    >
                        404
                    </h1>
                </motion.div>

                {/* Message */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <h2
                        className="text-2xl md:text-3xl font-semibold text-[var(--color-dark)] mb-4"
                        style={{ fontFamily: 'var(--font-heading)' }}
                    >
                        Page Not Found
                    </h2>
                    <p className="text-[var(--color-muted)] mb-8 max-w-md mx-auto">
                        The page you&apos;re looking for seems to have wandered off the sacred path.
                        Let us guide you back to your wellness journey.
                    </p>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
                >
                    <Link href="/" className="btn-solid flex items-center justify-center gap-2">
                        <Home size={18} />
                        Return Home
                    </Link>
                    <Link href="/shop" className="btn-outline flex items-center justify-center gap-2">
                        <ShoppingBag size={18} />
                        Browse Products
                    </Link>
                </motion.div>

                {/* Quick Links */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="border-t border-[var(--color-border)] pt-8"
                >
                    <p className="text-sm text-[var(--color-muted)] mb-4">Popular destinations:</p>
                    <div className="flex flex-wrap justify-center gap-3">
                        {[
                            { name: 'Shop', href: '/shop' },
                            { name: 'Bhasma Rituals', href: '/bhasma-rituals' },
                            { name: 'Why Ash?', href: '/why-ash' },
                            { name: 'Retreats', href: '/awt-retreats' },
                            { name: 'Contact', href: '/contact' },
                        ].map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-sm text-[var(--color-primary)] hover:underline"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
