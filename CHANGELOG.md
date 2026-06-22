# Changelog

All notable changes to the Tashtep platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-06-22

### Added
- **Enterprise Governance:** Added `docs/engineering` containing the Engineering Constitution and Code Review Checklists.
- **AI Agent Directives:** Added `.cursorrules` and `.ai-instructions.md` to establish the repository as the Single Source of Truth.
- **Environment Validation:** Created `src/lib/env.ts` using Zod to enforce fail-fast verification of `PAYMOB_*`, `RESEND_API_KEY`, and `DATABASE_URL` at boot.
- **Observability:** Integrated `Pino` for centralized, structured JSON logging replacing standard console streams.
- **Automated Testing:** Expanded Vitest coverage for `ProductService` and `CheckoutService`. Playwright E2E coverage added for Authentication and Guest Checkout flows.

### Changed
- **Checkout Flow:** Upgraded `processCheckout` to extract user email directly from the Prisma transaction, removing legacy `@placeholder.com` logic.
- **Paymob Integration:** Enforced strict `ConfigurationError` throwing on missing payment gateway variables.
- **Authentication:** Integrated `Resend` SDK for verified password reset and email verification operations.

### Removed
- Removed all instances of `console.log` and `console.error` outside of native client boundary components.
- Removed arbitrary `any` typing and `@ts-ignore` bypasses from the Product features.
- Destroyed all mock fallback iframes and placeholder business logic.
