"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckoutProgressProps {
    currentStep: number;
    className?: string;
}

const steps = [
    { id: 1, name: "Cart", shortName: "Cart" },
    { id: 2, name: "Shipping", shortName: "Ship" },
    { id: 3, name: "Payment", shortName: "Pay" },
    { id: 4, name: "Confirm", shortName: "Done" },
];

/**
 * Checkout Progress Indicator
 * Shows the current step in the checkout flow
 */
export function CheckoutProgress({ currentStep, className }: CheckoutProgressProps) {
    return (
        <div className={cn("w-full", className)}>
            {/* Desktop Progress */}
            <div className="hidden sm:block">
                <nav aria-label="Checkout progress">
                    <ol className="flex items-center justify-between">
                        {steps.map((step, index) => (
                            <li key={step.id} className="relative flex-1">
                                {/* Connector line */}
                                {index !== steps.length - 1 && (
                                    <div
                                        className="absolute top-5 left-1/2 w-full h-0.5 -translate-y-1/2"
                                        aria-hidden="true"
                                    >
                                        <motion.div
                                            initial={{ width: "0%" }}
                                            animate={{
                                                width: currentStep > step.id ? "100%" : "0%"
                                            }}
                                            transition={{ duration: 0.5, ease: "easeOut" }}
                                            className="h-full bg-amber-600"
                                        />
                                        <div
                                            className={cn(
                                                "absolute inset-0 h-full",
                                                currentStep > step.id ? "bg-amber-600" : "bg-stone-200"
                                            )}
                                            style={{ zIndex: -1 }}
                                        />
                                    </div>
                                )}

                                <div className="relative flex flex-col items-center group">
                                    {/* Step circle */}
                                    <motion.span
                                        initial={{ scale: 0.8 }}
                                        animate={{
                                            scale: currentStep === step.id ? 1.1 : 1,
                                            backgroundColor:
                                                currentStep > step.id
                                                    ? "#d97706"
                                                    : currentStep === step.id
                                                        ? "#d97706"
                                                        : "#f5f5f4"
                                        }}
                                        className={cn(
                                            "w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all z-10",
                                            currentStep > step.id
                                                ? "border-amber-600 bg-amber-600 text-white"
                                                : currentStep === step.id
                                                    ? "border-amber-600 bg-amber-600 text-white shadow-lg shadow-amber-200"
                                                    : "border-stone-300 bg-white text-stone-400"
                                        )}
                                    >
                                        {currentStep > step.id ? (
                                            <Check className="w-5 h-5" />
                                        ) : (
                                            <span className="text-sm font-semibold">{step.id}</span>
                                        )}
                                    </motion.span>

                                    {/* Step name */}
                                    <span
                                        className={cn(
                                            "mt-2 text-xs font-medium transition-colors",
                                            currentStep >= step.id ? "text-stone-900" : "text-stone-400"
                                        )}
                                    >
                                        {step.name}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ol>
                </nav>
            </div>

            {/* Mobile Progress */}
            <div className="sm:hidden">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-stone-900">
                        Step {currentStep} of {steps.length}
                    </span>
                    <span className="text-sm text-stone-500">
                        {steps[currentStep - 1]?.name}
                    </span>
                </div>
                <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: `${(currentStep / steps.length) * 100}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"
                    />
                </div>
                {/* Step indicators */}
                <div className="flex justify-between mt-2">
                    {steps.map((step) => (
                        <span
                            key={step.id}
                            className={cn(
                                "text-xs font-medium",
                                currentStep >= step.id ? "text-amber-600" : "text-stone-400"
                            )}
                        >
                            {step.shortName}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

/**
 * Simple Step Indicator
 * Minimal version for tight spaces
 */
export function SimpleStepIndicator({
    current,
    total,
    className
}: {
    current: number;
    total: number;
    className?: string;
}) {
    return (
        <div className={cn("flex items-center gap-1", className)}>
            {Array.from({ length: total }).map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: i + 1 === current ? 1.2 : 1 }}
                    className={cn(
                        "w-2 h-2 rounded-full transition-colors",
                        i + 1 < current
                            ? "bg-amber-600"
                            : i + 1 === current
                                ? "bg-amber-600"
                                : "bg-stone-300"
                    )}
                />
            ))}
        </div>
    );
}
