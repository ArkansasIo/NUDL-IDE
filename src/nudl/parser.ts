import {
  Token,
  TokenKind,
  Program,
  FunctionDecl,
  Stmt,
  Expr,
  Diagnostic,
  Parameter,
  StructDecl,
  SchemaDecl,
  DataDecl,
  DataRecord,
  NameExpr,
} from './types';

export class Parser {
  private tokens: Token[];
  private pos = 0;
  public diagnostics: Diagnostic[] = [];

  constructor(tokens: Token[]) {
    // Filter out comments from syntactic parse stream
    this.tokens = tokens.filter((t) => t.kind !== 'Comment');
  }

  private peek(): Token {
    return this.tokens[this.pos] || { kind: 'End', text: '', line: 1, col: 1 };
  }

  private prev(): Token {
    return this.tokens[Math.max(0, this.pos - 1)];
  }

  private isAtEnd(): boolean {
    return this.peek().kind === 'End';
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.pos++;
    return this.prev();
  }

  private check(kind: TokenKind): boolean {
    return this.peek().kind === kind;
  }

  private checkKeyword(word: string): boolean {
    const t = this.peek();
    return (t.kind === 'Keyword' || t.kind === 'Identifier') && t.text === word;
  }

  private match(kind: TokenKind): boolean {
    if (this.check(kind)) {
      this.advance();
      return true;
    }
    return false;
  }

  private matchKeyword(word: string): boolean {
    if (this.checkKeyword(word)) {
      this.advance();
      return true;
    }
    return false;
  }

  private error(message: string, token?: Token): void {
    const t = token || this.peek();
    this.diagnostics.push({
      code: `P${100 + (this.diagnostics.length % 900)}`,
      message,
      line: t.line,
      col: t.col,
      severity: 'error',
    });
  }

  private expect(kind: TokenKind, message: string): Token {
    if (this.check(kind)) {
      return this.advance();
    }
    this.error(`${message} (got '${this.peek().text || this.peek().kind}')`);
    return this.peek();
  }

  private expectIdentifier(message: string): string {
    if (this.peek().kind === 'Identifier' || this.peek().kind === 'Keyword') {
      return this.advance().text;
    }
    this.error(message);
    return 'unknown';
  }

  private parseType(): string {
    const t = this.peek();
    if (t.kind !== 'Identifier' && t.kind !== 'Keyword') {
      this.error('Expected type signature');
      return 'any';
    }
    let typeName = this.advance().text;
    if (this.match(TokenKind.LBracket)) {
      this.expect(TokenKind.RBracket, "Expected ']' for array type");
      typeName += '[]';
    }
    return typeName;
  }

  public parse(): { program: Program; diagnostics: Diagnostic[] } {
    const program: Program = {
      functions: [],
      statements: [],
      structs: [],
      schemas: [],
      dataBlocks: [],
    };

    while (!this.isAtEnd()) {
      try {
        if (this.checkKeyword('fn')) {
          const fn = this.parseFunction();
          if (fn) program.functions.push(fn);
        } else if (this.checkKeyword('struct')) {
          const st = this.parseStruct();
          if (st) {
            program.structs.push(st);
            program.statements.push(st);
          }
        } else if (this.checkKeyword('schema')) {
          const sc = this.parseSchema();
          if (sc) {
            program.schemas.push(sc);
            program.statements.push(sc);
          }
        } else if (this.checkKeyword('data')) {
          const dt = this.parseData();
          if (dt) {
            program.dataBlocks.push(dt);
            program.statements.push(dt);
          }
        } else {
          const stmt = this.parseStatement();
          if (stmt) {
            program.statements.push(stmt);
          } else {
            this.advance();
          }
        }
      } catch (err: any) {
        this.error(err?.message || 'Syntax parse error');
        this.synchronize();
      }
    }

    return { program, diagnostics: this.diagnostics };
  }

  private parseFunction(): FunctionDecl | null {
    const fnToken = this.advance(); // consume 'fn'
    const name = this.expectIdentifier('Expected function name');
    this.expect(TokenKind.LParen, "Expected '(' after function name");

    const params: Parameter[] = [];
    if (!this.check(TokenKind.RParen) && !this.isAtEnd()) {
      do {
        const paramName = this.expectIdentifier('Expected parameter name');
        let paramType = 'any';
        if (this.match(TokenKind.Colon)) {
          paramType = this.parseType();
        }
        params.push({ name: paramName, type: paramType });
      } while (this.match(TokenKind.Comma));
    }
    this.expect(TokenKind.RParen, "Expected ')' after parameters");

    let returnType = 'void';
    if (this.match(TokenKind.Arrow)) {
      returnType = this.parseType();
    }

    const body = this.parseBlock();
    return {
      type: 'Function',
      name,
      params,
      returnType,
      body,
      line: fnToken.line,
    };
  }

  private parseStruct(): StructDecl | null {
    const token = this.advance(); // consume 'struct'
    const name = this.expectIdentifier('Expected struct name');
    this.expect(TokenKind.LBrace, "Expected '{' for struct body");

    const fields: { name: string; type: string }[] = [];
    while (!this.check(TokenKind.RBrace) && !this.isAtEnd()) {
      const fieldName = this.expectIdentifier('Expected field name in struct');
      this.expect(TokenKind.Colon, "Expected ':' after field name");
      const fieldType = this.parseType();
      fields.push({ name: fieldName, type: fieldType });
      this.match(TokenKind.Semicolon) || this.match(TokenKind.Comma);
    }
    this.expect(TokenKind.RBrace, "Expected '}' closing struct");
    return { type: 'StructDecl', name, fields, line: token.line };
  }

  private parseSchema(): SchemaDecl | null {
    const token = this.advance(); // consume 'schema'
    const name = this.expectIdentifier('Expected schema name');
    this.expect(TokenKind.LBrace, "Expected '{' for schema definition");

    const fields = [];
    while (!this.check(TokenKind.RBrace) && !this.isAtEnd()) {
      const fieldName = this.expectIdentifier('Expected field name');
      this.expect(TokenKind.Colon, "Expected ':' after field name");
      const fieldType = this.parseType();
      let required = false;
      if (this.matchKeyword('required')) {
        required = true;
      }
      let defaultValue: Expr | undefined = undefined;
      if (this.match(TokenKind.Equal)) {
        defaultValue = this.parseExpression();
      }
      fields.push({ name: fieldName, type: fieldType, required, defaultValue });
      this.match(TokenKind.Semicolon) || this.match(TokenKind.Comma);
    }
    this.expect(TokenKind.RBrace, "Expected '}' closing schema");
    return { type: 'SchemaDecl', name, fields, line: token.line };
  }

  private parseData(): DataDecl | null {
    const token = this.advance(); // consume 'data'
    const name = this.expectIdentifier('Expected dataset identifier');
    this.expect(TokenKind.Colon, "Expected ':' after dataset identifier");
    const schemaName = this.expectIdentifier('Expected schema identifier');
    this.expect(TokenKind.LBrace, "Expected '{' for data records");

    const records: DataRecord[] = [];
    while (!this.check(TokenKind.RBrace) && !this.isAtEnd()) {
      if (this.match(TokenKind.LBrace)) {
        const values: Record<string, Expr> = {};
        while (!this.check(TokenKind.RBrace) && !this.isAtEnd()) {
          const k = this.expectIdentifier('Expected record key');
          this.expect(TokenKind.Colon, "Expected ':' after record key");
          values[k] = this.parseExpression();
          this.match(TokenKind.Comma);
        }
        this.expect(TokenKind.RBrace, "Expected '}' closing data record");
        records.push({ values });
      } else {
        this.advance();
      }
    }
    this.expect(TokenKind.RBrace, "Expected '}' closing data block");
    return { type: 'DataDecl', name, schemaName, records, line: token.line };
  }

  private parseBlock(): Stmt[] {
    this.expect(TokenKind.LBrace, "Expected '{' at start of block");
    const statements: Stmt[] = [];
    while (!this.check(TokenKind.RBrace) && !this.isAtEnd()) {
      const s = this.parseStatement();
      if (s) statements.push(s);
    }
    this.expect(TokenKind.RBrace, "Expected '}' at end of block");
    return statements;
  }

  private parseStatement(): Stmt | null {
    const t = this.peek();

    if (this.matchKeyword('let') || this.matchKeyword('const')) {
      return this.parseBinding(t.text === 'const');
    }

    if (this.matchKeyword('return')) {
      const line = t.line;
      let value: Expr;
      if (this.check(TokenKind.Semicolon)) {
        value = { type: 'Literal', value: 'null', kind: 'Null', raw: null };
      } else {
        value = this.parseExpression();
      }
      this.match(TokenKind.Semicolon);
      return { type: 'Return', value, line };
    }

    if (this.matchKeyword('if')) {
      return this.parseIf();
    }

    if (this.matchKeyword('while')) {
      return this.parseWhile();
    }

    // Check for assignment: identifier = expr;
    if (t.kind === 'Identifier' && this.tokens[this.pos + 1]?.kind === 'Equal') {
      const target = this.advance().text;
      this.advance(); // consume '='
      const value = this.parseExpression();
      this.match(TokenKind.Semicolon);
      return { type: 'Assign', target, value, line: t.line };
    }

    // Expression statement
    const expr = this.parseExpression();
    this.match(TokenKind.Semicolon);
    return { type: 'ExprStmt', value: expr, line: t.line };
  }

  private parseBinding(isConst: boolean): Stmt {
    const line = this.prev().line;
    const name = this.expectIdentifier('Expected variable name');
    let varType: string | undefined = undefined;
    if (this.match(TokenKind.Colon)) {
      varType = this.parseType();
    }
    this.expect(TokenKind.Equal, "Expected '=' in variable declaration");
    const value = this.parseExpression();
    this.match(TokenKind.Semicolon);
    return { type: 'Binding', name, constant: isConst, varType, value, line };
  }

  private parseIf(): Stmt {
    const line = this.prev().line;
    this.expect(TokenKind.LParen, "Expected '(' after 'if'");
    const condition = this.parseExpression();
    this.expect(TokenKind.RParen, "Expected ')' after if condition");
    const thenBranch = this.parseBlock();
    let elseBranch: Stmt[] | undefined = undefined;
    if (this.matchKeyword('else')) {
      if (this.checkKeyword('if')) {
        this.advance();
        elseBranch = [this.parseIf()];
      } else {
        elseBranch = this.parseBlock();
      }
    }
    return { type: 'If', condition, thenBranch, elseBranch, line };
  }

  private parseWhile(): Stmt {
    const line = this.prev().line;
    this.expect(TokenKind.LParen, "Expected '(' after 'while'");
    const condition = this.parseExpression();
    this.expect(TokenKind.RParen, "Expected ')' after while condition");
    const body = this.parseBlock();
    return { type: 'While', condition, body, line };
  }

  public parseExpression(): Expr {
    return this.parseLogicalOr();
  }

  private parseLogicalOr(): Expr {
    let expr = this.parseLogicalAnd();
    while (this.match(TokenKind.Or)) {
      const rhs = this.parseLogicalAnd();
      expr = { type: 'Binary', op: '||', lhs: expr, rhs };
    }
    return expr;
  }

  private parseLogicalAnd(): Expr {
    let expr = this.parseEquality();
    while (this.match(TokenKind.And)) {
      const rhs = this.parseEquality();
      expr = { type: 'Binary', op: '&&', lhs: expr, rhs };
    }
    return expr;
  }

  private parseEquality(): Expr {
    let expr = this.parseComparison();
    while (this.match(TokenKind.EqualEqual) || this.match(TokenKind.BangEqual)) {
      const op = this.prev().text;
      const rhs = this.parseComparison();
      expr = { type: 'Binary', op, lhs: expr, rhs };
    }
    return expr;
  }

  private parseComparison(): Expr {
    let expr = this.parseTerm();
    while (
      this.match(TokenKind.Less) ||
      this.match(TokenKind.LessEqual) ||
      this.match(TokenKind.Greater) ||
      this.match(TokenKind.GreaterEqual)
    ) {
      const op = this.prev().text;
      const rhs = this.parseTerm();
      expr = { type: 'Binary', op, lhs: expr, rhs };
    }
    return expr;
  }

  private parseTerm(): Expr {
    let expr = this.parseFactor();
    while (this.match(TokenKind.Plus) || this.match(TokenKind.Minus)) {
      const op = this.prev().text;
      const rhs = this.parseFactor();
      expr = { type: 'Binary', op, lhs: expr, rhs };
    }
    return expr;
  }

  private parseFactor(): Expr {
    let expr = this.parseUnary();
    while (this.match(TokenKind.Star) || this.match(TokenKind.Slash) || this.match(TokenKind.Percent)) {
      const op = this.prev().text;
      const rhs = this.parseUnary();
      expr = { type: 'Binary', op, lhs: expr, rhs };
    }
    return expr;
  }

  private parseUnary(): Expr {
    if (this.match(TokenKind.Minus)) {
      return { type: 'Unary', op: '-', rhs: this.parseUnary() };
    }
    if (this.match(TokenKind.Bang)) {
      return { type: 'Unary', op: '!', rhs: this.parseUnary() };
    }
    return this.parsePostfix();
  }

  private parsePostfix(): Expr {
    let expr = this.parsePrimary();

    while (true) {
      if (this.match(TokenKind.LParen)) {
        // Function call: expr(args)
        const args: Expr[] = [];
        if (!this.check(TokenKind.RParen) && !this.isAtEnd()) {
          do {
            args.push(this.parseExpression());
          } while (this.match(TokenKind.Comma));
        }
        this.expect(TokenKind.RParen, "Expected ')' after call arguments");
        if (expr.type === 'Name') {
          expr = { type: 'Call', callee: expr.value, args };
        } else if (expr.type === 'Member') {
          expr = {
            type: 'Call',
            callee: `${(expr.object as NameExpr).value}.${expr.property}`,
            args,
          };
        } else {
          expr = { type: 'Call', callee: 'dynamicCall', args };
        }
      } else if (this.match(TokenKind.Dot)) {
        const prop = this.expectIdentifier("Expected property name after '.'");
        expr = { type: 'Member', object: expr, property: prop };
      } else if (this.match(TokenKind.LBracket)) {
        const index = this.parseExpression();
        this.expect(TokenKind.RBracket, "Expected ']' after index expression");
        expr = { type: 'Index', object: expr, index };
      } else {
        break;
      }
    }

    return expr;
  }

  private parsePrimary(): Expr {
    const t = this.peek();

    if (this.match(TokenKind.Number)) {
      const num = parseFloat(t.text);
      return { type: 'Literal', value: t.text, kind: 'Number', raw: num };
    }

    if (this.match(TokenKind.String)) {
      return { type: 'Literal', value: t.text, kind: 'String', raw: t.text };
    }

    if (this.match(TokenKind.Boolean)) {
      return { type: 'Literal', value: t.text, kind: 'Boolean', raw: t.text === 'true' };
    }

    if (this.match(TokenKind.Null)) {
      return { type: 'Literal', value: 'null', kind: 'Null', raw: null };
    }

    if (this.match(TokenKind.LBracket)) {
      // Array literal [1, 2, 3]
      const elements: Expr[] = [];
      if (!this.check(TokenKind.RBracket) && !this.isAtEnd()) {
        do {
          elements.push(this.parseExpression());
        } while (this.match(TokenKind.Comma));
      }
      this.expect(TokenKind.RBracket, "Expected ']' at end of array literal");
      return { type: 'Array', elements };
    }

    if (this.match(TokenKind.LParen)) {
      const inner = this.parseExpression();
      this.expect(TokenKind.RParen, "Expected ')' after expression");
      return inner;
    }

    if (this.match(TokenKind.Identifier) || (this.check(TokenKind.Keyword) && t.text === 'print')) {
      const name = this.check(TokenKind.Keyword) ? this.advance().text : t.text;
      if (this.check(TokenKind.LBrace)) {
        // Potential struct instantiation: Point { x: 1.0, y: 2.0 }
        // Peek ahead to check if it's `{ id:`
        const next = this.tokens[this.pos + 1];
        if (next && (next.kind === 'Identifier' || next.kind === 'Keyword')) {
          this.advance(); // consume '{'
          const fields: { name: string; value: Expr }[] = [];
          while (!this.check(TokenKind.RBrace) && !this.isAtEnd()) {
            const fName = this.expectIdentifier('Expected field name');
            this.expect(TokenKind.Colon, "Expected ':' after field name");
            const fVal = this.parseExpression();
            fields.push({ name: fName, value: fVal });
            this.match(TokenKind.Comma);
          }
          this.expect(TokenKind.RBrace, "Expected '}' closing struct instantiation");
          return { type: 'StructInst', structName: name, fields };
        }
      }
      return { type: 'Name', value: name };
    }

    this.error(`Unexpected token in expression: '${t.text || t.kind}'`, t);
    this.advance();
    return { type: 'Literal', value: 'null', kind: 'Null', raw: null };
  }

  private synchronize(): void {
    this.advance();
    while (!this.isAtEnd()) {
      if (this.prev().kind === 'Semicolon') return;
      if (
        this.checkKeyword('fn') ||
        this.checkKeyword('let') ||
        this.checkKeyword('const') ||
        this.checkKeyword('if') ||
        this.checkKeyword('while') ||
        this.checkKeyword('return') ||
        this.checkKeyword('struct') ||
        this.checkKeyword('schema') ||
        this.checkKeyword('data')
      ) {
        return;
      }
      this.advance();
    }
  }
}
