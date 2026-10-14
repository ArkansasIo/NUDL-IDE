# Noodle Target Matrix

| Target | Output | Typical final toolchain | Status |
|---|---|---|---|
| C | .c/.h | GCC/Clang/MSVC-compatible C toolchains | planned |
| C++ | .cpp/.hpp | GCC/Clang/MSVC | planned |
| Rust | .rs | rustc/Cargo | planned |
| Python | .py | CPython/PyPy | planned |
| JavaScript | .js | Node.js/browser runtimes | planned |
| TypeScript | .ts | tsc/Bun/Deno toolchains | planned |
| C# | .cs | .NET SDK | planned |
| Java | .java | javac/JVM | planned |
| Swift | .swift | Swift compiler | planned |
| WebAssembly | .wat/.wasm | WASM toolchain | research |
| Native x86-64 | object/executable | platform linker | research |
| Native AArch64 | object/executable | platform linker | research |
| Native RISC-V | object/executable | platform linker | research |

A matrix entry is not an implementation claim. It becomes implemented only after backend tests produce verified target artifacts.
