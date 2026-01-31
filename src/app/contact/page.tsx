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
    CheckCircle2,
    Building2,
    Clock
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { Card, CardContent } from "@/components/ui/Card";
import { Hero } from "@/components/ui/Hero";
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
        title: "Visit Us",
        value: "Shivpuri, Akkalkot",
        description: "By appointment only",
        href: "#location"
    }
];

export default function ContactPage() {
    const [isSubmitted, setIsSubmitted] = useState(false);

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
            {/* Hero Section - Dark Theme */}
            <Hero
                badge="Get In Touch"
                title="Contact Us"
                description="Ready to begin your healing journey? We're here to guide you every step of the way."
                bgImage="/awt-retreats-1.jpg"
                theme="dark"
                minHeight="min-h-[50vh]"
            />

            {/* Contact Methods Grid */}
            <Section background="white" className="!py-16">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {contactMethods.map((method, index) => (
                        <motion.a
                            key={method.title}
                            href={method.href}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="block group"
                        >
                            <Card variant="bordered" className="h-full hover:border-[var(--color-primary)] hover:shadow-lg transition-all duration-300">
                                <CardContent className="p-6 text-center">
                                    <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <method.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="font-semibold text-[var(--color-navy)] mb-1 text-lg">{method.title}</h3>
                                    <p className="text-[var(--color-primary)] font-medium">{method.value}</p>
                                    <p className="text-[var(--color-ash)] text-sm mt-1">{method.description}</p>
                                </CardContent>
                            </Card>
                        </motion.a>
                    ))}
                </div>
            </Section>

            {/* Contact Form & Retreat Booking */}
            <Section background="cream">
                <div className="grid lg:grid-cols-5 gap-12">
                    {/* Form - Takes 3 columns */}
                    <div className="lg:col-span-3">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-semibold text-[var(--color-navy)] mb-2">
                                Send Us a Message
                            </h2>
                            <p className="text-[var(--color-ash)] mb-8">
                                Fill out the form below and our team will get back to you within 24 hours.
                            </p>

                            {isSubmitted ? (
                                <Card className="p-10 text-center bg-white">
                                    <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
                                    <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-semibold text-[var(--color-navy)] mb-3">
                                        Message Sent Successfully!
                                    </h3>
                                    <p className="text-[var(--color-ash)] mb-8 max-w-md mx-auto">
                                        Thank you for reaching out. Our wellness team will review your message and respond within 24 hours.
                                    </p>
                                    <Button onClick={handleReset} variant="outline">
                                        Send Another Message
                                    </Button>
                                </Card>
                            ) : (
                                <Card className="p-8 bg-white">
                                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                        <div className="grid sm:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-sm font-medium text-[var(--color-navy)] mb-2">
                                                    Your Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    {...register("name")}
                                                    className={`w-full px-4 py-3.5 rounded-lg border-2 focus:ring-0 outline-none transition-colors bg-[var(--color-bg-light)] ${errors.name
                                                        ? "border-red-400 focus:border-red-400"
                                                        : "border-transparent focus:border-[var(--color-primary)]"
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
                                                    className={`w-full px-4 py-3.5 rounded-lg border-2 focus:ring-0 outline-none transition-colors bg-[var(--color-bg-light)] ${errors.email
                                                        ? "border-red-400 focus:border-red-400"
                                                        : "border-transparent focus:border-[var(--color-primary)]"
                                                        }`}
                                                    placeholder="your@email.com"
                                                />
                                                {errors.email && (
                                                    <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid sm:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-sm font-medium text-[var(--color-navy)] mb-2">
                                                    Phone Number
                                                </label>
                                                <input
                                                    type="tel"
                                                    {...register("phone")}
                                                    className={`w-full px-4 py-3.5 rounded-lg border-2 focus:ring-0 outline-none transition-colors bg-[var(--color-bg-light)] ${errors.phone
                                                        ? "border-red-400 focus:border-red-400"
                                                        : "border-transparent focus:border-[var(--color-primary)]"
                                                        }`}
                                                    placeholder="+91 XXXXX XXXXX"
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
                                                    className={`w-full px-4 py-3.5 rounded-lg border-2 focus:ring-0 outline-none transition-colors bg-[var(--color-bg-light)] ${errors.interest
                                                        ? "border-red-400 focus:border-red-400"
                                                        : "border-transparent focus:border-[var(--color-primary)]"
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
                                        </div>

                                        {selectedInterest === "retreat" && (
                                            <div>
                                                <label className="block text-sm font-medium text-[var(--color-navy)] mb-2">
                                                    Preferred Retreat
                                                </label>
                                                <select
                                                    {...register("retreat")}
                                                    className="w-full px-4 py-3.5 rounded-lg border-2 border-transparent focus:border-[var(--color-primary)] focus:ring-0 outline-none transition-colors bg-[var(--color-bg-light)]"
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
                                                className={`w-full px-4 py-3.5 rounded-lg border-2 focus:ring-0 outline-none transition-colors bg-[var(--color-bg-light)] resize-none ${errors.message
                                                    ? "border-red-400 focus:border-red-400"
                                                    : "border-transparent focus:border-[var(--color-primary)]"
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
                                </Card>
                            )}
                        </motion.div>
                    </div>

                    {/* Sidebar - Takes 2 columns */}
                    <div className="lg:col-span-2 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            {/* Quick Retreat Booking */}
                            <Card variant="bordered" className="mb-6 bg-white">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
                                            <Calendar className="w-5 h-5 text-[var(--color-primary)]" />
                                        </div>
                                        <h3 className="font-semibold text-[var(--color-navy)] text-lg">Quick Retreat Booking</h3>
                                    </div>
                                    <p className="text-sm text-[var(--color-ash)] mb-5">
                                        Ready to transform? Book your retreat directly or schedule a consultation.
                                    </p>
                                    <div className="space-y-3">
                                        {retreatOptions.map((retreat) => (
                                            <Link
                                                key={retreat.value}
                                                href={`/awt-retreats#${retreat.value}`}
                                                className="block p-4 rounded-lg bg-[var(--color-bg-light)] hover:bg-[var(--color-primary)]/5 border border-transparent hover:border-[var(--color-primary)] transition-all duration-200"
                                            >
                                                <span className="text-[var(--color-navy)] text-sm font-medium">{retreat.label}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* WhatsApp CTA */}
                            <Card className="bg-gradient-to-br from-[var(--color-navy)] to-[#1a1a2e] text-white overflow-hidden">
                                <CardContent className="p-6 relative">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                                    <h3 className="font-[family-name:var(--font-playfair)] text-xl font-semibold mb-3 !text-white relative z-10">
                                        Prefer to Talk?
                                    </h3>
                                    <p className="text-gray-300 text-sm mb-6 relative z-10">
                                        Our wellness advisors are available for a free 15-minute consultation.
                                    </p>
                                    <a href="https://wa.me/917447489101" target="_blank" rel="noopener noreferrer">
                                        <Button className="w-full bg-green-500 hover:bg-green-600 !text-white border-0">
                                            <MessageCircle className="w-4 h-4 mr-2" />
                                            Chat on WhatsApp
                                        </Button>
                                    </a>
                                </CardContent>
                            </Card>

                            {/* Business Hours */}
                            <Card variant="bordered" className="bg-white">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-[var(--color-accent)]/10 flex items-center justify-center">
                                            <Clock className="w-5 h-5 text-[var(--color-accent)]" />
                                        </div>
                                        <h3 className="font-semibold text-[var(--color-navy)] text-lg">Business Hours</h3>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-[var(--color-ash)]">Monday - Saturday</span>
                                            <span className="text-[var(--color-navy)] font-medium">10:00 AM - 7:00 PM</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[var(--color-ash)]">Sunday</span>
                                            <span className="text-[var(--color-primary)] font-medium">Closed</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </Section>

            {/* Location & Company Info */}
            <Section background="white" id="location">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Map Placeholder */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="h-80 lg:h-96 rounded-2xl bg-gradient-to-br from-[var(--color-beige)] to-[var(--color-cream)] flex items-center justify-center overflow-hidden relative"
                    >
                        <div className="absolute inset-0 bg-[url('/pattern-sacred.svg')] opacity-5" />
                        <div className="text-center relative z-10">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
                                <MapPin className="w-8 h-8 text-[var(--color-primary)]" />
                            </div>
                            <p className="text-[var(--color-navy)] font-semibold text-lg mb-1">Head Office</p>
                            <p className="text-[var(--color-ash)] text-sm max-w-xs mx-auto">
                                Shivpuri, Akkalkot Station Road,<br />
                                Akkalkot 413216, Maharashtra, India
                            </p>
                        </div>
                    </motion.div>

                    {/* Company Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
                                <Building2 className="w-6 h-6 text-[var(--color-primary)]" />
                            </div>
                            <div>
                                <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-semibold text-[var(--color-navy)]">
                                    Company Information
                                </h2>
                            </div>
                        </div>

                        <Card variant="bordered" className="bg-[var(--color-bg-light)]">
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs uppercase tracking-wider text-[var(--color-ash)] mb-1">Registered Company Name</p>
                                        <p className="text-[var(--color-navy)] font-semibold text-lg">
                                            VISHWA HOLISTIC SOLUTIONS PRIVATE LIMITED
                                        </p>
                                    </div>
                                    <div className="h-px bg-[var(--color-border)]" />
                                    <div>
                                        <p className="text-xs uppercase tracking-wider text-[var(--color-ash)] mb-1">Brand</p>
                                        <p className="text-[var(--color-navy)] font-medium">Vishwa Wellness</p>
                                    </div>
                                    <div className="h-px bg-[var(--color-border)]" />
                                    <div>
                                        <p className="text-xs uppercase tracking-wider text-[var(--color-ash)] mb-1">Registered Address</p>
                                        <p className="text-[var(--color-charcoal)] text-sm">
                                            Shivpuri, Akkalkot Station Road,<br />
                                            Akkalkot, Maharashtra 413216, India
                                        </p>
                                    </div>
                                    <div className="h-px bg-[var(--color-border)]" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs uppercase tracking-wider text-[var(--color-ash)] mb-1">Email</p>
                                            <a href="mailto:crm@vishwaglobal.com" className="text-[var(--color-primary)] text-sm hover:underline">
                                                crm@vishwaglobal.com
                                            </a>
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase tracking-wider text-[var(--color-ash)] mb-1">Phone</p>
                                            <a href="tel:+917447489101" className="text-[var(--color-primary)] text-sm hover:underline">
                                                +91 74474 89101
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <p className="mt-6 text-sm text-[var(--color-ash)]">
                            Vishwa Wellness is a brand of VISHWA HOLISTIC SOLUTIONS PRIVATE LIMITED,
                            a company registered in India dedicated to bringing ancient Vedic wellness
                            practices to the modern world.
                        </p>
                    </motion.div>
                </div>
            </Section>
        </>
    );
}
