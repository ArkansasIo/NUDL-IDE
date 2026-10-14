# Noodle Build Information

## Current development build

- Product: Noodle
- Project: Noodle 0.3
- Build ID: NOODLE-0.3-DEV-0001
- Build name: Noodle 0.3 Developer Build
- Version: 0.3.0-dev
- Build number: 1
- Release channel: Development
- Language version: Noodle 0.3
- Primary implementation: Noodle
- Build system: Noodle Make (NMake)
- Repository: ArkansasIo/NUDL-0.3
- Primary branch: main

## Development credits

Engineering areas:
- Language architecture
- Compiler
- Runtime
- Backends
- IDE and developer tools
- Mathematics and algorithms
- Standard library and interoperability
- Testing and verification
- Documentation and education
- Release engineering and infrastructure

Individual credits are added only for actual contributors.

## Platform targets

Noodle is intended to run natively on:
- Windows
- Linux
- macOS

The native build system must support all three platforms and select the appropriate compiler, linker, libraries, packaging format, and runtime integration for each target.

## Reproducibility metadata

Production builds should record Git commit SHA, working-tree state, compiler/version, Noodle Make version, operating system, CPU architecture, target backend, build type, compiler flags, dependencies, UTC timestamp, and source-tree hash.

Machine-readable metadata belongs in build/manifest.json.

C++23 remains a bootstrap implementation technology, not the identity of the Noodle build.
