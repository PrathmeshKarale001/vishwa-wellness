'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, PlayCircle, Images, Building2, Leaf, Film, Loader2 } from 'lucide-react';
import type { CloudinaryAsset } from '@/lib/cloudinary';

/* ─── Types ────────────────────────────────────────────────────────────────── */
interface GalleryData {
    therapyPhotos: CloudinaryAsset[];
    facilityPhotos: CloudinaryAsset[];
    vishwaCentre: CloudinaryAsset[];
    promoReels: CloudinaryAsset[];
}

type TabId = 'therapy' | 'facility' | 'vishwa' | 'reels';


const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
    { id: 'therapy', label: 'Therapy Photos', icon: Leaf },
    { id: 'facility', label: 'Facility Photos', icon: Building2 },
    { id: 'vishwa', label: 'Vishwa Centre', icon: Images },
    { id: 'reels', label: 'Promotional Reels', icon: Film },
];

/* ─── Photo Lightbox ────────────────────────────────────────────────────────── */
function Lightbox({
    images,
    index,
    onClose,
}: {
    images: CloudinaryAsset[];
    index: number;
    onClose: () => void;
}) {
    const [current, setCurrent] = useState(index);

    const prev = useCallback(() => setCurrent((c) => (c - 1 + images.length) % images.length), [images.length]);
    const next = useCallback(() => setCurrent((c) => (c + 1) % images.length), [images.length]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
        };
        document.addEventListener('keydown', handler);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handler);
            document.body.style.overflow = '';
        };
    }, [onClose, prev, next]);

    const img = images[current];

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
                onClick={onClose}
            >
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
                    aria-label="Close"
                >
                    <X size={20} />
                </button>

                {/* Counter */}
                <div className="absolute top-5 left-1/2 -translate-x-1/2 text-white/60 text-sm">
                    {current + 1} / {images.length}
                </div>

                {/* Prev */}
                {images.length > 1 && (
                    <button
                        onClick={(e) => { e.stopPropagation(); prev(); }}
                        className="absolute left-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                    >
                        <ChevronLeft size={24} />
                    </button>
                )}

                {/* Image */}
                <motion.img
                    key={current}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.25 }}
                    src={img.optimizedUrl}
                    alt={img.public_id}
                    className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                />

                {/* Next */}
                {images.length > 1 && (
                    <button
                        onClick={(e) => { e.stopPropagation(); next(); }}
                        className="absolute right-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                    >
                        <ChevronRight size={24} />
                    </button>
                )}
            </motion.div>
        </AnimatePresence>
    );
}

/* ─── Photo Grid ─────────────────────────────────────────────────────────────── */
function PhotoGrid({ photos }: { photos: CloudinaryAsset[] }) {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    if (photos.length === 0) {
        return (
            <div className="text-center py-24 text-gray-400">
                <Images size={48} className="mx-auto mb-4 opacity-30" />
                <p>No photos found in this folder yet.</p>
            </div>
        );
    }

    return (
        <>
            <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
                {photos.map((photo, i) => (
                    <motion.div
                        key={photo.public_id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.4) }}
                        className="relative break-inside-avoid overflow-hidden rounded-xl cursor-pointer group"
                        onClick={() => setLightboxIndex(i)}
                    >
                        <img
                            src={photo.thumbnailUrl}
                            alt={`Gallery photo ${i + 1}`}
                            className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                            decoding="async"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-semibold uppercase tracking-widest bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-sm">
                                View
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {lightboxIndex !== null && (
                <Lightbox
                    images={photos}
                    index={lightboxIndex}
                    onClose={() => setLightboxIndex(null)}
                />
            )}
        </>
    );
}

/* ─── Video Card ─────────────────────────────────────────────────────────────── */
function VideoCard({ video, index }: { video: CloudinaryAsset; index: number }) {
    const [playing, setPlaying] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative overflow-hidden rounded-2xl bg-black shadow-xl"
            style={{ aspectRatio: '9/16' }}
        >
            {!playing ? (
                <>
                    <img
                        src={video.thumbnailUrl}
                        alt={`Promo reel ${index + 1}`}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <button
                        onClick={() => setPlaying(true)}
                        className="absolute inset-0 flex items-center justify-center group"
                        aria-label={`Play reel ${index + 1}`}
                    >
                        <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform duration-300">
                            <PlayCircle className="w-10 h-10 text-[var(--color-terracotta)] fill-[var(--color-terracotta)]" />
                        </div>
                    </button>
                    <div className="absolute bottom-4 left-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold rounded-full border border-white/15">
                            🎬 Promo Reel
                        </span>
                    </div>
                </>
            ) : (
                <video
                    autoPlay
                    controls
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                    preload="metadata"
                >
                    <source src={video.optimizedUrl} type="video/mp4" />
                </video>
            )}
        </motion.div>
    );
}

/* ─── Video Grid ─────────────────────────────────────────────────────────────── */
function VideoGrid({ videos }: { videos: CloudinaryAsset[] }) {
    if (videos.length === 0) {
        return (
            <div className="text-center py-24 text-gray-400">
                <Film size={48} className="mx-auto mb-4 opacity-30" />
                <p>No reels found in this folder yet.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {videos.map((video, i) => (
                <VideoCard key={video.public_id} video={video} index={i} />
            ))}
        </div>
    );
}

/* ─── Main Gallery Client ─────────────────────────────────────────────────── */
export default function GalleryClient() {
    const [activeTab, setActiveTab] = useState<TabId>('therapy');
    const [data, setData] = useState<GalleryData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/gallery')
            .then((r) => r.json())
            .then((d) => { setData(d); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const therapyPhotos  = data?.therapyPhotos  ?? [];
    const facilityPhotos = data?.facilityPhotos ?? [];
    const vishwaCentre   = data?.vishwaCentre   ?? [];
    const promoReels     = data?.promoReels     ?? [];

    const contentMap: Record<TabId, React.ReactNode> = {
        therapy:  loading ? <SkeletonGrid /> : <PhotoGrid photos={therapyPhotos} />,
        facility: loading ? <SkeletonGrid /> : <PhotoGrid photos={facilityPhotos} />,
        vishwa:   loading ? <SkeletonGrid /> : <PhotoGrid photos={vishwaCentre} />,
        reels:    loading ? <SkeletonGrid /> : <VideoGrid videos={promoReels} />,
    };

    const countMap: Record<TabId, number> = {
        therapy:  therapyPhotos.length,
        facility: facilityPhotos.length,
        vishwa:   vishwaCentre.length,
        reels:    promoReels.length,
    };

    return (
        <>
            {/* Hero */}
            <section className="relative pt-32 pb-16 bg-[var(--color-navy)] overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[var(--color-ochre)] blur-[120px]" />
                    <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-[var(--color-forest)] blur-[100px]" />
                </div>
                <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-ochre)]/10 border border-[var(--color-ochre)]/20 mb-6">
                            <Images size={14} className="text-[var(--color-ochre)]" />
                            <span className="text-[var(--color-ochre)] text-xs font-bold uppercase tracking-[0.2em]">Visual Journey</span>
                        </div>
                        <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-6xl font-bold !text-white mb-4 leading-tight">
                            Our Gallery
                        </h1>
                        <p className="text-white/60 text-lg max-w-xl mx-auto">
                            A visual exploration of sacred healing, our serene facility, and the transformative spirit of Vishwa Wellness.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Sticky Tab Bar */}
            <div className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex overflow-x-auto scrollbar-none">
                        {TABS.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-all duration-200 flex-shrink-0 ${
                                        isActive
                                            ? 'border-[var(--color-terracotta)] text-[var(--color-terracotta)]'
                                            : 'border-transparent text-gray-500 hover:text-gray-800'
                                    }`}
                                >
                                    <Icon size={16} />
                                    {tab.label}
                                    {!loading && countMap[tab.id] > 0 && (
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                                            isActive ? 'bg-[var(--color-terracotta)]/10 text-[var(--color-terracotta)]' : 'bg-gray-100 text-gray-400'
                                        }`}>
                                            {countMap[tab.id]}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Tab Content */}
            <section className="section-padding bg-white min-h-[60vh]">
                <div className="max-w-7xl mx-auto px-4">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.25 }}
                        >
                            {contentMap[activeTab]}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </section>
        </>
    );
}

/* ─── Skeleton Loader ────────────────────────────────────────────────────────── */
function SkeletonGrid() {
    return (
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
                <div
                    key={i}
                    className="break-inside-avoid rounded-xl bg-gray-100 animate-pulse"
                    style={{ height: `${160 + (i % 3) * 60}px` }}
                />
            ))}
        </div>
    );
}

