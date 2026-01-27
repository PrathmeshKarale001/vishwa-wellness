'use client';

import { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface HeroProps {
    // Content
    badge?: string;
    title: string;
    highlight?: string;
    subtitle?: string;
    description?: string;

    // CTAs
    cta?: { text: string; href: string };
    ctaSecondary?: { text: string; href: string };

    // Visual
    bgImage?: string;
    theme?: 'light' | 'dark' | 'split';

    // Layout
    minHeight?: string;
    children?: ReactNode;
}

export function Hero({
    badge,
    title,
    highlight,
    subtitle,
    description,
    cta,
    ctaSecondary,
    bgImage,
    theme = 'light',
    minHeight = 'min-h-[75vh]',
    children,
}: HeroProps) {
    // Theme configurations
    const themeConfig = {
        light: {
            containerBg: 'bg-warm-gradient',
            textColor: 'text-[var(--color-navy)]',
            overlayGradient: 'bg-gradient-to-t from-[var(--color-cream)] via-transparent to-[var(--color-beige)]/50',
            imageOpacity: 'opacity-15',
            badgeStyle: 'bg-[var(--color-gold)]/10 border-[var(--color-gold)]/20 text-[var(--color-gold)]',
        },
        dark: {
            containerBg: 'bg-hero-gradient',
            textColor: 'text-white',
            overlayGradient: 'bg-gradient-to-r from-black/80 via-black/40 to-transparent',
            imageOpacity: 'opacity-40',
            badgeStyle: 'bg-[var(--color-primary)]/20 border-[var(--color-primary)]/30 text-[var(--color-accent)]',
        },
        split: {
            containerBg: 'bg-white',
            textColor: 'text-[#222]',
            overlayGradient: '',
            imageOpacity: '',
            badgeStyle: 'bg-[var(--color-primary)]/10 border-[var(--color-primary)]/10 text-[var(--color-primary)]',
        },
    };

    const config = themeConfig[theme];

    if (theme === 'split') {
        // Split-screen grid layout (Homepage style)
        return (
            <section className={cn('relative overflow-hidden', minHeight, config.containerBg)}>
                <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
                    {/* Text Side */}
                    <div className="flex items-center justify-center lg:justify-end px-6 py-12 lg:py-0 lg:px-16 bg-[#f7f7f7]">
                        <div className="max-w-xl w-full">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                            >
                                {badge && (
                                    <span className={cn(
                                        'inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border',
                                        config.badgeStyle
                                    )}>
                                        ✧ {badge}
                                    </span>
                                )}

                                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-0 leading-[1.1]" style={{ fontFamily: 'var(--font-heading)' }}>
                                    {title}
                                </h1>

                                {highlight && (
                                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[var(--color-primary)] italic mt-[-12px] mb-5 leading-[1.1]" style={{ fontFamily: 'var(--font-heading)' }}>
                                        {highlight}
                                    </h2>
                                )}

                                {description && (
                                    <p className="text-[#666] text-base lg:text-lg mb-8 leading-relaxed max-w-lg">
                                        {description}
                                    </p>
                                )}

                                {(cta || ctaSecondary) && (
                                    <div className="flex flex-wrap gap-5">
                                        {cta && (
                                            <Link href={cta.href} className="btn-solid hover:-translate-y-1">
                                                {cta.text}
                                            </Link>
                                        )}
                                        {ctaSecondary && (
                                            <Link href={ctaSecondary.href} className="btn-outline hover:-translate-y-1">
                                                {ctaSecondary.text}
                                            </Link>
                                        )}
                                    </div>
                                )}

                                {children}
                            </motion.div>
                        </div>
                    </div>

                    {/* Image Side */}
                    {bgImage && (
                        <div className="relative h-full overflow-hidden">
                            <Image
                                src={bgImage}
                                alt={title}
                                fill
                                className="object-cover"
                                priority
                                quality={85}
                            />
                        </div>
                    )}
                </div>
            </section>
        );
    }

    // Standard hero layout (light/dark themes)
    return (
        <section className={cn('relative flex items-center justify-center pt-24 pb-16 overflow-hidden', minHeight)}>
            {/* Background */}
            <div className={cn('absolute inset-0', config.containerBg)} />

            {bgImage && (
                <div className="absolute inset-0 z-0">
                    <Image
                        src={bgImage}
                        alt={title}
                        fill
                        className={cn('object-cover', config.imageOpacity)}
                        priority
                        quality={85}
                    />
                    <div className={cn('absolute inset-0', config.overlayGradient)} />
                </div>
            )}

            {/* Content */}
            <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    {badge && (
                        <div className={cn(
                            'inline-block px-4 py-1 rounded-full border mb-8',
                            config.badgeStyle
                        )}>
                            <span className="text-xs font-bold uppercase tracking-[0.2em]">{badge}</span>
                        </div>
                    )}

                    <h1 className={cn(
                        'font-[family-name:var(--font-playfair)] text-3xl md:text-5xl lg:text-6xl font-bold mb-5 leading-[1.0]',
                        config.textColor
                    )}>
                        {title}
                        {highlight && (
                            <>
                                <br />
                                <span className="text-[var(--color-primary)] leading-[1.0]">{highlight}</span>
                            </>
                        )}
                    </h1>

                    {subtitle && (
                        <p className={cn('text-xl md:text-2xl mb-4 font-light', theme === 'dark' ? 'text-white/90' : 'opacity-80')}>
                            {subtitle}
                        </p>
                    )}

                    {description && (
                        <p className={cn('text-base md:text-lg max-w-3xl mx-auto mb-10 leading-relaxed', theme === 'dark' ? 'text-white/80' : 'opacity-80')}>
                            {description}
                        </p>
                    )}

                    {(cta || ctaSecondary) && (
                        <div className="flex flex-wrap gap-4 justify-center">
                            {cta && (
                                <Link href={cta.href} className="btn-solid">
                                    {cta.text}
                                </Link>
                            )}
                            {ctaSecondary && (
                                <Link href={ctaSecondary.href} className="btn-outline">
                                    {ctaSecondary.text}
                                </Link>
                            )}
                        </div>
                    )}

                    {children}
                </motion.div>
            </div>
        </section>
    );
}
