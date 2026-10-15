export type ExtensionKind = 'runtime' | 'stdlib' | 'editor' | 'tool' | 'theme';

export interface ExtensionManifest {
  id: string;
  name: string;
  version: string;
  api: string;
  nudl: string;
  kind: ExtensionKind;
  entry: string;
  platforms?: string[];
  capabilities?: string[];
  dependencies?: string[];
}

export interface ExtensionPackage {
  format: 'NUDL-IDE-extension-package';
  version: 1;
  manifest: ExtensionManifest;
  files: Record<string, string>;
}

export interface ExtensionValidation {
  valid: boolean;
  errors: string[];
  warnings: string[];
  package?: ExtensionPackage;
}

export const EXTENSION_PACKAGE_LIMITS = {
  maxBytes: 5 * 1024 * 1024,
  maxFiles: 256,
  maxFileBytes: 1024 * 1024,
} as const;

const MANIFEST_KEYS = new Set([
  'id', 'name', 'version', 'api', 'nudl', 'kind', 'entry',
  'platforms', 'capabilities', 'dependencies',
]);
const KINDS = new Set<ExtensionKind>(['runtime', 'stdlib', 'editor', 'tool', 'theme']);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function safeRelativePath(path: string): boolean {
  if (!path || path.length > 240 || path.startsWith('/') || path.includes('\\') || /^[a-zA-Z]:/.test(path)) {
    return false;
  }
  const parts = path.split('/');
  return parts.every((part) => part.length > 0 && part !== '.' && part !== '..' && !/[\u0000-\u001f]/.test(part));
}

function stringArray(value: unknown, field: string, errors: string[]): void {
  if (value === undefined) return;
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string' || !item.trim())) {
    errors.push('manifest.' + field + ' must be an array of non-empty strings.');
  }
}

export function validateExtensionManifest(value: unknown): ExtensionValidation {
  const errors: string[] = [];
  const warnings: string[] = [];
  if (!isRecord(value)) {
    return { valid: false, errors: ['manifest must be a JSON object.'], warnings };
  }

  for (const key of Object.keys(value)) {
    if (!MANIFEST_KEYS.has(key)) errors.push('manifest contains unsupported field "' + key + '".');
  }
  for (const key of ['id', 'name', 'version', 'api', 'nudl', 'kind', 'entry']) {
    if (typeof value[key] !== 'string' || !value[key].trim()) {
      errors.push('manifest.' + key + ' is required and must be a non-empty string.');
    }
  }

  if (typeof value.id === 'string' && !/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,127}$/.test(value.id)) {
    errors.push('manifest.id must use letters, numbers, dots, underscores, or hyphens.');
  }
  if (typeof value.version === 'string' && !/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(value.version)) {
    errors.push('manifest.version must be a semantic version such as 0.1.0.');
  }
  if (typeof value.kind === 'string' && !KINDS.has(value.kind as ExtensionKind)) {
    errors.push('manifest.kind must be runtime, stdlib, editor, tool, or theme.');
  }
  for (const field of ['platforms', 'capabilities', 'dependencies']) {
    stringArray(value[field], field, errors);
  }
  if (Array.isArray(value.capabilities) && value.capabilities.length === 0) {
    warnings.push('The extension declares no capabilities; it will have no host privileges by default.');
  }

  if (errors.length) return { valid: false, errors, warnings };
  return { valid: true, errors, warnings };
}

export function createExtensionPackage(
  manifest: ExtensionManifest,
  files: Record<string, string>,
): ExtensionPackage {
  const manifestCheck = validateExtensionManifest(manifest);
  if (!manifestCheck.valid) {
    throw new Error('Invalid extension manifest: ' + manifestCheck.errors.join(' '));
  }
  const entries = Object.entries(files);
  if (entries.length === 0) throw new Error('An extension package must contain at least one file.');
  if (entries.length > EXTENSION_PACKAGE_LIMITS.maxFiles) {
    throw new Error('An extension package may contain at most ' + EXTENSION_PACKAGE_LIMITS.maxFiles + ' files.');
  }

  const safeFiles: Record<string, string> = {};
  for (const [path, content] of entries) {
    if (!safeRelativePath(path)) throw new Error('Unsafe extension file path: "' + path + '".');
    if (typeof content !== 'string') throw new Error('Extension file "' + path + '" must contain text.');
    if (new TextEncoder().encode(content).byteLength > EXTENSION_PACKAGE_LIMITS.maxFileBytes) {
      throw new Error('Extension file "' + path + '" exceeds the 1 MiB file limit.');
    }
    safeFiles[path] = content;
  }

  const result: ExtensionPackage = {
    format: 'NUDL-IDE-extension-package',
    version: 1,
    manifest,
    files: safeFiles,
  };
  const byteLength = new TextEncoder().encode(JSON.stringify(result)).byteLength;
  if (byteLength > EXTENSION_PACKAGE_LIMITS.maxBytes) {
    throw new Error('Extension package exceeds the 5 MiB package limit.');
  }
  return result;
}

export function validateExtensionPackage(value: unknown): ExtensionValidation {
  const errors: string[] = [];
  const warnings: string[] = [];
  if (!isRecord(value)) return { valid: false, errors: ['package must be a JSON object.'], warnings };
  if (value.format !== 'NUDL-IDE-extension-package') errors.push('Unsupported extension package format.');
  if (value.version !== 1) errors.push('Unsupported extension package version; expected 1.');

  const manifestCheck = validateExtensionManifest(value.manifest);
  errors.push(...manifestCheck.errors);
  warnings.push(...manifestCheck.warnings);

  if (!isRecord(value.files)) {
    errors.push('package.files must be an object mapping relative paths to text content.');
  } else {
    const entries = Object.entries(value.files);
    if (entries.length === 0) errors.push('Package must contain at least one file.');
    if (entries.length > EXTENSION_PACKAGE_LIMITS.maxFiles) errors.push('Package exceeds the ' + EXTENSION_PACKAGE_LIMITS.maxFiles + '-file limit.');
    for (const [path, content] of entries) {
      if (!safeRelativePath(path)) errors.push('Unsafe extension file path: "' + path + '".');
      if (typeof content !== 'string') errors.push('Extension file "' + path + '" must contain text.');
      else if (new TextEncoder().encode(content).byteLength > EXTENSION_PACKAGE_LIMITS.maxFileBytes) {
        errors.push('Extension file "' + path + '" exceeds the 1 MiB file limit.');
      }
    }
  }

  try {
    if (new TextEncoder().encode(JSON.stringify(value)).byteLength > EXTENSION_PACKAGE_LIMITS.maxBytes) {
      errors.push('Extension package exceeds the 5 MiB package limit.');
    }
  } catch {
    errors.push('Package cannot be serialized as JSON.');
  }

  const valid = errors.length === 0;
  return {
    valid,
    errors,
    warnings,
    package: valid ? value as unknown as ExtensionPackage : undefined,
  };
}

export function parseExtensionPackage(source: string): ExtensionValidation {
  if (new TextEncoder().encode(source).byteLength > EXTENSION_PACKAGE_LIMITS.maxBytes) {
    return { valid: false, errors: ['Extension package exceeds the 5 MiB package limit.'], warnings: [] };
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(source);
  } catch {
    return { valid: false, errors: ['Extension package is not valid JSON.'], warnings: [] };
  }
  return validateExtensionPackage(parsed);
}

export function serializeExtensionPackage(extensionPackage: ExtensionPackage): string {
  const validation = validateExtensionPackage(extensionPackage);
  if (!validation.valid) throw new Error('Invalid extension package: ' + validation.errors.join(' '));
  return JSON.stringify(extensionPackage, null, 2);
}
