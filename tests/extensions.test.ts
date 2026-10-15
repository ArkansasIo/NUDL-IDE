import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createExtensionPackage,
  parseExtensionPackage,
  serializeExtensionPackage,
  validateExtensionManifest,
  validateExtensionPackage,
  type ExtensionManifest,
} from '../src/nudl/extensions.ts';

const manifest: ExtensionManifest = {
  id: 'example.analytics',
  name: 'Example Analytics Extension',
  version: '0.1.0',
  api: '0.1',
  nudl: '0.3',
  kind: 'runtime',
  entry: 'analytics_plugin',
  platforms: ['windows', 'linux', 'macos'],
  capabilities: [],
  dependencies: [],
};

test('validates the manifest shape used by the vendored NUDL examples', () => {
  const result = validateExtensionManifest(manifest);
  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, []);
});

test('rejects a manifest with a missing required field or unsupported kind', () => {
  assert.equal(validateExtensionManifest({ ...manifest, entry: '' }).valid, false);
  assert.ok(validateExtensionManifest({ ...manifest, kind: 'unknown' }).errors.some((e) => e.includes('manifest.kind')));
});

test('creates, serializes, and parses an extension package', () => {
  const bundle = createExtensionPackage(manifest, {
    'src/main.nudl': 'fn main() { print("hello extension"); }',
    'README.md': '# Example extension',
  });
  const serialized = serializeExtensionPackage(bundle);
  const parsed = parseExtensionPackage(serialized);
  assert.equal(parsed.valid, true);
  assert.equal(parsed.package?.manifest.id, manifest.id);
  assert.equal(parsed.package?.files['src/main.nudl'], 'fn main() { print("hello extension"); }');
});

test('rejects path traversal and absolute paths', () => {
  assert.throws(() => createExtensionPackage(manifest, { '../escape.nudl': 'bad' }), /Unsafe extension file path/);
  assert.throws(() => createExtensionPackage(manifest, { '/root.nudl': 'bad' }), /Unsafe extension file path/);
});

test('rejects malformed JSON, wrong format, and unsupported package version', () => {
  assert.equal(parseExtensionPackage('{broken').valid, false);
  assert.equal(validateExtensionPackage({ format: 'wrong', version: 2, manifest, files: { 'main.nudl': '' } }).valid, false);
});

test('rejects non-text file entries and oversized source files', () => {
  assert.equal(validateExtensionPackage({
    format: 'NUDL-IDE-extension-package',
    version: 1,
    manifest,
    files: { 'main.nudl': 42 },
  }).valid, false);
  assert.throws(() => createExtensionPackage(manifest, { 'main.nudl': 'x'.repeat(1024 * 1024 + 1) }), /1 MiB/);
});

test('rejects packages with no files', () => {
  assert.throws(() => createExtensionPackage(manifest, {}), /at least one file/);
});
