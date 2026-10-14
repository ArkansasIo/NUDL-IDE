# NUDL Mathematics Test Plan
**Document ID:** NUDL-MATH-TEST-001

## Current status
These are acceptance-test specifications. They do not assert that the current compiler can run them.

| Test ID | Input concept | Expected result | Feature dependency |
|---|---|---|---|
| MATH-T001 | `125 + 375` | `500` | numeric evaluator |
| MATH-T002 | exact rational arithmetic `1/4 * (4 - 1/2)` | `7/8` | rational numbers |
| MATH-T003 | `gcd(84,30)` | `6` | integer standard library |
| MATH-T004 | factor `x^2 - 9` | `(x-3)(x+3)` | symbolic polynomial engine |
| MATH-T005 | solve `x^2 - 5x + 6 = 0` | roots `2, 3` | equation solver |
| MATH-T006 | derivative of `x^4 sin(x)` | `4x^3 sin(x) + x^4 cos(x)` | symbolic calculus |
| MATH-T007 | integrate `x^2` from 0 to 3 | `9` | symbolic integration |
| MATH-T008 | limit `sin(x)/x` as x approaches 0 | `1` | limit engine |
| MATH-T009 | determinant of `[[1,2],[3,4]]` | `-2` | linear algebra |
| MATH-T010 | solve x+y=10, x-y=4 | x=7, y=3 | linear system solver |
| MATH-T011 | mean of eight sample values | `22.75` | statistics |
| MATH-T012 | median of the sample values | `23` | statistics |
| MATH-T013 | `sin(pi/6)` | exact `1/2` | exact trig simplification |
| MATH-T014 | solve y''+y=0 with y(0)=2, y'(0)=1 | `2 cos(x)+sin(x)` | ODE solver |

## Required error tests
- Division by zero produces a structured diagnostic.
- Invalid domains (such as real square root of a negative value) are explicit and policy-controlled.
- Solver reports no solution, infinitely many solutions, or unknown status distinctly.
- Numerical methods report tolerance, iteration limit, and convergence status.
- Units must be compatible before addition or comparison.
- Symbolic simplification must preserve expression semantics.
- Floating-point approximations must not be labeled exact.

## Release gate
A test passes only when run by the actual NUDL implementation and its observed output matches the expected result. Until then, all rows are specifications, not verified compiler results.
