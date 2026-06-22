# Git Workflow

> Tashtep Enterprise Git Strategy
>
> Version: 1.0
>
> Single Source of Truth

---

# Philosophy

The repository must always remain:

- Stable
- Predictable
- Reviewable
- Deployable
- Easy for AI and Developers

Never commit directly to production.

---

# Branch Strategy

```
main
│
├── develop
│
├── feature/*
│
├── release/*
│
└── hotfix/*
```

---

# Branches

## main

Production Ready

Rules

- Protected
- No direct commits
- No force push
- Deploys to Production

---

## develop

Integration Branch

Rules

- Daily development
- Merge feature branches
- QA validation

Deploys to Staging

---

## feature/*

Examples

```
feature/product-editor

feature/customer-360

feature/media-library

feature/activity-center

feature/checkout
```

Rules

- One feature only
- Short lifetime
- Rebase before merge

---

## release/*

Examples

```
release/v1.0.0

release/v1.1.0
```

Purpose

- Final testing
- Bug fixes only
- Documentation updates

No new features allowed.

---

## hotfix/*

Examples

```
hotfix/login-bug

hotfix/payment-timeout
```

Purpose

Emergency production fixes.

Merge into

- main
- develop

---

# Development Flow

```
Planning

↓

Create Feature Branch

↓

Development

↓

Local Testing

↓

Pull Request

↓

Code Review

↓

QA

↓

Merge to develop

↓

Release Branch

↓

Production

↓

Monitoring
```

---

# Commit Convention

Use Conventional Commits.

Examples

```
feat: add customer 360 workspace

fix: resolve checkout validation

refactor: simplify product card

style: improve spacing

docs: update deployment guide

test: add product service tests

perf: optimize image loading

chore: update dependencies
```

---

# Pull Request Rules

Every Pull Request must include

## Summary

What changed?

---

## Screenshots

Before

After

(if UI changes exist)

---

## Checklist

```
✅ TypeScript passes

✅ Lint passes

✅ Build passes

✅ Tests pass

✅ No duplicated components

✅ Design System respected

✅ Accessibility checked

✅ Responsive checked
```

---

# Merge Strategy

Use

```
Squash and Merge
```

Never

```
Merge Commit

or

Rebase Merge
```

for feature branches.

---

# Branch Naming

Good

```
feature/customer-dashboard

feature/product-editor

feature/media-library
```

Bad

```
new-feature

update

test

fix1

my-work
```

---

# File Naming

Components

```
ProductCard.tsx

MetricCard.tsx

ActivityCard.tsx
```

Hooks

```
useDebounce.ts

useMediaQuery.ts
```

Utilities

```
formatPrice.ts

formatDate.ts
```

---

# Protected Files

Changes require review.

```
02_BRAND.md

03_DESIGN_SYSTEM.md

06_COMPONENTS.md

11_PROJECT_RULES.md

12_DESIGN_TOKENS.md

16_ARCHITECTURE.md
```

---

# AI Development Rules

AI must

- Read documentation first
- Reuse existing components
- Never duplicate code
- Never redesign approved pages
- Follow Design System
- Follow Coding Rules

---

# Review Checklist

Before merge verify

```
No duplicated logic

No duplicated components

No unused imports

No console.log

No any

No TODO

No dead code

No hardcoded values
```

---

# Release Workflow

```
develop

↓

release/v1.x.x

↓

QA

↓

Staging

↓

Production

↓

Tag

↓

Monitoring
```

---

# Versioning

Semantic Versioning

```
Major.Minor.Patch
```

Examples

```
1.0.0

1.1.0

1.1.1

2.0.0
```

---

# Tags

```
v1.0.0

v1.1.0

v1.2.0
```

---

# Rollback Strategy

```
Production Issue

↓

Create hotfix branch

↓

Fix

↓

Review

↓

Deploy

↓

Merge into main

↓

Merge into develop
```

---

# CI Pipeline

```
Install

↓

Type Check

↓

Lint

↓

Tests

↓

Build

↓

Preview Deploy

↓

Production Deploy
```

---

# Definition of Done

A feature is complete only if

```
✅ Requirements implemented

✅ UI approved

✅ API completed

✅ Database migrated

✅ Tests passing

✅ Documentation updated

✅ Build successful

✅ Responsive

✅ Accessible

✅ Production Ready
```

---

# Core Principles

One Design System

One Component Library

One Documentation Source

One Architecture

One Git Strategy

One Coding Standard

Never sacrifice consistency for speed.

---

# Final Goal

Every commit should make the project:

- More maintainable
- More scalable
- More predictable
- More reusable
- More production ready

while preserving the Tashtep identity:

Apple Simplicity

Stripe Clarity

Linear Consistency

Notion Organization

Luxury Editorial Experience