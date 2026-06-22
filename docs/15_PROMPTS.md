# Official AI Prompts

> Tashtep Enterprise AI Prompt Library
>
> Version: 2.0
>
> Status: Approved
>
> Single Source of Truth

---

# Purpose

This document defines the official prompts and operating rules used by AI assistants when contributing to the Tashtep project.

AI should assist development while preserving architecture, design consistency and code quality.

AI must improve the project, never redefine it.

---

# AI Philosophy

AI should

Understand

↓

Analyze

↓

Reuse

↓

Extend

↓

Improve

Never

Guess

↓

Duplicate

↓

Redesign

↓

Break Standards

---

# Prompt Structure

Every AI prompt should contain

Context

↓

Objective

↓

Constraints

↓

Related Documentation

↓

Expected Output

↓

Acceptance Criteria

Never generate code without understanding the task.

---

# Documentation Loading Strategy

AI must NOT load every document for every task.

Instead load only the required documentation.

---

## Universal Documents

Always read

00_INDEX.md

11_PROJECT_RULES.md

16_ARCHITECTURE.md

---

## UI Tasks

Read

02_BRAND.md

03_DESIGN_SYSTEM.md

06_COMPONENTS.md

27_CODING_STANDARDS.md

---

## Backend Tasks

Read

04_DATABASE.md

05_API.md

28_API_CONVENTIONS.md

29_DATABASE_CONVENTIONS.md

---

## Feature Tasks

Read

01_PRD.md

07_ROUTES.md

10_TASKS.md

Relevant Module Documentation

---

## Deployment Tasks

Read

14_DEPLOYMENT.md

19_PERFORMANCE.md

20_RELEASE_PROCESS.md

21_SECURITY.md

---

# Preferred Technology Stack

Default

Next.js

React

TypeScript

Tailwind CSS

Prisma

PostgreSQL

Preferred Libraries

shadcn/ui

React Hook Form

Zod

Framer Motion

Equivalent alternatives are allowed if they preserve

Architecture

Design System

Performance

Developer Experience

---

# UI Generation Prompt

Generate production-ready UI.

Requirements

Arabic RTL First

Responsive

Accessible

Semantic HTML

Premium Editorial Layout

Large White Space

Soft Shadows

24px Radius

Design Tokens Only

Reuse Existing Components

Never redesign approved pages.

---

# Component Prompt

Generate a reusable component.

Requirements

Typed Props

Composable

Reusable

Accessible

RTL Ready

Responsive

Loading State

Error State

Empty State

Production Ready

Never duplicate existing components.

---

# Page Prompt

Generate a complete page.

Requirements

Reuse existing layout

Reuse components

SEO Ready

Accessible

Responsive

Production Ready

Respect Design System

Respect Brand Guidelines

---

# API Prompt

Generate a REST API endpoint.

Requirements

Input Validation

Authentication

Authorization

Consistent Response

Pagination

Filtering

Sorting

Error Handling

Documentation

Tests

Never generate undocumented endpoints.

---

# Database Prompt

Generate database schema.

Requirements

UUID Primary Keys

Soft Delete

Indexes

Relations

Audit Fields

UTC Dates

Production Ready

Never generate unnecessary tables.

---

# Form Prompt

Generate enterprise forms.

Requirements

Accessible

Responsive

Validation

Loading State

Success State

Error State

Reusable Fields

Typed Data

---

# Table Prompt

Prefer

Cards

Lists

Timelines

Editorial Layouts

Use tables only when tabular data provides clear value.

Avoid traditional ERP-style layouts.

---

# Animation Prompt

Allowed

Fade

Opacity

Transform

Hover Scale 1.01

Duration 180ms

ease-out

Never use distracting animations.

---

# Refactoring Prompt

Improve

Readability

Performance

Maintainability

Accessibility

Type Safety

Do not change business logic unless requested.

---

# Documentation Prompt

Generate documentation that is

Structured

Accurate

Maintainable

Consistent

Enterprise Ready

Never invent undocumented business rules.

---

# Code Generation Rules

Always

Strict TypeScript

Meaningful Naming

Reusable Logic

Pure Functions

Absolute Imports

Small Components

Small Functions

Readable Code

Never

Use any

Duplicate Logic

Duplicate Components

Hardcoded Secrets

Magic Numbers

Dead Code

Unused Imports

Placeholder Production Code

---

# Accessibility Rules

Generate

Semantic HTML

ARIA Labels

Keyboard Navigation

Visible Focus

RTL Support

WCAG 2.2 AA Compliance

---

# Performance Rules

Prefer

Server Components

Streaming

Dynamic Imports

Lazy Loading

Image Optimization

Memoization

Avoid

Large Bundles

Nested Requests

Heavy Client Components

Duplicate Fetches

---

# Security Rules

Always

Validate

Authenticate

Authorize

Audit

Log

Never

Expose Secrets

Bypass Permissions

Trust Client Input

Disable Validation

---

# Testing Rules

Generate

Unit Tests

Integration Tests

Validation Tests

Accessibility Tests

Responsive Tests

No feature is complete without tests.

---

# AI Review Checklist

Before generating final output verify

✅ Requirements Understood

✅ Documentation Loaded

✅ Existing Components Reused

✅ Architecture Preserved

✅ Design System Preserved

✅ Strong Types

✅ Accessibility Included

✅ Performance Considered

✅ Security Considered

✅ Tests Included

✅ Documentation Updated

---

# Forbidden

AI must never

Redesign approved screens

Change Brand Identity

Change Design Tokens

Invent Business Logic

Invent APIs

Invent Database Tables

Duplicate Components

Duplicate Logic

Ignore Documentation

Ignore Project Rules

---

# Golden Rule

If AI assumptions conflict with project documentation,

Documentation always wins.

If documentation conflicts with approved architecture,

Architecture wins.

If uncertainty remains,

request clarification instead of guessing.

---

# Final Vision

Every AI generated output should be indistinguishable from work produced by a senior engineering team.

The result must be

Consistent

Elegant

Accessible

Performant

Maintainable

Scalable

Enterprise Ready

while preserving the Tashtep identity and long-term maintainability.