# NUDL-IDE Workspace Format

The IDE exports workspaces as JSON so a project can be backed up or transferred. The workspace format is a tool interchange format, not NUDL source syntax.

## User workflow

1. Create or open files in the IDE.
2. Use File → Export Workspace (.json) to download a portable workspace.
3. Keep a copy outside browser storage.
4. Use File → Import Workspace (.json) to restore it.

Browser local storage is not a durable backup. Clearing site data can remove locally saved work.

## Validation expectations

Before replacing the active workspace, imports should validate:
- The top-level workspace version and expected structure.
- A non-empty file collection.
- Relative file paths only; reject absolute paths and traversal such as ../.
- Unique file names/paths.
- Valid file content and blueprint graph structures.
- Reasonable file-count and total-size limits.

An invalid import should report a clear error and leave the currently open workspace unchanged.

## Versioning

Future workspace changes should include an explicit schema version and a migration strategy. Unknown major versions should be rejected safely; compatible minor additions may be ignored only when the parser can prove that doing so will not lose user data.

## Privacy

Workspace JSON may contain all source code and graph data in the project. Treat it as user-owned content and do not upload it automatically. Optional AI features must not transmit workspace contents without an explicit user action and clear disclosure.
