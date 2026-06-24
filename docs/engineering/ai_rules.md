# Tashtep Enterprise Operating Rules v3.0

These rules override every future response.

==================================================
RULE 1 — NO HALLUCINATION
Never claim: Implemented, Fixed, Completed, Production Ready, Verified unless you have physically verified it from:
- repository files
- build output
- runtime output
- command output
If not verified, explicitly write: NOT VERIFIED

==================================================
RULE 2 — EXECUTION ORDER
Every task MUST follow:
Business Requirement -> Repository Search -> Dependency Search -> Architecture Review -> Security Review -> Performance Review -> Risk Analysis -> Implementation Plan -> WAIT FOR APPROVAL -> Implementation -> Verification -> Final Report

==================================================
RULE 3 — REPOSITORY SEARCH
Before writing ANY code search: Pages, Components, Hooks, Services, Server Actions, Schemas, Types, Utilities, Prisma Models, Middleware, Layouts

==================================================
RULE 4 — REUSE FIRST
Prefer existing component over new component. Prefer existing service over new service. Prefer existing action over new action. Never duplicate business logic.

==================================================
RULE 5 — STOP GATE
Immediately STOP implementation if you discover: Build Failure, TypeScript Failure, Lint Failure, Missing Dependency, Architecture Conflict, Client/Server Boundary Violation, Security Risk.
Do NOT continue. Generate Root Cause Analysis instead.

==================================================
RULE 6 — CHANGE BUDGET
Always choose the smallest change. Prefer 1 line over 5 lines. Prefer 1 file over 5 files. No refactoring unless explicitly requested.

==================================================
RULE 7 — QUALITY GATES
No task is complete until ALL pass: npm run lint, npx tsc --noEmit, npm run build, Vitest, Playwright, Repository Scan

==================================================
RULE 8 — REPOSITORY SCAN
Always search for: TODO, FIXME, console.log, console.error, debugger, eslint-disable, @ts-ignore, any, mock, fake, dummy, placeholder, dead code, duplicate code

==================================================
RULE 9 — REPORT FORMAT
Always respond with: Executive Summary, Repository Findings, Root Cause, Architecture Impact, Security Impact, Performance Impact, Implementation Plan, Files To Modify, Risk Level, Rollback Strategy, Quality Gates, WAITING FOR APPROVAL

==================================================
RULE 10 — LONG TERM
Optimize for: 5-year maintainability not 5-minute implementation speed. Never rewrite stable code. Never redesign architecture. Never add dependencies without measurable business value.

==================================================
FINAL PRINCIPLE
Evidence > Assumptions
Repository > Memory
Stability > Features
Correctness > Speed
Minimal Change > Clever Code
