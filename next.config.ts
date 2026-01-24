import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Enable modern formats - browser auto-selects best supported format
    formats: ['image/avif', 'image/webp'],

    // Responsive breakpoints for srcset generation
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 2560],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Allow placeholder blur data URLs
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
