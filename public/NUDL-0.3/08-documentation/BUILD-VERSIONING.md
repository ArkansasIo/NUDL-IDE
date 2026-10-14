# Noodle Build and Versioning

## Version

Noodle uses MAJOR.MINOR.PATCH project versions. Development releases may append -dev.

## Build number

A build number identifies a particular generated build within a development or release stream.

Example:
Version: 0.3.0-dev
Build number: 42
Build ID: NOODLE-0.3-DEV-0042

## Build ID

Format:

NOODLE-{language-version}-{channel}-{build-number}

Examples:
- NOODLE-0.3-DEV-0001
- NOODLE-0.3-CI-0042
- NOODLE-0.3-RC-0100
- NOODLE-1.0-RELEASE-0001

## Build name

Build names are descriptive human-readable artifact labels.

## Credits

Build credits must represent actual contributors, not hypothetical team members.

## Platform support

Noodle targets native execution on Windows, Linux, and macOS.

Noodle Make (NMake) is the native build-system direction. It must be capable of selecting platform-specific toolchains, compiling the Noodle compiler and runtime, running tests, and producing platform-native artifacts on all three operating systems.

## Release identity

Every release artifact should contain product, version, build number, build ID, Git revision, target, architecture, toolchain, dependencies, and reproducibility metadata.

The language version and compiler version remain separate compatibility identifiers.

## Native Noodle build system

The planned native build system is Noodle Make (NMake). It should describe source modules, targets, dependencies, generated artifacts, platform targets, compiler options, tests, and packaging in Noodle syntax. CMake remains an external bootstrap and compatibility build system until NMake can build the compiler itself.
