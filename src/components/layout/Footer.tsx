'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Send } from 'lucide-react';

const footerLinks = {
    shop: [
        { name: 'All Products', href: '/shop' },
        { name: 'Snān Collection', href: '/shop?category=snan' },
        { name: 'Lepam Collection', href: '/shop?category=lepam' },
        { name: 'Pāna Collection', href: '/shop?category=pana' },
        { name: 'Home & Aura', href: '/shop?category=home' },
    ],
    explore: [
        { name: 'Why Ash?', href: '/why-ash' },
        { name: 'Bhasma Rituals', href: '/bhasma-rituals' },
        { name: 'AWT Retreats', href: '/awt-retreats' },
        { name: 'Ash Water Guide', href: '/ash-water' },
        { name: 'DIY Recipes', href: '/diy-recipes' },
        { name: 'Science & Mysticism', href: '/science-mysticism' },
    ],
    support: [
        { name: 'About Us', href: '/about' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'FAQs', href: '/faq' },
        { name: 'Shipping Policy', href: '/shipping' },
        { name: 'Returns & Refunds', href: '/returns' },
        { name: 'Privacy Policy', href: '/privacy' },
    ],
};

const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/vishwawellness' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/vishwawellness' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/vishwawellness' },
    { name: 'YouTube', icon: Youtube, href: 'https://youtube.com/vishwawellness' },
];

export default function Footer() {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setSubscribed(true);
            setEmail('');
            setTimeout(() => setSubscribed(false), 3000);
        }
    };

    return (
        <footer className="bg-white text-[#333] border-t border-[#eee]">
            {/* Newsletter Section */}
            <div className="bg-[#f9f9f9] border-b border-[#eee]">
                <div className="max-w-7xl mx-auto px-4 py-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-center md:text-left">
                            <h3 className="text-2xl font-semibold text-[#222] mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
                                Join Our Sacred Circle
                            </h3>
                            <p className="text-[#777] text-sm">
                                Subscribe for rituals, recipes, and exclusive wellness offerings
                            </p>
                        </div>
                        <form onSubmit={handleSubscribe} className="flex w-full md:w-auto max-w-md border border-[#ddd]">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email..."
                                className="flex-1 px-4 py-3 bg-white text-[#333] text-sm focus:outline-none min-w-[200px]"
                                required
                            />
                            <button
                                type="submit"
                                className="px-6 py-3 bg-[var(--color-primary)] text-white font-semibold text-sm uppercase tracking-wider hover:bg-[var(--color-primary-dark)] transition-colors flex items-center gap-2"
                            >
                                {subscribed ? 'Subscribed!' : 'Subscribe'}
                                <Send size={14} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
                    {/* Brand Info */}
                    <div className="lg:col-span-2">
                        <Link href="/">
                            <Image
                                src="/logo.png"
                                alt="Vishwa Wellness"
                                width={180}
                                height={50}
                                className="h-14 w-auto mb-6"
                            />
                        </Link>
                        <p className="text-[#777] text-sm leading-relaxed mb-6">
                            Vishwa Wellness brings ancient fire rituals and sacred ash practices into modern wellness.
                            Discover the transformative power of Bhasma through our authentic products and immersive retreat experiences.
                        </p>
                        <div className="space-y-3 text-sm text-[#777]">
                            <a href="tel:+919876543210" className="flex items-center gap-3 hover:text-[var(--color-primary)] transition-colors">
                                <Phone size={16} className="text-[var(--color-primary)]" />
                                <span>+91 98765 43210</span>
                            </a>
                            <a href="mailto:hello@vishwawellness.com" className="flex items-center gap-3 hover:text-[var(--color-primary)] transition-colors">
                                <Mail size={16} className="text-[var(--color-primary)]" />
                                <span>hello@vishwawellness.com</span>
                            </a>
                            <p className="flex items-start gap-3">
                                <MapPin size={16} className="text-[var(--color-primary)] flex-shrink-0 mt-1" />
                                <span>Vishwa Wellness Center, Shivpuri, Madhya Pradesh, India</span>
                            </p>
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div>
                        <h4 className="text-[#222] font-semibold text-base mb-6 uppercase tracking-wider">Shop</h4>
                        <ul className="space-y-3">
                            {footerLinks.shop.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-[#777] text-sm hover:text-[var(--color-primary)] transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Explore Links */}
                    <div>
                        <h4 className="text-[#222] font-semibold text-base mb-6 uppercase tracking-wider">Explore</h4>
                        <ul className="space-y-3">
                            {footerLinks.explore.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-[#777] text-sm hover:text-[var(--color-primary)] transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h4 className="text-[#222] font-semibold text-base mb-6 uppercase tracking-wider">Support</h4>
                        <ul className="space-y-3">
                            {footerLinks.support.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-[#777] text-sm hover:text-[var(--color-primary)] transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="bg-[#f9f9f9] border-t border-[#eee]">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-[#777] text-sm text-center md:text-left">
                            © {new Date().getFullYear()} Vishwa Wellness. All rights reserved.
                            <span className="hidden md:inline"> | Healing Begins in the Ash.</span>
                        </p>

                        {/* Social Links */}
                        <div className="flex items-center gap-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full border border-[#ddd] flex items-center justify-center text-[#777] hover:bg-[var(--color-primary)] hover:border-[var(--color-primary)] hover:text-white transition-all"
                                    aria-label={social.name}
                                >
                                    <social.icon size={18} />
                                </a>
                            ))}
                        </div>

                        {/* Payment Icons Placeholder */}
                        <div className="flex items-center gap-2">
                            <span className="text-[#999] text-xs">We Accept:</span>
                            <div className="flex items-center gap-1 text-[#777] text-xs font-medium">
                                <span className="px-2 py-1 bg-white border border-[#eee] rounded shadow-sm">Visa</span>
                                <span className="px-2 py-1 bg-white border border-[#eee] rounded shadow-sm">MC</span>
                                <span className="px-2 py-1 bg-white border border-[#eee] rounded shadow-sm">UPI</span>
                                <span className="px-2 py-1 bg-white border border-[#eee] rounded shadow-sm">COD</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
