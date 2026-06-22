# Tashtep Brand & Design Guidelines

## 1. Design Philosophy
Tashtep is positioned as a **digital flagship showroom**, not merely an essential hardware store. The design language must evoke luxury, precision, and inspiration. 
- **Zara Home (50%)**: Editorial layouts, large-scale immersive photography, asymmetrical grids, sharp elegance, and focus on textural beauty.
- **Apple (30%)**: Extreme clarity, generous negative space, intentional typography, frictionless interactions, and technical precision.
- **IKEA (20%)**: Functional accessibility, highly structured product information, modular component reuse, and clear wayfinding.

## 2. Brand Voice
- **Tone**: Sophisticated, authoritative, inspiring, and professional.
- **Language Mode**: Premium Arabic (Modern Standard / Fusha blend adapted for high-end Egyptian commerce).
- **Messaging**: Focus on the *result* (a beautiful space) while validating the *process* (premium tools and materials). Avoid cheap promotional language (e.g., replace "Buy Now / اشتري الآن" with "Aquire / اقتني" or "Add to Project / أضف للمشروع").

## 3. Logo Rules
The Tashtep logo (Crown/Bear 'T' motif) is the primary anchor of the brand.
- **Clear Space**: Always maintain a minimum clear space equivalent to the height of the "T" motif around the logo.
- **Backgrounds**: The primary full-color logo (Orange `#F39223` and Grey `#8C8C91`) should only be used on pristine white (`#FFFFFF`) or ultra-light grey (`#FBFBFB`) backgrounds.
- **Monochrome Variants**: On dark backgrounds or photography overlays, use a strict solid white (`#FFFFFF`) variant. On highly textured neutral backgrounds, use solid charcoal (`#111111`).
- **Proportions**: Never stretch or distort the logomark. 

## 4. Colors
The color palette represents a balance of luxury and construction. 

### Core Brand
- **Tashtep Orange**: `#F39223` (Used sparingly as an accent for critical CTAs or active states, retaining its vibrancy without overwhelming the luxurious feel).
- **Tashtep Grey**: `#8C8C91` (Used for secondary structural elements and borders).

### UI & Editorial Theme
- **Obsidian Black**: `#111111` (Primary text, high-end solid buttons, dark mode elements).
- **Charcoal**: `#333333` (Secondary text, deep borders).
- **Gallery White**: `#FFFFFF` (Primary background, enforcing Apple-level negative space).
- **Stone Off-White**: `#F8F8F9` (Section separators, hover states, card backgrounds).

## 5. Typography
Arabic typography must exude modernity and legibility while maintaining the geometric precision of the Zara/Apple aesthetic.

- **Primary Font (Arabic & English)**: `Tajawal` or `IBM Plex Sans Arabic` (Clean, geometric, elegant). Alternatively, `Cairo` for bolder, architectural headings.
- **Scale Strategy**: Extreme contrast. Large, editorial, thin headers paired with highly legible, slightly heavier body text.
- **Line Height**: Generous spacing. `leading-relaxed` (1.625) for body copy to improve readability in RTL scripts, `leading-tight` (1.2) for massive headers.
- **Tracking (Letter Spacing)**: Arabic script inherently relies on connection (kashida). **Never apply wide letter-spacing (`tracking-wider`) to Arabic text**, as it breaks the script's ligatures. Use tracking exclusively on English technical specifications or SKUs.

## 6. Spacing
We utilize a strict **8pt geometric grid**, scaling up exponentially for section breaks to enforce the "flagship showroom" feel.
- **Micro (Components)**: 4px, 8px, 16px.
- **Macro (Layouts)**: 32px, 64px, 128px.
- **Rule of Negative Space**: When in doubt, double the padding. Elements must never feel constrained.

## 7. UI Components

### Buttons
- **Style**: Solid, matte, un-styled. No gradients. No heavy drop-shadows.
- **Shape**: Slightly softened edges `rounded-sm` (2px to 4px) to blend IKEA's friendliness with Zara's sharp editorial look.
- **Primary Action**: Obsidian Black (`#111111`) with White text. 
- **Highlight Action**: Tashtep Orange (`#F39223`) with White text (used ONLY for checkout/conversion).
- **Secondary Action**: Transparent background with a 1px solid Obsidian Black or Charcoal border.
- **Hover States**: Subtle opacity reduction (`opacity-80`) rather than physical displacement or harsh color inversion.

### Cards
- **Architecture**: Frameless or barely framed. The photography should define the card's boundary.
- **Borders**: If required, use an ultra-thin 1px border (`border-gray-200`).
- **Shadows**: Strictly avoid default shadows. Use a custom, ultra-diffuse, 2% opacity black shadow only on hover states (`hover:shadow-[0_10px_40px_rgba(0,0,0,0.04)]`).
- **Product Cards**: High aspect ratio (3:4 or 4:5 vertical alignment) mimicking fashion/editorial catalogs.

## 8. Icons
- **Library**: `lucide-react`.
- **Style**: Minimalist, technical, thin-line. 
- **Stroke Width**: `1.25` or `1.5` maximum.
- **Execution**: Icons are supporting actors. They should be sized consistently (e.g., 20x20 or 24x24) and colored in Tashtep Grey (`#8C8C91`) or Charcoal (`#333333`), never Orange unless indicating an active state.

## 9. Photography Style
Photography drives 80% of the Zara Home aesthetic. 
- **Product Shots (Cutouts)**: Deep-etched products placed on hex-matched `#F8F8F9` backgrounds. Symmetrical, front-facing, perfectly lit.
- **Lifestyle/Editorial**: Dramatic, natural lighting. Macro shots of paint textures, wallpapers reflecting light, styled rooms with deep contrast. 
- **No Stock-Feel**: Avoid artificial, overly bright, or generic "smiling contractor" stock photos. Focus on the art of the material, the perfection of the tool, and the beauty of the finished space.

## 10. RTL Rules
Engineering strictness is required for bi-directional layout support using modern CSS (Tailwind).
- **No Absolute Left/Right**: Ban the use of `ml-`, `mr-`, `pl-`, `pr-`, `left-`, `right-`.
- **Logical Properties Only**: Always use `ms-` (margin-inline-start), `me-` (margin-inline-end), `ps-`, `pe-`, `start-`, `end-`.
- **Icon Flipping**: Any directional icon (e.g., `ChevronRight`, `ArrowRight`) must be flipped when the document direction is `rtl`. Implement a standard `<IconRTL />` wrapper or utilize CSS transforms (`rtl:-scale-x-100`).
- **Text Alignment**: Default to `text-start`. Never hardcode `text-right` just because it's Arabic; the browser's `dir="rtl"` handles `text-start` appropriately.
