# Tashtep Platform Roadmap

This document outlines the strategic priorities for the Tashtep platform. The architecture is locked, and all future development must strictly adhere to the Engineering Constitution.

## Phase 1: v1.1 Enterprise Hardening (COMPLETED)
- [x] Zero Technical Debt (No TODOs, no any types).
- [x] Fail-fast environment validation.
- [x] Integration of real Email (Resend) and Payment (Paymob) providers.
- [x] Playwright E2E & Vitest Unit coverage expansion.

## Phase 2: Observability & Scaling (v1.2)
- [ ] **Advanced Telemetry:** Integrate Datadog or Sentry for real-time frontend and backend tracing.
- [ ] **Caching Layer Optimization:** Implement Redis for aggressive caching of product categories and search results.
- [ ] **CDN Optimization:** Route all static assets and user uploads through Cloudflare or AWS CloudFront.

## Phase 3: B2B & Wholesale Operations (v2.0)
- [ ] **Wholesale Tiers:** Implement tiered pricing algorithms based on authenticated user roles (B2B vs B2C).
- [ ] **Bulk Order Management:** Support CSV upload and bulk cart additions for contractors.
- [ ] **Advanced Invoicing:** Automated PDF tax invoice generation synced directly with Paymob settlements.

## Phase 4: AI & Analytics (v2.1)
- [ ] **Semantic Search:** Replace exact-match SQL search with Vector/Embeddings based product discovery.
- [ ] **Predictive Restocking:** Administrative dashboard forecasting inventory depletion based on sales velocity.
