# Noodle Cross-Language Interoperability

Noodle is designed as a source language and typed intermediate representation, not as a closed ecosystem.

Pipeline:

Noodle source
-> lexer/parser
-> semantic analysis
-> typed Noodle IR
-> target lowering
-> target source/IR
-> target compiler/toolchain
-> executable/library/package

Primary targets:
- C
- C++
- Rust
- Python
- JavaScript
- TypeScript
- C#
- Java
- Swift
- WebAssembly
- native CPU backends

A target backend must document semantic gaps, ownership/memory rules, numeric behavior, exceptions/errors, concurrency, ABI, and unsupported language features.
