# Architecture Rules

## Status
- Architecture: LOCKED
- Folder Structure: LOCKED
- Technology Stack: LOCKED

## Data Flow Layering
UI → Server Actions → Services → Prisma → Database
Never bypass this flow. Never access Prisma directly from the UI.

## Component Strategy
- Prefer Server Components, Streaming, and Suspense.
- Avoid unnecessary client components.
- Use `next/image` for performance optimization.

## Zero Redesign Policy
- Never redesign architecture.
- Never introduce Redux, GraphQL, or Microservices.
- Never create duplicate components, services, or server actions.

## State Management
- Server State: Next.js App Router (RSC, Server Actions, Caching).
- URL State: URL Search Params (for shareable state like filters/pagination).
- Local State: React `useState` / `useReducer` only when absolutely necessary for UI interactivity.
