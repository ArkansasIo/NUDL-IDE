# Omni Language Research for NUDL 0.3

**Document ID:** NUDL-RES-OMNI-001  
**Status:** Research synthesis; proposed design input, not a claim of compatibility  
**Prepared:** 2026-10-14

## 1. Purpose

This document identifies ideas from public projects called **Omni** and from the user's earlier OmniLang/OmniX design work that may inform NUDL. "Omni" is not one uniquely identified programming language: multiple unrelated projects use the name. Their grammars, implementations, and licenses must not be treated as interchangeable.

## 2. Sources and identity distinctions

### A. User's prior OmniLang / OmniLangLib / OmniX design

Prior project discussions described a standalone language/toolchain using `.omni` source files, an intermediate representation called UIR, a compiler, IDE, runtime, libraries, and potential WASM, LLVM, and PHP backends. Later design notes emphasized exact mathematics, deterministic execution, proof-aware workflows, algorithms, and a broad standard library. A separate quantum-software thread described a statevector simulator SDK with gates, measurement, circuits, noise models, and examples such as Bell states, teleportation, and Grover search.

These are **design goals and previous proposals**, not independently verified implementation capabilities. Before importing them into NUDL, preserve the distinction between implemented features, specifications, and aspirational ideas.

### B. Omni: low-level audio DSL

The public project [vitreo12/omni](https://github.com/vitreo12/omni) is a domain-specific language for low-level audio programming. Its README describes a Nim/C toolchain that compiles source into static or shared libraries, with integrations for SuperCollider UGens and Max objects. Its example separates input/output declarations, initialization, and per-sample processing. This suggests useful concepts for NUDL's architecture: explicit execution stages, predictable module interfaces, and native-library interoperability. Audio-specific syntax should not be copied wholesale into a general data language.

### C. Omni Compiler

The public [Omni Compiler project](https://omni-compiler.org/) is a different project. It translates C/Fortran code containing XcalableMP/OpenACC directives into code using runtime calls and a native compiler; XcodeML serves as an intermediate representation. Relevant architectural ideas include a staged translation pipeline, an explicit IR boundary, and separation between language front ends and native back ends. This project is not the same as the user's OmniLang.

### D. Other projects named Omni

Public results also include functional-language experiments and blockchain protocols with the Omni name. They are not assumed to be related to either OmniLang or NUDL. Any further extraction should record exact repository, version, license, and source file.

## 3. Candidate concepts to evaluate for NUDL

| ID | Concept | Potential NUDL use | Caution |
|---|---|---|---|
| OMNI-ARC-001 | Multi-stage compiler pipeline | Lexer → parser → AST → semantic checks → typed IR → execution/code generation | Keep the first implementation small and testable. |
| OMNI-ARC-002 | Explicit intermediate representation | Stable typed representation for transformations and future back ends | Do not promise LLVM/WASM back ends until implemented and tested. |
| OMNI-ARC-003 | Deterministic execution | Repeatable data transformations and reproducible test results | Define ordering, numeric behavior, errors, and environment dependencies. |
| OMNI-ARC-004 | Modular standard library | Separate text, math, collections, data, validation, and I/O APIs | Specify API contracts and versioning before expanding surface area. |
| OMNI-ARC-005 | Native interoperability | Optional adapters or foreign-function boundaries | Imported SQL or data must never be executed as commands by default. |
| OMNI-ARC-006 | Exact mathematics and proof-aware tooling | Explicit numeric types and optional verified constraints | Arbitrary-precision/exact semantics need formal definitions; avoid unsupported proof claims. |
| OMNI-ARC-007 | Domain-specific execution blocks | Possible later extension for streaming or signal-processing workloads | Keep audio/sample-rate concepts outside the core language unless NUDL adopts that domain. |
| OMNI-ARC-008 | Quantum simulation ideas | Optional external package or example domain | A simulator is not quantum hardware; keep this outside NUDL's core runtime. |

## 4. Recommended NUDL adaptation

1. **Keep NUDL independent.** Use research as inspiration; do not merge Omni syntax, implementation code, or identity into NUDL without an explicit compatibility decision.
2. **Define the core first.** Freeze tokens, grammar, AST nodes, type rules, diagnostics, and the initial value model.
3. **Add a small typed IR.** Give each node a documented type and source location. Make IR serialization/versioning a separate decision.
4. **Specify determinism.** Document evaluation order, numeric overflow, float behavior, map/record ordering, error reporting, and I/O effects.
5. **Build conformance tests.** Each accepted grammar feature needs positive and negative parser tests; type rules and runtime behavior need separate tests.
6. **Treat back ends as future milestones.** Add native, WASM, LLVM, or other targets only after the front end and semantics have executable tests.
7. **Keep interoperability explicit and safe.** JSON/CSV/SQL/XLSX adapters should be data adapters. Never execute imported SQL or arbitrary commands as a side effect of parsing.

## 5. Proposed traceability IDs

- `NUDL-RES-OMNI-001`: this research synthesis.
- `NUDL-REQ-OMNI-001`: compiler pipeline must have separately testable phases.
- `NUDL-REQ-OMNI-002`: core evaluation should be deterministic under a documented configuration.
- `NUDL-REQ-OMNI-003`: back ends must not be advertised as supported until a build/test matrix verifies them.
- `NUDL-REQ-OMNI-004`: external data adapters must not implicitly execute imported content.
- `NUDL-REQ-OMNI-005`: every borrowed idea must have a source and license review before code is copied.

These requirement IDs are proposals and should be promoted to normative requirements only after review.

## 6. References

- User's earlier OmniLang/OmniLangLib/OmniX design discussions in prior ChatGPT context (design proposals; not external verification).
- Omni audio DSL: https://github.com/vitreo12/omni
- Omni audio DSL documentation: https://vitreo12.github.io/omni/
- Omni Compiler project: https://omni-compiler.org/
- Omni Compiler source: https://github.com/omni-compiler/omni-compiler

## 7. Research limitations

This is an initial comparison based on publicly discoverable project descriptions and the user's prior design notes. It is not a full source-code audit, a complete extraction of every Omni repository, or a legal opinion. Before implementation reuse, inspect the exact source files, commit/version, dependency licenses, and contribution terms.
