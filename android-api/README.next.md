# Implementation summary

The adapter now uses the actual NUDL implementation:

1. `lex()` tokenizes source.
2. `Parser.parse()` creates the program AST.
3. `analyzeProgram()` combines lexical/parser diagnostics with semantic checks.
4. `Interpreter.run()` executes the bounded runtime.
5. `generateCode()` emits the selected target language.

This keeps Android behavior aligned with the browser IDE's NUDL implementation.
