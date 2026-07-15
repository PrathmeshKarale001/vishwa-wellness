"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    ArrowRight,
    Calendar,
    CheckCircle2,
    Flame,
    Gauge,
    Info,
    Sparkles,
    Users,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Card, CardContent, CardTitle } from "@/components/ui/Card";
import { RetreatFormat } from "../retreatFormats";
import RetreatEnquiryForm from "./RetreatEnquiryForm";

interface RetreatFormatDetailProps {
    format: RetreatFormat;
}

export default function RetreatFormatDetail({ format }: RetreatFormatDetailProps) {
    return (
        <>
            {/* ========== HERO ========== */}
            <section className="relative min-h-[65vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
                <div className="absolute inset-0 bg-[var(--color-navy)]" />
                <div className="absolute inset-0 z-0">
                    <img
                        src="/hero-2.jpg"
                        alt={`${format.title} background`}
                        className="w-full h-full object-cover opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-navy)] via-transparent to-[var(--color-navy)]/50" />
                </div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <Link
                            href="/awt-retreats"
                            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-8 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            All Retreats
                        </Link>

                        <div className="block mb-8">
                            <span
                                className="inline-block px-4 py-1 rounded-full border text-xs font-bold uppercase tracking-[0.2em]"
                                style={{
                                    color: "var(--color-ochre)",
                                    backgroundColor: "color-mix(in srgb, var(--color-ochre) 10%, transparent)",
                                    borderColor: "color-mix(in srgb, var(--color-ochre) 20%, transparent)",
                                }}
                            >
                                Agnihotra Wellness Retreat
                            </span>
                        </div>

                        <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl lg:text-6xl font-bold !text-white mb-6 leading-[1.1] drop-shadow-xl">
                            {format.title}
                        </h1>

                        <p className="text-lg md:text-xl !text-white/80 max-w-2xl mx-auto mb-12 leading-relaxed drop-shadow-md">
                            {format.tagline}
                        </p>

                        <div className="flex flex-wrap justify-center gap-4">
                            <div className="flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-lg">
                                <Calendar className="w-5 h-5 text-[var(--color-ochre)]" />
                                <span className="text-white text-sm font-semibold">{format.duration}</span>
                            </div>
                            <div className="flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-lg">
                                <Users className="w-5 h-5 text-[var(--color-ochre)]" />
                                <span className="text-white text-sm font-semibold">{format.groupSize}</span>
                            </div>
                            <div className="flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-lg">
                                <Gauge className="w-5 h-5 text-[var(--color-ochre)]" />
                                <span className="text-white text-sm font-semibold">{format.intensity}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ========== OVERVIEW ========== */}
            <Section background="cream">
                <div className="grid lg:grid-cols-3 gap-12">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="lg:col-span-2"
                    >
                        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-terracotta)] mb-4">
                            About This Retreat
                        </p>
                        <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-semibold text-[var(--color-navy)] mb-8">
                            {format.focus}
                        </h2>
                        <div className="space-y-5 text-gray-600 text-lg leading-relaxed">
                            {format.overview.map((paragraph, index) => (
                                <p key={index}>{paragraph}</p>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        viewport={{ once: true }}
                    >
                        <Card variant="bordered" className="p-0 overflow-hidden sticky top-28">
                            <div className="h-1.5 w-full" style={{ backgroundColor: format.accent }} />
                            <CardContent className="p-8">
                                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-terracotta)] mb-4">
                                    This retreat is for you if
                                </p>
                                <ul className="space-y-3.5 mb-8">
                                    {format.idealIf.map((item) => (
                                        <li key={item} className="flex items-start gap-3 text-sm text-gray-600 leading-relaxed">
                                            <CheckCircle2 className="w-4 h-4 text-[var(--color-forest)] flex-shrink-0 mt-0.5" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <Link href="#enquire">
                                    <Button className="w-full group">
                                        Enquire About This Retreat
                                        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </Section>

            {/* ========== DAY-BY-DAY JOURNEY ========== */}
            <Section background="white">
                <SectionHeading
                    title="Your Journey, Day by Day"
                    subtitle="Every phase is structured around the sunrise and sunset fire — nothing is left to chance."
                />

                <div className="max-w-3xl mx-auto">
                    {format.journey.map((phase, index) => (
                        <motion.div
                            key={phase.day}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="relative pl-10 md:pl-14 pb-12 last:pb-0"
                        >
                            {/* Timeline line */}
                            {index < format.journey.length - 1 && (
                                <div className="absolute left-[13px] md:left-[17px] top-8 bottom-0 w-px bg-gray-200" />
                            )}
                            {/* Timeline dot */}
                            <div
                                className="absolute left-0 top-1 w-7 h-7 md:w-9 md:h-9 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: `color-mix(in srgb, ${format.accent} 15%, white)` }}
                            >
                                <Flame className="w-3.5 h-3.5 md:w-4 md:h-4" style={{ color: format.accent }} />
                            </div>

                            <p
                                className="text-xs font-bold uppercase tracking-[0.15em] mb-2"
                                style={{ color: format.accent }}
                            >
                                {phase.day}
                            </p>
                            <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-semibold text-[var(--color-navy)] mb-3">
                                {phase.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed mb-5">{phase.description}</p>
                            <ul className="space-y-2.5">
                                {phase.highlights.map((highlight) => (
                                    <li key={highlight} className="flex items-start gap-3 text-sm text-gray-600">
                                        <CheckCircle2 className="w-4 h-4 text-[var(--color-forest)] flex-shrink-0 mt-0.5" />
                                        {highlight}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </Section>

            {/* ========== THERAPIES ========== */}
            <Section background="cream">
                <SectionHeading
                    title="Therapies & Inclusions"
                    subtitle="The core protocols of Agnihotra Wellness Therapy™, applied at the depth this retreat allows."
                />

                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {format.therapies.map((therapy, index) => (
                        <motion.div
                            key={therapy.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <Card variant="bordered" className="h-full">
                                <CardContent className="p-7">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div
                                            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                                            style={{ backgroundColor: `color-mix(in srgb, ${format.accent} 15%, white)` }}
                                        >
                                            <Sparkles className="w-4 h-4" style={{ color: format.accent }} />
                                        </div>
                                        <CardTitle className="text-lg !mb-0">{therapy.name}</CardTitle>
                                    </div>
                                    <p className="text-gray-600 text-sm leading-relaxed">{therapy.description}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </Section>

            {/* ========== OUTCOMES ========== */}
            <section className="relative py-20 md:py-28 bg-[var(--color-navy)] overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[var(--color-ochre)] blur-[120px]" />
                    <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-[var(--color-forest)] blur-[100px]" />
                </div>

                <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <div className="inline-block px-5 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
                            <span className="text-[var(--color-ochre)] text-xs font-bold uppercase tracking-[0.2em]">
                                What You Take Home
                            </span>
                        </div>

                        <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-5xl font-bold !text-white mb-10 leading-[1.1]">
                            How You Will Leave
                        </h2>

                        <div className="text-left max-w-lg mx-auto">
                            <ul className="space-y-4">
                                {format.outcomes.map((outcome) => (
                                    <li key={outcome} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-[var(--color-ochre)] flex-shrink-0 mt-0.5" />
                                        <span className="text-white/80 text-base">{outcome}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ========== GOOD TO KNOW ========== */}
            <Section background="white">
                <div className="max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        viewport={{ once: true }}
                    >
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[var(--color-terracotta)]/10 border border-[var(--color-terracotta)]/20 mb-6">
                                <Info className="w-4 h-4 text-[var(--color-terracotta)]" />
                                <span className="text-[var(--color-terracotta)] text-xs font-bold uppercase tracking-[0.2em]">
                                    Good to Know
                                </span>
                            </div>
                            <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-bold text-[var(--color-navy)]">
                                Before You Arrive
                            </h2>
                        </div>

                        <ul className="space-y-4">
                            {format.goodToKnow.map((note) => (
                                <li
                                    key={note}
                                    className="flex items-start gap-4 p-5 rounded-xl bg-[var(--color-cream)] border border-gray-100"
                                >
                                    <CheckCircle2 className="w-5 h-5 text-[var(--color-forest)] flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-600 leading-relaxed">{note}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            </Section>

            {/* ========== ENQUIRY FORM ========== */}
            <Section background="cream" id="enquire" className="scroll-mt-24">
                <div className="max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        viewport={{ once: true }}
                    >
                        <div className="text-center mb-10">
                            <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-bold text-[var(--color-navy)] mb-4">
                                Enquire About the {format.title}
                            </h2>
                            <p className="text-gray-500 max-w-xl mx-auto text-lg leading-relaxed">
                                Tell us a little about yourself and our wellness team will get back
                                to you within 24 hours with available dates and next steps.
                            </p>
                        </div>

                        <RetreatEnquiryForm
                            retreatTitle={format.title}
                            retreatSlug={format.slug}
                            accent={format.accent}
                        />
                    </motion.div>
                </div>
            </Section>

            {/* ========== CTA ========== */}
            <section className="relative py-24 md:py-28 bg-[var(--color-navy)] overflow-hidden">
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
                        <Flame className="w-8 h-8 text-[var(--color-ochre)] mx-auto mb-8 opacity-80" />

                        <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-bold !text-white mb-6">
                            Ready to Begin?
                        </h2>
                        <p className="text-lg text-white/70 max-w-xl mx-auto mb-10 leading-relaxed">
                            Retreats are kept small — {format.groupSize.toLowerCase()} — and every stay begins
                            with a personal consultation. Reach out and we will help you choose your dates.
                        </p>

                        <div className="flex flex-wrap justify-center gap-4">
                            <Button asChild size="lg" variant="primary">
                                <Link href="#enquire">
                                    Enquire Now
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                            <Button
                                asChild
                                size="lg"
                                className="!bg-white/10 !text-white border border-white/20 hover:!bg-white/20"
                            >
                                <Link href="/awt-retreats#upcoming">View Upcoming Dates</Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </>
    );
}
