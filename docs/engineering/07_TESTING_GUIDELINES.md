# Testing Guidelines

## Philosophy
Every bug fixed today should never return tomorrow.
Every production issue must generate a Root Cause Analysis and a Regression Test.

## Vitest (Unit & Integration)
- Focus on testing the **Service Layer** and complex **Utility functions**.
- Mock external dependencies (e.g., Prisma, Payment gateways, Email providers) strictly.
- Ensure all conditional branches (success, failure, unauthorized) are explicitly covered.

## Playwright (End-to-End)
- Focus on holistic user journeys (e.g., Guest Checkout, Authentication, Product Search).
- E2E tests must be isolated and resilient to minor UI changes.

## Continuous Integration
If Tests fail, STOP. Development cannot continue on a broken branch.
