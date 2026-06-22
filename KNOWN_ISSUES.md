# Known Issues

This file tracks identified bugs, edge cases, or platform limitations that have not yet been resolved or prioritized for a fix. 

> **Current Project Status:** Zero major or critical known issues reported. The v1.1.0 Enterprise Hardening sprint eradicated all known placeholder logic and unhandled exceptions.

## Low Priority / Backlog

1. **Client-Side Hydration Logs:** 
   - *Description:* `console.error` is currently utilized within `src/app/error.tsx` and local storage hooks (`useCart.ts`, `useWishlist.ts`). While functional, it is not forwarded to the central `Pino` logger because `pino-pretty` is restricted to server environments.
   - *Workaround:* Acceptable behavior; client side errors are contained within standard React Error Boundaries.

2. **Soft Deletion Constraints:**
   - *Description:* The Prisma schema heavily utilizes relational cascades. If an Order is deleted, associated tracking could be lost.
   - *Workaround:* Administrative deletion actions are currently restricted. Future updates should implement strict Soft Delete (`deletedAt`) auditing across the database schema.
