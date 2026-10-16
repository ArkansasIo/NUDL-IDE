# Noodle IDE 1.5 Pre-Alpha Batch Implementation Plan

## Release target
- Product: Noodle IDE (NUDL-IDE)
- Version: 1.5.0-pre-alpha
- Primary device target: Huawei P20 Pro / Android 10 / ARM64
- Development path: Android APK first, then broader Android devices

## Batch 1 — Foundation
1. Version/build metadata and About panel.
2. 25-language registry and language selector.
3. Project/file/workspace metadata.
4. Diagnostics and build status model.
5. Persistent settings schema.

## Batch 2 — Language services
1. Syntax profiles for all registered languages.
2. Formatter/linter adapter interfaces.
3. Compiler/runtime adapter interfaces.
4. Language-specific starter templates.
5. Code generation capability flags so unsupported generators are never presented as complete.

## Batch 3 — Libraries
1. Package-manager registry.
2. Project manifest detection.
3. Dependency browser.
4. Install/update/remove command abstraction.
5. Offline cache and dependency status reporting.

## Batch 4 — Local AI
1. LocalAIAgent controller.
2. Lite/Standard/Heavy model profiles.
3. Model-provider abstraction for WebGPU, WebAssembly and native Android runtimes.
4. Project-aware file search and edit tools.
5. NUDL lexer/parser/analyzer/interpreter tools.
6. Permission gate before file writes, shell commands or dependency changes.

## Batch 5 — Android / P20 Pro
1. Debug APK build.
2. ARM64 compatibility audit.
3. Storage Access Framework integration.
4. LAN/API configuration screen.
5. Logcat/diagnostics panel.
6. Low-memory mode and model-size guardrails.
7. Offline-first startup test.

## Batch 6 — QA
- TypeScript typecheck.
- Vite production build.
- NUDL lexer/parser/analyzer/interpreter tests.
- Android unit tests.
- Android instrumentation tests.
- APK install/launch smoke test.
- P20 Pro manual smoke test.

## Batch scripts
- `scripts/build-p20-pro.bat`: Windows build/validation entry point.
- `scripts/build-p20-pro.sh`: Linux/macOS/CI equivalent.
- `scripts/test-pre-alpha.bat`: local typecheck, test and production build.

## Definition of done for 1.5 pre-alpha
- APK builds successfully.
- NUDL editing/execution remains functional.
- Android API integration remains green.
- 25 languages are selectable with truthful capability states.
- Library/package metadata is available per language.
- AI settings expose Lite/Standard/Heavy without requiring remote AI.
- Unsupported native toolchains are clearly marked instead of being falsely reported as runnable on the P20 Pro.
