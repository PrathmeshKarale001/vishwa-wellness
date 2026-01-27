"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Mail,
    Phone,
    MapPin,
    MessageCircle,
    Calendar,
    Send,
    CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { Card, CardContent } from "@/components/ui/Card";
import { contactFormSchema, type ContactFormData } from "@/lib/validations/contact";

const retreatOptions = [
    { value: "3-day", label: "3-Day Pain & Stress Reset — ₹45,000" },
    { value: "7-day", label: "7-Day Detox & Metabolic Reset — ₹95,000" },
    { value: "15-day", label: "15-Day Advanced Rejuvenation — ₹1,85,000" },
];

const contactMethods = [
    {
        icon: Phone,
        title: "Phone",
        value: "+91 74474 89101",
        description: "Mon-Sat, 10am-7pm IST",
        href: "tel:+917447489101"
    },
    {
        icon: Mail,
        title: "Email",
        value: "crm@vishwaglobal.com",
        description: "We respond within 24 hours",
        href: "mailto:crm@vishwaglobal.com"
    },
    {
        icon: MessageCircle,
        title: "WhatsApp",
        value: "+91 74474 89101",
        description: "Instant messaging",
        href: "https://wa.me/917447489101"
    },
    {
        icon: MapPin,
        title: "Visit",
        value: "Shivpuri, Akkalkot",
        description: "By appointment only",
        href: "#"
    }
];

export default function ContactPage() {
    const [isSubmitted, setIsSubmitted] = useState(false);

    // React Hook Form setup with Zod resolver
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactFormSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            interest: "",
            retreat: "",
            message: "",
        },
    });

    const selectedInterest = watch("interest");

    const onSubmit = async (data: ContactFormData) => {
        // Simulate form submission
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log("Form submitted:", data);
        setIsSubmitted(true);
    };

    const handleReset = () => {
        reset();
        setIsSubmitted(false);
    };

    return (
        <>
            {/* Hero */}
            <section className="relative min-h-[75vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
                {/* Background layers */}
                <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-beige)] to-[var(--color-cream)]" />
                <div className="absolute inset-0 z-0">
                    <img
                        src="/awt-retreats-1.jpg"
                        alt="Contact Background"
                        className="w-full h-full object-cover opacity-15"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-cream)] via-transparent to-[var(--color-beige)]/50" />
                </div>

                <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="inline-block px-4 py-1 rounded-full bg-[var(--color-terracotta)]/10 border border-[var(--color-terracotta)]/20 mb-8">
                            <span className="text-[var(--color-terracotta)] text-xs font-bold uppercase tracking-[0.2em]">Connect</span>
                        </div>

                        <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-6xl lg:text-7xl font-bold text-[var(--color-navy)] mb-6 leading-[1.1]">
                            Contact Us
                        </h1>

                        <p className="text-lg md:text-xl text-[var(--color-ash)] max-w-2xl mx-auto leading-relaxed">
                            Ready to begin your healing journey? We're here to guide you.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Contact Methods */}
            <Section background="white" className="!py-12">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {contactMethods.map((method, index) => (
                        <motion.a
                            key={method.title}
                            href={method.href}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="block"
                        >
                            <Card variant="bordered" className="h-full hover:border-[var(--color-terracotta)] transition-colors">
                                <CardContent className="p-6 text-center">
                                    <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-[var(--color-terracotta)]/10 flex items-center justify-center">
                                        <method.icon className="w-6 h-6 text-[var(--color-terracotta)]" />
                                    </div>
                                    <h3 className="font-semibold text-[var(--color-navy)] mb-1">{method.title}</h3>
                                    <p className="text-[var(--color-charcoal)] text-sm">{method.value}</p>
                                    <p className="text-[var(--color-ash)] text-xs mt-1">{method.description}</p>
                                </CardContent>
                            </Card>
                        </motion.a>
                    ))}
                </div>
            </Section>

            {/* Contact Form */}
            <Section background="cream">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Form */}
                    <div>
                        <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-semibold text-[var(--color-navy)] mb-6">
                            Send Us a Message
                        </h2>

                        {isSubmitted ? (
                            <Card className="p-8 text-center">
                                <CheckCircle2 className="w-16 h-16 text-[var(--color-forest)] mx-auto mb-4" />
                                <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-semibold text-[var(--color-navy)] mb-2">
                                    Message Sent!
                                </h3>
                                <p className="text-[var(--color-ash)] mb-6">
                                    Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                                </p>
                                <Button onClick={handleReset}>
                                    Send Another Message
                                </Button>
                            </Card>
                        ) : (
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--color-navy)] mb-2">
                                            Your Name *
                                        </label>
                                        <input
                                            type="text"
                                            {...register("name")}
                                            className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-[var(--color-terracotta)]/20 outline-none transition-colors bg-white ${errors.name
                                                ? "border-red-400 focus:border-red-400"
                                                : "border-[var(--color-beige)] focus:border-[var(--color-terracotta)]"
                                                }`}
                                            placeholder="Enter your name"
                                        />
                                        {errors.name && (
                                            <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--color-navy)] mb-2">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            {...register("email")}
                                            className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-[var(--color-terracotta)]/20 outline-none transition-colors bg-white ${errors.email
                                                ? "border-red-400 focus:border-red-400"
                                                : "border-[var(--color-beige)] focus:border-[var(--color-terracotta)]"
                                                }`}
                                            placeholder="your@email.com"
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-navy)] mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        {...register("phone")}
                                        className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-[var(--color-terracotta)]/20 outline-none transition-colors bg-white ${errors.phone
                                            ? "border-red-400 focus:border-red-400"
                                            : "border-[var(--color-beige)] focus:border-[var(--color-terracotta)]"
                                            }`}
                                        placeholder="+91 74474 89101"
                                    />
                                    {errors.phone && (
                                        <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-navy)] mb-2">
                                        I&apos;m interested in...
                                    </label>
                                    <select
                                        {...register("interest")}
                                        className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-[var(--color-terracotta)]/20 outline-none transition-colors bg-white ${errors.interest
                                            ? "border-red-400 focus:border-red-400"
                                            : "border-[var(--color-beige)] focus:border-[var(--color-terracotta)]"
                                            }`}
                                    >
                                        <option value="">Select an option</option>
                                        <option value="products">Product Purchase</option>
                                        <option value="retreat">Retreat Booking</option>
                                        <option value="consultation">Wellness Consultation</option>
                                        <option value="wholesale">Wholesale / Business</option>
                                        <option value="other">Other Inquiry</option>
                                    </select>
                                    {errors.interest && (
                                        <p className="mt-1 text-sm text-red-500">{errors.interest.message}</p>
                                    )}
                                </div>

                                {selectedInterest === "retreat" && (
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--color-navy)] mb-2">
                                            Preferred Retreat
                                        </label>
                                        <select
                                            {...register("retreat")}
                                            className="w-full px-4 py-3 rounded-lg border border-[var(--color-beige)] focus:border-[var(--color-terracotta)] focus:ring-2 focus:ring-[var(--color-terracotta)]/20 outline-none transition-colors bg-white"
                                        >
                                            <option value="">Select a retreat</option>
                                            {retreatOptions.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-navy)] mb-2">
                                        Your Message
                                    </label>
                                    <textarea
                                        rows={5}
                                        {...register("message")}
                                        className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-[var(--color-terracotta)]/20 outline-none transition-colors bg-white resize-none ${errors.message
                                            ? "border-red-400 focus:border-red-400"
                                            : "border-[var(--color-beige)] focus:border-[var(--color-terracotta)]"
                                            }`}
                                        placeholder="Tell us about your wellness goals or any questions you have..."
                                    />
                                    {errors.message && (
                                        <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
                                    )}
                                </div>

                                <Button type="submit" size="lg" className="w-full sm:w-auto" loading={isSubmitting}>
                                    <Send className="w-4 h-4 mr-2" />
                                    {isSubmitting ? "Sending..." : "Send Message"}
                                </Button>
                            </form>
                        )}
                    </div>

                    {/* Retreat Quick Book */}
                    <div>
                        <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-semibold text-[var(--color-navy)] mb-6">
                            Book a Retreat
                        </h2>

                        <Card variant="bordered" className="mb-6">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <Calendar className="w-6 h-6 text-[var(--color-terracotta)]" />
                                    <h3 className="font-semibold text-[var(--color-navy)]">Quick Retreat Booking</h3>
                                </div>
                                <p className="text-sm text-[var(--color-ash)] mb-6">
                                    Ready to transform? Book your retreat directly or schedule a call
                                    to discuss which program is right for you.
                                </p>
                                <div className="space-y-3">
                                    {retreatOptions.map((retreat) => (
                                        <Link
                                            key={retreat.value}
                                            href={`/awt-retreats#${retreat.value}`}
                                            className="block p-4 rounded-lg border border-[var(--color-beige)] hover:border-[var(--color-terracotta)] hover:bg-[var(--color-beige)]/30 transition-colors"
                                        >
                                            <span className="text-[var(--color-navy)]">{retreat.label}</span>
                                        </Link>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-[var(--color-navy)] text-white">
                            <CardContent className="p-6">
                                <h3 className="font-[family-name:var(--font-playfair)] text-xl font-semibold mb-3 !text-white">
                                    Prefer to Talk?
                                </h3>
                                <p className="text-gray-300 text-sm mb-6">
                                    Our wellness advisors are available for a free 15-minute
                                    consultation to help you choose the right path.
                                </p>
                                <a href="https://wa.me/917447489101" target="_blank" rel="noopener noreferrer">
                                    <Button className="w-full bg-white !text-[var(--color-navy)] hover:bg-[var(--color-beige)]">
                                        <MessageCircle className="w-4 h-4 mr-2" />
                                        Chat on WhatsApp
                                    </Button>
                                </a>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </Section>

            {/* Map Placeholder */}
            <Section background="white" className="!py-0">
                <div className="h-80 bg-[var(--color-beige)] flex items-center justify-center">
                    <div className="text-center">
                        <MapPin className="w-12 h-12 text-[var(--color-ash)] mx-auto mb-4" />
                        <p className="text-[var(--color-charcoal)] font-medium">Head Office</p>
                        <p className="text-sm text-[var(--color-ash)]">Shivpuri, Akkalkot Station Road, Akkalkot 413216</p>
                    </div>
                </div>
            </Section>
        </>
    );
}
