"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
    Flame,
    Calendar,
    Users,
    CheckCircle2,
    ArrowRight,
    Star,
    MapPin
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Card, CardImage, CardContent, CardTitle, CardDescription } from "@/components/ui/Card";
import { Retreat } from "@/types";
import { getImageUrl } from "@/lib/image-utils";

interface RetreatsContentProps {
    retreats: Retreat[];
}

const testimonials = [
    {
        name: "Priya M.",
        location: "Mumbai",
        retreat: "7-Day Detox",
        quote: "The retreat transformed my relationship with my body. The ash rituals were profound."
    },
    {
        name: "Rahul S.",
        location: "Bangalore",
        retreat: "3-Day Reset",
        quote: "I came for stress relief and found so much more. The fire ceremonies were life-changing."
    },
    {
        name: "Sarah L.",
        location: "New York",
        retreat: "15-Day Rejuvenation",
        quote: "Worth every rupee. I feel 10 years younger and completely aligned with my purpose."
    }
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
                        alt="AWT Retreats Background"
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
                            <span className="text-[var(--color-ochre)] text-xs font-bold uppercase tracking-[0.2em]">AWT Retreats</span>
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

            {/* Retreat Options */}
            <Section background="cream">
                <SectionHeading
                    title="Choose Your Journey"
                    subtitle="From weekend resets to deep immersive experiences, find the retreat that calls to you."
                />

                {retreats && retreats.length > 0 ? (
                    <div className="grid md:grid-cols-3 gap-8">
                        {retreats.map((retreat, index) => (
                            <motion.div
                                key={retreat._id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="h-full"
                            >
                                <Card variant="bordered" className="h-full flex flex-col">
                                    <CardImage
                                        src={getImageUrl(retreat.images?.[0])}
                                        alt={retreat.title}
                                        aspectRatio="video"
                                    />
                                    <CardContent className="flex-1 flex flex-col">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="px-3 py-1 bg-[var(--color-terracotta)] text-white text-xs font-medium rounded-full">
                                                {retreat.duration}
                                            </span>
                                            {retreat.location && (
                                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                                    <MapPin size={12} /> {retreat.location}
                                                </span>
                                            )}
                                        </div>
                                        <CardTitle className="text-2xl mb-2">{retreat.title}</CardTitle>
                                        <p className="text-3xl font-semibold mb-4 text-[var(--color-navy)]">
                                            ₹{retreat.price.toLocaleString('en-IN')}
                                            <span className="text-sm font-normal opacity-70"> / person</span>
                                        </p>
                                        <CardDescription className="mb-6">{retreat.description}</CardDescription>

                                        {retreat.features && retreat.features.length > 0 && (
                                            <div className="mb-6 flex-1">
                                                <p className="font-medium mb-3">What's Included:</p>
                                                <ul className="space-y-2">
                                                    {retreat.features.slice(0, 5).map((item) => (
                                                        <li key={item} className="flex items-start gap-2 text-sm opacity-90">
                                                            <CheckCircle2 className="w-4 h-4 text-[var(--color-forest)] flex-shrink-0 mt-0.5" />
                                                            {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        <Link href="/contact" className="mt-auto">
                                            <Button className="w-full">
                                                Book Now
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Coming soon! We are curating our next sacred retreat experiences.</p>
                    </div>
                )}
            </Section>

            {/* Testimonials */}
            <Section background="white">
                <SectionHeading
                    title="Transformation Stories"
                    subtitle="Hear from those who have walked the fire path before you."
                />

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <Card variant="bordered" className="p-8 h-full">
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-[var(--color-gold)] text-[var(--color-gold)]" />
                                    ))}
                                </div>
                                <p className="italic mb-6 opacity-90">
                                    &ldquo;{testimonial.quote}&rdquo;
                                </p>
                                <div>
                                    <p className="font-semibold">{testimonial.name}</p>
                                    <p className="text-sm opacity-70">
                                        {testimonial.location} • {testimonial.retreat}
                                    </p>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </Section>

            {/* Continue at Home */}
            <Section background="beige">
                <div className="text-center max-w-2xl mx-auto">
                    <Flame className="w-12 h-12 text-[var(--color-terracotta)] mx-auto mb-6" />
                    <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-semibold text-[var(--color-navy)] mb-6">
                        Continue at Home
                    </h2>
                    <p className="mb-8 opacity-90">
                        Every retreat participant receives a curated collection of products
                        to continue their practice at home.
                    </p>
                    <Link href="/agni-products">
                        <Button variant="outline">
                            Shop Retreat Products
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            </Section>
        </>
    );
}
