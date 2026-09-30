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
| `tno` | Number of trades in the current session | Current session | `tradeCount` | Possible | Yes | Trade activity and quality checks | Verified |
| `tvol` | Total traded volume in the current session | Current session | `tradeVolume` | Possible | Yes | Relative volume, liquidity, risk and screening modules | Verified |
| `tval` | Total traded value in the current session | Current session | `tradeValue` | Possible | Yes | Liquidity and market-quality analysis | Verified |
| `pf` | First traded price of the current session | Current session | `firstPrice` | Possible | Yes | Intraday direction and opening-behaviour analysis | Verified |
| `(ct).Buy_CountI` | Number of individual (real-person) buyers | Current session / client type | `individualBuyerCount` | Possible | Yes | Buyer-power and participant analysis | Verified |
| `(ct).Buy_I_Volume` | Volume purchased by individual (real-person) investors | Current session / client type | `individualBuyVolume` | Possible | Yes | Buyer power, real flow and participant analysis | Verified |
| `(ct).Sell_CountI` | Number of individual (real-person) sellers | Current session / client type | `individualSellerCount` | Possible | Yes | Buyer-power and participant analysis | Verified |
| `(ct).Sell_I_Volume` | Volume sold by individual (real-person) investors | Current session / client type | `individualSellVolume` | Possible | Yes | Buyer power, real flow and participant analysis | Verified |
| `(ct).Buy_CountN` | Number of legal/institutional buyers | Current session / client type | `institutionalBuyerCount` | Possible | Yes | Institutional participation analysis | Verified |
| `(ct).Buy_N_Volume` | Volume purchased by legal/institutional investors | Current session / client type | `institutionalBuyVolume` | Possible | Yes | Participant-footprint and institutional-flow analysis | Verified |
| `(ct).Sell_CountN` | Number of legal/institutional sellers | Current session / client type | `institutionalSellerCount` | Possible | Yes | Institutional participation analysis | Verified |
| `(ct).Sell_N_Volume` | Volume sold by legal/institutional investors | Current session / client type | `institutionalSellVolume` | Possible | Yes | Participant-footprint and institutional-flow analysis | Verified |
## Validation Status

Field definitions in this document must be verified before being marked as stable.

Legacy filter assumptions should not be treated as authoritative without verification.
