'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Droplets, Hand, Wine, Search, Calendar, Sparkles, Heart, Brain, Shield, Zap, Leaf, MapPin, PlayCircle, ExternalLink } from 'lucide-react';
import ProductCard from '@/components/shop/ProductCard';
import { Product } from '@/types';
import FAQAccordion from '@/components/ui/FAQAccordion';
import { YouTubeVideo, formatVideoDate } from '@/lib/youtube';

// Type definition for hero slides (supports both hardcoded and Sanity CMS formats)
interface HeroSlide {
    // ID field - Sanity uses _key, local uses id
    id?: number | string;
    _key?: string;
    // Common fields
    subtitle?: string;
    title: string;
    // Local-only fields (optional for Sanity compatibility)
    highlight?: string;
    description?: string;
    // Image - Sanity provides object, local can be string
    image: string | { url: string; alt?: string };
    mobileImage?: { url: string; alt?: string };
    // Hardcoded CTA format
    cta?: { text: string; href: string };
    ctaSecondary?: { text: string; href: string };
    // Sanity CMS CTA format
    ctaText?: string;
    ctaLink?: string;
    ctaSecondaryText?: string;
    ctaSecondaryLink?: string;
}

// Slide auto-advance duration in ms
const SLIDE_DURATION = 8000;

// Hero Slides — Slide 1: Facility/Place, Slide 2: Products & Brand
const heroSlides: HeroSlide[] = [
    {
        id: 1,
        subtitle: 'Welcome to Vishwa Wellness',
        title: 'Where Ancient',
        highlight: 'Healing Lives',
        description: 'Step into a sacred sanctuary nestled in nature — where fire rituals, Bhasma traditions, and holistic healing come alive.',
        image: '/hero-2.jpg',
        cta: { text: 'Explore Our Sanctuary', href: '/about' },
        ctaSecondary: { text: 'Shop Products', href: '/shop' },
    },
    {
        id: 2,
        subtitle: 'Sacred Products & Rituals',
        title: 'Rooted in Fire,',
        highlight: 'Crafted with Devotion',
        description: 'From Bhasma-infused wellness products to transformative retreat experiences — discover the ancient science of Agni healing.',
        image: '/hero-1.jpg',
        cta: { text: 'Shop Collection', href: '/shop' },
        ctaSecondary: { text: 'Book a Retreat', href: '/awt-retreats' },
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
    heroSlides?: HeroSlide[];
    latestVideos?: YouTubeVideo[];
}

// Helper to extract image URL from string or object
function getSlideImageUrl(image: string | { url: string; alt?: string } | undefined): string {
    if (!image) return '/hero-placeholder.jpg';
    if (typeof image === 'string') return image;
    return image.url || '/hero-placeholder.jpg';
}

export default function HomePageClient({ featuredProducts, heroSlides: sanityHeroSlides, latestVideos = [] }: HomePageClientProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [currentRetreatImage, setCurrentRetreatImage] = useState(0);

    // Use sanity slides if provided, otherwise fallback to hardcoded
    const activeHeroSlides = sanityHeroSlides && sanityHeroSlides.length > 0 ? sanityHeroSlides : heroSlides;

    // Auto-advance hero slides
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % activeHeroSlides.length);
        }, SLIDE_DURATION);
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
            {/* ========== IMMERSIVE HERO SLIDER ========== */}
            <section className="relative min-h-[500px] overflow-hidden bg-black" style={{ height: 'calc(100svh - 120px)' }}>
                {activeHeroSlides.map((slide, index) => {
                    const isActive = index === currentSlide;
                    const isSlide1 = index === 0;

                    return (
                        <div
                            key={slide._key || slide.id || index}
                            className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                                }`}
                        >
                            {/* === Full-Bleed Background Image with Ken Burns === */}
                            <div className="absolute inset-0 overflow-hidden">
                                <Image
                                    src={getSlideImageUrl(slide.image)}
                                    alt={slide.title}
                                    fill
                                    className="object-cover"
                                    style={{
                                        animation: isActive
                                            ? `${isSlide1 ? 'kenBurnsZoom' : 'kenBurnsZoomAlt'} ${SLIDE_DURATION / 1000 + 2}s ease-out forwards`
                                            : 'none',
                                        transform: 'scale(1)',
                                    }}
                                    priority={index === 0}
                                    quality={90}
                                />
                            </div>

                            {/* === Cinematic Gradient Overlays === */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20 z-[1]" />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent z-[1] hidden lg:block" />

                            {/* === Ambient Glow Orbs (fire theme) === */}
                            <div
                                className="absolute w-[300px] h-[300px] rounded-full z-[2] pointer-events-none hidden lg:block"
                                style={{
                                    background: 'radial-gradient(circle, rgba(199,60,46,0.15) 0%, transparent 70%)',
                                    top: '20%',
                                    right: '15%',
                                    animation: 'floatGlow 8s ease-in-out infinite',
                                }}
                            />
                            <div
                                className="absolute w-[200px] h-[200px] rounded-full z-[2] pointer-events-none hidden lg:block"
                                style={{
                                    background: 'radial-gradient(circle, rgba(244,160,52,0.12) 0%, transparent 70%)',
                                    bottom: '30%',
                                    left: '10%',
                                    animation: 'floatGlow2 10s ease-in-out infinite',
                                }}
                            />

                            {/* === Content === */}
                            <div className="relative z-10 h-full flex items-end lg:items-center">
                                <div className="w-full max-w-7xl mx-auto px-5 sm:px-8 pb-28 sm:pb-32 lg:pb-0">
                                    <div className="max-w-2xl">
                                        {/* Badge */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                            transition={{ duration: 0.6, delay: 0.2 }}
                                        >
                                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md text-white text-xs font-bold uppercase tracking-[0.2em] rounded-full mb-6 border border-white/20">
                                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
                                                {slide.subtitle}
                                            </span>
                                        </motion.div>

                                        {/* Title */}
                                        <motion.h1
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                                            transition={{ duration: 0.7, delay: 0.4 }}
                                            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold !text-white leading-[1.05] drop-shadow-lg"
                                            style={{ fontFamily: 'var(--font-heading)', margin: 0, padding: 0 }}
                                        >
                                            {slide.title}
                                        </motion.h1>

                                        {/* Highlight */}
                                        {slide.highlight && (
                                            <motion.h2
                                                initial={{ opacity: 0, y: 30 }}
                                                animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                                                transition={{ duration: 0.7, delay: 0.55 }}
                                                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] drop-shadow-lg !text-white"
                                                style={{
                                                    fontFamily: 'var(--font-heading)',
                                                    margin: 0,
                                                    marginBottom: '1rem',
                                                    padding: 0,
                                                }}
                                            >
                                                {slide.highlight}
                                            </motion.h2>
                                        )}

                                        {/* Description */}
                                        <motion.p
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                            transition={{ duration: 0.6, delay: 0.7 }}
                                            className="!text-white/80 text-base sm:text-lg lg:text-xl mb-8 leading-relaxed max-w-xl"
                                        >
                                            {slide.description}
                                        </motion.p>

                                        {/* Slide 1 extras: Location badge */}
                                        {isSlide1 && (
                                            <motion.div
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                                                transition={{ duration: 0.5, delay: 0.85 }}
                                                className="flex items-center gap-2 mb-8"
                                            >
                                                <div className="flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/15">
                                                    <MapPin size={16} className="text-[var(--color-accent)]" />
                                                    <span className="!text-white/90 text-sm font-medium">Nestled in Nature • India</span>
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Slide 2 extras: Trust badges */}
                                        {!isSlide1 && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 15 }}
                                                animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                                                transition={{ duration: 0.5, delay: 0.85 }}
                                                className="flex flex-wrap items-center gap-3 mb-8"
                                            >
                                                {['100% Natural', 'Vedic Certified', 'Ancient Formulas'].map((badge) => (
                                                    <span
                                                        key={badge}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm text-white/90 text-xs font-semibold rounded-full border border-white/15"
                                                    >
                                                        <Sparkles size={12} className="text-[var(--color-accent)]" />
                                                        {badge}
                                                    </span>
                                                ))}
                                            </motion.div>
                                        )}

                                        {/* CTAs */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                            transition={{ duration: 0.6, delay: 1.0 }}
                                            className="flex flex-wrap gap-4"
                                        >
                                            <Link
                                                href={slide.cta?.href || slide.ctaLink || '#'}
                                                className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#222] text-sm font-bold uppercase tracking-[0.15em] hover:bg-[var(--color-accent)] hover:text-white transition-all duration-300 hover:-translate-y-0.5 shadow-lg"
                                            >
                                                {slide.cta?.text || slide.ctaText || 'Learn More'}
                                            </Link>
                                            {(slide.ctaSecondary || slide.ctaSecondaryLink) && (
                                                <Link
                                                    href={slide.ctaSecondary?.href || slide.ctaSecondaryLink || '#'}
                                                    className="inline-flex items-center justify-center px-8 py-4 bg-transparent !text-white text-sm font-bold uppercase tracking-[0.15em] border border-white/40 hover:bg-white/15 hover:border-white/70 transition-all duration-300 hover:-translate-y-0.5 backdrop-blur-sm"
                                                >
                                                    {slide.ctaSecondary?.text || slide.ctaSecondaryText || 'View Details'}
                                                </Link>
                                            )}
                                        </motion.div>
                                    </div>

                                    {/* Slide 1: Floating Stats (desktop) */}
                                    {isSlide1 && (
                                        <motion.div
                                            initial={{ opacity: 0, x: 40 }}
                                            animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
                                            transition={{ duration: 0.8, delay: 1.1 }}
                                            className="hidden lg:block absolute right-8 xl:right-16 bottom-16 xl:bottom-24"
                                        >
                                            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl">
                                                <div className="grid grid-cols-3 gap-6 text-center">
                                                    <div>
                                                        <div className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>50+</div>
                                                        <div className="text-xs text-white/60 mt-1">Years of<br />Practice</div>
                                                    </div>
                                                    <div className="border-x border-white/15 px-4">
                                                        <div className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>50,000+</div>
                                                        <div className="text-xs text-white/60 mt-1">Patients<br />Treated</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>3</div>
                                                        <div className="text-xs text-white/60 mt-1">Sacred<br />Rituals</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* === Slide Navigation Arrows === */}
                <button
                    onClick={prevSlide}
                    className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 bg-white/10 hover:bg-white/25 backdrop-blur-md rounded-full hidden lg:flex items-center justify-center transition-all duration-300 border border-white/20 hover:border-white/40 group"
                    aria-label="Previous slide"
                >
                    <ChevronLeft size={20} className="text-white group-hover:scale-110 transition-transform" />
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 bg-white/10 hover:bg-white/25 backdrop-blur-md rounded-full hidden lg:flex items-center justify-center transition-all duration-300 border border-white/20 hover:border-white/40 group"
                    aria-label="Next slide"
                >
                    <ChevronRight size={20} className="text-white group-hover:scale-110 transition-transform" />
                </button>

                {/* === Premium Pill Navigation === */}
                <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-full px-4 py-2.5 border border-white/15">
                    {activeHeroSlides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className="relative h-1.5 rounded-full transition-all duration-500 overflow-hidden"
                            style={{ width: index === currentSlide ? '48px' : '16px' }}
                            aria-label={`Go to slide ${index + 1}`}
                        >
                            <div className="absolute inset-0 bg-white/30 rounded-full" />
                            {index === currentSlide && (
                                <div
                                    className="absolute inset-0 bg-white rounded-full"
                                    style={{
                                        animation: `slideProgress ${SLIDE_DURATION / 1000}s linear forwards`,
                                    }}
                                />
                            )}
                        </button>
                    ))}
                </div>
            </section>

            {/* ========== ABOUT / PHILOSOPHY ========== */}
            <section className="section-padding bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        {/* Text Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="text-[var(--color-primary)] text-sm font-bold uppercase tracking-widest">Our Story</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-[#222] mt-3 mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
                                Where Ancient Wisdom Meets Modern Science
                            </h2>

                            <div className="space-y-4 text-[#666] leading-relaxed">
                                <p>
                                    At <strong className="text-[#222]">Vishwa Wellness</strong>, we believe that true healing comes from honoring both the ancient wisdom of our ancestors and the insights of modern science. Our journey began with a simple question: <em>What if the most profound healing traditions could be validated and enhanced by contemporary research?</em>
                                </p>

                                <p>
                                    The answer led us to <strong className="text-[var(--color-primary)]">Bhasma</strong> — sacred ash created through precise Vedic fire rituals. For thousands of years, this ancient practice has been used to purify, heal, and transform. Today, we bring this timeless wisdom to you through carefully crafted products and transformative retreat experiences.
                                </p>

                                <p>
                                    Every product we create, every ritual we teach, and every retreat we host is rooted in authenticity, reverence, and a deep commitment to your holistic well-being.
                                </p>
                            </div>

                            {/* Core Values Pills */}
                            <div className="flex flex-wrap gap-3 mt-8">
                                <span className="px-4 py-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-sm font-semibold rounded-full border border-[var(--color-primary)]/20">
                                    ✦ Authentic Tradition
                                </span>
                                <span className="px-4 py-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-sm font-semibold rounded-full border border-[var(--color-primary)]/20">
                                    ✦ Scientific Validation
                                </span>
                                <span className="px-4 py-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-sm font-semibold rounded-full border border-[var(--color-primary)]/20">
                                    ✦ Holistic Healing
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-4 mt-8">
                                <Link href="/about" className="btn-solid">
                                    Our Full Story
                                </Link>
                                <Link href="/science-mysticism" className="btn-outline">
                                    Science & Mysticism
                                </Link>
                            </div>
                        </motion.div>

                        {/* Visual Content */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="relative"
                        >
                            {/* Main Image */}
                            <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                                <Image
                                    src="/our-story.jpg"
                                    alt="Ancient wisdom meets modern science"
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                                {/* Decorative overlay */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-primary)]/20 to-transparent" />
                            </div>

                            {/* Floating Stats Card */}
                            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl border border-[#eee] max-w-[280px]">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-[var(--color-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
                                            50+
                                        </div>
                                        <div className="text-xs text-[#666] mt-1">Years of Practice</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-[var(--color-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
                                            50,000+
                                        </div>
                                        <div className="text-xs text-[#666] mt-1">Patients Treated</div>
                                    </div>
                                </div>
                                <div className="mt-3 pt-3 border-t border-[#eee] text-center">
                                    <div className="text-2xl font-bold text-[var(--color-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
                                        100%
                                    </div>
                                    <div className="text-xs text-[#666] mt-1">Authentic Rituals</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ========== FEATURED PRODUCTS ========== */}
            < section className="section-padding bg-[#f9f9f9]" >
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <span className="text-[var(--color-primary)] text-sm font-bold uppercase tracking-widest">Our Collection</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-[#222] mt-2" style={{ fontFamily: 'var(--font-heading)' }}>
                            Featured Products
                        </h2>
                    </div>

                    {featuredProducts.length > 0 ? (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
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
            </section >

            {/* ========== HOW IT WORKS ========== */}
            <section className="section-padding bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-[var(--color-primary)] text-sm font-bold uppercase tracking-widest">Your Journey</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-[#222] mt-2" style={{ fontFamily: 'var(--font-heading)' }}>
                            How It Works
                        </h2>
                        <p className="text-[#666] mt-4 max-w-2xl mx-auto">
                            Your path to transformation through ancient wisdom begins here
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
                        {/* Step 1 */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="group relative"
                        >
                            <div className="text-center">
                                <div className="relative inline-block mb-6">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                        <Search className="w-10 h-10 text-white" />
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white border-2 border-[var(--color-primary)] rounded-full flex items-center justify-center text-sm font-bold text-[var(--color-primary)]">
                                        1
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-[#222] mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                                    Discover
                                </h3>
                                <p className="text-[#666] leading-relaxed">
                                    Explore our range of Bhasma products and sacred rituals. Learn about the ancient wisdom behind each practice.
                                </p>
                            </div>
                            {/* Connector Arrow - Desktop only */}
                            <div className="hidden md:block absolute top-10 -right-6 lg:-right-8 text-[var(--color-primary)]/30 text-4xl">
                                →
                            </div>
                        </motion.div>

                        {/* Step 2 */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="group relative"
                        >
                            <div className="text-center">
                                <div className="relative inline-block mb-6">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                        <Calendar className="w-10 h-10 text-white" />
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white border-2 border-[var(--color-primary)] rounded-full flex items-center justify-center text-sm font-bold text-[var(--color-primary)]">
                                        2
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-[#222] mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                                    Experience
                                </h3>
                                <p className="text-[#666] leading-relaxed">
                                    Begin your practice with our products or join an Agnihotra Wellness Retreat for an immersive transformation experience.
                                </p>
                            </div>
                            {/* Connector Arrow - Desktop only */}
                            <div className="hidden md:block absolute top-10 -right-6 lg:-right-8 text-[var(--color-primary)]/30 text-4xl">
                                →
                            </div>
                        </motion.div>

                        {/* Step 3 */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="group"
                        >
                            <div className="text-center">
                                <div className="relative inline-block mb-6">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                        <Sparkles className="w-10 h-10 text-white" />
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white border-2 border-[var(--color-primary)] rounded-full flex items-center justify-center text-sm font-bold text-[var(--color-primary)]">
                                        3
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-[#222] mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                                    Transform
                                </h3>
                                <p className="text-[#666] leading-relaxed">
                                    Experience profound shifts in your physical, mental, and spiritual well-being through consistent practice.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ========== AGNIHOTRA WELLNESS RETREATS PREVIEW ========== */}
            <section className="section-padding bg-[#f9f9f9]">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Image Gallery */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="relative"
                        >
                            <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                                {retreatImages.map((img, idx) => (
                                    <div
                                        key={idx}
                                        className={`absolute inset-0 transition-opacity duration-1000 ${idx === currentRetreatImage ? 'opacity-100' : 'opacity-0'
                                            }`}
                                    >
                                        <Image
                                            src={img}
                                            alt={`Agnihotra Wellness Retreat ${idx + 1}`}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                        />
                                    </div>
                                ))}
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent" />
                            </div>

                            {/* Image Dots */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                {retreatImages.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentRetreatImage(idx)}
                                        className={`w-2 h-2 rounded-full transition-all ${idx === currentRetreatImage
                                            ? 'bg-white w-6'
                                            : 'bg-white/50 hover:bg-white/80'
                                            }`}
                                        aria-label={`View retreat image ${idx + 1}`}
                                    />
                                ))}
                            </div>
                        </motion.div>

                        {/* Content */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <span className="text-[var(--color-primary)] text-sm font-bold uppercase tracking-widest">Transformative Experiences</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-[#222] mt-3 mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
                                Agnihotra Wellness Retreats
                            </h2>

                            <p className="text-[#666] leading-relaxed mb-6">
                                Immerse yourself in a transformative journey through sacred fire ceremonies, personalized healing protocols, and ancient Bhasma rituals. Our retreats offer a deep reset for body, mind, and spirit in a serene natural setting.
                            </p>

                            {/* Features List */}
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <div className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
                                    </div>
                                    <span className="text-[#666]">Sacred fire ceremonies led by experienced practitioners</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <div className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
                                    </div>
                                    <span className="text-[#666]">Personalized healing protocols and consultations</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <div className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
                                    </div>
                                    <span className="text-[#666]">Hands-on training in the three Bhasma rituals</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <div className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
                                    </div>
                                    <span className="text-[#666]">Organic meals and serene natural accommodations</span>
                                </li>
                            </ul>

                            <div className="flex flex-wrap gap-4">
                                <Link href="/awt-retreats" className="btn-solid">
                                    Explore Retreats
                                </Link>
                                <Link href="/awt-retreats#upcoming" className="btn-outline">
                                    View Schedule
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ========== BENEFITS / RESULTS ========== */}
            <section className="section-padding bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-[var(--color-primary)] text-sm font-bold uppercase tracking-widest">What You Gain</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-[#222] mt-2" style={{ fontFamily: 'var(--font-heading)' }}>
                            Benefits & Results
                        </h2>
                        <p className="text-[#666] mt-4 max-w-2xl mx-auto">
                            Experience holistic transformation across all dimensions of well-being
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Benefit 1 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="group p-6 bg-gradient-to-br from-white to-[#f9f9f9] border border-[#eee] rounded-xl hover:shadow-lg hover:border-[var(--color-primary)]/30 transition-all duration-300"
                        >
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Heart className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-[#222] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                                Physical Vitality
                            </h3>
                            <p className="text-[#666] text-sm leading-relaxed">
                                Enhanced energy levels, improved digestion, and strengthened immunity through sacred ash practices.
                            </p>
                        </motion.div>

                        {/* Benefit 2 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="group p-6 bg-gradient-to-br from-white to-[#f9f9f9] border border-[#eee] rounded-xl hover:shadow-lg hover:border-[var(--color-primary)]/30 transition-all duration-300"
                        >
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Brain className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-[#222] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                                Mental Clarity
                            </h3>
                            <p className="text-[#666] text-sm leading-relaxed">
                                Reduced stress and anxiety, sharper focus, and emotional balance through mindful rituals.
                            </p>
                        </motion.div>

                        {/* Benefit 3 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="group p-6 bg-gradient-to-br from-white to-[#f9f9f9] border border-[#eee] rounded-xl hover:shadow-lg hover:border-[var(--color-primary)]/30 transition-all duration-300"
                        >
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Sparkles className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-[#222] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                                Spiritual Growth
                            </h3>
                            <p className="text-[#666] text-sm leading-relaxed">
                                Deeper connection to your inner self and the divine through authentic Vedic practices.
                            </p>
                        </motion.div>

                        {/* Benefit 4 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="group p-6 bg-gradient-to-br from-white to-[#f9f9f9] border border-[#eee] rounded-xl hover:shadow-lg hover:border-[var(--color-primary)]/30 transition-all duration-300"
                        >
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Shield className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-[#222] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                                Energy Protection
                            </h3>
                            <p className="text-[#666] text-sm leading-relaxed">
                                Purified energy field and protection from negative influences through Bhasma application.
                            </p>
                        </motion.div>

                        {/* Benefit 5 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="group p-6 bg-gradient-to-br from-white to-[#f9f9f9] border border-[#eee] rounded-xl hover:shadow-lg hover:border-[var(--color-primary)]/30 transition-all duration-300"
                        >
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Zap className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-[#222] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                                Digestive Fire
                            </h3>
                            <p className="text-[#666] text-sm leading-relaxed">
                                Ignited Agni for optimal metabolism, detoxification, and nutrient absorption.
                            </p>
                        </motion.div>

                        {/* Benefit 6 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="group p-6 bg-gradient-to-br from-white to-[#f9f9f9] border border-[#eee] rounded-xl hover:shadow-lg hover:border-[var(--color-primary)]/30 transition-all duration-300"
                        >
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Leaf className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-[#222] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                                Natural Detox
                            </h3>
                            <p className="text-[#666] text-sm leading-relaxed">
                                Deep cellular cleansing and toxin removal through time-tested Ayurvedic methods.
                            </p>
                        </motion.div>
                    </div>

                    <div className="text-center mt-12">
                        <Link href="/science-mysticism" className="btn-outline">
                            Learn the Science Behind It
                        </Link>
                    </div>
                </div>
            </section>

            {/* ========== BHASMA RITUALS ========== */}
            < section className="section-padding bg-[#f9f9f9]" >
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
            </section >

            {/* ========== LATEST PODCASTS ========== */}
            {latestVideos.length > 0 && (
                <section className="section-padding bg-white">
                    <div className="max-w-7xl mx-auto px-4">
                        {/* Header */}
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full mb-4 border border-red-100">
                                <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" />
                                    <path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="white" />
                                </svg>
                                <span className="text-red-500 text-xs font-bold uppercase tracking-widest">YouTube</span>
                            </div>
                            <span className="block text-[var(--color-primary)] text-sm font-bold uppercase tracking-widest mb-1">Latest From Our Channel</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-[#222] mt-2" style={{ fontFamily: 'var(--font-heading)' }}>
                                Watch Our Podcasts
                            </h2>
                            <p className="text-[#666] mt-4 max-w-xl mx-auto">
                                Dive into sacred wisdom, healing practices, and wellness insights — new episodes every week.
                            </p>
                        </div>

                        {/* Video Cards Grid */}
                        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                            {latestVideos.map((video, index) => (
                                <motion.a
                                    key={video.videoId}
                                    href={video.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="group block bg-white border border-[#eee] rounded-2xl overflow-hidden hover:shadow-xl hover:border-[var(--color-primary)]/30 transition-all duration-300 hover:-translate-y-1"
                                >
                                    {/* Thumbnail */}
                                    <div className="relative aspect-video overflow-hidden bg-[#111]">
                                        <Image
                                            src={video.thumbnail}
                                            alt={video.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        {/* Play overlay */}
                                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                            <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                                                <PlayCircle className="w-8 h-8 text-red-600 fill-red-600" />
                                            </div>
                                        </div>
                                        {/* YouTube badge */}
                                        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-black/70 backdrop-blur-sm rounded-full">
                                            <svg className="w-3 h-3 text-red-400" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" />
                                                <path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="white" />
                                            </svg>
                                            <span className="text-white text-[10px] font-semibold">YouTube</span>
                                        </div>
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-5">
                                        <h3
                                            className="font-bold text-[#222] text-base leading-snug line-clamp-2 mb-3 group-hover:text-[var(--color-primary)] transition-colors duration-200"
                                            style={{ fontFamily: 'var(--font-heading)' }}
                                        >
                                            {video.title}
                                        </h3>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1.5 text-[#999] text-xs">
                                                <Calendar className="w-3.5 h-3.5" />
                                                <span>{formatVideoDate(video.published)}</span>
                                            </div>
                                            <span className="inline-flex items-center gap-1 text-[var(--color-primary)] text-xs font-semibold group-hover:gap-2 transition-all duration-200">
                                                Watch <ExternalLink className="w-3 h-3" />
                                            </span>
                                        </div>
                                    </div>
                                </motion.a>
                            ))}
                        </div>

                        {/* CTA */}
                        <div className="text-center mt-10">
                            <a
                                href="https://www.youtube.com/@VishwaWellness"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 px-8 py-4 bg-red-600 hover:bg-red-700 text-white text-sm font-bold uppercase tracking-[0.15em] transition-all duration-300 hover:-translate-y-0.5 shadow-lg shadow-red-600/20 rounded-lg"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" />
                                    <path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="white" />
                                </svg>
                                View All Videos
                            </a>
                        </div>
                    </div>
                </section>
            )}

            {/* ========== FAQ SECTION ========== */}
            <section className="section-padding bg-white">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <span className="text-[var(--color-primary)] text-sm font-bold uppercase tracking-widest">Common Questions</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-[#222] mt-2" style={{ fontFamily: 'var(--font-heading)' }}>
                            Frequently Asked Questions
                        </h2>
                    </div>

                    <FAQAccordion />
                </div>
            </section>

            {/* ========== YOUTUBE CHANNEL CTA ========== */}
            <section className="section-padding bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1a]">
                <div className="max-w-5xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/20 rounded-full mb-6 border border-red-500/30">
                            <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" />
                                <path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="white" />
                            </svg>
                            <span className="text-red-400 text-xs font-bold uppercase tracking-widest">YouTube Channel</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold !text-white mt-2 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                            Watch Us on YouTube
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                            Discover sacred rituals, wellness tips, and transformative practices on our YouTube channel. Join thousands of seekers on the path to holistic healing.
                        </p>

                        {/* Embedded Video */}
                        <div className="relative w-full max-w-3xl mx-auto mb-10 rounded-xl overflow-hidden shadow-2xl shadow-black/40" style={{ aspectRatio: '16/9' }}>
                            <iframe
                                src="https://www.youtube.com/embed/nH4GAbjbq2A"
                                title="Vishwa Wellness - YouTube"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                className="absolute inset-0 w-full h-full"
                                style={{ border: 'none' }}
                            />
                        </div>

                        <a
                            href="https://www.youtube.com/@VishwaWellness"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-red-600 hover:bg-red-700 text-white text-sm font-bold uppercase tracking-[0.15em] transition-all duration-300 hover:-translate-y-0.5 shadow-lg shadow-red-600/30 rounded-lg"
                        >
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" />
                                <path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="white" />
                            </svg>
                            Subscribe to Our Channel
                        </a>
                    </motion.div>
                </div>
            </section>
        </>
    );
}
