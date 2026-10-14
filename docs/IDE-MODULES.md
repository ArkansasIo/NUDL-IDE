# NUDL IDE modules and extension points

This document describes module boundaries and the intended status of each capability.

## Source modules

- `src/nudl/`: language front-end, semantic diagnostics, interpreter, code generation and Blueprint conversion.
- `src/components/`: React presentation components and editors.
- `src/api/`: typed HTTP contracts and an optional API client. Endpoints are not assumed to exist.
- `src/features/registry.ts`: declarative feature inventory with status and requirements.
- `src/menus/registry.ts`: menu/command definitions for File, Edit, Build, View and Help.
- `src/tools/toolRegistry.ts`: tool inventory that distinguishes usable tools from planned integrations.
- `src/nudl/workspace.ts`: browser-storage access, workspace validation and import limits.

## API conventions

Responses use `ApiResult<T>`, stable error codes and optional request IDs. Configure a base URL at runtime; never embed server credentials in client source.

The client exposes health and compile request methods as contracts only. A matching backend must be implemented and deployed before those methods can succeed. The current IDE interpreter and source emitter remain local modules and do not call this API automatically.

## Plugin and tool policy

Tool definitions expose explicit availability metadata. The UI should not claim a tool is functional unless its implementation is connected and tested. Native compilation, debugger stepping, collaboration and cloud sync are extension points rather than production services.

## Workspace constraints

Import validation rejects absolute paths, traversal segments, duplicate names, invalid objects, excessive file counts and oversized source. Browser-local storage is best-effort and is not cloud backup.
