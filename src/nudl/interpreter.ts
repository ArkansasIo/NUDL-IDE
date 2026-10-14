import { Program, Expr, Stmt, FunctionDecl } from './types';

export interface ExecutionResult {
  output: string[];
  returnValue: any;
  executionTimeMs: number;
  stepCount: number;
  error?: string;
  variables: Record<string, any>;
}

export class Interpreter {
  private program: Program;
  private globals: Record<string, any> = {};
  private functions = new Map<string, FunctionDecl>();
  private output: string[] = [];
  private stepCount = 0;
  private maxSteps = 100000;

  constructor(program: Program) {
    this.program = program;
    for (const fn of program.functions) {
      this.functions.set(fn.name, fn);
    }
  }

  private isTruthy(val: any): boolean {
    if (val === null || val === undefined) return false;
    if (typeof val === 'boolean') return val;
    if (typeof val === 'number') return val !== 0;
    if (typeof val === 'string') return val.length > 0;
    if (Array.isArray(val)) return val.length > 0;
    return true;
  }

  private valueToString(v: any): string {
    if (v === null || v === undefined) return 'null';
    if (typeof v === 'boolean') return v ? 'true' : 'false';
    if (typeof v === 'string') return v;
    if (typeof v === 'number') return Number.isInteger(v) ? v.toString() : v.toFixed(6).replace(/\.?0+$/, '');
    if (Array.isArray(v)) {
      return `[${v.map((item) => this.valueToString(item)).join(', ')}]`;
    }
    if (typeof v === 'object') {
      const entries = Object.entries(v)
        .map(([k, val]) => `${k}: ${this.valueToString(val)}`)
        .join(', ');
      return `{ ${entries} }`;
    }
    return String(v);
  }

  public run(): ExecutionResult {
    const startTime = performance.now();
    this.output = [];
    this.globals = {};
    this.stepCount = 0;

    // Load schema definitions into runtime as descriptors
    for (const s of this.program.schemas) {
      this.globals[`Schema_${s.name}`] = s;
    }
    // Load data blocks
    for (const d of this.program.dataBlocks) {
      const records = d.records.map((r) => {
        const obj: Record<string, any> = {};
        for (const [k, expr] of Object.entries(r.values)) {
          obj[k] = this.evalExpr(expr, this.globals);
        }
        return obj;
      });
      this.globals[d.name] = records;
    }

    let returnValue: any = null;
    let returned = false;

    try {
      // Execute top-level statements
      for (const stmt of this.program.statements) {
        if (stmt.type === 'StructDecl' || stmt.type === 'SchemaDecl' || stmt.type === 'DataDecl') {
          continue;
        }
        const res = this.execStmt(stmt, this.globals);
        if (res.returned) {
          returnValue = res.val;
          returned = true;
          break;
        }
      }

      // If main function exists and top-level didn't return, invoke main()
      if (!returned && this.functions.has('main')) {
        returnValue = this.callFunction('main', [], this.globals);
      }

      const executionTimeMs = performance.now() - startTime;
      return {
        output: this.output,
        returnValue,
        executionTimeMs: Math.round(executionTimeMs * 100) / 100,
        stepCount: this.stepCount,
        variables: { ...this.globals },
      };
    } catch (err: any) {
      const executionTimeMs = performance.now() - startTime;
      return {
        output: this.output,
        returnValue: null,
        executionTimeMs: Math.round(executionTimeMs * 100) / 100,
        stepCount: this.stepCount,
        error: err?.message || 'Runtime execution error',
        variables: { ...this.globals },
      };
    }
  }

  private execStmt(
    stmt: Stmt,
    scope: Record<string, any>
  ): { returned: boolean; val?: any } {
    this.stepCount++;
    if (this.stepCount > this.maxSteps) {
      throw new Error(`Execution exceeded safety limit of ${this.maxSteps} steps (infinite loop protection).`);
    }

    switch (stmt.type) {
      case 'Binding': {
        const val = this.evalExpr(stmt.value, scope);
        scope[stmt.name] = val;
        return { returned: false };
      }
      case 'Assign': {
        const val = this.evalExpr(stmt.value, scope);
        if (stmt.target in scope) {
          scope[stmt.target] = val;
        } else if (stmt.target in this.globals) {
          this.globals[stmt.target] = val;
        } else {
          scope[stmt.target] = val;
        }
        return { returned: false };
      }
      case 'Return': {
        const val = this.evalExpr(stmt.value, scope);
        return { returned: true, val };
      }
      case 'ExprStmt': {
        this.evalExpr(stmt.value, scope);
        return { returned: false };
      }
      case 'If': {
        const cond = this.evalExpr(stmt.condition, scope);
        if (this.isTruthy(cond)) {
          for (const s of stmt.thenBranch) {
            const r = this.execStmt(s, scope);
            if (r.returned) return r;
          }
        } else if (stmt.elseBranch) {
          for (const s of stmt.elseBranch) {
            const r = this.execStmt(s, scope);
            if (r.returned) return r;
          }
        }
        return { returned: false };
      }
      case 'While': {
        while (this.isTruthy(this.evalExpr(stmt.condition, scope))) {
          for (const s of stmt.body) {
            const r = this.execStmt(s, scope);
            if (r.returned) return r;
          }
          this.stepCount++;
          if (this.stepCount > this.maxSteps) {
            throw new Error(`Execution exceeded safety limit of ${this.maxSteps} steps in while loop.`);
          }
        }
        return { returned: false };
      }
      default:
        return { returned: false };
    }
  }

  private evalExpr(expr: Expr, scope: Record<string, any>): any {
    switch (expr.type) {
      case 'Literal':
        return expr.raw;

      case 'Name': {
        if (expr.value in scope) return scope[expr.value];
        if (expr.value in this.globals) return this.globals[expr.value];
        // Standard library / namespaces
        if (expr.value === 'regex') return { __ns: 'regex' };
        if (expr.value === 'math') return { __ns: 'math' };
        throw new Error(`Undefined variable '${expr.value}'`);
      }

      case 'Unary': {
        const val = this.evalExpr(expr.rhs, scope);
        if (expr.op === '-') return -Number(val);
        if (expr.op === '!') return !this.isTruthy(val);
        throw new Error(`Unknown unary operator '${expr.op}'`);
      }

      case 'Binary': {
        // Short-circuit logical operators
        if (expr.op === '&&') {
          const l = this.evalExpr(expr.lhs, scope);
          if (!this.isTruthy(l)) return false;
          return Boolean(this.isTruthy(this.evalExpr(expr.rhs, scope)));
        }
        if (expr.op === '||') {
          const l = this.evalExpr(expr.lhs, scope);
          if (this.isTruthy(l)) return true;
          return Boolean(this.isTruthy(this.evalExpr(expr.rhs, scope)));
        }

        const l = this.evalExpr(expr.lhs, scope);
        const r = this.evalExpr(expr.rhs, scope);

        switch (expr.op) {
          case '+':
            if (typeof l === 'string' || typeof r === 'string') {
              return String(l) + String(r);
            }
            return Number(l) + Number(r);
          case '-':
            return Number(l) - Number(r);
          case '*':
            return Number(l) * Number(r);
          case '/':
            if (Number(r) === 0) throw new Error('Division by zero');
            return Number(l) / Number(r);
          case '%':
            return Number(l) % Number(r);
          case '==':
            return l === r || this.valueToString(l) === this.valueToString(r);
          case '!=':
            return l !== r && this.valueToString(l) !== this.valueToString(r);
          case '<':
            return Number(l) < Number(r);
          case '<=':
            return Number(l) <= Number(r);
          case '>':
            return Number(l) > Number(r);
          case '>=':
            return Number(l) >= Number(r);
          default:
            throw new Error(`Unknown binary operator '${expr.op}'`);
        }
      }

      case 'Array':
        return expr.elements.map((el) => this.evalExpr(el, scope));

      case 'Member': {
        const obj = this.evalExpr(expr.object, scope);
        if (obj && typeof obj === 'object') {
          return obj[expr.property];
        }
        throw new Error(`Cannot access property '${expr.property}' of ${this.valueToString(obj)}`);
      }

      case 'Index': {
        const obj = this.evalExpr(expr.object, scope);
        const idx = this.evalExpr(expr.index, scope);
        if (Array.isArray(obj)) {
          return obj[Number(idx)];
        }
        if (typeof obj === 'string') {
          return obj[Number(idx)];
        }
        if (obj && typeof obj === 'object') {
          return obj[idx];
        }
        throw new Error(`Cannot index into ${this.valueToString(obj)}`);
      }

      case 'StructInst': {
        const obj: Record<string, any> = { __struct: expr.structName };
        for (const f of expr.fields) {
          obj[f.name] = this.evalExpr(f.value, scope);
        }
        return obj;
      }

      case 'Call': {
        const args = expr.args.map((a) => this.evalExpr(a, scope));
        return this.evalCall(expr.callee, args, scope);
      }

      default:
        return null;
    }
  }

  private evalCall(callee: string, args: any[], scope: Record<string, any>): any {
    // Built-in print
    if (callee === 'print') {
      const msg = args.map((a) => this.valueToString(a)).join(' ');
      this.output.push(msg);
      return null;
    }

    // Built-in utility functions
    if (callee === 'len') {
      const a = args[0];
      if (Array.isArray(a) || typeof a === 'string') return a.length;
      if (a && typeof a === 'object') return Object.keys(a).length;
      return 0;
    }

    if (callee === 'str') {
      return this.valueToString(args[0]);
    }

    if (callee === 'typeof') {
      const a = args[0];
      if (a === null) return 'null';
      if (Array.isArray(a)) return 'array';
      return typeof a;
    }

    // Regex library functions from NUDL 0.3 Regex extension
    if (callee === 'regex.is_match') {
      const [pattern, str] = args;
      try {
        const re = new RegExp(String(pattern));
        return re.test(String(str));
      } catch {
        return false;
      }
    }

    if (callee === 'regex.replace') {
      const [pattern, str, replacement] = args;
      try {
        const re = new RegExp(String(pattern), 'g');
        return String(str).replace(re, String(replacement));
      } catch {
        return String(str);
      }
    }

    // Math library functions
    if (callee.startsWith('math.')) {
      const mName = callee.replace('math.', '');
      if (mName === 'sqrt') return Math.sqrt(Number(args[0]));
      if (mName === 'abs') return Math.abs(Number(args[0]));
      if (mName === 'pow') return Math.pow(Number(args[0]), Number(args[1]));
      if (mName === 'floor') return Math.floor(Number(args[0]));
      if (mName === 'ceil') return Math.ceil(Number(args[0]));
      if (mName === 'round') return Math.round(Number(args[0]));
      if (mName === 'min') return Math.min(...args.map(Number));
      if (mName === 'max') return Math.max(...args.map(Number));
    }

    if (callee === 'average') {
      const arr = Array.isArray(args[0]) ? args[0] : args;
      if (arr.length === 0) return 0;
      const sum = arr.reduce((acc: number, x: any) => acc + Number(x), 0);
      return sum / arr.length;
    }

    return this.callFunction(callee, args, scope);
  }

  private callFunction(name: string, args: any[], outerScope: Record<string, any>): any {
    const fn = this.functions.get(name);
    if (!fn) {
      throw new Error(`Unknown function '${name}()'`);
    }

    if (fn.params.length !== args.length) {
      throw new Error(
        `Function '${name}()' expected ${fn.params.length} arguments, but received ${args.length}`
      );
    }

    const localScope: Record<string, any> = { ...this.globals };
    for (let i = 0; i < fn.params.length; i++) {
      localScope[fn.params[i].name] = args[i];
    }

    for (const stmt of fn.body) {
      const res = this.execStmt(stmt, localScope);
      if (res.returned) {
        return res.val;
      }
    }

    return null;
  }
}
