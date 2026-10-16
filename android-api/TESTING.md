# Testing

Run the existing test suite:

```bash
npm test
```

The Android API adapter tests are in `tests/android-api.test.ts` and exercise lexing, parsing, diagnostics, interpreter execution, and TypeScript generation.

Start the API locally with:

```bash
npm run api:dev
```

Then point the Android emulator at `http://10.0.2.2:8787/`.
