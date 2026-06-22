# Database Conventions

> Tashtep Enterprise Database Standards
>
> Version: 1.0
>
> Single Source of Truth

---

# Philosophy

The database is the foundation of the platform.

Every table, column and relationship must be

- Predictable
- Consistent
- Scalable
- Auditable
- Performant
- Maintainable

Schema quality is more important than implementation speed.

---

# Database Engine

Primary Database

PostgreSQL

ORM

Prisma ORM

Character Set

UTF-8

Timezone

UTC

---

# Naming Convention

Tables

Plural

Examples

products

categories

customers

orders

order_items

roles

permissions

Never

Product

tbl_products

productTable

---

# Column Naming

snake_case

Examples

created_at

updated_at

deleted_at

first_name

last_name

unit_price

Never

createdAt

CreatedDate

productPrice

---

# Primary Keys

Always

UUID

Example

id UUID PRIMARY KEY

Never

Auto Increment IDs

Sequential IDs

---

# Foreign Keys

Always

table_id

Examples

customer_id

product_id

order_id

role_id

---

# Standard Columns

Every table should include

id

created_at

updated_at

deleted_at

created_by

updated_by

when applicable

---

# Soft Delete

Always prefer

deleted_at

Never permanently delete business data unless legally required.

---

# Auditability

Critical tables should include

created_by

updated_by

deleted_by

audit_logs

Every important action must be traceable.

---

# Relationships

One To One

User

↓

Profile

One To Many

Customer

↓

Orders

Many To Many

Products

↓

Categories

using junction tables

---

# Junction Tables

Naming

alphabetical order

Example

category_product

permission_role

Never

product_category_map

---

# Enums

Use database enums only for stable values

order_status

payment_status

user_role

Avoid enums for frequently changing business values.

---

# Money

Never use float.

Use

DECIMAL(12,2)

Examples

price

discount

subtotal

tax

total

---

# Dates

Store

UTC

Convert

User Timezone

Never store localized dates.

---

# Boolean Fields

Prefix with

is_

has_

Examples

is_active

has_discount

is_verified

---

# Indexing

Always index

foreign keys

slug

email

sku

status

created_at

search fields

---

# Unique Constraints

Examples

email

phone

slug

sku

external_id

Prevent duplicate business records.

---

# Search Optimization

Use

Indexes

Full Text Search

Trigram Search

Never scan entire tables.

---

# Transactions

Use transactions for

Checkout

Payments

Inventory Updates

Order Creation

Refunds

Never split critical business operations.

---

# Migration Rules

Every migration must be

Versioned

Reversible

Reviewed

Tested

Never modify old migrations.

Create new migrations only.

---

# Seed Data

Allowed

Roles

Permissions

Countries

Currencies

Languages

System Settings

Never seed production customer data.

---

# File Storage

Database stores

Metadata

URLs

References

Never store image binaries inside PostgreSQL.

---

# JSON Fields

Allowed only for

Flexible Settings

Metadata

External Payloads

Never replace relational design with JSON.

---

# Performance

Avoid

SELECT *

N+1 Queries

Unindexed Filters

Large Joins

Duplicate Data

Prefer

Pagination

Indexes

Selective Queries

Efficient Relations

---

# Prisma Rules

Always

Explicit Relations

Explicit Indexes

Explicit Constraints

Consistent Naming

Never

Implicit Magic

Duplicate Models

Unused Fields

---

# Security

Never expose

Internal IDs

Secrets

Tokens

Passwords

Always validate

Input

Ownership

Permissions

Tenant Scope

---

# Backup Policy

Database

Daily

Retention

30 Days

Verification

Weekly Restore Test

Encryption

Enabled

---

# AI Rules

AI must

Generate UUID IDs

Generate Soft Deletes

Generate Indexes

Generate Relations

Generate Constraints

Generate Audit Fields

Never generate auto-increment IDs for business entities.

---

# Database Review Checklist

✅ UUID Primary Keys

✅ Soft Delete

✅ Indexes

✅ Foreign Keys

✅ Constraints

✅ Audit Fields

✅ UTC Dates

✅ Decimal Money

✅ Prisma Compatible

✅ Production Ready

---

# Core Principles

Normalize

Index

Validate

Audit

Optimize

Document

Backup

Monitor

---

# Final Vision

The Tashtep database should be

Reliable

Scalable

Predictable

Maintainable

Auditable

Secure

Enterprise Ready

and capable of supporting millions of records while preserving simplicity, consistency and long-term maintainability.