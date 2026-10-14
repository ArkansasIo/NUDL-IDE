# Contributing to Noodle

## Workflow

1. Open or select an issue.
2. Identify the owning subsystem.
3. Describe the proposed behavior and compatibility impact.
4. Implement the smallest coherent change.
5. Add tests.
6. Update specification/documentation.
7. Run the relevant build and test suites.
8. Request review from the subsystem owner.

## Areas

compiler, runtime, backends, IDE, mathematics, standard-library, interoperability, testing, documentation, education, infrastructure.

## Pull requests

A PR should explain:
- problem
- design
- implementation
- tests
- compatibility impact
- performance impact
- known limitations

Avoid claiming a backend, algorithm, or language feature is implemented until it has executable verification.

## Commit discipline

Prefer focused commits with imperative messages. Keep generated artifacts separate from source changes when practical.
