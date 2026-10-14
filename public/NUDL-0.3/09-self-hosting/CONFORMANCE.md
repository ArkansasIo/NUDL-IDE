# Self-Hosting Conformance

A self-hosted release requires:

- compiler source is entirely Noodle except explicitly documented host/runtime ABI code
- bootstrap compilation succeeds
- generated native compiler starts and accepts Noodle source
- compiler can compile its own source
- repeated self-compilation produces equivalent semantic output
- language regression tests pass
- diagnostics tests pass
- standard-library tests pass
- backend tests pass

Self-hosting is a measured milestone, not an assumption.
