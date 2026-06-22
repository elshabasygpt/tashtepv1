# Development Protocol

## Workflow
Analysis → Dependency Graph → Reuse Analysis → Architecture Validation → Impact Analysis → Risk Assessment → Implementation Plan → WAIT FOR APPROVAL → Implementation → Verification → Summary.

## Pre-Implementation Mandate
Return:
- Executive Summary
- Affected Files
- Architecture & Security Impact
- Risk Assessment
- Acceptance Criteria & Rollback Strategy

## Reuse Policy
Priority:
1. Existing Component
2. Existing Feature
3. Existing Hook
4. Existing Service
5. Existing Server Action
6. Existing Schema
7. New Code (only if absolutely necessary)

## Verification
Every implementation is accepted ONLY IF:
Build = PASS
Lint = PASS
TypeScript = PASS
Tests = PASS
No technical debt introduced.
