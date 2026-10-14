# NUDL Mathematics Domain Map
**Document ID:** NUDL-MATH-001  
**Status:** Research and implementation roadmap  
**Purpose:** Define a broad mathematics capability plan for NUDL using publicly documented topic categories and example problem types.

## Scope and source note
This is an original NUDL roadmap, not a copy of Wolfram|Alpha's internal knowledge base, algorithms, or proprietary content. Wolfram|Alpha's public mathematics examples cover elementary math, algebra, geometry, trigonometry, calculus and analysis, differential equations, statistics, discrete mathematics, linear algebra, complex analysis, plotting, and special functions. See the public references at the end.

## Capability tiers
- **Tier 1 — exact numeric:** integer and decimal arithmetic, fractions, rational numbers, unit-aware quantities, constants, rounding policies.
- **Tier 2 — symbolic expressions:** expression trees, simplification, substitution, expansion, factorization, polynomial arithmetic, equation solving.
- **Tier 3 — numerical methods:** root finding, numerical integration, differentiation, optimization, interpolation, ODE solvers, error estimates.
- **Tier 4 — domain libraries:** statistics, matrices, geometry, number theory, combinatorics, complex numbers, special functions.
- **Tier 5 — visualization:** 2D/3D plots, parametric curves, surfaces, vector fields, data charts.
- **Tier 6 — advanced research:** PDEs, symbolic integration, formal proof interfaces, interval arithmetic, arbitrary precision, automatic differentiation.

## Domain inventory
| ID | Domain | Candidate NUDL modules | Initial examples |
|---|---|---|---|
| MATH-001 | Arithmetic and exact numbers | `math.numeric` | fractions, powers, gcd, rounding |
| MATH-002 | Algebra and polynomials | `math.algebra` | solve, expand, factor, simplify |
| MATH-003 | Geometry and measurement | `math.geometry`, `math.units` | area, volume, coordinate geometry |
| MATH-004 | Trigonometry | `math.trig` | radians, identities, trig equations |
| MATH-005 | Calculus and analysis | `math.calculus` | limits, derivatives, integrals, series |
| MATH-006 | Differential equations | `math.ode`, future `math.pde` | initial-value problems, numerical solvers |
| MATH-007 | Linear algebra | `math.linalg` | vectors, matrices, determinants, systems |
| MATH-008 | Probability and statistics | `math.stats`, `math.probability` | mean, variance, distributions, inference |
| MATH-009 | Discrete mathematics | `math.discrete` | sequences, recurrence, combinatorics, graphs |
| MATH-010 | Number theory | `math.number_theory` | primes, divisors, modular arithmetic |
| MATH-011 | Complex analysis | `math.complex` | complex arithmetic, roots, residues |
| MATH-012 | Special functions | `math.special` | gamma, erf, Bessel and related functions |
| MATH-013 | Optimization and numerical analysis | `math.optimize`, `math.numerical` | minima, error bounds, convergence |
| MATH-014 | Symbolic logic and proof | `math.logic`, `math.proof` | predicates, equivalence, proof obligations |
| MATH-015 | Plotting and visualization | `math.plot` | functions, inequalities, surfaces |

## Proposed API principles
1. Keep exact values exact until a user requests approximation.
2. Make numeric precision explicit; do not silently imply arbitrary precision if using machine floats.
3. Return structured results: value, units, assumptions, domain constraints, warnings, and method metadata.
4. Distinguish symbolic answers from numerical approximations.
5. Report when a result is unsupported, conditional, divergent, or numerically unstable.
6. Use deterministic tests with known expected results; randomized algorithms must accept a seed.
7. Treat imported formulas and scripts as untrusted input. No implicit file, network, or process access from math expressions.
8. Preserve source-language licensing and attribution when adapting third-party examples; prefer independently authored examples.

## Suggested result model
```text
MathResult<T> {
  value: T
  exact: Boolean
  precision: Optional<Integer>
  assumptions: List<Expression>
  warnings: List<String>
  method: Optional<String>
}
```

## Proposed Noodle examples
The files under `examples/math/` are illustrative syntax proposals. They must not be treated as executable until the NUDL parser, evaluator, and corresponding standard-library functions implement them.

## Implementation order
1. Numeric literals, precedence, exact integers/rationals, constants.
2. Expression AST and safe evaluator.
3. Unit tests and structured diagnostics.
4. Vectors/matrices and linear systems.
5. Polynomial operations and equation-solving interfaces.
6. Statistics and probability.
7. Numerical calculus and ODE solvers.
8. Symbolic calculus, special functions, plotting, and advanced domains.

## Public references
- Wolfram|Alpha mathematics examples: https://www.wolframalpha.com/examples/mathematics
- Wolfram|Alpha calculus and analysis examples: https://www.wolframalpha.com/examples/mathematics/calculus-and-analysis
- Wolfram|Alpha algebra examples: https://www.wolframalpha.com/examples/mathematics/algebra
- Wolfram|Alpha differential equations examples: https://www.wolframalpha.com/examples/mathematics/differential-equations
- Wolfram|Alpha mathematical functions examples: https://www.wolframalpha.com/examples/mathematics/mathematical-functions
- Wolfram Language mathematical functions reference: https://reference.wolfram.com/language/guide/MathematicalFunctions.html

These sources are a guide to subject coverage, not evidence that NUDL already implements these capabilities.
