import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Vishwa Wellness - Studio",
    description: "Content management for Vishwa Wellness",
};

export default function StudioLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div style={{ height: '100vh', overflow: 'hidden' }}>
            {children}
        </div>
    );
}
