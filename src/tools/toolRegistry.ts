export type ToolCategory = 'source' | 'analysis' | 'workspace' | 'generation' | 'integration';

export interface ToolDefinition {
  id: string;
  label: string;
  category: ToolCategory;
  description: string;
  available: boolean;
  command?: string;
}

export const TOOL_REGISTRY: ToolDefinition[] = [
  { id: 'lexer', label: 'Token Inspector', category: 'analysis', description: 'Inspect tokens produced by the NUDL lexer.', available: true, command: 'tokens' },
  { id: 'ast', label: 'AST Inspector', category: 'analysis', description: 'Inspect the parsed syntax tree summary.', available: true, command: 'ast' },
  { id: 'diagnostics', label: 'Diagnostics', category: 'analysis', description: 'Count errors and warnings for the active source.', available: true, command: 'check' },
  { id: 'interpreter', label: 'Interpreter', category: 'source', description: 'Run source in the in-browser interpreter.', available: true, command: 'run' },
  { id: 'formatter', label: 'Whitespace Formatter', category: 'source', description: 'Remove trailing whitespace from source lines.', available: true },
  { id: 'workspace-export', label: 'Workspace Export', category: 'workspace', description: 'Download all open files as a portable JSON workspace.', available: true },
  { id: 'target-emitter', label: 'Target Source Emitter', category: 'generation', description: 'Generate target-language source text.', available: true },
  { id: 'native-build', label: 'Native Build Runner', category: 'integration', description: 'Invoke a local/native compiler or remote build runner.', available: false },
  { id: 'formatter-full', label: 'Syntax-aware Formatter', category: 'source', description: 'Parse-aware formatting with stable style rules.', available: false },
  { id: 'debugger', label: 'Step Debugger', category: 'analysis', description: 'Pause, step and inspect interpreter frames.', available: false },
];

export function getToolsByCategory(category: ToolCategory): ToolDefinition[] {
  return TOOL_REGISTRY.filter((tool) => tool.category === category);
}
