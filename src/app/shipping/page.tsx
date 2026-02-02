import Link from 'next/link';
import { ChevronRight, Truck, Clock, MapPin, Package, Phone } from 'lucide-react';

export default function ShippingPage() {
    return (
        <>
            {/* Breadcrumb */}
            <div className="bg-[#f9f9f9] py-4 border-b border-[#eee]">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center gap-2 text-sm text-[#777]">
                        <Link href="/" className="hover:text-[var(--color-primary)]">Home</Link>
                        <ChevronRight size={14} />
                        <span className="text-[#222]">Shipping Policy</span>
                    </div>
                </div>
            </div>

            {/* Page Header */}
            <div className="bg-[#f5f2f2] py-8">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-3xl font-bold text-[#222]" style={{ fontFamily: 'var(--font-heading)' }}>
                        Shipping Policy
                    </h1>
                    <p className="text-[#777] mt-2">Last updated: January 2026</p>
                </div>
            </div>

            <section className="section-padding">
                <div className="max-w-3xl mx-auto px-4">
                    {/* Quick Info Cards */}
                    <div className="grid sm:grid-cols-3 gap-4 mb-12">
                        <div className="bg-[#f9f9f9] p-6 text-center border border-[#eee]">
                            <Truck className="mx-auto text-[var(--color-primary)] mb-3" size={32} />
                            <h3 className="font-semibold text-[#222]">Free Shipping</h3>
                            <p className="text-sm text-[#777] mt-1">On all orders</p>
                        </div>
                        <div className="bg-[#f9f9f9] p-6 text-center border border-[#eee]">
                            <Clock className="mx-auto text-[var(--color-primary)] mb-3" size={32} />
                            <h3 className="font-semibold text-[#222]">5-7 Days</h3>
                            <p className="text-sm text-[#777] mt-1">Standard delivery</p>
                        </div>
                        <div className="bg-[#f9f9f9] p-6 text-center border border-[#eee]">
                            <MapPin className="mx-auto text-[var(--color-primary)] mb-3" size={32} />
                            <h3 className="font-semibold text-[#222]">Pan India</h3>
                            <p className="text-sm text-[#777] mt-1">+ Select countries</p>
                        </div>
                    </div>

                    {/* Policy Content */}
                    <div className="prose prose-gray max-w-none">
                        <h2 className="text-xl font-semibold text-[#222] mt-8 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                            Domestic Shipping (India)
                        </h2>
                        <p className="text-[#777] mb-4">
                            We ship to all serviceable pin codes across India through our trusted courier partners including BlueDart, Delhivery, and India Post.
                        </p>
                        <table className="w-full border-collapse mb-6">
                            <thead>
                                <tr className="bg-[#f5f2f2]">
                                    <th className="text-left p-3 border border-[#eee] font-semibold text-[#222]">Shipping Method</th>
                                    <th className="text-left p-3 border border-[#eee] font-semibold text-[#222]">Delivery Time</th>
                                    <th className="text-left p-3 border border-[#eee] font-semibold text-[#222]">Cost</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="p-3 border border-[#eee] text-[#777]">Standard Shipping</td>
                                    <td className="p-3 border border-[#eee] text-[#777]">5-7 business days</td>
                                    <td className="p-3 border border-[#eee] text-[#777]"><span className="text-green-600 font-medium">Free</span></td>
                                </tr>
                                <tr>
                                    <td className="p-3 border border-[#eee] text-[#777]">Express Shipping</td>
                                    <td className="p-3 border border-[#eee] text-[#777]">2-3 business days</td>
                                    <td className="p-3 border border-[#eee] text-[#777]">₹199</td>
                                </tr>
                                <tr>
                                    <td className="p-3 border border-[#eee] text-[#777]">Same Day (Metro cities)</td>
                                    <td className="p-3 border border-[#eee] text-[#777]">Same day if ordered before 12 PM</td>
                                    <td className="p-3 border border-[#eee] text-[#777]">₹349</td>
                                </tr>
                            </tbody>
                        </table>

                        <h2 className="text-xl font-semibold text-[#222] mt-8 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                            International Shipping
                        </h2>
                        <p className="text-[#777] mb-4">
                            We ship to select countries worldwide. International orders are shipped via DHL or FedEx with tracking.
                        </p>
                        <table className="w-full border-collapse mb-6">
                            <thead>
                                <tr className="bg-[#f5f2f2]">
                                    <th className="text-left p-3 border border-[#eee] font-semibold text-[#222]">Region</th>
                                    <th className="text-left p-3 border border-[#eee] font-semibold text-[#222]">Delivery Time</th>
                                    <th className="text-left p-3 border border-[#eee] font-semibold text-[#222]">Cost</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="p-3 border border-[#eee] text-[#777]">USA, UK, Canada</td>
                                    <td className="p-3 border border-[#eee] text-[#777]">7-10 business days</td>
                                    <td className="p-3 border border-[#eee] text-[#777]">Calculated at checkout</td>
                                </tr>
                                <tr>
                                    <td className="p-3 border border-[#eee] text-[#777]">UAE, Singapore</td>
                                    <td className="p-3 border border-[#eee] text-[#777]">5-7 business days</td>
                                    <td className="p-3 border border-[#eee] text-[#777]">Calculated at checkout</td>
                                </tr>
                                <tr>
                                    <td className="p-3 border border-[#eee] text-[#777]">Australia, New Zealand</td>
                                    <td className="p-3 border border-[#eee] text-[#777]">10-14 business days</td>
                                    <td className="p-3 border border-[#eee] text-[#777]">Calculated at checkout</td>
                                </tr>
                            </tbody>
                        </table>

                        <h2 className="text-xl font-semibold text-[#222] mt-8 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                            Order Processing
                        </h2>
                        <ul className="list-disc pl-6 text-[#777] space-y-2 mb-6">
                            <li>Orders are processed within 1-2 business days</li>
                            <li>Orders placed after 2 PM IST are processed the next business day</li>
                            <li>We do not process orders on Sundays and national holidays</li>
                            <li>You will receive tracking information via email and SMS once shipped</li>
                        </ul>

                        <h2 className="text-xl font-semibold text-[#222] mt-8 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                            Important Notes
                        </h2>
                        <ul className="list-disc pl-6 text-[#777] space-y-2 mb-6">
                            <li>Delivery times are estimates and may vary due to unforeseen circumstances</li>
                            <li>P.O. Box addresses are not serviceable for express shipping</li>
                            <li>Customs duties for international orders are the responsibility of the recipient</li>
                            <li>Some products may have shipping restrictions based on local regulations</li>
                        </ul>

                        <div className="bg-[#f9f9f9] p-6 border border-[#eee] mt-8">
                            <div className="flex items-start gap-4">
                                <Phone className="text-[var(--color-primary)] flex-shrink-0 mt-1" size={24} />
                                <div>
                                    <h3 className="font-semibold text-[#222] mb-1">Need Help?</h3>
                                    <p className="text-[#777] text-sm">
                                        For shipping inquiries, contact us at{' '}
                                        <a href="mailto:crm@vishwaglobal.com" className="text-[var(--color-primary)]">
                                            crm@vishwaglobal.com
                                        </a>{' '}
                                        or call +91 74474 89101
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
