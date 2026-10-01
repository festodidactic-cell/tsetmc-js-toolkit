# TSETMC JS Toolkit

[![CI](https://github.com/festodidactic-cell/tsetmc-js-toolkit/actions/workflows/ci.yml/badge.svg)](https://github.com/festodidactic-cell/tsetmc-js-toolkit/actions/workflows/ci.yml)

A lightweight, zero-dependency JavaScript toolkit for building, organizing, validating, testing, and maintaining screening logic for TSETMC market analysis.

The project combines practical TSETMC screening filters with reusable indicators, quality and risk gates, candidate-scoring utilities, runtime-field documentation, examples, and regression tests.

## Overview

TSETMC screening code often starts as isolated filter snippets.

This project aims to turn those snippets into a more maintainable structure with clear separation between:

- online screening logic
- offline / historical analysis
- reusable indicators
- market-quality and risk checks
- symbol structure analysis
- candidate scoring
- runtime field documentation
- examples
- automated regression tests

The goal is not to provide automatic trading decisions.

The toolkit is intended to support research, screening, experimentation, validation, and development around Iranian capital-market data.

## Key Features

### Online Screening

The `src/Online/` directory contains modules intended for live or current-session analysis.

The collection includes logic related to:

- momentum and breakout behaviour
- smart-money and participant activity
- abnormal volume
- bullish reversal structures
- tight-range breakouts
- order-book and queue behaviour
- reclaim and resilience patterns
- exit-pressure monitoring
- breakout-quality validation
- tradeability and market-quality gating
- participant-footprint analysis
- symbol-regime classification
- multi-day swing structures
- trap-risk detection

Each module is intended to answer a distinct analytical question rather than combine every available signal into one oversized filter.

### Offline Analysis

The `src/offline/` directory contains logic intended for historical or multi-session analysis.

This layer is useful for concepts such as:

- accumulation
- historical price behaviour
- historical volume behaviour
- pre-breakout structures
- multi-session screening

### Hybrid Screening

The `src/Both/` directory contains screening logic that combines current-session observations with historical context.

## TSETMC Field Contract

Runtime-field documentation is maintained under:

```text
docs/tsetmc-field-contract.md
```

The field contract documents mappings between raw TSETMC variables and normalized concepts used throughout the toolkit.

Documented areas include:

- current-session price fields
- trade activity and traded-value fields
- individual and institutional client-type fields
- historical price fields
- historical volume and traded-value fields
- missing-value and zero-value considerations
- historical-array validation requirements

The contract also records an important rule:

> Legacy filter assumptions should not automatically be treated as authoritative.

Historical indexing, field availability, and runtime behaviour should be validated before a fixed assumption is relied upon.

## Reusable Indicators

Reusable calculations are stored under:

```text
src/indicators/
```

Current utilities include:

```text
buyer-power.js
price-change.js
volume-ratio.js
```

These modules separate basic calculations from higher-level screening logic.

Example:

```javascript
const buyerPower =
    require("./src/indicators/buyer-power");

const result =
    buyerPower(
        200000,
        20,
        100000,
        20
    );

console.log(result);
```

Reusable modules use defensive validation where practical.

For example, buyer-power calculations reject invalid participant counts rather than silently replacing zero counts with artificial fallback values.

## Candidate Scoring

The project includes a reusable scoring layer:

```text
src/scoring/candidate-ranking.js
```

The ranking engine accepts normalized analytical components such as:

- smart-money score
- accumulation score
- momentum score
- quality score
- regime score
- risk score

and produces a comparable candidate score.

Example:

```javascript
const rankCandidate =
    require("./src/scoring/candidate-ranking");

const result =
    rankCandidate({
        smartMoney: 82,
        accumulation: 76,
        momentum: 88,
        quality: 91,
        regime: 72,
        risk: 20
    });

console.log(result);
```

Possible classifications are:

```text
STRONG_CANDIDATE
REVIEW
WATCH
REJECT
```

Risk is treated as a penalty rather than as a positive analytical signal.

These classifications are ranking labels and are not buy or sell recommendations.

## Quality and Risk Separation

The toolkit deliberately separates different analytical responsibilities.

Examples:

```text
Breakout detection
        ↓
Breakout quality validation
```

```text
Participant activity
        ↓
Participant footprint analysis
```

```text
Selling deterioration
        ↓
Exit Pressure
```

```text
High-activity move
        ↓
Failed price acceptance / rejection
        ↓
Trap Risk
```

`Exit Pressure` and `Trap Risk`, for example, are intentionally different:

- **Exit Pressure** focuses primarily on weakening individual-investor flow, buyer weakness, negative flow, and price deterioration.
- **Trap Risk** focuses on abnormal activity that fails to maintain price acceptance and shows meaningful rejection from the intraday high.

This separation reduces semantic duplication between filters.

## Traded Value Handling

Where direct traded-value fields are available, the toolkit prefers them over approximations.

Current-session analysis should prefer:

```text
tval
```

Historical analysis should prefer:

```text
QTotCap
```

rather than estimating traded value from combinations such as:

```text
volume × closing price
```

This keeps market-quality calculations closer to the data supplied by the TSETMC runtime.

## Architecture

The toolkit is moving toward a layered architecture:

```text
TSETMC Runtime Data
        │
        ▼
Field Contract / Validation
        │
        ▼
Reusable Indicators
        │
        ▼
Quality / Risk Gates
        │
        ▼
Screening Modules
        │
        ▼
Regime / Structure Analysis
        │
        ▼
Candidate Ranking
```

This structure makes individual responsibilities easier to review, validate, test, replace, and reuse.

## Repository Structure

```text
tsetmc-js-toolkit/
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── docs/
│   └── tsetmc-field-contract.md
│
├── examples/
│
├── src/
│   ├── Both/
│   ├── Online/
│   ├── indicators/
│   │   ├── README.md
│   │   ├── buyer-power.js
│   │   ├── price-change.js
│   │   └── volume-ratio.js
│   │
│   ├── offline/
│   └── scoring/
│       └── candidate-ranking.js
│
├── tests/
│   └── core-modules.test.js
│
├── .gitignore
├── CONTRIBUTING.md
├── LICENSE
├── README.md
└── package.json
```

## Defensive Runtime Validation

Several runtime-oriented modules use defensive checks for:

- missing historical observations
- malformed numeric values
- invalid participant counts
- zero denominators
- incomplete moving-average windows
- invalid historical volume data
- inconsistent price ranges
- unexpected intraday price positions

Historical averages should only be calculated from explicitly validated observations.

For example, a 3-session or 5-session moving average should not silently divide an incomplete data window by a fixed number of sessions.

## Testing

Reusable Node.js modules include zero-dependency regression tests.

Run:

```bash
npm test
```

or directly:

```bash
node tests/core-modules.test.js
```

Current regression coverage includes:

- positive and negative price changes
- zero-value protection
- relative-volume calculations
- buyer-power validation
- invalid participant counts
- candidate-ranking boundaries
- malformed inputs
- numeric-string inputs
- score normalization
- configured ranking weights
- risk penalties
- classification thresholds

### Runtime Testing Limitation

Native TSETMC filters use runtime-specific structures such as:

```text
[ih]
(ct)
pl
pc
tvol
```

These filters should not be treated as ordinary Node.js modules.

The current Node regression suite therefore focuses on reusable pure modules rather than pretending to execute the native TSETMC environment.

A future runtime-adapter or fixture layer may allow more of the screening logic to be tested independently.

## Continuous Integration

GitHub Actions automatically runs the regression suite after pushes and pull requests targeting `main`.

The current CI matrix tests:

```text
Node.js 20
Node.js 22
Node.js 24
```

All supported matrix jobs are expected to pass before a release milestone is completed.

## Design Principles

The project follows several principles:

1. **Zero unnecessary dependencies**  
   Core utilities should remain lightweight whenever practical.

2. **Modular screening logic**  
   Different analytical concepts should remain independently understandable.

3. **Defensive data handling**  
   Invalid counts, missing historical observations, malformed values, incomplete windows, and zero denominators should be handled explicitly.

4. **Field semantics before formulas**  
   Raw TSETMC fields should be understood and documented before complex logic is built around them.

5. **Separation of signals and scoring**  
   A screening condition and a candidate-ranking system are different concerns.

6. **Avoid duplicate filters**  
   New modules should add genuinely different analytical capability rather than merely change thresholds or names.

7. **Observable claims only**  
   Code should describe measurable market behaviour without claiming to identify hidden actors, manipulation, unpublished information, guaranteed outcomes, or future price movements.

8. **Direct data over avoidable approximation**  
   When TSETMC provides a direct field such as traded value, use it instead of reconstructing an approximation unnecessarily.

9. **Maintainability over filter count**  
   A smaller collection of distinct, documented, defensively validated modules is preferable to a large collection of near-duplicate filters.

## TSETMC Compatibility

Some filters are designed specifically for the TSETMC market-watch filtering environment and depend on variables or historical structures exposed by that environment.

TSETMC data structures and field availability can change.

Before using a filter in live screening:

- verify currently available TSETMC fields
- consult the field contract
- validate historical-array behaviour
- verify sufficient historical observations
- test the logic against representative symbols
- check division-by-zero and missing-data cases
- review threshold assumptions for the intended market context

Reusable CommonJS modules in this repository should not be assumed to be directly importable inside the native TSETMC filter environment.

## Examples

The `examples/` directory contains small usage demonstrations intended to show how reusable toolkit components can be used without requiring a larger application.

Examples should be added when they demonstrate a genuinely reusable capability rather than duplicate existing documentation.

## Development Status

This project is under active development.

Recent engineering work has focused on:

- documenting TSETMC runtime fields
- reducing undocumented field assumptions
- strengthening current-session validation
- strengthening historical-data validation
- validating moving-average windows
- using direct traded-value fields where available
- improving participant-footprint validation
- improving exit-pressure validation
- separating trap-risk logic from exit-pressure logic
- reducing semantic overlap between screening modules
- preserving regression coverage and CI stability

Future development may include:

- extracting additional pure analytical functions from runtime filters
- representative runtime fixtures
- normalized TSETMC data adapters
- broader integration tests
- systematic legacy-filter deduplication
- carefully designed evaluation and backtesting infrastructure

Future releases will be created around meaningful engineering milestones rather than individual file additions.

## Contributing

Contributions, bug reports, validation results, documentation improvements, and well-defined screening ideas are welcome.

Please read:

```text
CONTRIBUTING.md
```

before proposing substantial changes.

New screening modules should ideally:

- solve a distinct analytical problem
- avoid duplicating existing modules
- document their assumptions
- use verified TSETMC field semantics
- handle missing or invalid data defensively
- avoid guaranteed trading claims
- include tests when their logic can be separated from the native TSETMC runtime

## Disclaimer

This repository is provided for educational, research, and analytical purposes.

Nothing in this project constitutes financial advice, an investment recommendation, or a guarantee of market performance.

Screening results and assumptions should be independently validated before being used in any financial decision.

## License

Released under the MIT License.

See:

```text
LICENSE
```

for details.
