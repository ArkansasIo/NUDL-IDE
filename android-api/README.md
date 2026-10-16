# NUDL Android API Integration

This directory defines the Android-facing API boundary for NUDL IDE.

## Purpose

Expose the NUDL language pipeline to an Android client without duplicating compiler logic:

- lexical analysis
- parsing
- semantic diagnostics
- bounded interpretation
- source generation
- workspace operations
- Blueprint graph operations

## API contract

### `POST /api/v1/nudl/lex`
Tokenizes NUDL source.

### `POST /api/v1/nudl/parse`
Parses NUDL source and returns the AST.

### `POST /api/v1/nudl/analyze`
Runs semantic diagnostics.

### `POST /api/v1/nudl/run`
Runs the bounded interpreter.

### `POST /api/v1/nudl/generate`
Generates source for a requested target.

### `GET /api/v1/health`
Returns service health and NUDL API version.

## Request model

```json
{
  "source": "...",
  "filename": "main.nudl",
  "target": "typescript"
}
```

## Response model

```json
{
  "ok": true,
  "diagnostics": [],
  "result": null
}
```

The Android application should treat generated source as text and should not assume that a target compiler is available on the device.
