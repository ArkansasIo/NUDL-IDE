# NUDL Standard Library

ID: NUDL-STDLIB-001
Status: Architecture and API specification

The NUDL standard library is organized as small composable modules. Implementations may use native code internally, but the public API must preserve NUDL semantics.

## Core modules

- core: values, Option, Result, errors, assertions
- text: Unicode strings, parsing, formatting
- collections: arrays, maps, sets, queues, iterators
- math: exact numbers, arithmetic, constants, functions
- math.algebra: expressions, polynomials, equations
- math.calculus: limits, derivatives, integrals, series
- math.linalg: vectors, matrices, tensors
- math.stats: descriptive statistics and distributions
- math.probability: random variables and probability
- math.discrete: combinatorics, sequences, graph algorithms
- math.number_theory: primes, modular arithmetic, gcd
- math.complex: complex numbers and functions
- math.units: dimensional quantities and unit conversion
- io: files, streams, serialization
- net: structured networking APIs
- time: clocks, dates, durations
- concurrency: tasks, channels, synchronization
- data: CSV, JSON, tabular data
- system: environment and process capabilities
- graphics: portable drawing primitives
- accelerator: CPU, SIMD, GPU capability and dispatch
- crypto: cryptographic primitives through audited implementations

## Design rules

1. Stable APIs before optimization-specific APIs.
2. Explicit errors rather than hidden failures.
3. Exact math where practical; approximation must be explicit.
4. Unit-aware arithmetic rejects incompatible dimensions.
5. Platform-specific functionality is capability-gated.
6. Unsafe operations live behind explicit unsafe boundaries.
7. Deterministic APIs accept explicit seeds where randomness matters.
8. No standard-library function silently performs privileged OS operations.

## Performance
The implementation may specialize hot paths for CPU vectorization or accelerators. Portable behavior remains the reference semantics.

## Versioning
Modules are versioned with NUDL. Breaking API changes require migration notes and compatibility policy.
