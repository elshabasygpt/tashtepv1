# Contributing Guide

> Tashtep Enterprise Contribution Standards
>
> Version: 1.0
>
> Single Source of Truth

---

# Philosophy

Every contribution should improve the project.

Code must be

- Clean
- Reusable
- Tested
- Documented
- Consistent
- Production Ready

Quality is more important than speed.

---

# Before You Start

Read

01_PRD.md

02_BRAND.md

03_DESIGN_SYSTEM.md

06_COMPONENTS.md

08_CODING_RULES.md

11_PROJECT_RULES.md

16_ARCHITECTURE.md

Never start development without understanding these documents.

---

# Development Workflow

Planning

↓

Create Feature Branch

↓

Development

↓

Testing

↓

Documentation

↓

Pull Request

↓

Review

↓

Merge

---

# Branch Naming

Good

feature/product-editor

feature/customer-360

feature/media-library

feature/activity-center

fix/checkout-validation

hotfix/login

Bad

new

test

update

work

---

# Commit Convention

Use Conventional Commits

Examples

feat: add customer 360 workspace

fix: resolve checkout validation

refactor: simplify product card

docs: update architecture guide

style: improve spacing

test: add product service tests

perf: optimize image loading

chore: update dependencies

---

# Coding Standards

Always

Strict TypeScript

Reusable Components

Server Components First

Meaningful Names

Small Functions

Strong Typing

Never

Use any

Duplicate Logic

Duplicate Components

Hardcode Values

Large Components

Unused Imports

Console.log

---

# Component Rules

One Component

One Folder

Example

ProductCard/

ProductCard.tsx

ProductCard.types.ts

ProductCard.test.ts

index.ts

---

# Styling Rules

Use

Tailwind CSS v4

shadcn/ui

Logical CSS Properties

RTL Native

8pt Grid

24px Radius

Soft Shadows

Never use

Bootstrap

Material UI

Inline Styles

Random Spacing

---

# Accessibility

Every contribution must include

Semantic HTML

Keyboard Navigation

Visible Focus

Proper Labels

RTL Support

Responsive Design

WCAG 2.2 AA

---

# Performance

Prefer

Server Components

Dynamic Imports

Lazy Loading

Image Optimization

Reusable Hooks

Avoid

Large Bundles

Heavy Client Components

Nested Requests

---

# Documentation

Every new feature must update

API

Components

Routes

Tasks

Architecture

when applicable.

Documentation is part of the feature.

---

# Testing

Every feature requires

Unit Tests

Integration Tests

Responsive Check

Accessibility Check

Build Validation

No feature is complete without testing.

---

# Pull Request Template

## Summary

Describe the change.

---

## Screenshots

Before

After

(if applicable)

---

## Checklist

✅ Requirements Complete

✅ Documentation Updated

✅ Tests Passed

✅ Build Passed

✅ Responsive

✅ Accessible

✅ Design System Respected

---

# Review Rules

Review

Architecture

Naming

Performance

Accessibility

Security

Documentation

Reusability

Never approve duplicated logic.

---

# AI Contribution Rules

AI must

Read Documentation First

Reuse Existing Components

Never Redesign Approved Pages

Follow Design System

Generate Production Ready Code

Generate Tests

Generate Strong Types

Never generate placeholder architecture.

---

# File Naming

Components

ProductCard.tsx

MetricCard.tsx

ActivityCard.tsx

Hooks

useDebounce.ts

usePagination.ts

Utilities

formatPrice.ts

slugify.ts

---

# Project Principles

One Design System

One Component Library

One Documentation Source

One Architecture

One Coding Standard

One Brand Identity

---

# Definition of Done

A contribution is complete only if

Requirements Complete

Documentation Updated

Tests Passed

Build Passed

Responsive

Accessible

Performance Validated

Security Validated

Production Ready

---

# Core Values

Consistency

Quality

Maintainability

Scalability

Simplicity

Reusability

Accessibility

Reliability

---

# Final Vision

Every contribution should make Tashtep

Cleaner

Faster

More Elegant

More Maintainable

More Scalable

while preserving the design philosophy inspired by

Apple

Stripe

Linear

Notion

and a premium Arabic RTL editorial experience.