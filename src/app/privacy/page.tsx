import Link from 'next/link';
import { ChevronRight, Shield, Eye, Lock, Database, Mail, Phone } from 'lucide-react';

export default function PrivacyPage() {
    return (
        <>
            {/* Breadcrumb */}
            <div className="bg-[#f9f9f9] py-4 border-b border-[#eee]">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center gap-2 text-sm text-[#777]">
                        <Link href="/" className="hover:text-[var(--color-primary)]">Home</Link>
                        <ChevronRight size={14} />
                        <span className="text-[#222]">Privacy Policy</span>
                    </div>
                </div>
            </div>

            {/* Page Header */}
            <div className="bg-[#f5f2f2] py-8">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-3xl font-bold text-[#222]" style={{ fontFamily: 'var(--font-heading)' }}>
                        Privacy Policy
                    </h1>
                    <p className="text-[#777] mt-2">Last updated: January 2026</p>
                </div>
            </div>

            <section className="section-padding">
                <div className="max-w-3xl mx-auto px-4">
                    {/* Quick Info Cards */}
                    <div className="grid sm:grid-cols-3 gap-4 mb-12">
                        <div className="bg-[#f9f9f9] p-6 text-center border border-[#eee]">
                            <Shield className="mx-auto text-[var(--color-primary)] mb-3" size={32} />
                            <h3 className="font-semibold text-[#222]">Your Data Protected</h3>
                            <p className="text-sm text-[#777] mt-1">Industry-standard security</p>
                        </div>
                        <div className="bg-[#f9f9f9] p-6 text-center border border-[#eee]">
                            <Eye className="mx-auto text-[var(--color-primary)] mb-3" size={32} />
                            <h3 className="font-semibold text-[#222]">Transparent</h3>
                            <p className="text-sm text-[#777] mt-1">Clear about data use</p>
                        </div>
                        <div className="bg-[#f9f9f9] p-6 text-center border border-[#eee]">
                            <Lock className="mx-auto text-[var(--color-primary)] mb-3" size={32} />
                            <h3 className="font-semibold text-[#222]">Your Control</h3>
                            <p className="text-sm text-[#777] mt-1">Manage your preferences</p>
                        </div>
                    </div>

                    {/* Policy Content */}
                    <div className="prose prose-gray max-w-none">
                        <h2 className="text-xl font-semibold text-[#222] mt-8 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                            Introduction
                        </h2>
                        <p className="text-[#777] mb-4">
                            Vishwa Wellness (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your privacy and is committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you visit our website or make a purchase.
                        </p>

                        <h2 className="text-xl font-semibold text-[#222] mt-8 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                            Information We Collect
                        </h2>
                        <p className="text-[#777] mb-3">We collect information you provide directly to us, including:</p>
                        <ul className="list-disc pl-6 text-[#777] space-y-2 mb-6">
                            <li><strong>Personal Information:</strong> Name, email address, phone number, shipping address</li>
                            <li><strong>Payment Information:</strong> Credit card details (processed securely via payment partners)</li>
                            <li><strong>Account Information:</strong> Username, password, purchase history</li>
                            <li><strong>Communication Data:</strong> Inquiries, feedback, customer support interactions</li>
                        </ul>

                        <h2 className="text-xl font-semibold text-[#222] mt-8 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                            How We Use Your Information
                        </h2>
                        <ul className="list-disc pl-6 text-[#777] space-y-2 mb-6">
                            <li>Process and fulfill your orders</li>
                            <li>Send order confirmations and shipping updates</li>
                            <li>Respond to your inquiries and provide customer support</li>
                            <li>Send promotional communications (with your consent)</li>
                            <li>Improve our website and services</li>
                            <li>Prevent fraud and ensure security</li>
                            <li>Comply with legal obligations</li>
                        </ul>

                        <h2 className="text-xl font-semibold text-[#222] mt-8 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                            Cookies and Tracking
                        </h2>
                        <p className="text-[#777] mb-4">
                            We use cookies and similar technologies to enhance your browsing experience, analyze website traffic, and personalize content. You can control cookie preferences through your browser settings.
                        </p>
                        <table className="w-full border-collapse mb-6">
                            <thead>
                                <tr className="bg-[#f5f2f2]">
                                    <th className="text-left p-3 border border-[#eee] font-semibold text-[#222]">Cookie Type</th>
                                    <th className="text-left p-3 border border-[#eee] font-semibold text-[#222]">Purpose</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="p-3 border border-[#eee] text-[#777]">Essential</td>
                                    <td className="p-3 border border-[#eee] text-[#777]">Required for website functionality</td>
                                </tr>
                                <tr>
                                    <td className="p-3 border border-[#eee] text-[#777]">Analytics</td>
                                    <td className="p-3 border border-[#eee] text-[#777]">Help us understand how visitors use our site</td>
                                </tr>
                                <tr>
                                    <td className="p-3 border border-[#eee] text-[#777]">Marketing</td>
                                    <td className="p-3 border border-[#eee] text-[#777]">Used for targeted advertising</td>
                                </tr>
                            </tbody>
                        </table>

                        <h2 className="text-xl font-semibold text-[#222] mt-8 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                            Data Sharing
                        </h2>
                        <p className="text-[#777] mb-4">
                            We do not sell your personal information. We may share data with:
                        </p>
                        <ul className="list-disc pl-6 text-[#777] space-y-2 mb-6">
                            <li><strong>Service Providers:</strong> Payment processors, shipping partners, email services</li>
                            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                            <li><strong>Business Transfers:</strong> In the event of a merger or acquisition</li>
                        </ul>

                        <h2 className="text-xl font-semibold text-[#222] mt-8 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                            Data Security
                        </h2>
                        <p className="text-[#777] mb-4">
                            We implement industry-standard security measures including SSL encryption, secure payment processing, and regular security audits to protect your data. However, no method of transmission over the internet is 100% secure.
                        </p>

                        <h2 className="text-xl font-semibold text-[#222] mt-8 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                            Your Rights
                        </h2>
                        <p className="text-[#777] mb-3">You have the right to:</p>
                        <ul className="list-disc pl-6 text-[#777] space-y-2 mb-6">
                            <li>Access and receive a copy of your personal data</li>
                            <li>Request correction of inaccurate data</li>
                            <li>Request deletion of your data</li>
                            <li>Opt-out of marketing communications</li>
                            <li>Withdraw consent at any time</li>
                        </ul>

                        <h2 className="text-xl font-semibold text-[#222] mt-8 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                            Data Retention
                        </h2>
                        <p className="text-[#777] mb-6">
                            We retain your personal data for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law. Order history is retained for 7 years for tax and legal compliance.
                        </p>

                        <h2 className="text-xl font-semibold text-[#222] mt-8 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                            Updates to This Policy
                        </h2>
                        <p className="text-[#777] mb-6">
                            We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.
                        </p>

                        <div className="bg-[#f9f9f9] p-6 border border-[#eee] mt-8">
                            <div className="flex items-start gap-4">
                                <Database className="text-[var(--color-primary)] flex-shrink-0 mt-1" size={24} />
                                <div>
                                    <h3 className="font-semibold text-[#222] mb-1">Data Protection Officer</h3>
                                    <p className="text-[#777] text-sm">
                                        For privacy-related inquiries, contact:{' '}
                                        <a href="mailto:privacy@vishwawellness.com" className="text-[var(--color-primary)]">
                                            privacy@vishwawellness.com
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
