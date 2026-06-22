# Security Guidelines

## Core Directives
- **Never trust client input.** All input crossing the network boundary MUST be validated using strictly defined Zod schemas.
- **Always authenticate.** Restrict access to authenticated routes explicitly.
- **Always authorize.** Ensure the authenticated user has permission to perform the requested action or access the requested resource.
- **Always derive identity from session.** Never accept a `userId` or similar identifier from the client payload for trusted operations; extract it from the verified server session.

## Secrets Management
- Never expose secrets in client-side bundles (no `NEXT_PUBLIC_` prefix unless absolutely intended for the browser).
- Never expose tokens in URLs, logs, or plain text outputs.
- Enforce Environment Validation on startup.

## Error Handling
- Never silently ignore failures. Fail fast.
- Catch errors at the boundary (e.g., `safe-action.ts`) and log them securely using structured logging without leaking sensitive stack traces to the client.
