import test from 'node:test';
import assert from 'node:assert/strict';
import { lex } from '../src/nudl/lexer.ts';
import { Parser } from '../src/nudl/parser.ts';
import { Interpreter } from '../src/nudl/interpreter.ts';
import { analyzeProgram } from '../src/nudl/analyzer.ts';
import { generateCode } from '../src/nudl/codegen.ts';

function compile(source: string) {
  const lexical = lex(source);
  const parsed = new Parser(lexical.tokens).parse();
  const lexDiagnostics = lexical.diagnostics.map((d) => ({
    code: 'LEX',
    message: d.message,
    line: d.line,
    col: d.col,
    severity: 'error' as const,
  }));
  return {
    lexical,
    parsed,
    diagnostics: analyzeProgram(source, parsed.program, lexDiagnostics, parsed.diagnostics),
  };
}

test('lexer recognizes keywords, numbers, strings, and comments', () => {
  const { tokens, diagnostics } = lex('let count = 42; // note\nprint("ok");');
  assert.equal(diagnostics.length, 0);
  assert.ok(tokens.some((t) => t.kind === 'Keyword' && t.text === 'let'));
  assert.ok(tokens.some((t) => t.kind === 'Number' && t.text === '42'));
  assert.ok(tokens.some((t) => t.kind === 'String' && t.text === 'ok'));
  assert.ok(tokens.some((t) => t.kind === 'Comment'));
});

test('parser and interpreter execute a simple main function', () => {
  const source = 'fn main() { let total = 2 + 3; print(total); }';
  const { parsed, diagnostics } = compile(source);
  assert.equal(diagnostics.filter((d) => d.severity === 'error').length, 0);
  const result = new Interpreter(parsed.program).run();
  assert.equal(result.error, undefined);
  assert.deepEqual(result.output, ['5']);
});

test('semantic analysis reports missing required schema fields', () => {
  const source = 'schema Person { name: string required, age: i64 } data people: Person { { age: 10 } }';
  const { diagnostics } = compile(source);
  assert.ok(diagnostics.some((d) => d.code === 'E203' && d.message.includes("missing required field 'name'")));
});

test('code generation returns the expected target filename and output', () => {
  const { parsed } = compile('fn main() { print("hello"); }');
  const result = generateCode(parsed.program, 'Python');
  assert.equal(result.filename, 'main.py');
  assert.match(result.code, /print\("hello"\)/);
});

test('lexer reports unterminated strings', () => {
  const { diagnostics } = lex('print("unfinished)');
  assert.ok(diagnostics.some((d) => d.message.toLowerCase().includes('unterminated string')));
});

test('delimiter analysis ignores braces and parentheses inside strings and comments', () => {
  const source = 'fn main() { print("} ) ]"); // } ) ]\n }';
  const { diagnostics } = compile(source);
  assert.equal(diagnostics.filter((d) => d.code === 'E104' || d.code === 'E105').length, 0);
});

test('semantic analysis reports unknown fields in schema-backed data', () => {
  const source = 'schema Person { name: string required } data people: Person { { name: "Ada", nickname: "A" } }';
  const { diagnostics } = compile(source);
  assert.ok(diagnostics.some((d) => d.code === 'E204' && d.message.includes("Field 'nickname'")));
});

test('semantic analysis reports duplicate schema fields', () => {
  const source = 'schema Person { name: string, name: text }';
  const { diagnostics } = compile(source);
  assert.ok(diagnostics.some((d) => d.code === 'E206'));
});


import {
  validateWorkspaceFiles,
  MAX_WORKSPACE_FILES,
  MAX_FILE_CONTENT_LENGTH,
} from '../src/nudl/workspace.ts';

test('workspace validation normalizes relative paths and fills safe defaults', () => {
  const files = validateWorkspaceFiles([
    { name: 'src\\\\main.nudl', content: 'fn main() {}' },
  ]);
  assert.equal(files[0].name, 'src/main.nudl');
  assert.equal(files[0].isBlueprint, false);
  assert.equal(files[0].readOnly, false);
});

test('workspace validation rejects absolute paths and traversal', () => {
  assert.throws(() => validateWorkspaceFiles([{ name: '../secrets.txt', content: 'x' }]), /Invalid relative path/);
  assert.throws(() => validateWorkspaceFiles([{ name: '/root.nudl', content: 'x' }]), /Invalid relative path/);
  assert.throws(() => validateWorkspaceFiles([{ name: 'C:\\\\temp\\\\x.nudl', content: 'x' }]), /Invalid relative path/);
});

test('workspace validation rejects duplicate names without case sensitivity', () => {
  assert.throws(() => validateWorkspaceFiles([
    { name: 'Main.nudl', content: '' },
    { name: 'main.NUDL', content: '' },
  ]), /Duplicate filename/);
});

test('workspace validation rejects invalid envelopes and empty workspaces', () => {
  assert.throws(() => validateWorkspaceFiles({ format: 'other', files: [] }), /Unsupported/);
  assert.throws(() => validateWorkspaceFiles([]), /at least one file/);
});

test('workspace validation enforces file count and source-size limits', () => {
  assert.throws(() => validateWorkspaceFiles(
    Array.from({ length: MAX_WORKSPACE_FILES + 1 }, (_, i) => ({ name: `file-${i}.nudl`, content: '' }))
  ), /at most/);
  assert.throws(() => validateWorkspaceFiles([{ name: 'large.nudl', content: 'x'.repeat(MAX_FILE_CONTENT_LENGTH + 1) }]), /content limit/);
});
