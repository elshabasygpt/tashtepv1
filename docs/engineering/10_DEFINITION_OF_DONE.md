# Definition of Done

A task is DONE only if ALL of the following are true.

## Repository

- Existing implementation searched
- Existing components reused
- Existing services reused
- Existing actions reused

## Code

- No duplicate logic
- No duplicate components
- No duplicate services
- No dead code

## Security

- Zod validation
- Authentication verified
- Authorization verified
- Session verified

## Database

- Uses Service Layer
- Uses Prisma
- Uses Transactions when required

## Quality

- Build PASS
- Lint PASS
- TypeScript PASS
- Vitest PASS
- Playwright PASS

## Repository Scan

- TODO = 0
- FIXME = 0
- console.log = 0
- any = 0
- @ts-ignore = 0
- eslint-disable = 0

## Documentation

- ADR updated (if needed)
- Docs updated (if needed)

## Release

- Acceptance Criteria satisfied
- Rollback documented
- Technical Debt introduced = 0

Only then may the task be marked DONE.
