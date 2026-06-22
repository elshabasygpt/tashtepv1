# Tashtep - Project & Coding Rules

## 1. Architectural Commitments
- **Design System First**: Never redesign Header, Footer, Product Card, or Search components. Build them perfectly once and reuse everywhere.
- **Component Reusability**: Enforce modular, reusable components across the codebase. No duplicated code.
- **UI Frameworks**: Always use `shadcn/ui` components tailored to our aesthetic guidelines, complemented by `Tailwind CSS`.
- **Database & State**: Always use `Prisma` for database orchestration. State validation MUST pass through `Zod`.
- **Rendering Paradigm**: Server Components first. Always prioritize server-side processing unless dynamic client interactions strongly mandate `use client` state.

## 2. RTL & Layout Directives
- **RTL Exclusivity**: The application is strictly RTL (Arabic).
- **Logical CSS Properties**: ALWAYS use logical properties (`start`, `end`, `ps`, `pe`, `ms`, `me`).
- **Prohibited Classes**: NEVER use physical directional classes (e.g., `left-4`, `pr-2`, `ml-auto`).
- **Inline Styles**: Ban all inline styles. Everything must be mapped through Tailwind CSS utility classes.
- **Container Sizing**: Max layout width is pinned to `1440px`.
- **Grid System**: Use a rigid `8pt` spacing system (e.g. `p-2` = 8px, `p-4` = 16px, `gap-8` = 32px).

## 3. Qualitative Directives
- **Zero Generic Aesthetics**: Reject standard, uninspired e-commerce formats. The application must channel:
  - 50% Zara Home (Editorial image depth and asymmetry)
  - 30% Apple (Technical precision, massive negative space, frictionless micro-interactions)
  - 20% IKEA (Unmatched functional wayfinding and accessibility)
- **Accessibility**: A11y is strictly required. Ensure ARIA labels, semantic HTML, and correct keyboard navigation states across all interactive elements.
- **Performance**: Optimize for maintainability, scalable codebase growth, and raw technical speed. Server rendering forms the core of our performance metrics.
- **SEO First**: Maintain robust meta-data and semantic structures strictly geared toward Search Engine optimization.
