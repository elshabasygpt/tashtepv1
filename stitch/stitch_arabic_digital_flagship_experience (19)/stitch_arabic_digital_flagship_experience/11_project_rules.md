# Tashtep - Immutable Project Rules

## 1. Rule of Consistency
Once a pattern is introduced and approved (e.g., how an API response is formatted, how a button handles loading states), it must be utilized project-wide. No ad-hoc or rogue implementations tailored to single pages.

## 2. Design System Immutability
- **Typography**: Only use the defined variables (`--font-tajawal`, `--font-cairo`). Do not arbitrarily add weights or families inline.
- **Colors**: Rely exclusively on Tailwind semantics mapped to the design system (`bg-obsidian`, `text-charcoal`, `border-stone`, `text-gallery`). No arbitrary hex codes (`bg-[#FFF]`) allowed in component code.
- **Spacing**: The grid is 8pt. (`p-2`, `p-4`, `p-6`, `p-8`). Do not use odd utility steps like `p-3` or `m-[17px]`.

## 3. The "No Redesign" Rule
The critical path components—specifically the Header, Product Card, and Cart flow—are mathematically designed to reflect the 50/30/20 brand blend (Zara/Apple/IKEA). No developer or AI agent is permitted to "redesign" these to fit a generic e-commerce template. Expand them if necessary, but changing their core structural CSS or aesthetic layout is functionally forbidden.

## 4. Logical CSS Only (RTL Matrix)
The site targets the Egyptian market and is natively Arabic RTL.
- `left-*` -> **BANNED** (Use `start-*`)
- `right-*` -> **BANNED** (Use `end-*`)
- `pl-*`, `pr-*` -> **BANNED** (Use `ps-*`, `pe-*`)
- `ml-*`, `mr-*` -> **BANNED** (Use `ms-*`, `me-*`)

## 5. Architectural Boundaries
- **No Client Fetching by Default**: If data can be fetched securely on the server via Prisma within a Server Component, it must be done there. Do not expose APIs to the client unless live interactivity (like search-as-you-type) necessitates it.
- **Validation Barrier**: No data crosses from Client to Server (via Actions or APIs) without passing through a Zod schema validation step.

## 6. Language & Tone
- All user-facing text is Arabic (Fusha/Modern Standard adapted for high-end commerce).
- English is reserved strictly for: Codebases, internal documentation, URLs/Slugs, and technical product specifications/SKUs.
