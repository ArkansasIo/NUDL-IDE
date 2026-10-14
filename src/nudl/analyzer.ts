import { Program, Diagnostic, TokenKind } from './types';
import { lex } from './lexer';

function diagnostic(code: string, message: string, line = 1, col = 1, severity: Diagnostic['severity'] = 'error'): Diagnostic {
  return { code, message, line, col, severity };
}

export function analyzeProgram(
  source: string,
  program: Program,
  lexDiagnostics: Diagnostic[],
  parseDiagnostics: Diagnostic[]
): Diagnostic[] {
  const diagnostics: Diagnostic[] = [...lexDiagnostics, ...parseDiagnostics];

  if (!source.trim()) {
    diagnostics.push(diagnostic('E000', 'Source file is empty.', 1, 1, 'warning'));
    return diagnostics;
  }

  // Balance syntax tokens, not raw characters: braces inside strings/comments are not delimiters.
  const tokens = lex(source).tokens.filter((t) => t.kind !== TokenKind.Comment && t.kind !== TokenKind.End);
  const pairs: Record<string, string> = {
    [TokenKind.RBrace]: TokenKind.LBrace,
    [TokenKind.RParen]: TokenKind.LParen,
    [TokenKind.RBracket]: TokenKind.LBracket,
  };
  const opening = new Set<string>([TokenKind.LBrace, TokenKind.LParen, TokenKind.LBracket]);
  const stack: Array<{ kind: string; line: number; col: number }> = [];
  for (const token of tokens) {
    if (opening.has(token.kind)) {
      stack.push({ kind: token.kind, line: token.line, col: token.col });
    } else if (token.kind in pairs) {
      const expected = pairs[token.kind];
      const top = stack[stack.length - 1];
      if (!top || top.kind !== expected) {
        diagnostics.push(diagnostic(
          'E104',
          `Unexpected closing delimiter '${token.text}'.`,
          token.line,
          token.col
        ));
      } else {
        stack.pop();
      }
    }
  }
  for (const open of stack) {
    const close = open.kind === TokenKind.LBrace ? '}' : open.kind === TokenKind.LParen ? ')' : ']';
    diagnostics.push(diagnostic(
      'E105',
      `Unclosed delimiter; expected '${close}'.`,
      open.line,
      open.col
    ));
  }

  // Entry-point guidance.
  const hasMain = program.functions.some((f) => f.name === 'main');
  const hasTopLevelStatements = program.statements.some(
    (s) => s.type === 'ExprStmt' || s.type === 'Binding' || s.type === 'While' || s.type === 'If'
  );
  if (!hasMain && !hasTopLevelStatements && program.functions.length > 0) {
    diagnostics.push(diagnostic(
      'W101',
      'No `fn main()` entry point found. Top-level functions will not run automatically unless invoked.',
      program.functions[0]?.line || 1,
      1,
      'warning'
    ));
  }

  // Duplicate function declarations.
  const seenFns = new Set<string>();
  for (const fn of program.functions) {
    if (seenFns.has(fn.name)) {
      diagnostics.push(diagnostic('E201', `Duplicate function declaration '${fn.name}'.`, fn.line || 1, 1));
    }
    seenFns.add(fn.name);
  }

  // Duplicate struct/schema declarations share a namespace in this initial implementation.
  const seenTypes = new Set<string>();
  for (const typeDecl of [...program.structs, ...program.schemas]) {
    if (seenTypes.has(typeDecl.name)) {
      diagnostics.push(diagnostic('E202', `Duplicate type declaration '${typeDecl.name}'.`, typeDecl.line || 1, 1));
    }
    seenTypes.add(typeDecl.name);
  }

  // Validate schema field names and data records.
  const schemas = new Map(program.schemas.map((schema) => [schema.name, schema]));
  for (const schema of program.schemas) {
    const fields = new Set<string>();
    for (const field of schema.fields) {
      if (fields.has(field.name)) {
        diagnostics.push(diagnostic(
          'E206',
          `Duplicate field '${field.name}' in schema '${schema.name}'.`,
          schema.line || 1,
          1
        ));
      }
      fields.add(field.name);
    }
  }

  for (const data of program.dataBlocks) {
    const schema = schemas.get(data.schemaName);
    if (!schema) {
      diagnostics.push(diagnostic(
        'W202',
        `Data block '${data.name}' references schema '${data.schemaName}' which is not declared in this file.`,
        data.line || 1,
        1,
        'warning'
      ));
      continue;
    }

    const knownFields = new Set(schema.fields.map((field) => field.name));
    for (const record of data.records) {
      for (const field of schema.fields) {
        if (field.required && record.values[field.name] === undefined && field.defaultValue === undefined) {
          diagnostics.push(diagnostic(
            'E203',
            `Record in data '${data.name}' is missing required field '${field.name}' defined by schema '${schema.name}'.`,
            data.line || 1,
            1
          ));
        }
      }
      for (const fieldName of Object.keys(record.values)) {
        if (!knownFields.has(fieldName)) {
          diagnostics.push(diagnostic(
            'E204',
            `Field '${fieldName}' is not declared in schema '${schema.name}'.`,
            data.line || 1,
            1
          ));
        }
      }
    }
  }

  return diagnostics;
}
