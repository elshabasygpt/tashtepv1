# Coding Standards

> Tashtep Enterprise Coding Standards
>
> Version: 2.0
>
> Status: Approved
>
> Single Source of Truth

---

# Purpose

This document defines the official coding standards for the Tashtep platform.

Every developer and every AI assistant must follow these rules.

The objective is to produce code that is

- Consistent
- Readable
- Maintainable
- Testable
- Scalable
- Production Ready

---

# Philosophy

Code is a long-term asset.

Optimize for

Readability

↓

Maintainability

↓

Reusability

↓

Performance

↓

Complexity

Never optimize readability away.

---

# General Principles

Always

Write explicit code

Prefer composition

Prefer pure functions

Prefer reusable modules

Keep responsibilities separated

Avoid unnecessary abstraction

Never write code that requires explanation to understand.

---

# Technology Agnostic Rule

Use the project's approved technology stack.

Equivalent libraries are allowed if they preserve

Architecture

Design System

Developer Experience

Performance

Maintainability

Never introduce a new dependency without technical justification.

---

# Naming Convention

Names should describe intent.

Good

```
ProductCard

CustomerService

OrderRepository

calculateTotal()

formatCurrency()

isCheckoutValid
```

Bad

```
helper

utils2

temp

newFunction

data1

myComponent
```

---

# File Naming

Components

```
ProductCard.tsx

OrderTimeline.tsx

MetricCard.tsx
```

Hooks

```
useSearch.ts

usePagination.ts
```

Services

```
ProductService.ts

OrderService.ts
```

Repositories

```
ProductRepository.ts
```

Schemas

```
productSchema.ts
```

---

# Folder Organization

Reusable components are recommended to follow

```
ProductCard/

ProductCard.tsx

ProductCard.types.ts

ProductCard.test.ts

index.ts
```

Simple components may remain in a single file when appropriate.

Choose clarity over rigid structure.

---

# Component Principles

Every component should have

One clear responsibility

Small public API

Typed Props

Accessibility support

RTL support

Responsive behavior

Loading state

Error state

Empty state

Prefer composition over inheritance.

---

# Function Principles

Prefer

Small focused functions

Pure functions

Early returns

Meaningful names

Avoid

Deep nesting

Hidden side effects

Large switch statements

Arbitrary limits are discouraged.

Functions should remain easy to understand and test.

---

# TypeScript

Always

Strict Mode

Explicit Types

Readonly where applicable

Discriminated Unions

Generics when beneficial

Never

any

ts-ignore

Unsafe casting

Implicit any

Prefer type safety over convenience.

---

# Imports

Use

Absolute Imports

```
@/components

@/hooks

@/lib

@/types
```

Order

Framework

↓

Third Party

↓

Internal Packages

↓

Project Modules

↓

Types

↓

Styles

Avoid deep relative imports.

---

# Styling

Use

Design Tokens

Logical CSS Properties

Reusable Utility Classes

Consistent Spacing

Never

Hardcoded Colors

Random Radius

!important

Inline Styles (unless technically required)

Every UI must follow the Design System.

---

# State Management

Prefer

Server State

↓

Local State

↓

Shared State

↓

Global State

Only introduce global state when multiple independent features require shared data.

---

# Error Handling

Always

Handle expected failures

Return meaningful messages

Log critical errors

Provide fallback UI

Never

Ignore errors

Use empty catch blocks

Expose internal implementation details

---

# Security

Always

Validate input

Authorize actions

Escape output

Protect secrets

Audit critical actions

Never trust client input.

---

# Performance

Prefer

Lazy Loading

Memoization when needed

Streaming

Code Splitting

Image Optimization

Avoid premature optimization.

Measure before optimizing.

---

# Accessibility

Every component should support

Semantic HTML

Keyboard Navigation

Visible Focus

Screen Readers

RTL

WCAG 2.2 AA

Accessibility is mandatory.

---

# Documentation

Every exported module should clearly communicate

Purpose

Inputs

Outputs

Usage

Complex business rules should be documented.

Avoid documenting obvious code.

---

# Testing

Every business feature should include

Unit Tests

Integration Tests

Validation Tests

Accessibility Verification

Critical user journeys should include end-to-end testing.

---

# Logging

Log

Business Events

Errors

Warnings

Audit Actions

Never log

Passwords

Secrets

Tokens

Sensitive Personal Information

---

# Refactoring Principles

Improve

Readability

Maintainability

Type Safety

Accessibility

Performance

without changing business behavior unless explicitly requested.

---

# Code Review Checklist

Before merging verify

✅ Clear Naming

✅ Strong Typing

✅ No Duplicate Logic

✅ No Duplicate Components

✅ No Dead Code

✅ No Unused Imports

✅ No Hardcoded Secrets

✅ Accessible

✅ Responsive

✅ Documented

✅ Tested

---

# AI Development Rules

AI must

Read relevant documentation

Reuse existing components

Preserve architecture

Preserve design system

Generate production-ready code

Generate meaningful types

Generate tests when applicable

Never

Invent business rules

Duplicate existing logic

Redesign approved interfaces

Ignore project documentation

---

# Definition of Done

Code is complete only if

Requirements Met

Readable

Reusable

Typed

Tested

Documented

Accessible

Responsive

Secure

Performance Validated

Production Ready

---

# Core Principles

Consistency Over Cleverness

Reuse Over Duplication

Composition Over Complexity

Documentation Over Assumptions

Quality Over Speed

Long-Term Maintainability Over Short-Term Convenience

---

# Final Vision

Every file in the Tashtep codebase should appear as if it was written by the same senior engineering team.

The codebase should remain

Consistent

Predictable

Elegant

Scalable

Maintainable

Vendor Independent

Enterprise Ready

for years without requiring major refactoring.