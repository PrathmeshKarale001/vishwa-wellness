'use client';

import { CreditCard, Wallet } from 'lucide-react';

export type PaymentMethod = 'online';

interface CheckoutPaymentMethodProps {
    selected: PaymentMethod;
    onChange: (method: PaymentMethod) => void;
    total?: number;
}

export default function CheckoutPaymentMethod({
    selected,
    onChange,
}: CheckoutPaymentMethodProps) {
    const paymentOptions: Array<{
        id: PaymentMethod;
        name: string;
        description: string;
        icon: typeof CreditCard;
        available: boolean;
        recommended?: boolean;
    }> = [
            {
                id: 'online',
                name: 'Pay Online',
                description: 'UPI, Credit/Debit Card, Net Banking, Wallets',
                icon: CreditCard,
                available: true,
                recommended: true,
            },
        ];

    // Filter only available options
    const availableOptions = paymentOptions.filter((opt) => opt.available);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-[#eee] overflow-hidden">
            {/* Section Header */}
            <div className="p-6 border-b border-[#eee] bg-[#f9f9f9]">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center">
                        <Wallet size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-[#222]">
                            Payment Method
                        </h2>
                        <p className="text-sm text-[#777]">
                            Select how you&apos;d like to pay
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-4">
                {availableOptions.map((option) => (
                    <label
                        key={option.id}
                        className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${selected === option.id
                            ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                            : 'border-[#eee] hover:border-[var(--color-primary)]/50'
                            }`}
                    >
                        <input
                            type="radio"
                            name="paymentMethod"
                            value={option.id}
                            checked={selected === option.id}
                            onChange={() => onChange(option.id)}
                            className="mt-1 w-5 h-5 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                        />
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <option.icon size={18} className="text-[#222]" />
                                <span className="font-semibold text-[#222]">
                                    {option.name}
                                </span>
                                {option.recommended && (
                                    <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full font-medium">
                                        Recommended
                                    </span>
                                )}
                            </div>
                            <p className="mt-1 text-sm text-[#777]">
                                {option.description}
                            </p>
                        </div>
                    </label>
                ))}



                {/* Payment Security Note */}
                <div className="flex items-center gap-2 pt-4 text-sm text-[#777]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Your payment information is secure and encrypted</span>
                </div>
            </div>
        </div>
    );
}
