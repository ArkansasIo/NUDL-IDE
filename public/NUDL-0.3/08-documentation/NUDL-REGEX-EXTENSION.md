# Noodle Regex Extension Specification

## Purpose

Regex is a Noodle extension for pattern matching, extraction, replacement, and splitting.

## API

```
regex.compile(pattern) -> Regex
regex.is_match(pattern, input) -> bool
regex.find(pattern, input) -> Array<Match>
regex.replace(pattern, input, replacement) -> string
regex.split(pattern, input) -> Array<string>
```

## Execution order

1. Evaluate the pattern expression.
2. Evaluate the input expression.
3. Compile or retrieve the cached pattern.
4. Validate the pattern.
5. Execute the selected regex operation.
6. Materialize matches/captures.
7. Return the Noodle value.
8. Emit a runtime diagnostic if the operation fails.

## Security

Untrusted patterns must be subject to runtime resource limits. A host may select a linear-time regex engine or reject constructs capable of excessive backtracking.

## Research experiment

Compare:
- compilation cost with and without pattern caching
- matching throughput
- Unicode behavior
- capture extraction
- worst-case pattern behavior
- scalar versus parallel batch matching

The results belong in the Noodle thesis as an extension-system case study.
