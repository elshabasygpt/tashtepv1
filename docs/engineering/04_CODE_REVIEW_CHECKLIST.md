# Code Review Checklist

Before approving any PR verify

## Architecture

□ No architecture violations
□ No folder structure violations
□ No direct Prisma access from UI
□ Uses Service Layer

## Reuse

□ Existing components reused
□ Existing services reused
□ Existing actions reused

## Security

□ Zod validation
□ Authentication
□ Authorization
□ Session identity

## Performance

□ Server Component when possible
□ next/image
□ Pagination
□ No unnecessary client components

## Quality

□ Build PASS
□ Lint PASS
□ TypeScript PASS
□ Tests PASS

## Repository

□ No TODO
□ No FIXME
□ No duplicate code
□ No dead code
□ No placeholder logic
