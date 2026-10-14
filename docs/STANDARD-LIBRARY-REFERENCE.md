# NUDL-IDE Standard Library Reference

The browser interpreter implements a small set of built-ins directly in `src/nudl/interpreter.ts`. These are not automatically available in the native C++ compiler or every generated target.

## Core built-ins

- `print(...values)`: appends a formatted line to the IDE output panel.
- `len(value)`: returns text/array length or object key count; unsupported values return zero in the current interpreter.
- `str(value)`: formats a runtime value as text.
- `typeof(value)`: returns a JavaScript-like runtime category, with explicit handling for null and arrays.
- `average(values)`: calculates the mean of an array or the supplied arguments; empty input currently returns zero.

## Math functions

`math.sqrt`, `math.abs`, `math.pow`, `math.floor`, `math.ceil`, `math.round`, `math.min`, and `math.max`.

## Regex functions

- `regex.is_match(pattern, text)`
- `regex.replace(pattern, text, replacement)`

The browser implementation uses JavaScript regular expressions. Invalid patterns are currently handled by fallback return values rather than structured NUDL diagnostics. This behavior should be normalized before cross-implementation conformance.

## Known portability caveat

Built-ins are currently implemented in the TypeScript interpreter rather than a shared runtime package. Use the native language specification and conformance plan when deciding whether a function is portable across implementations.
