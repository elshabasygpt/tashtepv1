# Tashtep - API Architecture

## 1. Paradigm
Tashtep relies heavily on **Server Actions** and **React Server Components (RSC)** rather than traditional REST APIs to minimize client-side JavaScript and improve performance and SEO. Next.js Route Handlers (`app/api/*`) are reserved strictly for external webhooks, third-party integrations, and edge cases.

## 2. Server Actions (Primary Data Mutation)
Server Actions are the primary method for mutating data. They run exclusively on the server and are called directly from client components.

- **Location**: `src/actions/[feature].ts`
- **Validation**: All incoming data MUST be validated using `Zod` schemas before touching the database.
- **Error Handling**: Actions must return standard response objects: `{ success: boolean, data?: any, error?: string, validationErrors?: any }`.
- **Revalidation**: Post-mutation, use `revalidatePath` or `revalidateTag` to update the UI instantly without full page reloads.

### Core Action Modules
- `auth.actions.ts`: Login, registration, password management.
- `cart.actions.ts`: Add to cart, remove from cart, update quantities.
- `checkout.actions.ts`: Place order, handle COD logic.
- `user.actions.ts`: Update profile, address management.

## 3. Data Fetching (Primary Data Reading)
Data fetching happens primarily in Server Components directly interacting with Prisma.

- **Caching Strategy**: Next.js Data Cache is utilized extensively. Product catalogs and categories use heavy time-based (`revalidate: 3600`) or tag-based (`tags: ['products']`) caching.
- **Client Fetching**: Avoided where possible. If client-side reactivity requires data fetching (e.g., infinite scroll, live stock checking), we use **TanStack Query** paired with Server Actions or specialized Route Handlers.

## 4. Route Handlers (External APIs)
Used strictly when Server Actions are insufficient.

- **Location**: `src/app/api/[resource]/route.ts`
- **Methodology**: Standard HTTP REST concepts (`GET`, `POST`, `PUT`, `DELETE`).
- **Security**: Must be protected via Auth.js sessions. Webhooks are verified using cryptographic signatures.

### Example Route Handlers
- `POST /api/webhooks/payment`: (Future Phase) For Paymob/Fawry payment confirmations.
- `GET /api/feed/google`: XML feed generator for Google Merchant Center.

## 5. Security & Rate Limiting
- **Authentication**: Managed via Auth.js. User sessions are verified in middleware or directly at the top of Server Actions/Route Handlers.
- **Rate Limiting**: To prevent abuse (e.g., brute-forcing login, spamming cart additions), implement edge-level rate-limiting using Upstash Redis or Vercel KV within the middleware or critical endpoints.
