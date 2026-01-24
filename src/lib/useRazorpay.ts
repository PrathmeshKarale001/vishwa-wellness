'use client';

import { useState, useCallback } from 'react';

declare global {
    interface Window {
        Razorpay: any;
    }
}

interface RazorpayOptions {
    amount: number;
    currency?: string;
    name?: string;
    description?: string;
    image?: string;
    prefill?: {
        name?: string;
        email?: string;
        contact?: string;
    };
    notes?: Record<string, string>;
    theme?: {
        color?: string;
    };
}

interface PaymentResult {
    success: boolean;
    paymentId?: string;
    orderId?: string;
    signature?: string;
    error?: string;
}

export function useRazorpay() {
    const [isLoading, setIsLoading] = useState(false);
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);

    // Load Razorpay script
    const loadScript = useCallback((): Promise<boolean> => {
        return new Promise((resolve) => {
            if (isScriptLoaded || typeof window.Razorpay !== 'undefined') {
                setIsScriptLoaded(true);
                resolve(true);
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            script.onload = () => {
                setIsScriptLoaded(true);
                resolve(true);
            };
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    }, [isScriptLoaded]);

    // Create order and initiate payment
    const initiatePayment = useCallback(async (options: RazorpayOptions): Promise<PaymentResult> => {
        setIsLoading(true);

        try {
            // Load Razorpay script if not loaded
            const loaded = await loadScript();
            if (!loaded) {
                throw new Error('Failed to load Razorpay SDK');
            }

            // Create order on server
            const orderResponse = await fetch('/api/payment/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: options.amount,
                    notes: options.notes,
                }),
            });

            if (!orderResponse.ok) {
                const error = await orderResponse.json();
                throw new Error(error.error || 'Failed to create order');
            }

            const orderData = await orderResponse.json();

            // Open Razorpay checkout
            return new Promise((resolve) => {
                const razorpayOptions = {
                    key: orderData.keyId,
                    amount: orderData.amount,
                    currency: orderData.currency,
                    name: options.name || 'Vishwa Wellness',
                    description: options.description || 'Payment for your order',
                    image: options.image || '/logo.png',
                    order_id: orderData.orderId,
                    prefill: options.prefill || {},
                    notes: options.notes || {},
                    theme: options.theme || { color: '#C73C2E' },
                    handler: async (response: any) => {
                        try {
                            // Verify payment on server
                            const verifyResponse = await fetch('/api/payment/verify', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(response),
                            });

                            if (verifyResponse.ok) {
                                resolve({
                                    success: true,
                                    paymentId: response.razorpay_payment_id,
                                    orderId: response.razorpay_order_id,
                                    signature: response.razorpay_signature,
                                });
                            } else {
                                resolve({
                                    success: false,
                                    error: 'Payment verification failed',
                                });
                            }
                        } catch {
                            resolve({
                                success: false,
                                error: 'Payment verification failed',
                            });
                        }
                    },
                    modal: {
                        ondismiss: () => {
                            resolve({
                                success: false,
                                error: 'Payment cancelled',
                            });
                        },
                    },
                };

                const razorpay = new window.Razorpay(razorpayOptions);
                razorpay.open();
            });
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Payment failed',
            };
        } finally {
            setIsLoading(false);
        }
    }, [loadScript]);

    return {
        initiatePayment,
        isLoading,
        isScriptLoaded,
    };
}
