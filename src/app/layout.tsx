import type { Metadata } from "next";
import "@fontsource/lato/400.css";
import "@fontsource/lato/700.css";
import "@fontsource/playfair-display/400.css";
import "@fontsource/playfair-display/600.css";
import "@fontsource/playfair-display/700.css";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { OrganizationSchema } from "@/components/seo/JsonLd";
import ConditionalLayout from "@/components/layout/ConditionalLayout";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://vishwawellness.com'),
  title: "Vishwa Wellness - Healing Begins in the Ash",
  description: "Discover ancient Bhasma rituals, Agni-infused wellness products, and transformative AWT retreats. Experience the sacred science of ash for holistic healing.",
  keywords: "wellness, bhasma, ash therapy, ayurveda, holistic healing, retreats, agni",
  openGraph: {
    title: "Vishwa Wellness - Healing Begins in the Ash",
    description: "Ancient wisdom meets modern wellness through sacred ash rituals and Agni-infused products.",
    images: ["/logo.png"],
    siteName: "Vishwa Wellness",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vishwa Wellness - Healing Begins in the Ash",
    description: "Ancient wisdom meets modern wellness through sacred ash rituals and Agni-infused products.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <OrganizationSchema
          name="Vishwa Wellness"
          url={process.env.NEXT_PUBLIC_APP_URL || 'https://vishwawellness.com'}
          logo={`${process.env.NEXT_PUBLIC_APP_URL || 'https://vishwawellness.com'}/logo.png`}
          description="Ancient wisdom meets modern wellness through sacred Bhasma rituals and Agni-infused products."
          sameAs={[
            // Add your social media URLs here
          ]}
        />
        <AuthProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
