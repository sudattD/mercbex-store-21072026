# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project: MERCBEX — Agri Pesticides Store

A Next.js e-commerce and crop-disease diagnostic platform for Indian farmers. Built with Next.js 16 (App Router), React 19, Tailwind CSS 4, TypeScript, and `lucide-react` icons.

## Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint check
```

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, Tailwind CSS 4
- **Language**: TypeScript (strict mode)
- **Icons**: `lucide-react`
- **Fonts**: DM Sans + Syne (Google Fonts, loaded via `next/font`)
- **State**: React Context (no external state library)
- **Storage**: localStorage for persistence (cart, auth, scan history, language)
- **Auth**: Password-based (stored in localStorage — demo/simulated, not production-ready)
- **Deployment**: `vercel.json` configured for Vercel

## Architecture Overview

### Data Layer (`src/data/`)

| File | Purpose |
|---|---|
| `products.ts` | Products (30 hardcoded), categories, crops (15), common problems (10), testimonials. Admin can override via `localStorage("mercbex_products_override")`. SVG generators for disease reference images. |
| `cropAnalysis.ts` | AI detection mapping — mock `analyzeCropImage()` simulated analysis for the products page. |
| `aiDetection.ts` | Scan-page AI detection — `simulateMultiDetection()` for the `/scan` page. |
| `translations.ts` | i18n — 8 languages (en/hi/ta/te/kn/mr/bn/gu). All UI strings as `{key: {lang: string}}`. |

### Context Providers (`src/context/`)

| Provider | Storage Key | Purpose |
|---|---|---|
| `LanguageProvider` | `mercbex-lang` | i18n state, `t()` lookup function |
| `AuthProvider` | `mercbex_user_*`, `mercbex_session`, `mercbex_phone_*` | Login/signup, profile CRUD, address management (all localStorage) |
| `CropProvider` | `mercbex_my_crop` | Tracks which crop the user selected for scan |
| `CartProvider` | none (in-memory) | Cart items, add/remove/quantity, scan context per item |

### Pages (`src/app/`)

| Route | File | Purpose |
|---|---|---|
| `/` | `page.tsx` | Homepage — hero carousel, crop selector, categories, product grids, testimonials, newsletter |
| `/products` (with `?category=`, `?search=`) | `products/page.tsx` | Full product catalog with filters, search (including voice), AI image analysis upload |
| `/products/[id]` | `products/[id]/page.tsx` | Product detail page |
| `/scan` | `scan/page.tsx` | **Core feature** — AI crop disease scanner: select crop → take photo (camera or upload) → simulated analysis → results with symptom details and add-to-cart |
| `/crops/[id]` | `crops/[id]/page.tsx` | Crop-specific disease info and product recommendations |
| `/problems/[id]` | `problems/[id]/page.tsx` | Individual problem/disease detail page |
| `/checkout` | `checkout/page.tsx` | Checkout flow |
| `/order/[id]` | `order/[id]/page.tsx` | Order confirmation |
| `/auth` | `auth/page.tsx` | Login/signup |
| `/profile` | `profile/page.tsx` | User profile and address management |
| `/about` | `about/page.tsx` | About page |
| `/contact` | `contact/page.tsx` | Contact page |

### Key Components (`src/components/`)

| Component | Purpose |
|---|---|
| `Navbar.tsx` | Global nav — language selector, cart badge, mobile menu, scan CTA |
| `HeroCarousel.tsx` | The horizontal scrolling hero section |
| `HeroStory.tsx` | Step-by-step "How It Works" carousel (5 slides, auto-scroll) |
| `PromoBanner.tsx` | Admin-controlled promo banner from localStorage |
| `CategoryIcon.tsx` | Maps string icon names to Lucide components (Bug, Shield, Leaf, Rat, TrendingUp) |
| `CartDrawer.tsx` | Slide-out cart panel |
| `ProductCard.tsx` | Product card used in grids |
| `MyDiagnoses.tsx` | Scan history dashboard (reads from localStorage `mercbex_crop_scans`) |
| `WhatsAppButton.tsx` | Fixed-position WhatsApp support button |
| `Footer.tsx` | Site footer |

## Important Patterns

- **All pages are `"use client"`** — no server components. Data comes from static arrays + localStorage, not a database.
- **Mock AI detection** — both `cropAnalysis.analyzeCropImage()` (products page) and `aiDetection.simulateMultiDetection()` (scan page) are simulated. The data types are designed so a real ML API can return the same shape.
- **Scan session persistence** — the `/scan` page saves its full state (results, image, rejection flags, cart additions) to `localStorage("mercbex_scan_session")` so users can return mid-flow.
- **Admin overrides** — products can be overridden at runtime via `localStorage("mercbex_products_override")` (JSON array of `Product` objects). Matching IDs merge, new IDs append.
- **`@/` path alias** maps to `src/` (configured in `tsconfig.json`).
- **No database, no API routes** — the entire app is client-side with localStorage persistence.

## Design Constraints

- **Font families**: `--font-dm-sans` (body) and `--font-syne` (headings, variable name `--font-syne`). Applied via CSS variables in `layout.tsx`.
- **Tailwind v4** — uses `@tailwindcss/postcss` (v4), not the v3 `tailwindcss` package. Config is in `postcss.config.mjs`.
- **Icons**: Use `lucide-react` components (e.g., `import { Bug } from "lucide-react"`). Map string names via `CategoryIcon.tsx`.

## Key Data Shapes

### Product
```typescript
interface Product {
  id: string; name: string; activeIngredient: string; formulation: string;
  category: "Insecticide" | "Fungicide" | "Herbicide" | "Rodenticide" | "Plant Growth Regulator";
  price: number; originalPrice?: number; rating: number; reviewCount: number;
  description: string; targetPests: string[]; cropSuitability: string[];
  dosage: string; packSizes: string[]; features: string[]; inStock: boolean; badge?: string;
}
```

### CropType
```typescript
interface CropType {
  id: string; name: string; icon: string; image: string; description: string;
  commonIssues: CropIssue[]; matchingProductIds: string[];
}
```

### Detection Result (scan page)
```typescript
interface DetectionResult {
  disease: string; severity: string; confidence: number; description: string;
  cause?: string; symptoms: string[];
  referenceImages?: { url: string; caption: string }[];
  recommendedProductIds: string[]; crop: string; cropIcon: string;
}
```

## Admin Dashboard

- **Route**: `/admin` (not linked from the public app — direct URL access)
- Single-page dashboard with 5 tabs in a dark sidebar. All data reads/writes localStorage using the same keys the app uses.
- **Tabs**: Overview (stats cards + quick actions + recent scans), Products (CRUD table + modal form with tag inputs), Scans (read-only history table with severity filter), Promo Banner (form + live color preview), Orders (reads `order_MBX*` keys from checkout)
- Product edits merge with the hardcoded catalog via `getProducts()` in `products.ts`
- See `public/mercbex-flow-diagram.html` and `public/mercbex-api-spec.html` for extended docs
