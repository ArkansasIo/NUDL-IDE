# NUDL Programming-Language Example Corpus

This document defines an original example set inspired by major programming-language families.

These are not copied textbook programs. They are small semantic examples designed to test what NUDL can represent and cross-compile.

## Example matrix

| ID | Language/family | Concept represented | NUDL target idea |
|---|---|---|---|
| EX-C | C | structs, functions, pointers as an explicit boundary | records + FFI |
| EX-CPP | C++ | classes, RAII, templates | records + resource scopes + generics |
| EX-RUST | Rust | ownership and pattern matching | ownership profile + algebraic types |
| EX-GO | Go | packages and goroutines | modules + concurrency library |
| EX-JAVA | Java | classes and interfaces | records + interfaces |
| EX-CS | C# | async and LINQ-style transforms | tasks + data transforms |
| EX-JS | JavaScript | dynamic objects and async | runtime values + async |
| EX-TS | TypeScript | static structural types | typed records |
| EX-PY | Python | scripting and comprehensions | functions + collections |
| EX-RUBY | Ruby | blocks and enumerable transforms | higher-order transforms |
| EX-PHP | PHP | web/data scripting | records + HTTP adapter |
| EX-PERL | Perl | text processing | text pipeline |
| EX-LUA | Lua | embedding and scripting | capability-limited runtime |
| EX-SWIFT | Swift | optionals and value types | Option + records |
| EX-KOTLIN | Kotlin | null safety and coroutines | Option + tasks |
| EX-HASKELL | Haskell | pure functions and algebraic data | pure functions + sum types |
| EX-OCAML | OCaml | pattern matching and modules | pattern matching + modules |
| EX-FSHARP | F# | pipelines and functional records | transformation pipeline |
| EX-ERLANG | Erlang | actors and message passing | actor library |
| EX-ELIXIR | Elixir | processes and supervision | actor/supervision library |
| EX-CLOJURE | Clojure | immutable data and sequences | immutable collections |
| EX-SCHEME | Scheme | higher-order functions | function values |
| EX-PROLOG | Prolog | rules and constraints | validation/rule engine |
| EX-SQL | SQL | declarative query and aggregation | data query IR |
| EX-FORTRAN | Fortran | arrays and numerical loops | numerical arrays |
| EX-JULIA | Julia | numerical functions | Math/Numerics |
| EX-R | R | data frames and statistics | datasets + statistics |
| EX-MATLAB | MATLAB | matrices and vector operations | matrix library |
| EX-BASIC | BASIC | interactive procedural logic | simple statements |
| EX-PASCAL | Pascal | structured records and procedures | records + functions |
| EX-COBOL | COBOL | business records and decimal arithmetic | decimal + schemas |
| EX-SMALLTALK | Smalltalk | objects and message sending | object/module model |
| EX-LISP | Lisp | symbolic data and macros | symbolic values; macros later |
| EX-ZIG | Zig | explicit allocation and systems control | allocator profile |
| EX-ASM | Assembly | registers and machine operations | low-level backend |
| EX-BASH | Bash | shell pipelines | process/IO capability layer |
| EX-POWERSHELL | PowerShell | object pipelines | typed pipeline model |
| EX-CUDA | CUDA | GPU kernels | NUDL GPU profile |
| EX-OPENCL | OpenCL | portable accelerator kernels | NUDL GPU profile |
| EX-SHADER | Shader languages | vertex/fragment computation | graphics profile |

## Universal example

All examples can be reduced to a common semantic operation:

    input -> transform -> result

For example:

    input:  A = 10, B = 20
    operation: add
    result: 30

A NUDL adapter can represent this operation independently of the original syntax.

## Cross-language composition example

    C component
        +
    Rust component
        +
    Python component
        +
    SQL query
        |
        v
    NUDL IR
        |
        v
    Combined NUDL program

The final program can then target another supported backend.

## Required corpus tests

Each language example should eventually have:

- source-language example
- NUDL equivalent
- NUDL IR representation
- expected result
- import test
- semantic-equivalence test
- target compilation test where supported
- negative/unsupported-feature test
- provenance mapping test

## Important scope rule

"Every known programming language" is not a finite practical corpus. Thousands of languages and dialects exist, including historical, experimental, academic, proprietary, and domain-specific languages.

Therefore the corpus uses:

1. major languages,
2. major language families,
3. historically important languages,
4. important paradigms,
5. representative domain-specific languages.

Additional languages can be added without changing the NUDL IR architecture.
