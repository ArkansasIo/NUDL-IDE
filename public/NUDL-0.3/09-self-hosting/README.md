# Noodle Self-Hosting Compiler

This directory contains the Noodle-native implementation of the Noodle compiler.

The project deliberately keeps two implementations side by side:

- `03-compiler/`: C++ bootstrap/reference compiler
- `09-self-hosting/`: Noodle-native compiler implementation

The C++ compiler is the bootstrap seed. The long-term goal is:

    Noodle source
      -> Noodle lexer
      -> Noodle parser
      -> Noodle AST
      -> Noodle semantic analysis
      -> Noodle IR
      -> Noodle optimizer
      -> Noodle backend
      -> native executable

Self-hosting is reached when a previously built Noodle compiler can compile the current Noodle compiler source without requiring C++ for the compiler implementation.

## Bootstrap stages

Stage 0: C++ bootstrap compiler.
Stage 1: Noodle lexer/parser source.
Stage 2: Noodle semantic analyzer and IR generator.
Stage 3: Noodle-native backend.
Stage 4: Noodle compiler compiles itself.
Stage 5: C++ bootstrap becomes optional for normal development.

Until those stages are experimentally verified, the repository must not claim full self-hosting.
