# Noodle IDE — Pre-Alpha APK 1.5

## Build identity

- Product: Noodle IDE
- Project: NUDL-IDE
- Version: `1.5.0-pre-alpha`
- Channel: `pre-alpha`
- Build date: `2026-10-15`
- Codename: `Noodle`
- Target: Android / P20 Pro first

## Build ID

`NUDL-NOODLE-1.5.0-PRE-ALPHA-TEST1`

## Test number 1

**TEST-001 — P20 Pro smoke build**

Acceptance checks:

1. APK installs successfully on the target Android device.
2. Application launches without a crash.
3. Version/About screen reports `1.5.0-pre-alpha` and build ID `NUDL-NOODLE-1.5.0-PRE-ALPHA-TEST1`.
4. NUDL editor opens and accepts a basic source file.
5. Lexer, parser, analyzer, and interpreter diagnostics can execute.
6. Android API connectivity works against the configured development endpoint.
7. Project/file manager opens without losing workspace state.
8. Language registry loads all 25 configured language profiles.
9. AI settings open without requiring a remote service when Local AI is enabled.
10. APK artifact is archived with the build ID.

## Result states

- `PASS` — all required checks completed.
- `FAIL` — a required check failed; release is blocked.
- `BLOCKED` — test cannot run because a device/toolchain prerequisite is missing.

Test 1 is a smoke/integration gate, not a claim that all 25 external compiler toolchains execute natively on the P20 Pro.
