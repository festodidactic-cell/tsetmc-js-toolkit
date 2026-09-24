# TSETMC JS Toolkit

[![CI](https://github.com/festodidactic-cell/tsetmc-js-toolkit/actions/workflows/ci.yml/badge.svg)](https://github.com/festodidactic-cell/tsetmc-js-toolkit/actions/workflows/ci.yml)

A lightweight, zero-dependency JavaScript toolkit for building, organizing, testing, and maintaining screening logic for TSETMC market analysis.

The project combines practical TSETMC screening filters with reusable indicators, quality and risk gates, candidate-scoring utilities, examples, and regression tests.

## Overview

TSETMC screening code often starts as isolated filter snippets.

This project aims to turn those snippets into a more maintainable structure with clear separation between:

- online screening logic
- offline / historical analysis
- reusable indicators
- market-quality and risk checks
- candidate scoring
- examples
- automated regression tests

The goal is not to provide automatic trading decisions. The toolkit is intended to support research, screening, experimentation, and development around Iranian capital-market data.

## Key Features

### Online Screening

The `src/Online/` directory contains screening modules for live or current-session analysis.

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
- tradeability and market-quality gates
- participant-footprint detection
- symbol-regime classification
- multi-day swing structures
- trap-risk detection

Each module is designed around a specific analytical question rather than attempting to combine every signal into one oversized filter.

### Offline Analysis

The `src/offline/` directory contains logic intended for historical or multi-session analysis.

This layer is useful for concepts such as:

- accumulation
- historical price behaviour
- historical volume behaviour
- pre-breakout structures
- multi-session screening

### Hybrid Screening

The `src/Both/` directory is reserved for screening logic that combines current-session observations with historical context.

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

These classifications are analytical ranking labels and are not buy or sell recommendations.

## Architecture

The toolkit is moving toward a layered screening architecture:

```text
TSETMC Data
     │
     ▼
Indicators
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

This structure makes individual components easier to test, replace, extend, and reuse.

## Repository Structure

```text
tsetmc-js-toolkit/
│
├── .github/
│   └── workflows/
│       └── ci.yml
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
├── CONTRIBUTING.md
├── LICENSE
├── README.md
└── package.json
```

## Testing

The reusable modules include zero-dependency regression tests.

Run:

```bash
npm test
```

or directly:

```bash
node tests/core-modules.test.js
```

The current tests cover areas including:

- positive and negative price changes
- zero-value protection
- relative-volume calculations
- buyer-power validation
- candidate-ranking boundaries
- malformed inputs
- score normalization
- risk penalties
- classification thresholds

## Continuous Integration

GitHub Actions automatically runs the regression suite after pushes and pull requests targeting `main`.

The current CI matrix tests the project on:

```text
Node.js 20
Node.js 22
Node.js 24
```

This helps detect regressions before future releases.

## Design Principles

The project follows several principles:

1. **Zero unnecessary dependencies**  
   Core utilities should remain lightweight whenever practical.

2. **Modular screening logic**  
   Different analytical concepts should remain independently understandable and testable.

3. **Defensive data handling**  
   Invalid counts, missing historical observations, zero denominators, and malformed values should be handled explicitly.

4. **Separation of signals and scoring**  
   A screening condition and a candidate-ranking system are different concerns.

5. **Avoid duplicate filters**  
   New modules should add a genuinely different analytical capability rather than simply changing thresholds in an existing filter.

6. **Observable claims only**  
   Code should describe measurable market behaviour without claiming to identify hidden actors, manipulation, guaranteed outcomes, or future price movements.

7. **Maintainability over filter count**  
   A smaller collection of distinct, documented, testable modules is preferable to a large collection of near-duplicate filters.

## TSETMC Compatibility

Some filters are designed for the TSETMC market-watch filtering environment and may depend on variables or historical structures exposed by that environment.

TSETMC data structures and field availability can change.

Before using a filter in live screening:

- verify the currently available TSETMC fields
- validate historical-array behaviour
- test the logic against representative symbols
- check division-by-zero and missing-data cases
- review threshold assumptions for the intended market context

Reusable Node.js modules in this repository should not be assumed to be directly importable inside the native TSETMC filter environment.

## Examples

The `examples/` directory contains small usage demonstrations intended to show how toolkit components can be used without requiring a larger application.

Additional examples will be added as reusable modules mature.

## Development Status

This project is under active development.

Current work focuses on:

- consolidating distinct screening concepts
- reducing duplicate filter logic
- extracting reusable calculations
- improving defensive validation
- expanding regression coverage
- building a clearer scoring architecture
- documenting assumptions and limitations

Future releases will be created around meaningful development milestones rather than individual file additions.

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
- handle missing or invalid data defensively
- avoid guaranteed trading claims
- include tests when the logic can be separated from the TSETMC runtime

## Disclaimer

This repository is provided for educational, research, and analytical purposes.

Nothing in this project constitutes financial advice, an investment recommendation, or a guarantee of market performance.

Screening results should be independently validated before being used in any financial decision.

## License

Released under the MIT License.

See:

```text
LICENSE
```

for details.
