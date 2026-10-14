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
