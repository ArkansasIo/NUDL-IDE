# NUDL Cross-Language Compilation Model

NUDL can act as a universal interchange and compilation layer between programming languages.

## Core model

    C           C++          Rust          Go            Java           C#             Python      +--> NUDL Front-End Adapter --> NUDL IR --> NUDL Back-End --> C/C++/Rust/Go/Java/C#/Python/JS/TS/WASM/LLVM
    JS/TS     /
    Swift    /
    Kotlin  /
    Fortran /
    other  /

The important property is that translation goes through a common semantic representation instead of requiring a direct translator for every pair of languages.

Without NUDL, N languages can require approximately N*(N-1) directed translations for every source/target pair. With NUDL adapters, the architecture can approach N source adapters plus M target backends.

## Example

A project may contain:

    math.c
    parser.py
    network.rs
    ui.ts

A future NUDL toolchain can import each supported source module:

    math.c       -> C adapter       -> NUDL IR
    parser.py    -> Python adapter  -> NUDL IR
    network.rs   -> Rust adapter    -> NUDL IR
    ui.ts        -> TypeScript      -> NUDL IR

Then:

    NUDL IR + NUDL IR + NUDL IR + NUDL IR
                         |
                         v
                    NUDL linker
                         |
                         v
                  unified NUDL IR
                         |
             +-----------+-----------+
             |           |           |
             v           v           v
            C++        Rust        WASM

## Important limitation

Cross-compilation is not guaranteed to be lossless.

A source language feature is imported only when its semantics can be represented by the NUDL semantic model.

Examples of difficult or potentially non-portable features include:

- compiler-specific intrinsics
- undefined behavior
- language-specific object models
- macros that generate arbitrary source
- reflection with runtime-dependent behavior
- garbage-collector assumptions
- pointer aliasing assumptions
- target-specific SIMD instructions
- OS-specific APIs
- concurrency models that do not have equivalent NUDL semantics
- dynamic runtime metaprogramming

When a construct cannot be translated safely, the compiler should produce a diagnostic and identify the unsupported construct.

## Three translation modes

### 1. Import

    source language -> NUDL

Used to bring existing programs into the NUDL semantic model.

### 2. Compose

    language A -> NUDL IR
    language B -> NUDL IR
                    |
                    v
                unified IR

Used to combine components originally written in different languages.

### 3. Export

    NUDL -> target language

Used to generate target-language source or target bytecode/native code.

The complete workflow is therefore:

    Import -> Normalize -> Type/Semantic Check -> Compose -> Optimize -> Export

## NUDL adapter contract

Every source-language adapter must document:

- source language and version
- supported syntax
- supported language features
- source runtime assumptions
- type mapping
- memory model mapping
- exception/error mapping
- concurrency mapping
- FFI mapping
- unsupported constructs
- generated provenance
- conformance-test status

## Provenance

Generated NUDL IR must retain source-location metadata so diagnostics can identify:

    original-language file
    source language
    source line/column
    NUDL IR operation
    target-language output

This allows an error in generated C++ or Rust to be traced back to the original source.

## Semantic firewall

The NUDL IR is a semantic firewall.

Source-language behavior is accepted only when it is:

1. understood by the adapter,
2. represented in NUDL IR,
3. validated by NUDL semantic analysis,
4. representable by the selected target.

This prevents a target backend from silently deciding what an ambiguous source construct means.

## Universal library bridge

Libraries require the same model:

    C library     -> FFI/import adapter -> NUDL API
    Rust crate    -> adapter            -> NUDL API
    Python module -> adapter/runtime     -> NUDL API
    JS package    -> adapter/runtime     -> NUDL API

A library is not considered portable merely because a wrapper exists. Its observable behavior must be specified.

## Initial realistic implementation order

P0:
- NUDL-native source
- NUDL AST
- typed NUDL IR
- deterministic semantics
- diagnostics
- test framework

P1:
- C/C++ import/export
- JSON/CSV/data adapters
- C ABI FFI

P2:
- Rust and Python interoperability
- JavaScript/TypeScript interoperability
- WebAssembly backend

P3:
- Go, Java, C#/.NET, Swift, Kotlin, Fortran
- LLVM backend

P4:
- deeper source-to-NUDL translation for language-specific constructs
- automated library/API mapping
- optimization and whole-program cross-language compilation

## Security rule

Imported source code is never executed merely because it was imported.

Compilation adapters analyze source and produce IR. Execution occurs only after explicit compilation/run steps and capability checks.
