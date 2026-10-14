import { Program, Diagnostic } from './types';

export function analyzeProgram(
  source: string,
  program: Program,
  lexDiagnostics: Diagnostic[],
  parseDiagnostics: Diagnostic[]
): Diagnostic[] {
  const diagnostics: Diagnostic[] = [...lexDiagnostics, ...parseDiagnostics];

  if (!source.trim()) {
    diagnostics.push({
      code: 'E000',
      message: 'Source file is empty.',
      line: 1,
      col: 1,
      severity: 'warning',
    });
    return diagnostics;
  }

  // Check unmatched braces
  const openBraces = (source.match(/\{/g) || []).length;
  const closeBraces = (source.match(/\}/g) || []).length;
  if (openBraces !== closeBraces) {
    diagnostics.push({
      code: 'E102',
      message: `Unmatched curly braces: ${openBraces} '{' vs ${closeBraces} '}'`,
      line: 1,
      col: 1,
      severity: 'error',
    });
  }

  // Check unmatched parentheses
  const openParens = (source.match(/\(/g) || []).length;
  const closeParens = (source.match(/\)/g) || []).length;
  if (openParens !== closeParens) {
    diagnostics.push({
      code: 'E103',
      message: `Unmatched parentheses: ${openParens} '(' vs ${closeParens} ')'`,
      line: 1,
      col: 1,
      severity: 'error',
    });
  }

  // Check main function presence
  const hasMain = program.functions.some((f) => f.name === 'main');
  const hasTopLevelStatements = program.statements.some(
    (s) => s.type === 'ExprStmt' || s.type === 'Binding' || s.type === 'While' || s.type === 'If'
  );

  if (!hasMain && !hasTopLevelStatements && program.functions.length > 0) {
    diagnostics.push({
      code: 'W101',
      message: 'No `fn main() -> ...` entry point found. Top-level functions will not run automatically unless invoked.',
      line: program.functions[0]?.line || 1,
      col: 1,
      severity: 'warning',
    });
  }

  // Check for duplicate function names
  const seenFns = new Set<string>();
  for (const f of program.functions) {
    if (seenFns.has(f.name)) {
      diagnostics.push({
        code: 'E201',
        message: `Duplicate function declaration '${f.name}'`,
        line: f.line || 1,
        col: 1,
        severity: 'error',
      });
    }
    seenFns.add(f.name);
  }

  // Schema & Data validation
  const schemas = new Map(program.schemas.map((s) => [s.name, s]));
  for (const db of program.dataBlocks) {
    const targetSchema = schemas.get(db.schemaName);
    if (!targetSchema) {
      diagnostics.push({
        code: 'W202',
        message: `Data block '${db.name}' references schema '${db.schemaName}' which is not declared in this file.`,
        line: db.line || 1,
        col: 1,
        severity: 'warning',
      });
    } else {
      // Check required fields
      for (const rec of db.records) {
        for (const sf of targetSchema.fields) {
          if (sf.required && rec.values[sf.name] === undefined && sf.defaultValue === undefined) {
            diagnostics.push({
              code: 'E203',
              message: `Record in data '${db.name}' is missing required field '${sf.name}' defined by schema '${targetSchema.name}'.`,
              line: db.line || 1,
              col: 1,
              severity: 'error',
            });
          }
        }
      }
    }
  }

  return diagnostics;
}
