"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
    Home, ShoppingBag, Package, User, Settings, Search,
    BookOpen, Phone, MapPin, CreditCard, LogOut, Heart
} from "lucide-react";
import {
    Command,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandSeparator,
} from "@/components/ui/command";

interface GlobalSearchProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const navigationItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: ShoppingBag, label: "Shop", href: "/shop" },
    { icon: Package, label: "My Orders", href: "/account/orders" },
    { icon: Heart, label: "Wishlist", href: "/wishlist" },
    { icon: User, label: "My Account", href: "/account" },
];

const pageLinks = [
    { icon: BookOpen, label: "About Us", href: "/about" },
    { icon: Phone, label: "Contact", href: "/contact" },
    { icon: MapPin, label: "AWT Retreats", href: "/awt-retreats" },
    { icon: CreditCard, label: "Checkout", href: "/checkout" },
];

const accountActions = [
    { icon: Settings, label: "Settings", href: "/account/settings" },
    { icon: MapPin, label: "Addresses", href: "/account/addresses" },
    { icon: LogOut, label: "Sign Out", href: "/account/login" },
];

/**
 * Global Search / Command Palette
 * Triggered with Cmd+K or Ctrl+K
 */
export function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
    const router = useRouter();
    const [search, setSearch] = React.useState("");

    const handleSelect = (href: string) => {
        onOpenChange(false);
        setSearch("");
        router.push(href);
    };

    // Handle keyboard shortcut
    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                onOpenChange(!open);
            }
            if (e.key === "Escape") {
                onOpenChange(false);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, [open, onOpenChange]);

    if (!open) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                onClick={() => onOpenChange(false)}
            />

            {/* Command Dialog */}
            <div className="fixed left-1/2 top-[20%] z-50 w-full max-w-lg -translate-x-1/2 px-4">
                <Command className="rounded-2xl border border-stone-200 shadow-2xl">
                    <CommandInput
                        placeholder="Search pages, products, or actions..."
                        value={search}
                        onValueChange={setSearch}
                    />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>

                        <CommandGroup heading="Navigation">
                            {navigationItems.map((item) => (
                                <CommandItem
                                    key={item.href}
                                    onSelect={() => handleSelect(item.href)}
                                >
                                    <item.icon className="mr-2 h-4 w-4" />
                                    <span>{item.label}</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>

                        <CommandSeparator />

                        <CommandGroup heading="Pages">
                            {pageLinks.map((item) => (
                                <CommandItem
                                    key={item.href}
                                    onSelect={() => handleSelect(item.href)}
                                >
                                    <item.icon className="mr-2 h-4 w-4" />
                                    <span>{item.label}</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>

                        <CommandSeparator />

                        <CommandGroup heading="Account">
                            {accountActions.map((item) => (
                                <CommandItem
                                    key={item.href}
                                    onSelect={() => handleSelect(item.href)}
                                >
                                    <item.icon className="mr-2 h-4 w-4" />
                                    <span>{item.label}</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>

                    {/* Footer hint */}
                    <div className="flex items-center justify-between border-t border-stone-200 px-4 py-2 text-xs text-stone-400">
                        <span>Type to search...</span>
                        <div className="flex gap-1">
                            <kbd className="px-1.5 py-0.5 bg-stone-100 rounded text-stone-500">↑↓</kbd>
                            <span>navigate</span>
                            <kbd className="px-1.5 py-0.5 bg-stone-100 rounded text-stone-500 ml-2">↵</kbd>
                            <span>select</span>
                            <kbd className="px-1.5 py-0.5 bg-stone-100 rounded text-stone-500 ml-2">esc</kbd>
                            <span>close</span>
                        </div>
                    </div>
                </Command>
            </div>
        </>
    );
}

/**
 * Hook to use the global search
 */
export function useGlobalSearch() {
    const [open, setOpen] = React.useState(false);

    return {
        open,
        setOpen,
        toggle: () => setOpen((prev) => !prev),
    };
}
