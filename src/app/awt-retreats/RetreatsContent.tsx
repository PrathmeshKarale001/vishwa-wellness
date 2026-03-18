"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Flame,
    Calendar,
    Users,
    CheckCircle2,
    ArrowRight,
    MapPin,
    Shield,
    PlayCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Card, CardContent, CardTitle } from "@/components/ui/Card";
import { Retreat } from "@/types";

// ─── Cloudinary Testimonial Videos ─────────────────────────────────────────
const CLOUD = 'dlxfsjx9t';

const testimonialVideos = [
    {
        id: 1,
        publicId: 'Vishwa_Test_3_1_afqhoe',
        version: 'v1773841524',
    },
    {
        id: 2,
        publicId: 'Vishwa_Test_4_1_cwo95y',
        version: 'v1773841520',
    },
    {
        id: 3,
        publicId: 'Vishwa_Test_1_1_dsofd8',
        version: 'v1773841518',
    },
    {
        id: 4,
        publicId: 'Vishwa_Test_2_1_oq6ehx',
        version: 'v1773841517',
    },
];

// Builds Cloudinary URL with transformations
function cldVideo(publicId: string, version: string) {
    // q_auto:eco = aggressive quality, vc_auto = best codec (VP9/H265/H264)
    return `https://res.cloudinary.com/${CLOUD}/video/upload/q_auto:eco,vc_auto/${version}/${publicId}.mp4`;
}
function cldThumb(publicId: string, version: string) {
    // Grab frame at 0.5s, auto-quality JPEG, 640px wide
    return `https://res.cloudinary.com/${CLOUD}/video/upload/f_jpg,q_auto:good,w_640,so_0.5/${version}/${publicId}.jpg`;
}

function VideoCard({ video, index }: { video: typeof testimonialVideos[0]; index: number }) {
    const [isPlaying, setIsPlaying] = useState(false);

    const thumbUrl = cldThumb(video.publicId, video.version);
    const videoUrl = cldVideo(video.publicId, video.version);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.12 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl bg-black shadow-xl"
            style={{ aspectRatio: '9/16' }}
        >
            {!isPlaying ? (
                <>
                    {/* Thumbnail — img fills the aspect-ratio parent reliably */}
                    <img
                        src={thumbUrl}
                        alt={`Retreat participant testimonial ${index + 1}`}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />

                    {/* Play button */}
                    <button
                        onClick={() => setIsPlaying(true)}
                        className="absolute inset-0 flex items-center justify-center group"
                        aria-label={`Play testimonial video ${index + 1}`}
                    >
                        <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-2xl transform scale-100 group-hover:scale-110 transition-transform duration-300">
                            <PlayCircle className="w-10 h-10 text-[var(--color-terracotta)] fill-[var(--color-terracotta)]" />
                        </div>
                    </button>

                    {/* Label badge */}
                    <div className="absolute bottom-4 left-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold rounded-full border border-white/15">
                            🔥 Retreat Participant
                        </span>
                    </div>
                </>
            ) : (
                /* Video only mounts on click — zero pre-load weight */
                <video
                    autoPlay
                    controls
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                    preload="metadata"
                >
                    <source src={videoUrl} type="video/mp4" />
                </video>
            )}
        </motion.div>
    );
}
// ────────────────────────────────────────────────────────────────────────────

interface RetreatsContentProps {
    retreats: Retreat[];
}

const retreatFormats = [
    {
        title: "3-Day Pain & Stress Reset",
        focus: "Immediate relief, nervous system calming, and rhythm correction.",
        bestFor: "First-time participants, working professionals, stress and pain management.",
        includes: [
            "Daily Agnihotra",
            "Bhasma Snān™, Lepam™, Pāna™",
            "Agni Jal™ support",
            "Restorative routines"
        ],
        link: "/contact",
        linkText: "Explore 3-Day Retreat",
        accent: "var(--color-terracotta)"
    },
    {
        title: "7-Day Detox & Metabolic Reset",
        focus: "Internal cleansing, digestive balance, inflammation reduction, and energy restoration.",
        bestFor: "Metabolic issues, chronic fatigue, digestive disorders, toxin overload.",
        includes: [
            "Deeper Bhasma therapies",
            "Structured Agni-aligned diet",
            "Extended internal support",
            "Lifestyle rhythm recalibration"
        ],
        link: "/contact",
        linkText: "Explore 7-Day Retreat",
        accent: "var(--color-ochre)"
    },
    {
        title: "15-Day Advanced Rejuvenation",
        focus: "Long-standing imbalance, deep regeneration, and systemic restoration.",
        bestFor: "Chronic conditions, long-term stress, and those seeking profound renewal.",
        includes: [
            "Full Agnihotra Wellness immersion",
            "Advanced ash therapies",
            "Extended Agni Jal™ protocols",
            "Long-term lifestyle guidance"
        ],
        link: "/contact",
        linkText: "Explore 15-Day Retreat",
        accent: "var(--color-forest)"
    }
];

const beyondRetreatItems = [
    "Personalised Agnihotra Wellness guidance",
    "Agni-based daily routines",
    "Agni-Infused™ products for home use",
    "Clear understanding of the Bhasma Ritual System™"
];

export default function RetreatsContent({ retreats }: RetreatsContentProps) {
    return (
        <>
            {/* Hero */}
            <section className="relative min-h-[75vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
                <div className="absolute inset-0 bg-[var(--color-navy)]" />
                <div className="absolute inset-0 z-0">
                    <img
                        src="/hero-2.jpg"
                        alt="Agnihotra Wellness Retreats Background"
                        className="w-full h-full object-cover opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-navy)] via-transparent to-[var(--color-navy)]/50" />
                </div>

                <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="inline-block px-4 py-1 rounded-full bg-[var(--color-ochre)]/10 border border-[var(--color-ochre)]/20 mb-8">
                            <span className="text-[var(--color-ochre)] text-xs font-bold uppercase tracking-[0.2em]">Agnihotra Wellness Retreats</span>
                        </div>

                        <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-6xl lg:text-7xl font-bold !text-white mb-6 leading-[1.1] drop-shadow-xl">
                            3 Days. One Fire.<br />
                            <span className="text-[var(--color-ochre)] drop-shadow-none">A Deep Reset.</span>
                        </h1>

                        <p className="text-lg md:text-xl !text-white/80 max-w-2xl mx-auto mb-12 leading-relaxed drop-shadow-md">
                            Immersive wellness experiences that combine sacred fire ceremonies,
                            daily Bhasma rituals, and personalized healing protocols.
                        </p>

                        <div className="flex flex-wrap justify-center gap-4">
                            <div className="flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-lg transition-transform hover:scale-105">
                                <MapPin className="w-5 h-5 text-[var(--color-ochre)]" />
                                <span className="text-white text-sm font-semibold">Sacred Valley, India</span>
                            </div>
                            <div className="flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-lg transition-transform hover:scale-105">
                                <Users className="w-5 h-5 text-[var(--color-ochre)]" />
                                <span className="text-white text-sm font-semibold">Small Groups (8-12)</span>
                            </div>
                            <div className="flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-lg transition-transform hover:scale-105">
                                <Calendar className="w-5 h-5 text-[var(--color-ochre)]" />
                                <span className="text-white text-sm font-semibold">Year-Round</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ========== RETREAT FORMATS ========== */}
            <Section background="cream">
                <SectionHeading
                    title="Choose Your Depth of Healing"
                />

                <div className="grid md:grid-cols-3 gap-8 mt-12">
                    {retreatFormats.map((format, index) => (
                        <motion.div
                            key={format.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                            viewport={{ once: true }}
                            className="h-full"
                        >
                            <Card variant="bordered" className="h-full flex flex-col p-0 overflow-hidden">
                                {/* Card accent top bar */}
                                <div className="h-1.5 w-full" style={{ backgroundColor: format.accent }} />

                                <CardContent className="flex-1 flex flex-col p-8">
                                    <div className="flex items-center gap-3 mb-5">
                                        <span className="text-xl">🔹</span>
                                        <CardTitle className="text-xl md:text-2xl !mb-0">
                                            {format.title}
                                        </CardTitle>
                                    </div>

                                    <div className="mb-5">
                                        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-terracotta)] mb-2">Focus</p>
                                        <p className="text-gray-600 leading-relaxed text-sm">{format.focus}</p>
                                    </div>

                                    <div className="mb-5">
                                        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-terracotta)] mb-2">Best for</p>
                                        <p className="text-gray-600 leading-relaxed text-sm">{format.bestFor}</p>
                                    </div>

                                    <div className="mb-8 flex-1">
                                        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-terracotta)] mb-3">Includes</p>
                                        <ul className="space-y-2.5">
                                            {format.includes.map((item) => (
                                                <li key={item} className="flex items-start gap-3 text-sm text-gray-600">
                                                    <CheckCircle2 className="w-4 h-4 text-[var(--color-forest)] flex-shrink-0 mt-0.5" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <Link href={format.link} className="mt-auto">
                                        <Button className="w-full group">
                                            {format.linkText}
                                            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </Section>

            {/* ========== TESTIMONIALS ========== */}
            <Section background="white">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-ochre)]/10 border border-[var(--color-ochre)]/20 mb-6">
                        <span className="text-[var(--color-ochre)] text-xs font-bold uppercase tracking-[0.2em]">Real Transformations</span>
                    </div>
                    <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl lg:text-5xl font-semibold text-[var(--color-navy)] mb-4">
                        Hear It From Our Participants
                    </h2>
                    <p className="text-gray-500 max-w-xl mx-auto text-lg leading-relaxed">
                        Genuine experiences from those who have walked the path of Agnihotra Wellness Therapy™.
                    </p>
                </div>

                {/* 2×2 portrait grid — videos load ONLY on click (no bandwidth wasted) */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {testimonialVideos.map((video, index) => (
                        <VideoCard key={video.id} video={video} index={index} />
                    ))}
                </div>
            </Section>

            {/* ========== BEYOND THE RETREAT ========== */}
            <section className="relative py-20 md:py-28 bg-[var(--color-navy)] overflow-hidden">
                {/* Decorative glow */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[var(--color-ochre)] blur-[120px]" />
                    <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-[var(--color-forest)] blur-[100px]" />
                </div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <div className="inline-block px-5 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
                            <span className="text-[var(--color-ochre)] text-xs font-bold uppercase tracking-[0.2em]">
                                🌿 What Makes Healing Last
                            </span>
                        </div>

                        <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-5xl font-bold !text-white mb-6 leading-[1.1]">
                            Beyond the Retreat
                        </h2>

                        <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto mb-12 leading-relaxed">
                            Healing does not end when the retreat ends.
                        </p>

                        <div className="text-left max-w-lg mx-auto mb-10">
                            <p className="text-white/60 mb-5 text-base">Participants leave with:</p>
                            <ul className="space-y-4">
                                {beyondRetreatItems.map((item) => (
                                    <li key={item} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-[var(--color-ochre)] flex-shrink-0 mt-0.5" />
                                        <span className="text-white/80 text-base">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <p className="text-base text-white/50 max-w-2xl mx-auto leading-relaxed">
                            This ensures continuity of healing beyond the retreat environment.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ========== SAFETY & SUPERVISION ========== */}
            <Section background="cream">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        viewport={{ once: true }}
                    >
                        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[var(--color-terracotta)]/10 border border-[var(--color-terracotta)]/20 mb-8">
                            <Shield className="w-4 h-4 text-[var(--color-terracotta)]" />
                            <span className="text-[var(--color-terracotta)] text-xs font-bold uppercase tracking-[0.2em]">
                                Safety & Supervision
                            </span>
                        </div>

                        <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-bold text-[var(--color-navy)] mb-8">
                            Applied with Responsibility
                        </h2>

                        <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
                            <p>
                                Agnihotra Wellness Retreats are guided and supervised.
                            </p>
                            <p>
                                Ash therapies follow strict preparation and application protocols.
                            </p>
                            <p className="text-gray-500 mt-6">
                                The aim is not intensity — but <strong className="text-[var(--color-navy)]">precision, safety, and sustainability</strong>.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </Section>

            {/* ========== CLOSING STATEMENT ========== */}
            <section className="relative py-24 md:py-32 bg-[var(--color-navy)] overflow-hidden">
                <div className="absolute inset-0 opacity-[0.07]">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[var(--color-ochre)] blur-[150px]" />
                </div>

                <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9 }}
                        viewport={{ once: true }}
                    >
                        <Flame className="w-8 h-8 text-[var(--color-ochre)] mx-auto mb-10 opacity-80" />

                        <div className="space-y-6">
                            <p className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl text-white/90 leading-relaxed">
                                The fire restores order.
                            </p>
                            <p className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl text-white/90 leading-relaxed">
                                The ash removes imbalance.
                            </p>
                            <p className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl text-white/90 leading-relaxed">
                                Rhythm allows healing to stay.
                            </p>
                        </div>

                        <div className="mt-12 pt-10 border-t border-white/10">
                            <p className="text-white/50 text-sm uppercase tracking-[0.2em] mb-3">This is the promise of</p>
                            <p className="font-[family-name:var(--font-playfair)] text-xl md:text-2xl text-[var(--color-ochre)] font-semibold">
                                Agnihotra Wellness Therapy™
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

        </>
    );
}
