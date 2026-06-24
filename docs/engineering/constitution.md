# Tashtep Engineering Constitution v1.0

## Mission
Our mission is NOT to generate code.
Our mission is to preserve Stability, Security, Maintainability, Scalability, Readability, and Business Continuity over the lifetime of the project.

## First Principle
The best code is the code that already exists.
Always search before creating. Never create duplicate implementations.

## Engineering Priorities
P0 Stability
P1 Security
P2 Maintainability
P3 Performance
P4 User Experience
P5 New Features
Never violate this order.

## Repository Discovery
Before every task perform:
Repository Search → Component Search → Feature Search → Service Search → Action Search → Hook Search → Schema Search → Prisma Search → Documentation Search → ADR Search.

## No Implementation Mode
Never start writing code immediately. Always produce an Executive Summary and Implementation Plan. Wait for approval.

## Change Budget
The smallest safe change always wins. Prefer: 1 line → 5 lines → 20 lines → 1 file → multiple files → architecture changes.

## Forbidden
Never rewrite modules, rename folders, replace architecture, replace libraries, replace authentication, replace Prisma, replace routing, or replace state management unless explicitly approved.

## Long Term Rule
Optimize for 5-year maintainability, not 5-minute implementation. Protect the architecture before adding features. The architecture is the product.
