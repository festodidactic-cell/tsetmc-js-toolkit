# TSETMC Field Contract

This document defines the TSETMC runtime fields used by TSETMC JS Toolkit.

Its purpose is to provide a verified mapping between raw TSETMC variables and the normalized concepts used by screening, indicator, risk, and scoring modules.

## Goals

- Document TSETMC runtime variables used by the toolkit
- Separate current-session and historical fields
- Identify missing-value and zero-value edge cases
- Reduce duplicated field interpretation across filters
- Provide a stable reference for future refactoring and testing

## Field Reference

| Raw Field | Meaning | Scope | Normalized Name | Can Be Missing? | Can Be Zero? | Used By | Verification |
|---|---|---|---|---|---|---|---|
| TBD | TBD | TBD | TBD | TBD | TBD | TBD | Pending |

## Validation Status

Field definitions in this document must be verified before being marked as stable.

Legacy filter assumptions should not be treated as authoritative without verification.
