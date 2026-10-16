import { analyzeProgram } from "../../src/nudl/analyzer";
import { generateCode } from "../../src/nudl/codegen";
import { Interpreter } from "../../src/nudl/interpreter";
import { lex } from "../../src/nudl/lexer";
import { Parser } from "../../src/nudl/parser";
import { Diagnostic, TargetLanguage } from "../../src/nudl/types";

export interface AndroidNudlRequest {
  source: string;
  filename?: string;
  target?: TargetLanguage;
}

export interface AndroidNudlResponse<T = unknown> {
  ok: boolean;
  diagnostics: Diagnostic[];
  result?: T;
}

export function parseRequest(source: string) {
  const lexical = lex(source);
  const parser = new Parser(lexical.tokens);
  const parsed = parser.parse();
  const diagnostics = [...lexical.diagnostics.map(toDiagnostic), ...parsed.diagnostics];
  return { lexical, parsed, diagnostics };
}

function toDiagnostic(diagnostic: { line: number; col: number; message: string }): Diagnostic {
  return {
    code: "L100",
    message: diagnostic.message,
    line: diagnostic.line,
    col: diagnostic.col,
    severity: "error",
  };
}

export function lexRequest(request: AndroidNudlRequest): AndroidNudlResponse {
  const result = lex(request.source);
  const diagnostics = result.diagnostics.map(toDiagnostic);
  return { ok: diagnostics.every((d) => d.severity !== "error"), diagnostics, result };
}

export function parseRequestApi(request: AndroidNudlRequest): AndroidNudlResponse {
  const { lexical, parsed, diagnostics } = parseRequest(request.source);
  return {
    ok: diagnostics.every((d) => d.severity !== "error"),
    diagnostics,
    result: { tokens: lexical.tokens, program: parsed.program },
  };
}

export function analyzeRequest(request: AndroidNudlRequest): AndroidNudlResponse {
  const { lexical, parsed, diagnostics: syntaxDiagnostics } = parseRequest(request.source);
  const diagnostics = analyzeProgram(request.source, parsed.program, lexical.diagnostics.map(toDiagnostic), parsed.diagnostics);
  return {
    ok: diagnostics.every((d) => d.severity !== "error"),
    diagnostics,
    result: { program: parsed.program, tokenCount: lexical.tokens.length, syntaxDiagnostics },
  };
}

export function runRequest(request: AndroidNudlRequest): AndroidNudlResponse {
  const { lexical, parsed } = parseRequest(request.source);
  const diagnostics = analyzeProgram(request.source, parsed.program, lexical.diagnostics.map(toDiagnostic), parsed.diagnostics);
  if (diagnostics.some((d) => d.severity === "error")) {
    return { ok: false, diagnostics };
  }
  const result = new Interpreter(parsed.program).run();
  return { ok: !result.error, diagnostics, result };
}

export function generateRequest(request: AndroidNudlRequest): AndroidNudlResponse {
  const target = request.target ?? "TypeScript";
  const { lexical, parsed } = parseRequest(request.source);
  const diagnostics = analyzeProgram(request.source, parsed.program, lexical.diagnostics.map(toDiagnostic), parsed.diagnostics);
  if (diagnostics.some((d) => d.severity === "error")) {
    return { ok: false, diagnostics };
  }
  const result = generateCode(parsed.program, target);
  return { ok: true, diagnostics, result };
}
