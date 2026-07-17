"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
    Flame,
    ArrowRight,
    CheckCircle2,
    Shield,
    Eye,
    BookOpen,
    Sparkles,
    Heart,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Section, SectionHeading, SacredDivider } from "@/components/ui/Section";
import { Card, CardContent } from "@/components/ui/Card";
import { Hero } from "@/components/ui/Hero";

// ─── Animation helpers ───────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.7, delay },
});

// ─── Data ────────────────────────────────────────────────────────────
const awtSystemItems = [
    "The Bhasma Ritual System™",
    "Agni-Infused™ Technology",
    "Rhythm-based healing protocols",
];

const awtPurpose = [
    "Preserve authenticity",
    "Ensure safety",
    "Enable structured application",
    "Make Agnihotra accessible beyond ritual spaces",
];

const whatWeDoItems = [
    { icon: Flame, label: "Guided AWT Retreats" },
    { icon: Sparkles, label: "Agni-Infused™ Products" },
    { icon: Heart, label: "Agni Jal™ internal support" },
    { icon: BookOpen, label: "Educational programs and publications" },
];

const rootedIn = [
    "Fire discipline",
    "Scriptural alignment",
    "Practical safety",
    "Modern relevance",
];

const responsibilityItems = [
    "Agnihotra Ash is treated as medicine, not folklore",
    "Internal applications are guided and measured",
    "Retreat therapies are supervised",
    "Products follow clean-label and safety principles",
];

const visionItems = [
    "To restore Agni in individuals",
    "To bring rhythm back to families",
    "To reduce stress, toxicity, and imbalance",
    "To reconnect modern humanity with fire-based wisdom",
];

export default function AboutPage() {
    return (
        <>
            {/* ════════════ HERO ════════════ */}
            <Hero
                badge="About"
                title="A Living Fire Tradition"
                subtitle="Agnihotra • Lineage • Healing in Service of Humanity"
                description="Agnihotra Wellness Therapy™ is not a modern invention. It is the continuation of an ancient fire science, preserved through lineage, lived through practice, and applied responsibly for modern healing."
                bgImage="/21.jpg"
                theme="dark"
            />

            {/* ════════════ THE ORIGIN OF AWT ════════════ */}
            <Section background="white">
                <div className="max-w-4xl mx-auto">
                    <motion.div {...fadeUp()}>
                        <div className="text-center mb-10">
                            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--color-terracotta)]">
                                🌿 The Origin of AWT
                            </span>
                            <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl lg:text-5xl font-semibold text-[var(--color-navy)] mt-3">
                                Where This Healing System Comes From
                            </h2>
                            <div className="h-px w-16 bg-[var(--color-gold)] mx-auto mt-6" />
                        </div>

                        <div className="space-y-5 text-base md:text-lg text-[var(--color-charcoal)] leading-relaxed">
                            <p>
                                Agnihotra is a Vedic fire practice described in ancient scriptures
                                and preserved through generations of disciplined practice.
                            </p>
                            <p>
                                In the 20th century, at a time when humanity was entering an age of
                                pollution, stress, and imbalance, <strong className="text-[var(--color-navy)]">Param Sadguru Shree Gajanan
                                Maharaj</strong> brought renewed attention to Agnihotra as a practical
                                healing solution for the modern world.
                            </p>

                            <div className="bg-[var(--color-cream)] rounded-2xl p-8 border border-[var(--color-gold)]/20 my-8">
                                <p className="text-sm font-bold uppercase tracking-[0.15em] text-[var(--color-terracotta)] mb-4">
                                    He Emphasised
                                </p>
                                <ul className="space-y-3">
                                    {[
                                        "Precision in fire practice",
                                        "Purity of inputs",
                                        "Discipline of timing",
                                        "Application of Agnihotra Ash for healing",
                                    ].map((item) => (
                                        <li key={item} className="flex items-start gap-3 text-[var(--color-charcoal)]">
                                            <CheckCircle2 className="w-5 h-5 text-[var(--color-forest)] flex-shrink-0 mt-0.5" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <p>
                                This revival laid the foundation for what is now known as{" "}
                                <strong className="text-[var(--color-navy)]">
                                    Agnihotra Wellness Therapy™ (AWT)
                                </strong>.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </Section>

            {/* ════════════ THE GURU LINEAGE ════════════ */}
            <Section background="cream">
                <div className="max-w-4xl mx-auto">
                    <motion.div {...fadeUp()}>
                        <div className="text-center mb-10">
                            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--color-terracotta)]">
                                🌿 The Guru Lineage
                            </span>
                            <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl lg:text-5xl font-semibold text-[var(--color-navy)] mt-3">
                                A Living Lineage, Not a Lost Tradition
                            </h2>
                            <div className="h-px w-16 bg-[var(--color-gold)] mx-auto mt-6" />
                        </div>

                        <div className="space-y-5 text-base md:text-lg text-[var(--color-charcoal)] leading-relaxed">
                            <p>
                                After Param Sadguru Shree Gajanan Maharaj, his spiritual successor
                                and son, <strong className="text-[var(--color-navy)]">Shree Shreekantji Maharaj</strong>,
                                carried this work forward and expanded it globally.
                            </p>
                            <p>
                                Through decades of teaching, healing work, and international outreach,
                                the Agnihotra tradition was preserved not as ritual alone — but as a
                                living, applicable science.
                            </p>
                            <p>
                                Today, Agnihotra Wellness Therapy™ stands on this lineage of practice,
                                discipline, and service.
                            </p>
                        </div>

                        {/* Definitive Lineage Statement */}
                        <div className="mt-10 border-l-4 border-[var(--color-gold)] pl-6 py-4 bg-[var(--color-beige)]/50 rounded-r-xl">
                            <p className="font-[family-name:var(--font-playfair)] text-lg md:text-xl italic text-[var(--color-navy)] leading-relaxed">
                                After Param Sadguru Shree Gajanan Maharaj, his spiritual successor
                                and son Shree Shreekantji Maharaj expanded the Guru&apos;s work globally.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </Section>

            {/* ════════════ FROM PRACTICE TO SYSTEM ════════════ */}
            <Section background="white">
                <div className="max-w-4xl mx-auto">
                    <motion.div {...fadeUp()}>
                        <div className="text-center mb-10">
                            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--color-terracotta)]">
                                🔥 From Practice to System
                            </span>
                            <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl lg:text-5xl font-semibold text-[var(--color-navy)] mt-3">
                                How AWT Was Formed
                            </h2>
                            <div className="h-px w-16 bg-[var(--color-gold)] mx-auto mt-6" />
                        </div>

                        <div className="space-y-5 text-base md:text-lg text-[var(--color-charcoal)] leading-relaxed">
                            <p>
                                Over decades of observation and application, it became clear that
                                Agnihotra&apos;s healing power followed a repeatable structure.
                            </p>

                            <p className="font-semibold text-[var(--color-navy)]">
                                This structure was refined into:
                            </p>

                            {/* System Items */}
                            <div className="grid sm:grid-cols-3 gap-4 my-6">
                                {awtSystemItems.map((item, i) => (
                                    <motion.div
                                        key={item}
                                        {...fadeUp(i * 0.1)}
                                        className="bg-[var(--color-navy)] text-white rounded-xl p-5 text-center shadow-lg"
                                    >
                                        <Flame className="w-6 h-6 text-[var(--color-ochre)] mx-auto mb-3" />
                                        <p className="text-sm font-semibold leading-snug">{item}</p>
                                    </motion.div>
                                ))}
                            </div>

                            <p className="font-semibold text-[var(--color-navy)]">
                                Agnihotra Wellness Therapy™ was formalised to:
                            </p>

                            <ul className="space-y-3 ml-1">
                                {awtPurpose.map((item) => (
                                    <li key={item} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-[var(--color-forest)] flex-shrink-0 mt-0.5" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-8 pt-6 border-t border-[var(--color-gold)]/20">
                                <p className="font-[family-name:var(--font-playfair)] text-lg text-[var(--color-navy)] italic">
                                    AWT is not an abstraction.<br />
                                    It is a codified healing architecture.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </Section>

            {/* ════════════ OUR PHILOSOPHY ════════════ */}
            <section className="relative py-20 md:py-28 bg-[var(--color-navy)] overflow-hidden">
                {/* Decorative glows */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[var(--color-ochre)] blur-[120px]" />
                    <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-[var(--color-forest)] blur-[100px]" />
                </div>

                <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
                    <motion.div {...fadeUp()}>
                        <div className="inline-block px-5 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
                            <span className="text-[var(--color-ochre)] text-xs font-bold uppercase tracking-[0.2em]">
                                🌿 Our Philosophy
                            </span>
                        </div>

                        <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-5xl font-bold !text-white mb-6 leading-[1.1]">
                            Healing Is the Restoration of Order
                        </h2>

                        <div className="space-y-5 text-lg text-white/75 leading-relaxed text-left max-w-2xl mx-auto">
                            <p>
                                AWT is built on a simple principle:
                            </p>
                            <div className="border-l-4 border-[var(--color-ochre)] pl-6 py-2">
                                <p className="font-[family-name:var(--font-playfair)] text-xl text-white/90 italic">
                                    Illness is not the enemy.<br />
                                    Loss of rhythm is.
                                </p>
                            </div>
                            <p>
                                Modern life disrupts digestion, sleep, breath, emotion, and attention.
                                AWT restores Agni, rhythm, and coherence, allowing the body and mind
                                to heal naturally.
                            </p>
                            <p className="font-[family-name:var(--font-playfair)] text-xl text-white/90 italic text-center mt-6">
                                We do not fight disease.<br />
                                We remove what blocks healing.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ════════════ WHAT WE DO TODAY ════════════ */}
            <Section background="white">
                <div className="max-w-5xl mx-auto">
                    <motion.div {...fadeUp()}>
                        <div className="text-center mb-12">
                            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--color-terracotta)]">
                                🔥 What We Do Today
                            </span>
                            <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl lg:text-5xl font-semibold text-[var(--color-navy)] mt-3">
                                Agnihotra in Modern Life
                            </h2>
                            <div className="h-px w-16 bg-[var(--color-gold)] mx-auto mt-6" />
                        </div>
                    </motion.div>

                    <p className="text-base md:text-lg text-[var(--color-charcoal)] leading-relaxed text-center max-w-2xl mx-auto mb-10">
                        Today, AWT is applied through:
                    </p>

                    {/* Cards grid */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {whatWeDoItems.map((item, i) => (
                            <motion.div key={item.label} {...fadeUp(i * 0.1)}>
                                <Card className="h-full text-center hover:shadow-lg transition-all duration-300 group border border-gray-200">
                                    <CardContent className="p-8">
                                        <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-[var(--color-navy)] text-white flex items-center justify-center border-4 border-[var(--color-gold)] group-hover:scale-110 transition-transform">
                                            <item.icon className="w-6 h-6" />
                                        </div>
                                        <p className="font-semibold text-[var(--color-navy)] leading-snug">
                                            {item.label}
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* Rooted in */}
                    <div className="bg-[var(--color-cream)] rounded-2xl p-8 border border-[var(--color-gold)]/20 max-w-2xl mx-auto">
                        <p className="text-sm font-bold uppercase tracking-[0.15em] text-[var(--color-terracotta)] mb-4 text-center">
                            All applications remain rooted in
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            {rootedIn.map((item) => (
                                <div key={item} className="flex items-center gap-3">
                                    <CheckCircle2 className="w-4 h-4 text-[var(--color-forest)] flex-shrink-0" />
                                    <span className="text-sm text-[var(--color-charcoal)] font-medium">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Section>

            {/* ════════════ OUR RESPONSIBILITY ════════════ */}
            <Section background="cream">
                <div className="max-w-4xl mx-auto">
                    <motion.div {...fadeUp()}>
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[var(--color-terracotta)]/10 border border-[var(--color-terracotta)]/20 mb-6">
                                <Shield className="w-4 h-4 text-[var(--color-terracotta)]" />
                                <span className="text-[var(--color-terracotta)] text-xs font-bold uppercase tracking-[0.2em]">
                                    Our Responsibility
                                </span>
                            </div>
                            <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl lg:text-5xl font-semibold text-[var(--color-navy)]">
                                Tradition with Accountability
                            </h2>
                            <div className="h-px w-16 bg-[var(--color-gold)] mx-auto mt-6" />
                        </div>

                        <div className="space-y-5 text-base md:text-lg text-[var(--color-charcoal)] leading-relaxed max-w-3xl mx-auto">
                            <p>
                                We recognise the power of fire-based healing — and the responsibility
                                it carries.
                            </p>
                            <p className="font-semibold text-[var(--color-navy)]">Therefore:</p>

                            <ul className="space-y-4 ml-1">
                                {responsibilityItems.map((item) => (
                                    <li key={item} className="flex items-start gap-3">
                                        <Shield className="w-5 h-5 text-[var(--color-terracotta)] flex-shrink-0 mt-0.5" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-8 bg-white rounded-xl p-6 border border-[var(--color-gold)]/30 shadow-sm text-center">
                                <p className="font-[family-name:var(--font-playfair)] text-lg text-[var(--color-navy)] italic">
                                    AWT is complementary to medical care, not a replacement.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </Section>

            {/* ════════════ OUR VISION ════════════ */}
            <Section background="beige">
                <div className="max-w-4xl mx-auto">
                    <motion.div {...fadeUp()}>
                        <div className="text-center mb-10">
                            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--color-terracotta)]">
                                🌿 Our Vision
                            </span>
                            <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl lg:text-5xl font-semibold text-[var(--color-navy)] mt-3">
                                Creating Balance, One Life at a Time
                            </h2>
                            <div className="h-px w-16 bg-[var(--color-gold)] mx-auto mt-6" />
                        </div>

                        <p className="text-base md:text-lg text-[var(--color-charcoal)] leading-relaxed text-center mb-8">
                            Our vision is simple and long-term:
                        </p>

                        <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
                            {visionItems.map((item, i) => (
                                <motion.div
                                    key={item}
                                    {...fadeUp(i * 0.08)}
                                    className="flex items-start gap-3 bg-white rounded-xl p-5 shadow-sm border border-[var(--color-gold)]/15"
                                >
                                    <Eye className="w-5 h-5 text-[var(--color-ochre)] flex-shrink-0 mt-0.5" />
                                    <span className="text-sm md:text-base text-[var(--color-charcoal)] font-medium">{item}</span>
                                </motion.div>
                            ))}
                        </div>

                        <p className="text-center font-[family-name:var(--font-playfair)] text-lg italic text-[var(--color-navy)]">
                            Not as belief — but as daily, lived wellness.
                        </p>
                    </motion.div>
                </div>
            </Section>

            {/* ════════════ CLOSING STATEMENT ════════════ */}
            <section className="relative py-24 md:py-32 bg-[var(--color-navy)] overflow-hidden">
                <div className="absolute inset-0 opacity-[0.07]">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[var(--color-ochre)] blur-[150px]" />
                </div>

                <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
                    <motion.div {...fadeUp()}>
                        <Flame className="w-8 h-8 text-[var(--color-ochre)] mx-auto mb-10 opacity-80" />

                        <div className="space-y-6">
                            <p className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl text-white/90 leading-relaxed">
                                Agnihotra is the fire.
                            </p>
                            <p className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl text-white/90 leading-relaxed">
                                Bhasma is the medicine.
                            </p>
                            <p className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl text-white/90 leading-relaxed">
                                AWT is the system.
                            </p>
                            <p className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl text-[var(--color-ochre)] font-semibold leading-relaxed">
                                Healing is the outcome.
                            </p>
                        </div>

                        <div className="mt-12 pt-10 border-t border-white/10">
                            <p className="text-white/50 text-sm uppercase tracking-[0.2em] mb-3">This is</p>
                            <p className="font-[family-name:var(--font-playfair)] text-xl md:text-2xl text-[var(--color-ochre)] font-semibold">
                                Agnihotra Wellness Therapy™
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ════════════ CTA ════════════ */}
            <Section background="navy">
                <div className="text-center max-w-2xl mx-auto">
                    <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-semibold text-white mb-6">
                        Begin Your Healing Journey
                    </h2>
                    <p className="text-gray-300 mb-8">
                        Whether you&apos;re seeking healing, learning to practice, or looking to
                        bring these offerings to your community — we&apos;d love to connect.
                    </p>
                    <Link href="/contact">
                        <Button className="bg-white !text-[var(--color-navy)] hover:bg-[var(--color-beige)]">
                            Get in Touch
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            </Section>
        </>
    );
}
