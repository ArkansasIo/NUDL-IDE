/**
 * NUDL 0.3 Core Type Definitions
 * Based on NUDL 0.3 Specification & Grammar (ArkansasIo/NUDL-0.3)
 */

export enum TokenKind {
  Identifier = 'Identifier',
  Keyword = 'Keyword',
  Number = 'Number',
  String = 'String',
  Boolean = 'Boolean',
  Null = 'Null',
  LParen = 'LParen',
  RParen = 'RParen',
  LBrace = 'LBrace',
  RBrace = 'RBrace',
  LBracket = 'LBracket',
  RBracket = 'RBracket',
  Colon = 'Colon',
  Semicolon = 'Semicolon',
  Comma = 'Comma',
  Dot = 'Dot',
  Arrow = 'Arrow',
  Equal = 'Equal',
  EqualEqual = 'EqualEqual',
  BangEqual = 'BangEqual',
  Less = 'Less',
  LessEqual = 'LessEqual',
  Greater = 'Greater',
  GreaterEqual = 'GreaterEqual',
  Plus = 'Plus',
  Minus = 'Minus',
  Star = 'Star',
  Slash = 'Slash',
  Percent = 'Percent',
  Bang = 'Bang',
  And = 'And',
  Or = 'Or',
  Comment = 'Comment',
  End = 'End',
}

export interface Token {
  kind: TokenKind;
  text: string;
  line: number;
  col: number;
}

export type LiteralKind = 'Number' | 'String' | 'Boolean' | 'Null';

export interface LiteralExpr {
  type: 'Literal';
  value: string;
  kind: LiteralKind;
  raw: any;
}

export interface NameExpr {
  type: 'Name';
  value: string;
}

export interface UnaryExpr {
  type: 'Unary';
  op: '-' | '!';
  rhs: Expr;
}

export interface BinaryExpr {
  type: 'Binary';
  op: string;
  lhs: Expr;
  rhs: Expr;
}

export interface CallExpr {
  type: 'Call';
  callee: string;
  args: Expr[];
}

export interface ArrayExpr {
  type: 'Array';
  elements: Expr[];
}

export interface MemberExpr {
  type: 'Member';
  object: Expr;
  property: string;
}

export interface IndexExpr {
  type: 'Index';
  object: Expr;
  index: Expr;
}

export interface StructInstExpr {
  type: 'StructInst';
  structName: string;
  fields: { name: string; value: Expr }[];
}

export type Expr =
  | LiteralExpr
  | NameExpr
  | UnaryExpr
  | BinaryExpr
  | CallExpr
  | ArrayExpr
  | MemberExpr
  | IndexExpr
  | StructInstExpr;

export interface Parameter {
  name: string;
  type: string;
}

export interface FunctionDecl {
  type: 'Function';
  name: string;
  params: Parameter[];
  returnType: string;
  body: Stmt[];
  line?: number;
}

export interface BindingStmt {
  type: 'Binding';
  name: string;
  constant: boolean;
  varType?: string;
  value: Expr;
  line?: number;
}

export interface AssignStmt {
  type: 'Assign';
  target: string;
  value: Expr;
  line?: number;
}

export interface ReturnStmt {
  type: 'Return';
  value: Expr;
  line?: number;
}

export interface IfStmt {
  type: 'If';
  condition: Expr;
  thenBranch: Stmt[];
  elseBranch?: Stmt[];
  line?: number;
}

export interface WhileStmt {
  type: 'While';
  condition: Expr;
  body: Stmt[];
  line?: number;
}

export interface ExprStmt {
  type: 'ExprStmt';
  value: Expr;
  line?: number;
}

export interface StructField {
  name: string;
  type: string;
}

export interface StructDecl {
  type: 'StructDecl';
  name: string;
  fields: StructField[];
  line?: number;
}

export interface SchemaField {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: Expr;
}

export interface SchemaDecl {
  type: 'SchemaDecl';
  name: string;
  fields: SchemaField[];
  line?: number;
}

export interface DataRecord {
  values: Record<string, Expr>;
}

export interface DataDecl {
  type: 'DataDecl';
  name: string;
  schemaName: string;
  records: DataRecord[];
  line?: number;
}

export type Stmt =
  | BindingStmt
  | AssignStmt
  | ReturnStmt
  | IfStmt
  | WhileStmt
  | ExprStmt
  | StructDecl
  | SchemaDecl
  | DataDecl;

export interface Program {
  functions: FunctionDecl[];
  statements: Stmt[];
  structs: StructDecl[];
  schemas: SchemaDecl[];
  dataBlocks: DataDecl[];
}

export interface Diagnostic {
  code: string;
  message: string;
  line: number;
  col: number;
  severity: 'error' | 'warning' | 'info';
}

export type TargetLanguage =
  | 'Interpreter'
  | 'C++'
  | 'C'
  | 'Rust'
  | 'Python'
  | 'JavaScript'
  | 'TypeScript'
  | 'C#'
  | 'Java'
  | 'Swift'
  | 'WASM';

// Blueprint node graph types
export type BlueprintNodeType =
  | 'event'
  | 'function'
  | 'variable'
  | 'math'
  | 'logic'
  | 'flow'
  | 'data';

export interface BlueprintPin {
  id: string;
  name: string;
  type: 'exec' | 'number' | 'string' | 'boolean' | 'any';
  direction: 'in' | 'out';
  value?: any;
}

export interface BlueprintNode {
  id: string;
  title: string;
  type: BlueprintNodeType;
  x: number;
  y: number;
  inputs: BlueprintPin[];
  outputs: BlueprintPin[];
  customCode?: string;
  variableName?: string;
  operation?: string;
}

export interface BlueprintConnection {
  fromNodeId: string;
  fromPinId: string;
  toNodeId: string;
  toPinId: string;
}

export interface BlueprintGraph {
  nodes: BlueprintNode[];
  connections: BlueprintConnection[];
}

export interface VirtualFile {
  name: string;
  content: string;
  isBlueprint?: boolean;
  blueprintData?: BlueprintGraph;
  readOnly?: boolean;
}
