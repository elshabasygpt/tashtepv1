# Tashtep - Design System

## 1. Principles
- **Zara Home (50%)**: Immersive, editorial lifestyle imagery, asymmetrical grids, extreme elegance.
- **Apple (30%)**: Supreme technical clarity, pixel-perfect alignment, negative space, frictionless micro-interactions.
- **IKEA (20%)**: Modular component reusability, clear wayfinding, functional accessibility.

## 2. Layout & Grid
- **Container**: Max width constrained to `1440px`.
- **Spacing**: Strict 8pt vertical/horizontal rhythm.
- **Logical Properties**: Rigid adherence to `start`, `end`, `ps`, `pe`, `ms`, `me` (Never `left`/`right`).
- **Composition**: Extensive use of blank space. Elements should breathe heavily.

## 3. Core Components

### 3.1. Typography System
- `Display`: Extravagant sizes, tight line-heights, used for hero banners. (Cairo or Tajawal).
- `Heading`: Medium weights, structured for hierarchy.
- `Body`: Highly legible, relaxed line-heights `leading-relaxed` for Arabic script readability.
- `Technical`: Monospace or strict geometric sans for SKUs, dimensions, and prices. EGP currency symbol styled distinctly.

### 3.2. Buttons (Actions)
- **Primary**: Solid Obsidian Black (`#111111`), White Text, minimal border-radius `rounded-sm`.
- **Checkout/Conversion**: Tashtep Orange (`#F39223`), White Text.
- **Secondary**: Transparent with 1px Obsidian border.
- **Ghost/Tertiary**: Underlined text upon hover, no background.
- **Interaction**: Framer Motion subtle scaling (`scale: 0.98`) on tap, gentle fade on hover. No harsh dropshadows.

### 3.3. Product Cards
- **Structure**: Vertical editorial ratio (3:4 or 4:5). Focus 80% on photography.
- **Data Display**: Brand name (small, grey), Product Title (medium, black), Price (strong weight).
- **Hover**: Second image reveal (cutout to lifestyle transition), ultra-diffuse 2% shadow.
- **Actions**: "Quick Add" reveals on hover at bottom of image.

### 3.4. Navigation & Header
- Sticky, transparent-to-solid transition on scroll.
- Mega-menu for categories (Paints -> Interior, Exterior, Enamels).
- Minimalist iconography (Lucide).

### 3.5. Forms & Inputs
- **Style**: Floating labels or deeply padded flush inputs.
- **Borders**: 1px grey border, transitioning to Obsidian on focus. No glowing focus rings—use sharp, solid black outlines or bottom borders.
- **Validation**: Inline, elegant red text below inputs, animated slide-down via Framer motion.

## 4. Animation Language
- Transitions must feel like page turns or optical fades.
- Speed: Swift but smooth (duration: `0.3s` - `0.5s`, ease: `[0.25, 0.1, 0.25, 1.0]`).
- Page load: Staggered upward fades.
