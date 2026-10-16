# Integration status

Implemented on `feature/android-api-integration`:

- REST API adapter wired directly to the existing NUDL lexer, parser, analyzer, interpreter, and code generator.
- Health endpoint.
- Lex, parse, analyze, run, and generate endpoints.
- OpenAPI contract.
- Android Retrofit service, models, repository, target constants, and editor state/view model scaffold.
- Automated API adapter tests.

Not yet included in this branch:

- A complete standalone Android Studio project wrapper.
- Authentication and remote workspace persistence.
- Production deployment configuration.
- A native Kotlin implementation of the NUDL compiler.

The design intentionally reuses the repository's TypeScript compiler/runtime rather than creating a second compiler implementation.
