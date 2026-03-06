"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
    Flame,
    Heart,
    Users,
    Award,
    ArrowRight,
    Quote
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Section, SectionHeading, SacredDivider } from "@/components/ui/Section";
import { Card, CardContent } from "@/components/ui/Card";
import { Hero } from "@/components/ui/Hero";

const globalJourney = [
    { year: "1856 AD", event: "Shree Swami Samarth Arrives In Akkalkot After Completing Intense Meditation." },
    { year: "1944 AD", event: "Paramsadguru takes the vow to rejuvenate the Vedas; Sapta Shloki revealed." },
    { year: "1969 AD", event: "First Mahasomayaga at Shivpuri - established as a spiritual center." },
    { year: "1974 AD", event: "First Agnihotra practitioner initiated by Paramsadguru." },
    { year: "1978 AD", event: "First International Agnihotra center established in the USA." },
    { year: "2009 AD", event: "Vishwa Foundation initiated as an umbrella for global upliftment missions." },
    { year: "2023 AD", event: "Vishwa is Future Ready! Global presence in 40+ countries with 500,000+ practitioners." }
];




const guidingLight = [
    {
        name: "Shree Swami Samarth Maharaj",
        role: "The Fourth Incarnation of Lord Dattatreya",
        image: "https://vishwaglobal.com/images/newtheme/Shree-Swami-Samarth-Maharaj.jpg",
        bio: "Considered the fourth Incarnation of Lord Dattatreya, he graced Akkalkot in 1856, imparting wisdom and guiding disciples toward inner peace and happiness through his profound teachings.",
        link: "https://vishwaglobal.com/about-us"
    },
    {
        name: "Paramsadguru Shree Gajanan Maharaj",
        role: "The Visionary of Global Healing",
        image: "https://vishwaglobal.com/images/newtheme/Paramsadguru.jpg",
        bio: "As the disciple of Swami Samarth Maharaj, Paramsadguru inspired by the teachings of the lineage, created a global vision and mission to heal humanity and reset the planet.",
        link: "https://paramsadguru.vishwaglobal.com/"
    },
    {
        name: "Dr. Purushottam",
        role: "Steward of the Lineage",
        image: "https://vishwaglobal.com/images/newtheme/Dr-Purushottam-og.jpg",
        bio: "Paramsadguru’s grandson, Dr. Purushottam has dedicated his life to sharing spiritual knowledge, fostering a global community and enriching the lives of countless seekers worldwide.",
        link: "https://vishwaglobal.com/doctor-purushottam"
    },
];




const vishwaValues = [
    { letter: "V", title: "Visionary Leadership", description: "We are blessed to have exemplary leadership with divine vision for not just our community, but for the world at large." },
    { letter: "I", title: "Inspiration", description: "Cultivating a culture that inspires generations by enabling individuals to become guided by the Divine." },
    { letter: "S", title: "Spiritual Wisdom", description: "Embracing the profound philosophy of the Guru Lineage as a guiding light." },
    { letter: "H", title: "Harmony", description: "Promoting harmony within and across the world by recognizing the oneness of all beings." },
    { letter: "W", title: "Wellness", description: "Prioritizing the well-being of individuals, physically, emotionally and spiritually." },
    { letter: "A", title: "Acceptance", description: "Embracing our own unique identity and staying open to new ideas, cultures, and perspectives." }
];

export default function AboutPage() {
    return (
        <>
            {/* Hero */}
            <Hero
                badge="Our Story"
                title="About Vishwa Wellness"
                description="Born from a 170+ year old Guru Lineage, we empower individuals to channel their spiritual energy and manifest a new life."
                bgImage="/hero-about-us.png"
                theme="dark"
            />

            {/* Mission & Vision */}
            <Section background="white">
                <div className="max-w-4xl mx-auto text-center space-y-12">
                    <div>
                        <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-semibold text-[var(--color-navy)] mb-6">Our Vision</h2>
                        <p className="text-lg text-[var(--color-charcoal)] leading-relaxed">
                            Vishwa envisions a world of universal oneness and profound inner peace. Our vision is to create a global community where the timeless wisdom of the Vedas guides individuals to channel their spiritual energy to manifest a new life.
                        </p>
                    </div>
                    <div>
                        <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-semibold text-[var(--color-navy)] mb-6">Our Mission</h2>
                        <p className="text-lg text-[var(--color-charcoal)] leading-relaxed">
                            Our mission is to disseminate the profound teachings of the Guru Lineage, empowering individuals to embark on a transformative journey and learn to heal themselves. We are committed to cultivating individuals who are spiritually awakened, environmentally aware, and driven to create social change.
                        </p>
                    </div>
                </div>
            </Section>

            {/* VISHWA Values */}
            <Section background="beige">
                <SectionHeading
                    title="Our Core Values"
                    subtitle="Empowering lives through the 5 Fold Path"
                />

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {vishwaValues.map((value, index) => (
                        <motion.div
                            key={value.letter}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <Card className="h-full text-center hover:shadow-lg transition-shadow duration-300">
                                <CardContent className="p-8">
                                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[var(--color-navy)] text-white flex items-center justify-center text-2xl font-bold font-[family-name:var(--font-playfair)] border-4 border-[var(--color-gold)]">
                                        {value.letter}
                                    </div>
                                    <h3 className="font-[family-name:var(--font-playfair)] text-xl font-semibold mb-3 text-[var(--color-navy)]">
                                        {value.title}
                                    </h3>
                                    <p className="text-sm opacity-80 leading-relaxed text-[var(--color-charcoal)]">{value.description}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </Section>

            {/* Global Journey Timeline */}
            <Section background="white">
                <SectionHeading
                    title="Vishwa: Our Global Journey"
                    subtitle="Propagating the 170+ year old Guru Lineage"
                />

                <div className="max-w-4xl mx-auto">
                    <div className="space-y-0">
                        {globalJourney.map((item, index) => (
                            <motion.div
                                key={item.year}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="flex gap-8 group"
                            >
                                <div className="flex flex-col items-center">
                                    <div className="w-5 h-5 rounded-full bg-[var(--color-navy)] border-4 border-[var(--color-gold)] z-10" />
                                    {index < globalJourney.length - 1 && (
                                        <div className="w-0.5 flex-1 bg-gradient-to-b from-[var(--color-gold)] to-transparent -mt-1" />
                                    )}
                                </div>
                                <div className="pb-10 pt-0.5">
                                    <span className="text-[var(--color-terracotta)] font-bold text-lg tracking-wider">{item.year}</span>
                                    <p className="mt-2 text-[var(--color-charcoal)] font-medium leading-relaxed group-hover:text-[var(--color-navy)] transition-colors">{item.event}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </Section>

            {/* Fire Lineage */}
            <Section background="cream">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-semibold mb-6">
                            The Fire Lineage
                        </h2>
                        <p className="leading-relaxed mb-6 opacity-90">
                            For over five decades, our founding teacher traveled the sacred lands of India,
                            learning from Himalayan masters, temple priests, and village healers who had
                            preserved the knowledge of Agni (sacred fire) medicine.
                        </p>
                        <p className="leading-relaxed mb-6 opacity-90">
                            The Guru Tradition is a sacred lineage that passes down spiritual wisdom
                            from master to disciple, fostering a profound connection to higher
                            consciousness. Rooted in timeless teachings, it serves as a guiding light
                            for seekers on the path of awakening.
                        </p>
                        <p className="leading-relaxed opacity-90">
                            Today, Vishwa Wellness carries this flame forward, adapting ancient protocols
                            for modern bodies while never compromising on authenticity or sacred intention.
                        </p>
                    </div>
                    <div className="relative rounded-2xl aspect-square overflow-hidden shadow-2xl">
                        <Image
                            src="/firelineage.jpg"
                            alt="The Sacred Fire Lineage"
                            fill
                            className="object-cover transition-transform duration-700 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-navy)]/40 to-transparent" />
                    </div>
                </div>
            </Section>

            {/* Our Guiding Light */}
            <Section background="white">
                <SectionHeading
                    title="Our Guiding Light"
                    subtitle="Propellers of the Sacred Tradition"
                />

                <div className="max-w-3xl mx-auto text-center mb-16 -mt-8">
                    <p className="text-lg text-[var(--color-charcoal)] opacity-80">
                        The Guru Tradition is a sacred lineage that passes down spiritual wisdom from master to disciple,
                        fostering a profound connection to higher consciousness. Rooted in timeless teachings, it serves as a guiding light for seekers on the path of awakening.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {guidingLight.map((guru, index) => (
                        <motion.div
                            key={guru.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.15 }}
                            viewport={{ once: true }}
                        >
                            <Card variant="bordered" className="h-full hover:border-[var(--color-gold)] transition-all duration-300 group overflow-hidden bg-white">
                                <div className="aspect-[4/5] relative overflow-hidden bg-stone-100">
                                    <Image
                                        src={guru.image}
                                        alt={guru.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-navy)]/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                                </div>
                                <CardContent className="text-center p-6 relative">
                                    <h3 className="font-[family-name:var(--font-playfair)] text-xl font-bold mb-2 text-[var(--color-navy)] leading-tight">
                                        {guru.name}
                                    </h3>
                                    <div className="h-px w-10 bg-[var(--color-gold)] mx-auto mb-4" />
                                    <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-terracotta)] mb-4">
                                        {guru.role}
                                    </p>
                                    <p className="text-sm opacity-80 mb-6 leading-relaxed line-clamp-4">
                                        {guru.bio}
                                    </p>
                                    <a href={guru.link} target="_blank" rel="noopener noreferrer">
                                        <Button variant="outline" size="sm" className="hover:bg-[var(--color-gold)] hover:text-white hover:border-[var(--color-gold)] rounded-full px-8">
                                            Know More
                                        </Button>
                                    </a>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </Section>

            {/* Wellness Video */}
            <Section background="beige">
                <SectionHeading
                    title="Experience Our Wellness Journey"
                    subtitle="Watch and discover the transformative power of ancient healing"
                />

                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative rounded-2xl overflow-hidden shadow-2xl"
                    >
                        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                            <iframe
                                className="absolute inset-0 w-full h-full"
                                src="https://www.youtube.com/embed/H79P9JWeEYI"
                                title="Vishwa Wellness Video"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            />
                        </div>
                    </motion.div>
                    <p className="text-center text-[var(--color-charcoal)] mt-6 opacity-80">
                        Discover how ancient Vedic practices and sacred fire rituals are transforming lives around the world.
                    </p>
                </div>
            </Section>

            {/* CTA */}
            <Section background="navy">
                <div className="text-center max-w-2xl mx-auto">
                    <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-semibold text-white mb-6">
                        Join Our Mission
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
