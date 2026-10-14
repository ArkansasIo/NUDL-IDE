# Noodle Order of Operations and Execution Model

## Source processing order

1. UTF-8 source decoding
2. Lexical analysis
3. Parsing
4. AST construction
5. Name and scope resolution
6. Type inference and type checking
7. Constant evaluation
8. Semantic validation
9. Typed Noodle IR generation
10. IR optimization
11. Backend selection
12. Target code generation
13. Runtime linking
14. Execution
15. Diagnostics, profiling, and test reporting

## Expression precedence

Highest precedence is evaluated first:

1. Parentheses
2. Function calls and indexing
3. Unary operators
4. Multiplication, division, remainder
5. Addition and subtraction
6. Comparisons
7. Equality
8. Logical operators
9. Assignment

Binary arithmetic and comparison operators are left-associative unless a future specification explicitly changes this.

Example: 2 + 3 * 4 means 2 + (3 * 4). Parentheses override precedence.

## Function evaluation order

1. Evaluate the callee.
2. Evaluate arguments left-to-right.
3. Bind arguments to parameters.
4. Enter function scope.
5. Execute statements in source order.
6. Evaluate return.
7. Leave the function scope.
8. Produce the return value.

## Control flow

An if condition is evaluated before exactly one selected branch executes.

A while loop evaluates its condition, exits when false, executes its body when true, then reevaluates the condition.

## Data pipeline order

Input -> decoding -> schema validation -> transformation -> computation -> output serialization.

Invalid data must produce a diagnostic or explicit runtime error rather than silently changing meaning.

## Parallel execution

Parallel constructs may change internal scheduling, but they must preserve declared semantic results and documented synchronization guarantees.

## Optimization

Optimization may change implementation order but must not change observable Noodle semantics. Floating-point reassociation, fused operations, vectorization, and reduced precision require an explicit optimization policy.

## Research requirement

Every research example should document source order, precedence, AST order, typed-IR order, runtime execution order, optimization transformations, target execution model, expected result, and test evidence.
