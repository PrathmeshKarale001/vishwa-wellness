# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Vishwa Wellness is an e-commerce platform for wellness products (Bhasma rituals, Agni-infused products, retreats) built with Next.js 16 (App Router), TypeScript, and Tailwind CSS v4.

## Development Commands

```bash
npm run dev      # Start development server at localhost:3000
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture

### Tech Stack
- **Framework**: Next.js 16 with App Router
- **CMS**: Sanity (headless CMS for products, categories, rituals, retreats)
- **Database/Auth**: Supabase (authentication, profiles, orders, reviews, wishlists)
- **Payments**: Razorpay (Indian payment gateway)
- **State Management**: Zustand with persist middleware
- **Styling**: Tailwind CSS v4
- **Email**: Resend
- **Error Tracking**: Sentry
- **Caching**: Redis (optional, graceful fallback)

### Directory Structure

```
src/
├── app/                    # Next.js App Router pages and API routes
│   ├── api/               # API routes (payment, orders, admin, webhooks)
│   ├── account/           # User account pages (orders, addresses, settings)
│   ├── admin/             # Admin panel (orders, reviews, coupons)
│   ├── products/[slug]/   # Dynamic product detail pages
│   ├── shop/              # Shop listing page
│   ├── studio/            # Embedded Sanity Studio at /studio
│   └── ...
├── components/
│   ├── auth/              # AuthProvider, AuthGuard
│   ├── cart/              # CartDrawer
│   ├── checkout/          # Multi-step checkout components
│   ├── layout/            # Header, Footer, MobileBottomNav
│   ├── product/           # Product detail components
│   ├── reviews/           # Review system components
│   ├── shop/              # ProductCard, QuickViewModal
│   └── ui/                # Reusable UI primitives (Button, Card, Dialog, etc.)
├── lib/
│   ├── authStore.ts       # Zustand auth state
│   ├── cartStore.ts       # Zustand cart state (persisted)
│   ├── wishlistStore.ts   # Zustand wishlist state
│   ├── sanity.ts          # Sanity client configuration
│   ├── sanity.fetch.ts    # Sanity data fetching functions
│   ├── sanity.queries.ts  # GROQ queries
│   ├── supabase.ts        # Supabase browser client
│   ├── supabase-server.ts # Supabase server client
│   ├── razorpay.ts        # Razorpay integration
│   ├── redis/             # Redis caching layer
│   └── validations/       # Zod schemas
├── hooks/                 # Custom React hooks
└── types/                 # TypeScript type definitions
sanity/
├── schemas/               # Sanity document schemas (product, category, ritual, etc.)
└── components/            # Custom Sanity Studio inputs
```

### Key Patterns

**State Management**: Zustand stores with persist middleware for cart/wishlist. Auth state syncs with Supabase sessions.

**Data Fetching**:
- Sanity: Use `sanityFetch()` from `lib/sanity.fetch.ts` with Next.js cache tags
- Supabase: Direct client calls for user data, orders, reviews

**Authentication**: Supabase Auth with email/password and Google OAuth. `AuthProvider` initializes auth state, `AuthGuard` protects routes.

**Payments Flow**:
1. Create Razorpay order via `/api/payment/create-order`
2. Client-side Razorpay checkout
3. Verify payment via `/api/payment/verify`
4. Webhook handler at `/api/webhooks/razorpay`

**Admin Routes**: Protected by checking `profile.is_admin` flag in Supabase profiles table.

### Import Alias

Use `@/*` for imports from `src/` directory (configured in tsconfig.json).

## Environment Variables

Copy `.env.example` to `.env.local`. Required services:
- Supabase (auth, database)
- Sanity (CMS)
- Razorpay (payments)

Optional: Sentry, Resend, Redis

## Sanity Studio

Embedded at `/studio` route. Schemas in `sanity/schemas/`. Key document types:
- `product`: Main product schema with variants, sections, categories
- `category`: Product categories with subcategories and segments
- `ritual`: Bhasma ritual content
- `retreat`: Wellness retreat offerings
- `homePage`: Homepage content (singleton)
