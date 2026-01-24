"use client";

import { Toaster as SonnerToaster, toast } from "sonner";

/**
 * Toast Provider Component
 * Add this to your root layout to enable toast notifications
 */
export function ToastProvider() {
    return (
        <SonnerToaster
            position="bottom-right"
            toastOptions={{
                duration: 4000,
                classNames: {
                    toast:
                        "group toast bg-white border border-stone-200 shadow-lg rounded-xl p-4",
                    title: "text-stone-900 font-semibold text-sm",
                    description: "text-stone-600 text-sm",
                    actionButton:
                        "bg-stone-900 text-white hover:bg-stone-800 rounded-lg px-3 py-1.5 text-sm font-medium",
                    cancelButton:
                        "bg-stone-100 text-stone-900 hover:bg-stone-200 rounded-lg px-3 py-1.5 text-sm font-medium",
                    closeButton:
                        "bg-stone-100 text-stone-600 hover:bg-stone-200 rounded-full p-1",
                    success: "border-green-200 bg-green-50",
                    error: "border-red-200 bg-red-50",
                    warning: "border-amber-200 bg-amber-50",
                    info: "border-blue-200 bg-blue-50",
                },
            }}
            expand
            richColors
        />
    );
}

/**
 * Toast utility functions
 * Usage: showToast.success("Item added to cart!")
 */
export const showToast = {
    success: (message: string, options?: { description?: string }) =>
        toast.success(message, options),

    error: (message: string, options?: { description?: string }) =>
        toast.error(message, options),

    warning: (message: string, options?: { description?: string }) =>
        toast.warning(message, options),

    info: (message: string, options?: { description?: string }) =>
        toast.info(message, options),

    loading: (message: string) =>
        toast.loading(message),

    promise: <T,>(
        promise: Promise<T>,
        options: {
            loading: string;
            success: string | ((data: T) => string);
            error: string | ((error: Error) => string);
        }
    ) => toast.promise(promise, options),

    dismiss: (toastId?: string | number) =>
        toast.dismiss(toastId),

    custom: (message: string, options?: Parameters<typeof toast>[1]) =>
        toast(message, options),
};

// Re-export the original toast for advanced usage
export { toast };
