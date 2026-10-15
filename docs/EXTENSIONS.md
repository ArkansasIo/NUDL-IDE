# NUDL IDE extension packages

The browser IDE has a typed, testable package-format utility in src/nudl/extensions.ts. It validates manifests and safely packages text files for import/export. It does not load native code or execute extension contents.

## Package format

A .nudlext file is UTF-8 JSON with this envelope:

    {
      "format": "NUDL-IDE-extension-package",
      "version": 1,
      "manifest": {
        "id": "example.analytics",
        "name": "Example Analytics Extension",
        "version": "0.1.0",
        "api": "0.1",
        "nudl": "0.3",
        "kind": "runtime",
        "entry": "analytics_plugin",
        "platforms": ["windows", "linux", "macos"],
        "capabilities": [],
        "dependencies": []
      },
      "files": {
        "src/main.nudl": "fn main() { print(\"hello\"); }",
        "README.md": "# Example extension"
      }
    }

The existing native plugin manifest convention is retained: id, name, version, api, nudl, kind, and entry are required. Supported kinds in the IDE package validator are runtime, stdlib, editor, tool, and theme.

## Safety boundaries

- Package paths must be relative forward-slash paths; absolute paths, drive prefixes, backslashes, empty path segments, dot, and dot-dot segments are rejected.
- Maximum package size is 5 MiB, maximum 256 files, and maximum individual text file size is 1 MiB.
- Package contents are text only. This implementation does not extract ZIP archives, load JavaScript dynamically, grant capabilities, or run native executables.
- A valid package is a structurally valid package, not proof that the extension code is trusted, compatible, or executable.
- Browser builds must not treat the .nudlext JSON package as a native executable.

## API

- validateExtensionManifest(value): validate the manifest object.
- createExtensionPackage(manifest, files): build a validated in-memory package.
- validateExtensionPackage(value): validate a parsed package object.
- parseExtensionPackage(source): parse and validate package JSON.
- serializeExtensionPackage(package): validate and serialize to formatted JSON.

Run regression tests with npm test. This format is an IDE transport/package format; native runtime loading and extension sandboxing remain separate implementation work.


## IDE integration

The File menu exposes Import Extension (.nudlext) and Export Extension (.nudlext). Export creates a package from the workspace's text contents. Import validates the package, then adds files under `extensions/<manifest-id>/` to avoid overwriting ordinary workspace paths. Import never executes the package. Blueprint graph metadata is not serialized by this text-only extension package format.
