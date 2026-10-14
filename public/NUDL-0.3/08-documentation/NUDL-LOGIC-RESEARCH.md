# Noodle Logic Research Program

## Research question

Can a strongly typed Noodle representation express major classical and computational logic algorithms while preserving their mathematical semantics across interpreter, native, SIMD, and future accelerator backends?

## Logic pipeline

source proposition
-> lexer
-> parser
-> AST
-> typed logical expression
-> normalized representation
-> inference/decision algorithm
-> proof or decision result
-> diagnostics

## Core representations

Boolean values:
true, false

Logical operators:
NOT, AND, OR, XOR, implication, equivalence

Relations:
equal, unequal, less, less-or-equal, greater, greater-or-equal

Quantifiers:
forall, exists

Future proof objects should carry premises, inference rule, derived proposition, and source location.

## Correctness requirements

A logic backend must distinguish:

- satisfiable
- unsatisfiable
- valid
- invalid
- unknown/undecided
- timeout/resource exhaustion

It must never convert an undecided result into false.

## Complexity research

Record asymptotic complexity and measured performance separately. SAT, theorem proving, model checking, and first-order reasoning can have exponential or undecidable cases; Noodle must document those limits.

## Thesis experiment

For each algorithm, compare:

- correctness
- execution time
- memory
- proof/decision output
- scalability
- determinism
- interpreter versus native execution
- optional parallel implementation

The purpose is empirical evaluation, not an assumption that Noodle is inherently faster.
