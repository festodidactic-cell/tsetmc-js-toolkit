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
| `pl` | Last traded price | Current session | `lastPrice` | Possible | Yes | Online screening, regime, risk modules | Verified |
| `pc` | Closing price | Current session | `closingPrice` | Possible | Yes | Online screening, price acceptance, scoring inputs | Verified |
| `py` | Previous trading day's price | Current session reference | `previousClose` | Possible | Yes | Price-change and trend calculations | Verified |
| `pmin` | Lowest traded price of the current session | Current session | `dayLow` | Possible | Yes | Intraday range and price-position calculations | Verified |
| `pmax` | Highest traded price of the current session | Current session | `dayHigh` | Possible | Yes | Breakout, rejection and range calculations | Verified |
## Validation Status

Field definitions in this document must be verified before being marked as stable.

Legacy filter assumptions should not be treated as authoritative without verification.
