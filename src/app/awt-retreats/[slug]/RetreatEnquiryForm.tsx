"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { retreatEnquirySchema, type RetreatEnquiryData } from "@/lib/validations/contact";

interface RetreatEnquiryFormProps {
    retreatTitle: string;
    retreatSlug: string;
    accent: string;
}

const participantOptions = [
    { value: "1", label: "Just me" },
    { value: "2", label: "2 people" },
    { value: "3-4", label: "3–4 people" },
    { value: "5+", label: "5 or more" },
];

// Next 6 months as "Month Year" options for the preferred-month select
function upcomingMonths(count: number): string[] {
    const formatter = new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" });
    const now = new Date();
    return Array.from({ length: count }, (_, i) =>
        formatter.format(new Date(now.getFullYear(), now.getMonth() + i + 1, 1))
    );
}

export default function RetreatEnquiryForm({ retreatTitle, retreatSlug, accent }: RetreatEnquiryFormProps) {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const months = useMemo(() => upcomingMonths(6), []);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<RetreatEnquiryData>({
        resolver: zodResolver(retreatEnquirySchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            preferredMonth: "",
            participants: "",
            message: "",
        },
    });

    const onSubmit = async (data: RetreatEnquiryData) => {
        setSubmitError(null);
        try {
            const response = await fetch("/api/retreat-enquiry", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...data, retreatTitle, retreatSlug }),
            });

            const result = await response.json().catch(() => ({}));

            if (!response.ok) {
                setSubmitError(result?.error || "Failed to send your enquiry. Please try again.");
                return;
            }

            setIsSubmitted(true);
        } catch {
            setSubmitError("Network error. Please check your connection and try again.");
        }
    };

    const handleReset = () => {
        reset();
        setSubmitError(null);
        setIsSubmitted(false);
    };

    const inputClass = (hasError: boolean) =>
        `w-full px-4 py-3.5 rounded-lg border-2 focus:ring-0 outline-none transition-colors bg-[var(--color-bg-light)] ${hasError
            ? "border-red-400 focus:border-red-400"
            : "border-transparent focus:border-[var(--color-primary)]"
        }`;

    if (isSubmitted) {
        return (
            <Card className="p-10 text-center bg-white">
                <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
                <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-semibold text-[var(--color-navy)] mb-3">
                    Enquiry Received!
                </h3>
                <p className="text-[var(--color-ash)] mb-8 max-w-md mx-auto">
                    Thank you for your interest in the {retreatTitle}. Our wellness team will
                    reach out within 24 hours to discuss dates and answer your questions.
                </p>
                <Button onClick={handleReset} variant="outline">
                    Send Another Enquiry
                </Button>
            </Card>
        );
    }

    return (
        <Card className="p-8 bg-white overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-1.5" style={{ backgroundColor: accent }} />
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-2">
                <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-navy)] mb-2">
                            Your Name *
                        </label>
                        <input
                            type="text"
                            {...register("name")}
                            className={inputClass(!!errors.name)}
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
                            className={inputClass(!!errors.email)}
                            placeholder="your@email.com"
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                        )}
                    </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-5">
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-navy)] mb-2">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            {...register("phone")}
                            className={inputClass(!!errors.phone)}
                            placeholder="+91 XXXXX XXXXX"
                        />
                        {errors.phone && (
                            <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-navy)] mb-2">
                            Preferred Month
                        </label>
                        <select {...register("preferredMonth")} className={inputClass(false)}>
                            <option value="">Flexible / not sure</option>
                            {months.map((month) => (
                                <option key={month} value={month}>
                                    {month}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-navy)] mb-2">
                            Participants
                        </label>
                        <select {...register("participants")} className={inputClass(false)}>
                            <option value="">Select</option>
                            {participantOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-[var(--color-navy)] mb-2">
                        Anything We Should Know?
                    </label>
                    <textarea
                        rows={4}
                        {...register("message")}
                        className={`${inputClass(!!errors.message)} resize-none`}
                        placeholder="Health concerns, questions, or what you hope to gain from the retreat..."
                    />
                    {errors.message && (
                        <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
                    )}
                </div>

                {submitError && (
                    <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <p className="text-sm text-red-700">{submitError}</p>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <Button type="submit" size="lg" className="w-full sm:w-auto" loading={isSubmitting}>
                        <Send className="w-4 h-4 mr-2" />
                        {isSubmitting ? "Sending..." : "Send Enquiry"}
                    </Button>
                    <p className="text-xs text-[var(--color-ash)]">
                        No payment now — our team confirms dates and details with you first.
                    </p>
                </div>
            </form>
        </Card>
    );
}
