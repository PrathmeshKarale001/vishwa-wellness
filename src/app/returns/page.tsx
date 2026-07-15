import Link from 'next/link';
import { ChevronRight, RefreshCw, Clock, CheckCircle, XCircle, Phone } from 'lucide-react';

export default function ReturnsPage() {
    return (
        <>
            {/* Breadcrumb */}
            <div className="bg-[#f9f9f9] py-4 border-b border-[#eee]">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center gap-2 text-sm text-[#777]">
                        <Link href="/" className="hover:text-[var(--color-primary)]">Home</Link>
                        <ChevronRight size={14} />
                        <span className="text-[#222]">Returns & Refunds</span>
                    </div>
                </div>
            </div>

            {/* Page Header */}
            <div className="bg-[#f5f2f2] py-8">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-3xl font-bold text-[#222]" style={{ fontFamily: 'var(--font-heading)' }}>
                        Returns & Refunds
                    </h1>
                    <p className="text-[#777] mt-2">Last updated: January 2026</p>
                </div>
            </div>

            <section className="section-padding">
                <div className="max-w-3xl mx-auto px-4">
                    {/* Quick Info Cards */}
                    <div className="grid sm:grid-cols-3 gap-4 mb-12">
                        <div className="bg-[#f9f9f9] p-6 text-center border border-[#eee]">
                            <Clock className="mx-auto text-[var(--color-primary)] mb-3" size={32} />
                            <h3 className="font-semibold text-[#222]">30 Days</h3>
                            <p className="text-sm text-[#777] mt-1">Return window</p>
                        </div>
                        <div className="bg-[#f9f9f9] p-6 text-center border border-[#eee]">
                            <RefreshCw className="mx-auto text-[var(--color-primary)] mb-3" size={32} />
                            <h3 className="font-semibold text-[#222]">Free Returns</h3>
                            <p className="text-sm text-[#777] mt-1">On defective items</p>
                        </div>
                        <div className="bg-[#f9f9f9] p-6 text-center border border-[#eee]">
                            <CheckCircle className="mx-auto text-[var(--color-primary)] mb-3" size={32} />
                            <h3 className="font-semibold text-[#222]">5-7 Days</h3>
                            <p className="text-sm text-[#777] mt-1">Refund processing</p>
                        </div>
                    </div>

                    {/* Policy Content */}
                    <div className="prose prose-gray max-w-none">
                        <h2 className="text-xl font-semibold text-[#222] mt-8 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                            Return Policy Overview
                        </h2>
                        <p className="text-[#777] mb-4">
                            We have a strict no-return policy unless the item you received is defective or was damaged during travel.
                        </p>

                        <h2 className="text-xl font-semibold text-[#222] mt-8 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                            Eligible for Return
                        </h2>
                        <div className="bg-green-50 border border-green-200 p-4 mb-6">
                            <div className="flex items-start gap-3">
                                <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                                <ul className="text-[#777] space-y-2 list-none m-0 p-0">
                                    <li>Unopened products in original packaging</li>
                                    <li>Damaged or defective items (with photo proof)</li>
                                    <li>Wrong item received</li>
                                    <li>Items not matching the description</li>
                                </ul>
                            </div>
                        </div>

                        <h2 className="text-xl font-semibold text-[#222] mt-8 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                            Not Eligible for Return
                        </h2>
                        <div className="bg-red-50 border border-red-200 p-4 mb-6">
                            <div className="flex items-start gap-3">
                                <XCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                                <ul className="text-[#777] space-y-2 list-none m-0 p-0">
                                    <li>Opened personal care products (hygiene reasons)</li>
                                    <li>Items with broken seals</li>
                                    <li>Products used or tampered with</li>
                                    <li>Retreat bookings (see cancellation policy)</li>
                                    <li>Gift cards and digital products</li>
                                </ul>
                            </div>
                        </div>

                        <h2 className="text-xl font-semibold text-[#222] mt-8 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                            How to Initiate a Return
                        </h2>
                        <ol className="list-decimal pl-6 text-[#777] space-y-3 mb-6">
                            <li>
                                <strong>Log in to your account</strong> and go to Order History
                            </li>
                            <li>
                                <strong>Select the order</strong> and click &quot;Return Items&quot;
                            </li>
                            <li>
                                <strong>Choose reason</strong> for return and upload photos if defective
                            </li>
                            <li>
                                <strong>Print return label</strong> (free for defective items)
                            </li>
                            <li>
                                <strong>Pack securely</strong> and drop off at nearest courier partner
                            </li>
                        </ol>

                        <h2 className="text-xl font-semibold text-[#222] mt-8 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                            Refund Process
                        </h2>
                        <table className="w-full border-collapse mb-6">
                            <thead>
                                <tr className="bg-[#f5f2f2]">
                                    <th className="text-left p-3 border border-[#eee] font-semibold text-[#222]">Stage</th>
                                    <th className="text-left p-3 border border-[#eee] font-semibold text-[#222]">Timeline</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="p-3 border border-[#eee] text-[#777]">Return received & inspected</td>
                                    <td className="p-3 border border-[#eee] text-[#777]">1-2 business days</td>
                                </tr>
                                <tr>
                                    <td className="p-3 border border-[#eee] text-[#777]">Refund processed</td>
                                    <td className="p-3 border border-[#eee] text-[#777]">3-5 business days</td>
                                </tr>
                                <tr>
                                    <td className="p-3 border border-[#eee] text-[#777]">Amount credited to account</td>
                                    <td className="p-3 border border-[#eee] text-[#777]">5-7 business days (depends on bank)</td>
                                </tr>
                            </tbody>
                        </table>

                        <h2 className="text-xl font-semibold text-[#222] mt-8 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                            Exchange Policy
                        </h2>
                        <p className="text-[#777] mb-4">
                            We do not offer product exchanges.
                        </p>

                        <h2 className="text-xl font-semibold text-[#222] mt-8 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                            Retreat Booking Cancellations
                        </h2>
                        <p className="text-[#777] mb-4">
                            Retreat bookings have a separate cancellation policy:
                        </p>
                        <ul className="list-disc pl-6 text-[#777] space-y-2 mb-6">
                            <li>30+ days before: Full refund minus ₹500 booking fee</li>
                            <li>15+ days before: 50% refund</li>
                            <li>Less than 15 days: No refund (one-time transfer to future retreat allowed)</li>
                        </ul>

                        <div className="bg-[#f9f9f9] p-6 border border-[#eee] mt-8">
                            <div className="flex items-start gap-4">
                                <Phone className="text-[var(--color-primary)] flex-shrink-0 mt-1" size={24} />
                                <div>
                                    <h3 className="font-semibold text-[#222] mb-1">Need Help with Returns?</h3>
                                    <p className="text-[#777] text-sm">
                                        Contact our support team at{' '}
                                        <a href="mailto:crm@vishwaglobal.com" className="text-[var(--color-primary)]">
                                            crm@vishwaglobal.com
                                        </a>{' '}
                                        or call +91 95797 22111
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
