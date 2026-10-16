# Android API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/v1/health` | Service health |
| POST | `/api/v1/nudl/lex` | Tokenize source |
| POST | `/api/v1/nudl/parse` | Build AST |
| POST | `/api/v1/nudl/analyze` | Semantic/syntax diagnostics |
| POST | `/api/v1/nudl/run` | Execute bounded interpreter |
| POST | `/api/v1/nudl/generate` | Generate target-language source |

All NUDL operations accept JSON with `source`, optional `filename`, and optional `target`.
