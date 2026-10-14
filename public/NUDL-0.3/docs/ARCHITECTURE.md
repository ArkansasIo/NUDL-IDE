# NUDL Architecture

```text
source.nudl
   |
 lexer
   v
 tokens
   |
 parser
   v
 AST
   |
 semantic analysis
   v
 typed IR
   |\
   | runtime
   |\
   +--> native/WASM code generation (future)
```

The architecture deliberately separates syntax, semantics, runtime execution, and interoperability.
