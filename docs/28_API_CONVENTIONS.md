# API Conventions

> Tashtep Enterprise API Standards
>
> Version: 1.0
>
> Single Source of Truth

---

# Philosophy

Every API should be

- Predictable
- Consistent
- Secure
- Typed
- Documented
- Versionable

Every endpoint should behave exactly as developers expect.

---

# Architecture

```
Client

↓

Route Handler

↓

Server Action

↓

Service

↓

Repository

↓

Prisma ORM

↓

PostgreSQL
```

Business logic must never exist inside Route Handlers.

---

# API Style

REST First

JSON Only

UTF-8

HTTPS Only

Stateless

---

# URL Convention

Good

```
/api/products

/api/products/{id}

/api/orders

/api/customers

/api/media

/api/settings
```

Bad

```
/api/getProducts

/api/createProduct

/api/deleteOrder

/api/listCustomers
```

Use nouns instead of verbs.

---

# HTTP Methods

GET

Retrieve resources

POST

Create resources

PUT

Replace resources

PATCH

Update resources

DELETE

Soft delete resources

---

# Response Format

Every response must follow

```json
{
  "success": true,
  "data": {},
  "message": "",
  "meta": {}
}
```

Error response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request."
  }
}
```

Never return inconsistent structures.

---

# Status Codes

200 OK

201 Created

204 No Content

400 Bad Request

401 Unauthorized

403 Forbidden

404 Not Found

409 Conflict

422 Validation Error

429 Too Many Requests

500 Internal Server Error

---

# Validation

Every request must use

Zod

Server Validation

Type Validation

Business Validation

Never trust client validation.

---

# Authentication

Protected endpoints require

Auth.js Session

JWT Verification

Role Verification

Permission Verification

---

# Authorization

Every endpoint must verify

Role

Permission

Ownership

Tenant (if applicable)

Never expose unauthorized resources.

---

# Pagination

Default

20 Items

Maximum

100 Items

Response

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 240,
    "pages": 12
  }
}
```

---

# Filtering

Use query parameters

Example

```
/api/products?category=paint

/api/orders?status=completed

/api/customers?search=ahmed
```

---

# Sorting

```
sort=name

sort=-createdAt

sort=price
```

"-" means descending order.

---

# Searching

Use

```
search=
```

Example

```
/api/products?search=primer
```

---

# Versioning

```
/api/v1/products

/api/v2/products
```

Breaking changes require a new version.

---

# Error Handling

Every error must include

Code

Message

Request ID

Timestamp

Never expose

Stack traces

Database errors

Internal implementation

---

# File Uploads

Accept

jpg

jpeg

png

webp

svg

pdf

Validate

Size

Mime Type

Extension

Virus Scan

---

# Rate Limiting

Required for

Login

Search

Checkout

Upload

Register

Password Reset

---

# Caching

GET

Cacheable

POST

Not Cacheable

PATCH

Invalidate Cache

DELETE

Invalidate Cache

---

# Logging

Log

Request ID

User ID

Route

Duration

Status

Never log

Passwords

Tokens

Secrets

Personal Data

---

# Naming Convention

Good

```
ProductService

OrderRepository

CustomerController
```

Bad

```
ProductHelper2

NewAPI

MyService
```

---

# API Documentation

Every endpoint must document

Purpose

Authentication

Parameters

Body

Response

Errors

Example

---

# Security

Always

HTTPS

Validation

Authorization

Rate Limiting

Audit Logging

Environment Variables

---

# Performance

Use

Pagination

Indexes

Caching

Compression

Streaming

Parallel Queries

Avoid

N+1 Queries

Large Payloads

Duplicate Requests

---

# AI Rules

AI must

Generate

Strong Types

Zod Schemas

Consistent Responses

Error Handling

Documentation

Never generate undocumented endpoints.

---

# Checklist

✅ RESTful

✅ Typed

✅ Validated

✅ Authenticated

✅ Authorized

✅ Paginated

✅ Searchable

✅ Filterable

✅ Documented

✅ Tested

---

# Final Principle

Every API should be

Simple

Consistent

Secure

Predictable

Scalable

Maintainable

Enterprise Ready

while remaining fully aligned with the Tashtep Architecture and Documentation System.