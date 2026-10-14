# Noodle ABI and FFI Design

## Goals

Provide explicit interoperability with C-compatible ABIs first, followed by language-specific adapters.

## ABI boundary

The first stable boundary should use:
- fixed-width integers
- IEEE floating-point values where applicable
- UTF-8 byte buffers with explicit length
- opaque handles
- explicit ownership
- explicit error/status values

## Ownership

Generated bindings must never silently guess ownership. APIs declare borrowed, owned, shared, or transferred values.

## FFI

Noodle should support declarations that import external symbols and declarations that export Noodle functions.

Proposed forms are specification material until grammar and compiler support are implemented.

## Safety

Unsafe FFI operations require an explicit boundary and capability policy.
