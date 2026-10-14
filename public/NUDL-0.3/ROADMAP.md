# Noodle Roadmap

## Vision
Noodle is intended to become a typed, data-oriented, general-purpose programming language with a common intermediate representation and portable execution across native CPUs, SIMD, GPUs, WebAssembly, mobile, and explicitly supported targets.

## Phase 0 — NUDL 0.3 Foundation
Establish the specification, grammar, lexer, parser, AST, diagnostics, C++ bootstrap compiler, CI, regression tests, documentation, browser IDE, plugin ABI, and research corpus.
Exit: bootstrap builds and smoke/conformance tests pass.

## Phase 1 — Complete Language Core
Implement primitive types, strings, arrays, maps, tuples, structures, enums, functions, modules, imports, namespaces, assignment, indexing, member access, conditionals, loops, pattern matching, errors/results, generics, aliases, subtypes, nullable types, and conversions.
Exit: representative programs parse, type-check, and execute.

## Phase 2 — Semantic Model
Specify scope, name resolution, overload resolution, type inference, ownership/lifetime, mutability, nullability, evaluation order, integer overflow, floating-point rules, errors, determinism, concurrency, and ABI rules.
Exit: semantic specification agrees with conformance tests.

## Phase 3 — Typed Noodle IR
Build the stable middle layer: typed values, SSA-compatible representation, basic blocks, control flow, calls, memory, aggregates, metadata, debug locations, source maps, and deterministic lowering.
Pipeline: source -> tokens -> AST -> semantic model -> typed IR -> optimized IR -> backend.

## Phase 4 — Native Noodle Runtime
Implement memory, strings, arrays, maps, I/O, files, processes, time, threads, synchronization, diagnostics, errors, plugins, and FFI. Keep the runtime ABI small and versioned.

## Phase 5 — Noodle-Native Compiler
Implement the lexer, parser, AST, semantic analyzer, IR builder, optimizer, backend interface, diagnostics, and driver in Noodle.
Bootstrap: C++ compiler -> native Noodle compiler -> native compiler compiles itself -> compare outputs and tests.
Exit: self-hosting conformance passes reproducibly.

## Phase 6 — Native CPU Backends
Support x86-64 and AArch64, followed by RISC-V 64. Add calling conventions, object generation, linking, ABI interoperability, debug information, and optimization levels.

## Phase 7 — SIMD and Parallel Execution
Add vector types, SIMD lowering, multicore scheduling, parallel loops, reductions, deterministic parallel primitives, CPU feature detection, and vectorization diagnostics.

## Phase 8 — GPU and Accelerator Backends
Research CUDA, Vulkan Compute, WebGPU, and accelerator plugins. Define explicit memory-transfer and synchronization semantics.

## Phase 9 — Standard Library
Build core, text, regex, collections, math, algebra, calculus, linear algebra, statistics, probability, units, time, filesystem, networking, serialization, JSON, CSV, databases, concurrency, cryptography, graphics, system, and testing libraries.

## Phase 10 — Interoperability
Provide controlled FFI with C, C++, Rust, Python, Java, C#, JavaScript/TypeScript, Swift, and WebAssembly through explicit typed boundaries.

## Phase 11 — Tools and IDE
Complete compiler CLI, formatter, linter, package manager, documentation generator, language server, debugger integration, profiler, test runner, dependency manager, browser IDE, editor integrations, and project generator.

## Phase 12 — Applications and Research Corpus
Build reproducible programs for general utilities, data engineering, scientific computing, mathematics, statistics, AI/ML, databases, web services, GUI applications, games, robotics, embedded systems, simulations, distributed systems, compiler tooling, and formal methods.

## Phase 13 — Performance and Correctness Research
Measure compile time, memory, executable size, startup, throughput, latency, SIMD/multicore scaling, GPU throughput, numerical accuracy, and interoperability overhead using reproducible workloads and documented hardware.

## Phase 14 — Security and Reliability
Add capability-based APIs, sandboxing, secure plugin loading, dependency integrity, reproducible builds, fuzzing, property-based testing, differential compiler testing, static analysis, and supply-chain metadata.

## Phase 15 — Noodle 1.0
Require a stable language specification, stable core ABI, verified bootstrap/self-hosting path, conformance suite, documented platforms, native CPU backend, standard-library baseline, package format, tooling baseline, reproducible releases, security policy, and migration policy.

## Phase 16 — Noodle 2.x Research
Investigate refinement types, formal verification, actors/distributed programming, automatic differentiation, tensor programming, quantum interfaces, heterogeneous scheduling, specialization, incremental compilation, distributed compilation, verified optimization, and new accelerator targets.

## Release Discipline
Every feature follows: proposal -> specification -> implementation -> tests -> documentation -> benchmark/research -> compatibility review -> release.
A roadmap item is not complete merely because source files exist; implementation, tests, and documented behavior are required.
