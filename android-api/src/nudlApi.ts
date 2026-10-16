import { analyzeSource, generateSource, interpretSource, lexSource, parseSource } from "../../src/nudl/api";

export interface AndroidNudlRequest {
  source: string;
  filename?: string;
  target?: string;
}

export interface AndroidNudlResponse {
  ok: boolean;
  diagnostics: unknown[];
  result?: unknown;
}

export function lex(request: AndroidNudlRequest): AndroidNudlResponse {
  return { ok: true, diagnostics: [], result: lexSource(request.source) };
}

export function parse(request: AndroidNudlRequest): AndroidNudlResponse {
  return { ok: true, diagnostics: [], result: parseSource(request.source, request.filename ?? "main.nudl") };
}

export function analyze(request: AndroidNudlRequest): AndroidNudlResponse {
  const diagnostics = analyzeSource(request.source, request.filename ?? "main.nudl");
  return { ok: diagnostics.length === 0, diagnostics, result: null };
}

export function run(request: AndroidNudlRequest): AndroidNudlResponse {
  return { ok: true, diagnostics: [], result: interpretSource(request.source, request.filename ?? "main.nudl") };
}

export function generate(request: AndroidNudlRequest): AndroidNudlResponse {
  const target = request.target ?? "typescript";
  return {
    ok: true,
    diagnostics: [],
    result: generateSource(request.source, target, request.filename ?? "main.nudl"),
  };
}
