# Tashtep - Component Architecture

## 1. Core Philosophy
- **Reusability**: No duplicated UI code. If a UI element appears twice, it must abstract to a reusable component.
- **Server by Default**: Components must be Server Components unless they require state (`useState`), lifecycle hooks (`useEffect`), or DOM events (`onClick`).
- **Headless UI Foundation**: We build upon `shadcn/ui` (which uses Radix UI). This ensures accessibility (WAI-ARIA) is baked in without sacrificing styling flexibility.

## 2. Folder Structure (`src/components/`)
Components are organized strictly by scope and domain, not by generic technical classification.

- **`/ui`**: Generic, highly reusable building blocks directly from `shadcn/ui` (e.g., `Button`, `Input`, `Dialog`, `Sheet`).
- **`/layout`**: Structural components that frame the application (e.g., `Header`, `Footer`, `Sidebar`, `Container`).
- **`/product`**: Domain-specific blocks for products (e.g., `ProductCard`, `ProductGallery`, `PriceDisplay`, `CoverageCalculator`).
- **`/cart`**: Components managing the purchasing flow (e.g., `CartDrawer`, `CartItem`, `CheckoutSummary`).
- **`/shared`**: Cross-domain complex components (e.g., `SearchOverlay`, `EmptyState`, `Breadcrumbs`).

## 3. Component Guidelines
- **Props**: Strongly typed with TypeScript interfaces. Always export the interface for composed usage.
- **Styling**: `Tailwind CSS` with utility functions like `cn()` (clsx + tailwind-merge) to permit style overrides safely.
- **RTL Support**: Components must rely solely on logical properties (`ps`, `me`, `start`, `end`). Directional icons must automatically flip when rendered in an RTL context.
- **Suspense & Fallbacks**: Complex Server Components (like product grids or recommendations) must be wrapped in `<Suspense>` boundaries with meticulously designed skeleton fallbacks (`fallback={<ProductGridSkeleton />}`).

## 4. Strict UI Rules
- **Header/Footer**: Immutable design logic. Never rebuild; only extend existing props.
- **Product Card**: The most critical conversion unit. Do not alter its carefully balanced typography, aspect ratios, or hover mechanics arbitrarily.
- **Spacing**: Hardcoded padding/margins within generic components are discouraged unless using the system's strict 8pt scale variables. Let the parent layout dictate spacing via `gap` or `flex`.
