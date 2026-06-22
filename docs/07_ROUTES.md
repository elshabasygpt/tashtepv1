# Tashtep - Routing Architecture

## 1. Paradigm
We utilize the **Next.js App Router** (`src/app/`). The architecture is strictly **SEO-first**, relying extensively on dynamic segments, parallel routes, and intercepting routes for seamless modal experiences.

## 2. Route Map

### 2.1. Public E-Commerce Experience
- `/` - The flagship home page. Immersive editorial experience. Server Rendered with heavy edge caching.
- `/about` - Brand story, heritage, and showroom locations.
- `/contact` - B2B/B2C inquiries and customer support.
- `/inspiration` - "Shop the Room" galleries. High-resolution imagery with hot-spotted products.

### 2.2. Product Catalog (PLP & PDP)
- `/categories/[slug]` - Product Listing Page (PLP). Contains deeply integrated facet filtering. Uses dynamic routing with cached params.
- `/products/[slug]` - Product Detail Page (PDP). The core conversion engine. Server component heavy with Suspense for related items. Includes coverage calculators.
- `/search` - Dedicated search results page. Must support query params (e.g., `?q=hammer`).

### 2.3. Cart & Checkout (Strictly Protected where applicable)
- *(Cart is a Drawer component available globally, not a dedicated page, adhering to modern frictionless UI expectations)*
- `/checkout` - Secure checkout funnel.
  - `/checkout/information` - Address and contact details collection.
  - `/checkout/shipping` - Governorate selection and dynamic fee calculation.
  - `/checkout/payment` - COD validation (Phase 1).
  - `/checkout/success/[orderId]` - Order confirmation and tracking summary.

### 2.4. Customer Account (Protected Routes)
- `/account` - Main dashboard (Overview).
- `/account/orders` - Historical order tracking.
- `/account/orders/[id]` - Detailed immutable invoice view.
- `/account/saved` - Wishlists or specific "Projects" being planned by the user.
- `/account/addresses` - Address book management for fast checkout.

### 2.5. Legal & Compliance
- `/legal/terms` - Terms & Conditions.
- `/legal/privacy` - Privacy Policy.
- `/legal/returns` - Return & Exchange protocols.

## 3. Dynamic Metadata
Every dynamic route (`[slug]`) MUST export a `generateMetadata` function to ensure dynamic SEO rendering (Title tags, Open Graph images representing the specific product category).
