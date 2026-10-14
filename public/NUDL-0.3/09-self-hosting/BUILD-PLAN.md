# Native Noodle Compiler Build Plan

## Parallel implementation layout

| Concern | Bootstrap | Native Noodle |
|---|---|---|
| Lexer | 03-compiler/src/lexer.cpp | 09-self-hosting/lexer |
| Tokens | 03-compiler/include/nudl/token.hpp | 09-self-hosting/lexer/token.nudl |
| Parser | 03-compiler/src/parser.cpp | 09-self-hosting/parser |
| AST | 03-compiler/include/nudl/ast.hpp | 09-self-hosting/parser/ast.nudl |
| Semantics | future C++/IR | 09-self-hosting/semantic |
| IR | future C++/IR | 09-self-hosting/ir |
| Optimizer | future C++/IR | 09-self-hosting/optimizer |
| Backend | future native backend | 09-self-hosting/backend |
| Driver | 03-compiler/src/main.cpp | 09-self-hosting/driver.nudl |

## Required milestones

1. Extend the Noodle grammar to support modules, records, arrays, indexing, member access, and mutable state.
2. Implement a complete Noodle standard runtime.
3. Implement the lexer in Noodle.
4. Implement the parser in Noodle.
5. Implement semantic analysis.
6. Implement typed Noodle IR.
7. Implement a native backend.
8. Compile the Noodle compiler with the bootstrap compiler.
9. Use the resulting compiler to compile itself.
10. Compare bootstrap and self-hosted compiler outputs and test suites.

The C++ implementation remains the bootstrap until stages 8-10 pass reproducibly.
