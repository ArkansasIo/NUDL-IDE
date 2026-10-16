# NUDL IDE Version Information

## Product
- Name: NUDL IDE
- Language: NUDL 0.3
- Product line: NUDL IDE 0.4 development series
- Current integration branch: `feature/android-api-integration`
- Platform targets: Web/PWA, Android 10+, iOS 15+
- Architecture: TypeScript/React IDE + NUDL engine + REST API + platform clients

## Version policy

- `0.4.x`: mobile/API integration, multi-language tooling, project/workspace improvements, AI agent foundations.
- `0.5.x`: local AI agent, expanded language tooling, package/library manager, debugger and build orchestration.
- `1.0.x`: stable IDE release after mobile, AI, language adapters, security, persistence, and regression suites are complete.

## Planned language matrix

NUDL remains the native language. The IDE will additionally provide editing, syntax support, project templates, diagnostics, and adapter/toolchain integration for at least 25 programming languages:

1. NUDL
2. C
3. C++
4. C#
5. Rust
6. Python
7. JavaScript
8. TypeScript
9. Java
10. Kotlin
11. Swift
12. Go
13. Dart
14. Ruby
15. PHP
16. Lua
17. R
18. Julia
19. Fortran
20. Pascal
21. Assembly
22. SQL
23. HTML
24. CSS
25. WebAssembly/WAT

A language adapter must declare file extensions, lexer/highlighter, formatter, diagnostics, compiler/interpreter command, package manager, debugger capability, and platform support. Missing external toolchains must be reported rather than silently simulated.

## Mobile modes

### NUDL AI Lite
Small quantized/local model configuration for supported mobile hardware.

### NUDL AI Heavy
Larger local model configuration for devices with sufficient RAM/compute. The model package is replaceable and the agent runtime remains shared.

## Build identity

The UI should expose product version, build channel, commit SHA, target platform, NUDL engine version, API version, and AI-agent version in **Help > About > Build Information**.
