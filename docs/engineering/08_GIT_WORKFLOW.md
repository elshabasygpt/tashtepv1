# Git Workflow

## Commit Philosophy
Every commit must improve or preserve the architecture. Never degrade it.
No anonymous ownership; every important change has one responsible engineer.

## Pull Requests
Every pull request must explicitly answer:
- Why?
- Why now?
- Why this implementation?
- Why not reuse existing code?

## Branching Strategy
- Main branch is strictly protected. If the main branch is broken, STOP all development until it is fixed.
- Use atomic, logically isolated commits for easier rollbacks.
- Technical debt is allowed only if: Documented, Measured, Scheduled, and Owned.
