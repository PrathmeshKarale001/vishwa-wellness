'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Droplets, Hand, Wine } from 'lucide-react';
import ProductCard from '@/components/shop/ProductCard';
import { Product } from '@/types';

// Hero Slides
const heroSlides = [
    {
        id: 1,
        subtitle: 'Ancient Wisdom • Modern Wellness',
        title: 'Healing Begins',
        highlight: 'in the Ash',
        description: 'Discover the sacred science of Bhasma through authentic rituals and Agni-infused products',
        image: '/hero-1.jpg',
        cta: { text: 'Explore Products', href: '/shop' },
        ctaSecondary: { text: 'Learn About Ash', href: '/why-ash' },
    },
    {
        id: 2,
        subtitle: 'Transformative Experiences',
        title: 'AWT Retreats',
        highlight: 'A Deep Reset',
        description: 'Immerse yourself in sacred fire ceremonies and personalized healing protocols',
        image: '/hero-2.jpg',
        cta: { text: 'Book Retreat', href: '/awt-retreats' },
        ctaSecondary: { text: 'View Programs', href: '/awt-retreats' },
    },
];

// AWT Retreat Images
const retreatImages = ['/awt-retreats-1.jpg', '/awt-retreats-2.jpg'];

// Ritual Cards
const rituals = [
    {
        id: 'snan',
        icon: Droplets,
        name: 'Bhasma Snān™',
        subtitle: 'Ash Bath Ritual',
        description: 'A sacred bathing practice using consecrated ash to purify the body and cleanse the energy field.',
        href: '/bhasma-rituals#snan',
    },
    {
        id: 'lepam',
        icon: Hand,
        name: 'Bhasma Lepam™',
        subtitle: 'Ash Application Ritual',
        description: 'The ancient art of applying ash to specific points on the body for healing and protection.',
        href: '/bhasma-rituals#lepam',
    },
    {
        id: 'pana',
        icon: Wine,
        name: 'Bhasma Pāna™',
        subtitle: 'Internal Agni Ritual',
        description: 'The mystical practice of consuming ash-infused water to ignite the internal digestive fire.',
        href: '/bhasma-rituals#pana',
    },
];

interface HomePageClientProps {
    featuredProducts: Product[];
    heroSlides?: any[];
}

export default function HomePageClient({ featuredProducts, heroSlides: sanityHeroSlides }: HomePageClientProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [currentRetreatImage, setCurrentRetreatImage] = useState(0);

    // Use sanity slides if provided, otherwise fallback to hardcoded
    const activeHeroSlides = sanityHeroSlides && sanityHeroSlides.length > 0 ? sanityHeroSlides : heroSlides;

    // Auto-advance hero slides
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % activeHeroSlides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [activeHeroSlides.length]);

    // Auto-advance retreat images
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentRetreatImage((prev) => (prev + 1) % retreatImages.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % activeHeroSlides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + activeHeroSlides.length) % activeHeroSlides.length);

    return (
        <>
            {/* ========== HERO SLIDER ========== */}
            <section className="relative h-[600px] lg:h-[700px] overflow-hidden bg-white">
                {activeHeroSlides.map((slide, index) => (
                    <div
                        key={slide.id || index}
                        className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                            }`}
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
                            {/* Text Side */}
                            <div className="flex items-center justify-center lg:justify-end px-6 py-12 lg:py-0 lg:px-16 bg-[#f7f7f7]">
                                <div className="max-w-xl w-full">
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={index === currentSlide ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                                        transition={{ duration: 0.8, delay: 0.3 }}
                                    >
                                        <span className="inline-block px-4 py-1.5 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-bold uppercase tracking-widest rounded-full mb-6 border border-[var(--color-primary)]/10">
                                            ✧ {slide.subtitle}
                                        </span>

                                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-[#222] mb-1 leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                                            {slide.title}
                                        </h1>

                                        {slide.highlight && (
                                            <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-[var(--color-primary)] italic mb-8 leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                                                {slide.highlight}
                                            </h2>
                                        )}

                                        <p className="text-[#666] text-lg lg:text-xl mb-10 leading-relaxed max-w-lg">
                                            {slide.description}
                                        </p>

                                        <div className="flex flex-wrap gap-5">
                                            <Link href={slide.cta?.href || slide.ctaLink || '#'} className="btn-solid !px-10 !py-4 shadow-lg shadow-[var(--color-primary)]/10 hover:-translate-y-1 transition-transform">
                                                {slide.cta?.text || slide.ctaText || 'Learn More'}
                                            </Link>
                                            {(slide.ctaSecondary || slide.ctaSecondaryLink) && (
                                                <Link href={slide.ctaSecondary?.href || slide.ctaSecondaryLink || '#'} className="btn-outline !px-10 !py-4 hover:-translate-y-1 transition-transform bg-white">
                                                    {slide.ctaSecondary?.text || slide.ctaSecondaryText || 'View Details'}
                                                </Link>
                                            )}
                                        </div>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Image Side */}
                            <div className="relative h-full overflow-hidden">
                                <Image
                                    src={slide.image?.url || slide.image || '/hero-placeholder.jpg'}
                                    alt={slide.title}
                                    fill
                                    className={`object-cover transition-transform duration-[2000ms] ease-out ${index === currentSlide ? 'scale-100' : 'scale-110'}`}
                                    priority={index === 0}
                                    quality={85}
                                />
                            </div>
                        </div>
                    </div>
                ))}

                {/* Slide Navigation */}
                <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-colors shadow-md"
                    aria-label="Previous slide"
                >
                    <ChevronLeft size={24} />
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-colors shadow-md"
                    aria-label="Next slide"
                >
                    <ChevronRight size={24} />
                </button>

                {/* Slide Dots */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
                    {activeHeroSlides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all ${index === currentSlide
                                ? 'bg-[var(--color-primary)] w-8'
                                : 'bg-[#ddd] hover:bg-[#bbb]'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </section>

            {/* ========== FEATURED PRODUCTS ========== */}
            <section className="section-padding bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <span className="text-[var(--color-primary)] text-sm font-bold uppercase tracking-widest">Our Collection</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-[#222] mt-2" style={{ fontFamily: 'var(--font-heading)' }}>
                            Featured Products
                        </h2>
                    </div>

                    {featuredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {featuredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-[#777] mb-4">No products available yet.</p>
                            <Link href="/shop" className="btn-solid">
                                Explore All Products
                            </Link>
                        </div>
                    )}

                    <div className="text-center mt-12">
                        <Link href="/shop" className="btn-outline">
                            View All Products
                        </Link>
                    </div>
                </div>
            </section>

            {/* ========== BHASMA RITUALS ========== */}
            <section className="section-padding bg-[#f9f9f9]">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <span className="text-[var(--color-primary)] text-sm font-bold uppercase tracking-widest">Sacred Practices</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-[#222] mt-2" style={{ fontFamily: 'var(--font-heading)' }}>
                            The Three Bhasma Rituals
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {rituals.map((ritual) => {
                            const Icon = ritual.icon;
                            return (
                                <Link
                                    key={ritual.id}
                                    href={ritual.href}
                                    className="group bg-white p-8 border border-[#eee] hover:border-[var(--color-primary)] transition-all duration-300 hover:shadow-lg"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <Icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-[#222] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                                        {ritual.name}
                                    </h3>
                                    <p className="text-[var(--color-primary)] text-sm font-medium mb-4">{ritual.subtitle}</p>
                                    <p className="text-[#777] leading-relaxed">{ritual.description}</p>
                                </Link>
                            );
                        })}
                    </div>

                    <div className="text-center mt-12">
                        <Link href="/bhasma-rituals" className="btn-solid">
                            Learn More About Rituals
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
