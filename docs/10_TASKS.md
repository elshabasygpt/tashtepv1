# Tashtep - Execution Roadmap & Task List

## Phase 1: Foundation & Infrastructure (Current)
- [x] PRD Documentation
- [x] Brand & Design System Documentation
- [x] Database Schema Design
- [x] Route & API Planning
- [x] Next.js 15 initial setup with App Router configuration
- [x] Tailwind CSS v4 setup with custom variables and colors
- [x] Prisma configuration with MySQL schema mapping
- [x] Implement robust `lucide-react` integration and foundational layout.
- [ ] Implement robust `shadcn/ui` base components natively in RTL.

## Phase 2: Core UX/UI Skeletons
- [ ] Build global `Header` with transparency-on-scroll logic and mega-menu structure.
- [ ] Build global `Footer` with legal and navigation links.
- [ ] Build reusable `ProductCard` with hover transitions (image flip, Quick Add reveal).
- [ ] Develop `SearchOverlay` with debounced input and skeleton loaders.

## Phase 3: Catalog Experience
- [ ] Implement Home Page (Editorial Hero, Featured Categories, Shop the Look module).
- [ ] Implement Category PLP (Dynamic route `/categories/[slug]`, robust side-filtering).
- [ ] Implement Product PDP (Massive gallery display, technical specifications table, coverage calculator).

## Phase 4: Cart & Orders
- [ ] Build `CartDrawer` with local state persistence and Prisma variant validation.
- [ ] Implement Checkout flow (Information -> Shipping -> COD Confirmation).
- [ ] Map dynamic shipping fees based on Egyptian Governorates.

## Phase 5: Authentication & User Accounts
- [ ] Configure `Auth.js` with credentials provider (Phone/Email) and secure session management.
- [ ] Build User Dashboard (Profile, Address Book, Order History lists).
- [ ] Protect checkout paths requiring authentication or strict guest flows.

## Phase 6: Final Polish
- [ ] Strict accessibility audit (WAI-ARIA compliance, keyboard navigation).
- [ ] Performance profiling (Image optimization, Core Web Vitals checks).
- [ ] SEO implementation (Dynamic Meta, Open Graph tags, JSON-LD Schema).
