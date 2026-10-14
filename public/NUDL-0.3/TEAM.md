# Noodle Development Team

The Noodle team is organized as a virtual open-source engineering group. Roles describe ownership and review responsibility; they do not imply that named people are currently assigned.

## Core team

### 1. Project Lead / Language Architect
Owns language direction, architecture, roadmap, compatibility policy, and major design decisions.

### 2. Compiler Team
Owns lexer, parser, AST, semantic analysis, type system, Noodle IR, optimization, code generation, diagnostics, and bootstrap compiler.

### 3. Runtime Team
Owns interpreter, runtime values, memory model, execution engine, standard runtime APIs, concurrency, and portability.

### 4. Backend & Systems Team
Owns C/C++, Rust, native CPU, SIMD, WebAssembly, GPU/accelerator, ABI, linker, and platform integration.

### 5. IDE & Developer Tools Team
Owns the browser IDE, desktop IDE direction, language service, debugger, terminal, formatter, syntax tools, project system, and build integration.

### 6. Mathematics & Algorithms Team
Owns mathematical libraries, numerical methods, symbolic mathematics, logic algorithms, algorithms research, correctness notes, and educational examples.

### 7. Standard Library & Interoperability Team
Owns collections, text, math, regex, files, networking, serialization, FFI, and integrations with C/C++/Rust/Python/JS/TS/etc.

### 8. Testing, Verification & Performance Team
Owns unit tests, conformance tests, fuzzing, property tests, benchmarks, numerical validation, compiler differential tests, security testing, and regression tracking.

### 9. Documentation & Education Team
Owns language guides, specifications, API documentation, tutorials, beginner/intermediate/advanced mathematics books, university material, examples, and thesis/research documentation.

### 10. Release & Infrastructure Team
Owns CMake, CI, GitHub Actions, releases, package artifacts, versioning, compatibility matrices, generated documentation, and reproducible builds.

## Specialist roles

- Security reviewer
- Numerical-analysis reviewer
- Formal-methods reviewer
- UX/accessibility reviewer
- Build/release engineer
- Technical writer
- Curriculum designer
- Benchmark engineer

## Decision model

Small implementation changes: subsystem owner review.

Cross-cutting language changes: compiler owner + language architect + affected subsystem owner.

Semantic changes: specification review before implementation.

Breaking changes: migration plan, compatibility note, tests, and release decision.

No feature is considered complete solely because its interface exists; implementation, tests, documentation, and verification are required.
