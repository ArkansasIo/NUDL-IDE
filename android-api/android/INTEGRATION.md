# Android integration flow

```text
Jetpack Compose editor
        |
        v
   NudlViewModel
        |
        v
   NudlRepository
        |
        v
   NudlApiService
        |
     HTTP/JSON
        |
        v
Express NUDL API
        |
        v
NUDL TypeScript pipeline
 lexer -> parser -> analyzer -> interpreter/codegen
```

The compiler remains single-sourced in `src/nudl`; Android is a client rather than a second compiler implementation.
