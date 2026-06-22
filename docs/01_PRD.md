# Tashtep - Product Requirements Document (PRD)

## 1. Business Overview
Tashtep is a premium ecommerce platform in Egypt specializing in high-end paints, decorative materials, wallpapers, tools, and finishing supplies. It is designed not as a generic hardware store, but as a digital flagship showroom. 

## 2. Goals
- Deliver an unparalleled visual and shopping experience in the Egyptian finishing materials market.
- Capture B2B (Contractors, Architects) and B2C (Homeowners) segments natively.
- Provide a frictionless, performance-optimized browsing experience.
- Maintain a scalable, SEO-first architecture from Day 1 to dominate local search queries.

## 3. Target Audience
- **Architects & Interior Designers**: Seeking premium materials, precise specifications, and mood-board-worthy inspiration.
- **Contractors & Painters**: Needing bulk ordering, professional tools, technical specs, and reliability.
- **Home Owners**: Looking for inspiration, DIY supplies, premium finishes, and guided purchasing.

## 4. Features
- **Editorial Homepage**: Zara Home style immersive banners.
- **Advanced Taxonomy**: Multi-level categorization with visual navigation.
- **Inspirational Galleries**: "Shop the look" rooms.
- **Rich Product Detail Pages (PDP)**: High-resolution cutouts, environmental shots, technical spec sheets, coverage calculators.
- **Cart & Checkout**: Drawer-based cart, Cash on Delivery (COD) flow, governorate-based shipping.
- **RTL Native Optimization**: Perfect Arabic bidirectional alignment.

## 5. Pages
- **Public**: Home, Category (PLP), Product (PDP), Inspiration Gallery, About, Contact, Knowledge Base.
- **Checkout**: Cart Drawer, Order Details, Customer Information, Shipping, Order Confirmation.
- **User Profile**: Order History, Saved Projects/Wishlist, Addresses, Account Settings.
- **Legal**: Terms & Conditions, Privacy Policy, Return Policy.

## 6. User Roles
- **Guest**: Can browse, add to cart, and checkout.
- **Retail Customer (B2C)**: Registered homeowner. Has wishlists and order history.
- **Trade Professional (B2B)**: Verified architects/contractors. May see different pricing tiers or bulk packaging in later phases.
- **Admin/Store Manager**: Has access to the CMS/dashboard to manage catalog and orders.

## 7. Future Roadmap
- Phase 2: Online Payment Gateway Integration (Paymob/Fawry).
- Phase 3: B2B Wholesale Tiers & Quoting System.
- Phase 4: AR functionality (Wall color visualizers).
- Phase 5: Multi-vendor / Marketplace integration.

## 8. Business Rules
- **Currency**: EGP (Egyptian Pound) only.
- **Payment Phase 1**: Cash on Delivery (COD) exclusively.
- **Delivery**: Nationwide (All Egyptian Governorates).
- **Language**: Strict Arabic (RTL).

## 9. Functional Requirements
- High-fidelity product search with debounced inputs.
- Shopping cart persistent via local storage or user session.
- Zod-validated authentication and checkout forms.
- Dynamic shipping calculation based on the selected Governorate.
- Paint coverage calculator integration on paint PDPs.

## 10. Non-Functional Requirements
- **Architecture**: Next.js 15 App Router, Server Components First.
- **Styling**: Tailwind CSS with generic-agnostic, premium layouts.
- **Database**: MySQL managed via Prisma ORM.

## 11. SEO Strategy
- Server-Side Rendered (SSR) / Static Site Generated (SSG) product and category pages.
- Dynamic Meta Tags, Open Graph, and Twitter Cards using Native Next.js Metadata API.
- Semantic HTML5 (nav, section, article, aside).
- Schema.org structured data for Products, Breadcrumbs, and Organization.
- Arabic URL Slugs.

## 12. Performance Requirements
- Core Web Vitals optimized (LCP < 2.5s, FID < 100ms, CLS < 0.1).
- Strict image optimization (WebP/AVIF via Next/Image).
- Minimal client-side JavaScript bundle (Server Components prioritized).
- Edge-caching for static assets.
