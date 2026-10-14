# NUDL-IDE Language Support Matrix

This matrix distinguishes a UI option or code emitter from a feature that is fully implemented and verified.

| Capability | Browser IDE status | Verification needed |
|---|---|---|
| Lexing | Implemented | Edge-case regression fixtures |
| Parsing | Implemented for current grammar subset | Recovery, grammar parity, malformed inputs |
| Diagnostics | Implemented baseline analyzer | Type/name analysis and precise source ranges |
| Interpreter | Implemented with step limit | Scope, recursion, edge cases, runtime parity |
| Blueprint editor | Present | Node evaluation and generated NUDL round-trip tests |
| Workspace import/export | Present | Versioning, malformed data, large files |
| C++ generation | Emitter present | Compile generated programs in CI |
| C generation | Emitter present | Compile generated programs in CI |
| Rust generation | Emitter present | Compile generated programs in CI |
| Python generation | Emitter present | Run generated programs in CI |
| JavaScript / TypeScript | Emitters present | Execute/type-check generated programs in CI |
| C# / Java / Swift | Emitters present | Native toolchain conformance tests |
| WebAssembly text | Emitter present | Validate and instantiate emitted modules |
| Native C++ compiler integration | Reference source is vendored | Explicit service/worker integration and parity suite |
| JSON / CSV / SQL / spreadsheet adapters | Design targets | Implement explicit import/export adapters |

A row marked "emitter present" must not be interpreted as a guarantee that every source program generates valid, equivalent target code.
