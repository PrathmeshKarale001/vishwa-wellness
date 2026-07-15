'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Send } from 'lucide-react';
import { showToast } from '@/components/ui/toast';

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
        { name: 'Agnihotra Wellness Retreats', href: '/awt-retreats' },
        { name: 'Gallery', href: '/gallery' },
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
    { name: 'Facebook', icon: Facebook, href: 'https://www.facebook.com/share/1EatnQQGWE/' },
    { name: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/vishwa.wellness' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/vishwawellness' },
    { name: 'YouTube', icon: Youtube, href: 'https://www.youtube.com/@VishwaWellness' },
];

export default function Footer() {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setSubscribed(true);
            setEmail('');
            showToast.success('Thank You for Subscribing!');
            setTimeout(() => setSubscribed(false), 3000);
        }
    };

    return (
        <footer className="bg-white text-[#111] border-t border-[var(--color-border)]">
            {/* Newsletter Section */}
            <div className="bg-[var(--color-bg-cream)] border-b border-[var(--color-border)]">
                <div className="max-w-7xl mx-auto px-4 py-16">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
                        <div className="text-center lg:text-left">
                            <h3 className="text-3xl font-bold text-black mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                                Join Our Sacred Circle
                            </h3>
                            <p className="text-gray-500 text-sm tracking-wide">
                                Subscribe for rituals, recipes, and exclusive wellness offerings
                            </p>
                        </div>
                        <form onSubmit={handleSubscribe} className="flex w-full lg:w-auto max-w-md border-b-2 border-black">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email Address"
                                className="flex-1 px-0 py-4 bg-transparent text-black text-xs font-bold uppercase tracking-widest focus:outline-none min-w-[280px]"
                                required
                            />
                            <button
                                type="submit"
                                className="px-6 py-4 text-black font-bold text-[10px] uppercase tracking-[0.3em] hover:text-[var(--color-accent)] transition-colors flex items-center gap-3"
                            >
                                {subscribed ? 'Subscribed' : 'Join'}
                                <Send size={12} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16">
                    {/* Brand Info */}
                    <div className="lg:col-span-2">
                        <Link href="/">
                            <Image
                                src="/logo.png"
                                alt="Vishwa Wellness"
                                width={160}
                                height={45}
                                className="h-10 w-auto mb-8"
                            />
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-sm">
                            Vishwa Wellness brings ancient fire rituals and sacred ash practices into modern life.
                            Discover the transformative power of Bhasma through our authentic products.
                        </p>
                        <div className="space-y-4 text-xs font-bold uppercase tracking-widest text-[#111]">
                            <a href="tel:+917447489101" className="flex items-center gap-4 hover:text-[var(--color-accent)] transition-colors">
                                <Phone size={14} className="text-[var(--color-accent)]" />
                                <span>+91 74474 89101</span>
                            </a>
                            <a href="mailto:crm@vishwaglobal.com" className="flex items-center gap-4 hover:text-[var(--color-accent)] transition-colors">
                                <Mail size={14} className="text-[var(--color-accent)]" />
                                <span>crm@vishwaglobal.com</span>
                            </a>
                        </div>
                        <div className="mt-4 text-xs text-gray-500 leading-relaxed font-medium">
                            <p className="flex items-start gap-4 mb-2">
                                <MapPin size={14} className="text-[var(--color-accent)] flex-shrink-0 mt-0.5" />
                                <span>Shivpuri, Akkalkot Station Road,<br />Akkalkot 413216</span>
                            </p>
                            <p className="flex items-start gap-4">
                                <span className="text-[var(--color-accent)] font-bold text-[10px] flex-shrink-0 uppercase tracking-wider w-[14px] text-center">🕒</span>
                                <span>Mon - Sat: 10:00 AM - 7:00 PM IST</span>
                            </p>
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div>
                        <h4 className="text-black font-bold text-[10px] mb-8 uppercase tracking-[0.2em]">Shop</h4>
                        <ul className="space-y-4">
                            {footerLinks.shop.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-500 text-xs font-bold uppercase tracking-widest hover:text-black transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Explore Links */}
                    <div>
                        <h4 className="text-black font-bold text-[10px] mb-8 uppercase tracking-[0.2em]">Explore</h4>
                        <ul className="space-y-4">
                            {footerLinks.explore.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-500 text-xs font-bold uppercase tracking-widest hover:text-black transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h4 className="text-black font-bold text-[10px] mb-8 uppercase tracking-[0.2em]">Support</h4>
                        <ul className="space-y-4">
                            {footerLinks.support.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-500 text-xs font-bold uppercase tracking-widest hover:text-black transition-colors"
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
            <div className="bg-white border-t border-[var(--color-border)]">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest text-center md:text-left">
                            © {new Date().getFullYear()} Vishwa Wellness. Healing Begins in the Ash.
                        </p>

                        {/* Social Links */}
                        <div className="flex items-center gap-6">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-black transition-colors"
                                    aria-label={social.name}
                                >
                                    <social.icon size={18} />
                                </a>
                            ))}
                        </div>

                        {/* Payment Indicators */}
                        <div className="flex items-center gap-4 opacity-30 grayscale">
                            <span className="text-[10px] font-bold uppercase tracking-widest">VISA</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest">MC</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest">UPI</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
