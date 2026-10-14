# NUDL Universal Language Architecture

NUDL 0.3 is designed as a universal data-and-programming language front-end.

Core pipeline:

    NUDL source -> lexer -> parser -> AST -> semantic/type analysis -> NUDL IR -> backend -> target language/runtime

NUDL is not defined as C++, Python, or another host language with a different surface syntax. The NUDL semantic model is authoritative; target languages are compilation targets.

## Target families

Initial backend targets:

- C
- C++
- Rust
- Go
- Java
- C#
- JavaScript
- TypeScript
- Python
- WebAssembly
- SQL (data/query subset only)
- LLVM IR
- Native machine code through a future backend

Additional adapters can be added for Swift, Kotlin, Zig, Fortran, CUDA/OpenCL, shell environments, and domain-specific runtimes where semantics can be mapped safely.

## Backend contract

Every backend must declare supported NUDL types, control flow, standard-library operations, numeric behavior, memory model, error mapping, concurrency mapping, I/O capabilities, unsupported constructs, and runtime dependencies.

A backend must never silently change NUDL semantics to fit the target language.

## Translation levels

### Level 0 — Validation
Source is parsed and type-checked.

### Level 1 — NUDL IR
The program is lowered into a typed, target-independent intermediate representation.

### Level 2 — Source generation
The IR is emitted as readable target source.

### Level 3 — Portable runtime
The IR executes through a NUDL runtime or compiles to WebAssembly.

### Level 4 — Native compilation
A native backend lowers NUDL IR through LLVM or another code-generation system.

## Semantic preservation

Examples:

- NUDL ownership may map naturally to Rust but require generated cleanup in C.
- NUDL algebraic data types may require tagged structs/classes in C.
- NUDL deterministic decimal arithmetic may require a runtime library in JavaScript.
- NUDL schema validation may become generated validation functions.
- Relational transformations may lower to SQL when safely expressible; otherwise they execute in the NUDL runtime.

## Universal language principle

NUDL has one language specification and many implementations:

    NUDL
      |
      +-- parser
      +-- semantic analyzer
      +-- typed IR
      |
      +-- C
      +-- C++
      +-- Rust
      +-- Go
      +-- JVM
      +-- .NET
      +-- JS/TS
      +-- Python
      +-- WASM
      +-- SQL data backend
      +-- LLVM/native

## Compatibility profiles

A program can eventually declare:

    target wasm
    target rust
    target cpp
    target sql

The compiler should reject a target when the source uses unsupported features instead of silently changing semantics.

## Libraries

- NUDL Core
- NUDL Data
- NUDL Math
- NUDL Collections
- NUDL IO
- NUDL Net
- NUDL Concurrency
- NUDL Validation
- NUDL FFI
- NUDL Graphics/UI
- NUDL GPU
- NUDL Domain

A library API is portable only when its observable behavior is specified independently of a particular implementation language.

## Security

Generated code must not inherit unsafe behavior merely because the target language permits it.

Imported data is data unless explicitly declared executable source. Imported SQL must never execute merely because it was imported. FFI, filesystem, process, network, GPU, and native-memory operations require explicit capabilities.

## Status

Proposed architecture. The current compiler is an early structural parser and does not yet implement all listed backends.
