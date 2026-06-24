# Release Checklist

## Governance
No feature is COMPLETE unless:
- [ ] Build PASS
- [ ] Lint PASS
- [ ] TypeScript PASS
- [ ] Tests PASS
- [ ] Repository Scan PASS
- [ ] Architecture PASS
- [ ] Security PASS

## Rollback & Reliability
- [ ] Is this release independently deployable?
- [ ] Is this release recoverable (Rollback is mandatory)?
- [ ] Does the codebase belong to the team, protecting consistency over personal preference?

## Continuous Verification
- [ ] Are environments strictly validated at boot via `Zod`?
- [ ] Have all secrets been verified as strictly server-side?
