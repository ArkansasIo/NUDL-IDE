export type FeatureStatus = 'implemented' | 'partial' | 'planned' | 'external';

export interface FeatureDefinition {
  id: string;
  title: string;
  description: string;
  status: FeatureStatus;
  module: string;
  requirements?: string[];
}

/** Feature inventory for documentation, command surfaces and future plugin panels. */
export const FEATURE_REGISTRY: FeatureDefinition[] = [
  { id: 'editor', title: 'Source Editor', description: 'Edit NUDL files with cursor and indentation support.', status: 'implemented', module: 'components/TextEditor' },
  { id: 'language-service', title: 'Language Service', description: 'Lexing, parsing, semantic diagnostics and AST inspection.', status: 'implemented', module: 'nudl' },
  { id: 'interpreter', title: 'In-browser Interpreter', description: 'Run supported NUDL syntax in the bounded TypeScript interpreter.', status: 'partial', module: 'nudl/interpreter' },
  { id: 'code-generation', title: 'Target Source Generation', description: 'Emit target-language source text for supported constructs.', status: 'partial', module: 'nudl/codegen', requirements: ['Run target-specific conformance tests before production use.'] },
  { id: 'blueprint-editor', title: 'Visual Blueprint Editor', description: 'Author a visual graph and convert supported nodes to NUDL.', status: 'partial', module: 'components/BlueprintEditor' },
  { id: 'workspace', title: 'Workspace Management', description: 'Create, import, export and persist browser-local files.', status: 'implemented', module: 'nudl/workspace' },
  { id: 'remote-projects', title: 'Remote Project Sync', description: 'Cloud-backed project persistence and collaboration.', status: 'planned', module: 'api', requirements: ['Backend service', 'Authentication', 'Project storage'] },
  { id: 'extensions', title: 'Extension API', description: 'Third-party modules and capability permissions.', status: 'planned', module: 'plugins', requirements: ['Plugin sandbox', 'Manifest validation', 'Permission UI'] },
  { id: 'native-compiler', title: 'Native Compiler Integration', description: 'Invoke native compiler toolchains and report diagnostics.', status: 'external', module: 'native', requirements: ['Native executable or service', 'Target SDKs'] },
];

export function getFeature(id: string): FeatureDefinition | undefined {
  return FEATURE_REGISTRY.find((feature) => feature.id === id);
}
