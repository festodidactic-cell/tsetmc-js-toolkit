# TSETMC JS Toolkit

Lightweight JavaScript screening tools for TSETMC market data.

This repository contains a collection of modular stock-market filters developed for screening and analyzing symbols listed on the Iranian capital market.

The project focuses on lightweight client-side execution and practical screening logic that can be used directly within TSETMC-compatible filtering environments.

## Screening Modules

The repository includes filters for several types of market analysis:

- Offline accumulation screening
- Pre-breakout detection
- Live momentum monitoring
- Order-book and queue analysis
- Reclaim and resilience detection
- Divergence analysis
- Candlestick pattern screening
- Elliott Wave setups
- Liquidity and market-quality checks

## Design Goals

The project is built around a few simple principles:

- Lightweight JavaScript
- No unnecessary external dependencies
- Modular screening logic
- Defensive handling of incomplete market data
- Reusable analytical components
- Clear separation between historical and live-market filters

## Repository Structure

```text
src/
├── offline/
├── online/
├── divergence/
├── candlestick/
└── elliott-wave/

docs/
examples/
tests/
```

## Important Note

The filters in this repository are analytical screening tools. Their output should be treated as a candidate list for further analysis rather than as an automated buy or sell recommendation.

Market conditions, liquidity, price limits, and TSETMC data structures may change over time, so filters should be validated before practical use.

## Status

The toolkit is under active development. Existing filters are being reorganized into reusable modules and accompanied by documentation and test cases.
Update README with license information
