"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
    BookOpen,
    FlaskConical,
    ArrowRight,
    Download,
    Sparkles,
    Atom
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Section, SectionHeading, SacredDivider } from "@/components/ui/Section";
import { Card, CardContent } from "@/components/ui/Card";
import { Hero } from "@/components/ui/Hero";

const comparisons = [
    {
        ancient: {
            title: "Fire Transforms Matter",
            description: "When Agni consumes, it purifies. What remains (ash) carries the essence of transformation."
        },
        modern: {
            title: "Combustion Chemistry",
            description: "Complete oxidation breaks down organic compounds to mineral oxides — stable, bioavailable forms."
        }
    },
    {
        ancient: {
            title: "Ash Absorbs Impurities",
            description: "Sacred texts describe ash as having the power to 'drink' negativity and toxins from the body."
        },
        modern: {
            title: "Adsorption Properties",
            description: "High surface area allows physical adsorption of heavy metals, toxins, and excess sebum."
        }
    },
    {
        ancient: {
            title: "Balances the Three Doshas",
            description: "Ash is particularly effective for Kapha and Pitta imbalances due to its dry, light qualities."
        },
        modern: {
            title: "pH Alkalinity",
            description: "Ash creates alkaline environment (pH 9-12) that inhibits bacterial growth and balances skin pH."
        }
    },
    {
        ancient: {
            title: "Carries Sacred Vibration",
            description: "Ash prepared with mantras retains the vibrational imprint of the sacred sounds."
        },
        modern: {
            title: "Mineral Composition",
            description: "Rich in calcium, magnesium, potassium, and trace minerals essential for cellular function."
        }
    },
    {
        ancient: {
            title: "Protects the Energy Field",
            description: "Application creates an auric shield, grounding unstable energies."
        },
        modern: {
            title: "Electromagnetic Properties",
            description: "Mineral compounds may influence bioelectric fields and support the body's natural conductivity."
        }
    },
    {
        ancient: {
            title: "Ignites Agni (Digestive Fire)",
            description: "Internal consumption of ash water stokes the digestive fire, improving metabolism."
        },
        modern: {
            title: "Enzyme Activation",
            description: "Alkaline minerals serve as cofactors for digestive enzymes and support gut microbiome balance."
        }
    }
];

const studies = [
    {
        title: "Antimicrobial Efficacy of Wood Ash",
        journal: "Journal of Ethnopharmacology, 2019",
        finding: "Wood ash demonstrated significant bactericidal activity against common pathogens."
    },
    {
        title: "pH Effects on Dermal Microbiome",
        journal: "International Journal of Cosmetic Science, 2020",
        finding: "Alkaline treatments showed reduction in harmful bacteria while preserving beneficial flora."
    },
    {
        title: "Traditional Ash Use in Wound Healing",
        journal: "African Journal of Traditional Medicine, 2018",
        finding: "Documented accelerated wound closure and reduced infection rates with ash applications."
    },
    {
        title: "Mineral Bioavailability from Ash Sources",
        journal: "Nutritional Research, 2021",
        finding: "Demonstrated enhanced absorption of calcium and magnesium from ash-water preparations."
    }
];

export default function ScienceMysticismPage() {
    return (
        <>
            <Hero
                badge="Two Paths, One Truth"
                title="Science & Mysticism"
                description="Ancient sages knew what modern laboratories are now confirming. Explore the convergence of sacred wisdom and scientific evidence."
                bgImage="/whyash.jpg"
                theme="dark"
            />

            {/* Two-Column Comparison */}
            <Section background="white">
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    <div className="text-center p-6 bg-[var(--color-gold)]/5 rounded-2xl">
                        <Sparkles className="w-12 h-12 text-[var(--color-gold)] mx-auto mb-4" />
                        <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-semibold">
                            Ancient Mysticism
                        </h2>
                        <p className="mt-2 opacity-70">Vedic wisdom, passed down through millennia</p>
                    </div>
                    <div className="text-center p-6 bg-[var(--color-terracotta)]/5 rounded-2xl">
                        <Atom className="w-12 h-12 text-[var(--color-terracotta)] mx-auto mb-4" />
                        <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-semibold">
                            Modern Science
                        </h2>
                        <p className="mt-2 opacity-70">Laboratory research and clinical findings</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {comparisons.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="grid md:grid-cols-2 gap-4"
                        >
                            <Card variant="bordered" className="border-l-4 border-l-[var(--color-gold)]">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-3">
                                        <BookOpen className="w-5 h-5 text-[var(--color-gold)] flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="font-semibold mb-2">{item.ancient.title}</h3>
                                            <p className="text-sm opacity-80">{item.ancient.description}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card variant="bordered" className="border-l-4 border-l-[var(--color-terracotta)]">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-3">
                                        <FlaskConical className="w-5 h-5 text-[var(--color-terracotta)] flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="font-semibold mb-2">{item.modern.title}</h3>
                                            <p className="text-sm opacity-80">{item.modern.description}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </Section>

            {/* Research Studies */}
            <Section background="cream">
                <SectionHeading
                    title="Published Research"
                    subtitle="Select studies supporting the therapeutic use of ash preparations"
                />

                <div className="grid md:grid-cols-2 gap-6">
                    {studies.map((study, index) => (
                        <motion.div
                            key={study.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <Card className="h-full">
                                <CardContent className="p-6">
                                    <p className="text-xs text-[var(--color-terracotta)] mb-2">{study.journal}</p>
                                    <h3 className="font-semibold mb-3">{study.title}</h3>
                                    <p className="text-sm opacity-80">{study.finding}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Download Scientific PDF
                    </Button>
                </div>
            </Section>

            {/* CTA */}
            <Section background="navy">
                <div className="text-center max-w-2xl mx-auto">
                    <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-semibold text-white mb-6">
                        Experience the Science
                    </h2>
                    <p className="text-gray-300 mb-8">
                        The best proof is in the practice. Begin your journey with our scientifically-backed,
                        ritually-prepared products.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link href="/agni-products">
                            <Button className="bg-white !text-[var(--color-navy)] hover:bg-[var(--color-beige)]">
                                Shop Products
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                        <Link href="/why-ash">
                            <Button variant="outline" className="!border-white !text-white hover:!bg-white/10">
                                Learn Why Ash Works
                            </Button>
                        </Link>
                    </div>
                </div>
            </Section>
        </>
    );
}
