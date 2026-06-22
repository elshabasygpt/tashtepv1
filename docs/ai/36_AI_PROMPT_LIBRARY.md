# AI Prompt Library

> Tashtep Enterprise AI Prompt Library
>
> Version: 1.0
>
> Status: Approved
>
> Classification: Internal Engineering Standard
>
> Single Source of Truth

---

# Purpose

This document defines the official prompt templates used across the Tashtep platform.

Every AI interaction should follow a consistent structure to produce predictable, reusable and production-ready outputs.

---

# Prompt Philosophy

A good prompt should provide

Context

↓

Objective

↓

Constraints

↓

References

↓

Expected Output

↓

Acceptance Criteria

Better prompts produce better engineering results.

---

# Universal Prompt Structure

Every prompt should contain

## Context

Describe the current system.

---

## Objective

Describe exactly what should be achieved.

---

## Constraints

Architecture

Design System

Coding Standards

Performance

Security

Accessibility

Documentation

---

## References

Relevant documentation

Relevant components

Relevant APIs

Relevant database models

---

## Expected Output

Component

Page

API

Feature

Migration

Documentation

Tests

---

## Acceptance Criteria

Functional requirements

Visual requirements

Performance requirements

Accessibility requirements

Security requirements

---

# Feature Development Prompt

```
Analyze the existing implementation.

Reuse existing components whenever possible.

Preserve project architecture.

Preserve design system.

Generate a production-ready implementation.

Update documentation.

Generate tests when applicable.

Never duplicate existing functionality.
```

---

# Component Prompt

```
Generate a reusable component.

Requirements

Typed Props

RTL Support

Accessibility

Responsive Design

Loading State

Error State

Empty State

Reusable API

Production Ready
```

---

# Page Prompt

```
Generate a complete page.

Reuse existing layout.

Reuse existing components.

Support SEO.

Support Accessibility.

Support Responsive Design.

Never redesign approved interfaces.
```

---

# API Prompt

```
Generate a REST endpoint.

Include

Authentication

Authorization

Validation

Pagination

Filtering

Sorting

Logging

Documentation

Tests

Consistent response structure.
```

---

# Database Prompt

```
Generate schema changes.

Use UUID.

Generate indexes.

Generate relations.

Generate audit fields.

Generate rollback strategy.

Never generate destructive migrations without approval.
```

---

# Refactoring Prompt

```
Improve readability.

Reduce complexity.

Preserve business behavior.

Improve accessibility.

Improve maintainability.

Do not introduce breaking changes.
```

---

# Documentation Prompt

```
Generate structured documentation.

Keep terminology consistent.

Follow project standards.

Update affected documents.

Never invent undocumented business rules.
```

---

# Code Review Prompt

```
Review implementation.

Check

Architecture

Naming

Accessibility

Performance

Security

Documentation

Testing

Suggest improvements only when justified.
```

---

# Bug Fix Prompt

```
Understand root cause.

Preserve architecture.

Fix the minimum required code.

Avoid regressions.

Generate tests.

Update documentation when necessary.
```

---

# Performance Optimization Prompt

```
Measure first.

Identify bottlenecks.

Optimize rendering.

Reduce bundle size.

Reduce queries.

Preserve readability.

Document trade-offs.
```

---

# Security Review Prompt

```
Validate inputs.

Verify authorization.

Check secret management.

Review logging.

Review error handling.

Review sensitive operations.

Recommend improvements.
```

---

# Accessibility Prompt

```
Verify

Semantic HTML

ARIA Labels

Keyboard Navigation

Visible Focus

RTL

Responsive Design

WCAG 2.2 AA

Fix every violation.
```

---

# Testing Prompt

```
Generate

Unit Tests

Integration Tests

Accessibility Tests

Validation Tests

Critical Path Tests

Avoid brittle tests.
```

---

# AI Self Review Prompt

Before delivering any answer verify

Requirements

↓

Architecture

↓

Reuse

↓

Accessibility

↓

Performance

↓

Security

↓

Documentation

↓

Testing

↓

Production Readiness

If any item fails,

improve before delivering.

---

# Prompt Anti Patterns

Never write prompts that

Lack context

Ignore architecture

Ignore documentation

Ignore existing components

Request duplicate implementations

Request insecure solutions

Request undocumented business logic

---

# Prompt Quality Checklist

Every prompt should be

Clear

↓

Specific

↓

Actionable

↓

Context Aware

↓

Architecture Aware

↓

Documentation Aware

↓

Production Focused

---

# AI Prompt Priority

Always prioritize

Project Documentation

↓

Existing Implementation

↓

Reusable Components

↓

Architecture

↓

User Request

↓

Generated Solution

---

# Final Principle

Every prompt should guide AI toward

Reuse

↓

Consistency

↓

Maintainability

↓

Accessibility

↓

Security

↓

Performance

↓

Production Readiness

Never optimize for speed at the expense of quality.

---

# Document Status

Version

1.0

Status

Approved

Classification

Internal Engineering Standard

Applies To

All AI Systems

All Engineers

All Contributors

Single Source of Truth