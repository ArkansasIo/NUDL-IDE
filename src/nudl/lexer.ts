import { Token, TokenKind } from './types';

const KEYWORDS = new Set([
  'fn',
  'let',
  'const',
  'return',
  'if',
  'else',
  'while',
  'true',
  'false',
  'null',
  'struct',
  'schema',
  'data',
  'output',
  'print',
  'required',
  'where',
  'class',
  'module',
  'import',
  'export',
]);

export function lex(source: string): { tokens: Token[]; diagnostics: Array<{ line: number; col: number; message: string }> } {
  const tokens: Token[] = [];
  const diagnostics: Array<{ line: number; col: number; message: string }> = [];

  let i = 0;
  let line = 1;
  let col = 1;

  const pushToken = (kind: TokenKind, text: string, tokenLine: number, tokenCol: number) => {
    tokens.push({ kind, text, line: tokenLine, col: tokenCol });
  };

  while (i < source.length) {
    const c = source[i];

    // Whitespace
    if (c === ' ' || c === '\t' || c === '\r') {
      i++;
      col++;
      continue;
    }

    // Newlines
    if (c === '\n') {
      i++;
      line++;
      col = 1;
      continue;
    }

    // Comments: // or #
    if (c === '#' || (c === '/' && i + 1 < source.length && source[i + 1] === '/')) {
      const commentStartCol = col;
      let text = '';
      while (i < source.length && source[i] !== '\n') {
        text += source[i];
        i++;
        col++;
      }
      tokens.push({ kind: TokenKind.Comment, text, line, col: commentStartCol });
      continue;
    }

    // Block comments: /* ... */
    if (c === '/' && i + 1 < source.length && source[i + 1] === '*') {
      const commentStartCol = col;
      let text = '/*';
      i += 2;
      col += 2;
      while (i + 1 < source.length && !(source[i] === '*' && source[i + 1] === '/')) {
        if (source[i] === '\n') {
          line++;
          col = 1;
        } else {
          col++;
        }
        text += source[i];
        i++;
      }
      if (i + 1 < source.length) {
        text += '*/';
        i += 2;
        col += 2;
      }
      tokens.push({ kind: TokenKind.Comment, text, line, col: commentStartCol });
      continue;
    }

    const tokenLine = line;
    const tokenCol = col;

    // Identifiers & Keywords
    if (/[a-zA-Z_]/.test(c)) {
      let j = i + 1;
      while (j < source.length && /[a-zA-Z0-9_]/.test(source[j])) {
        j++;
      }
      const text = source.substring(i, j);
      col += j - i;
      i = j;

      if (text === 'true' || text === 'false') {
        pushToken(TokenKind.Boolean, text, tokenLine, tokenCol);
      } else if (text === 'null') {
        pushToken(TokenKind.Null, text, tokenLine, tokenCol);
      } else if (KEYWORDS.has(text)) {
        pushToken(TokenKind.Keyword, text, tokenLine, tokenCol);
      } else {
        pushToken(TokenKind.Identifier, text, tokenLine, tokenCol);
      }
      continue;
    }

    // Numbers (integer or floating point)
    if (/[0-9]/.test(c)) {
      let j = i + 1;
      let hasDot = false;
      while (j < source.length && (/[0-9]/.test(source[j]) || (source[j] === '.' && !hasDot && /[0-9]/.test(source[j + 1] || '')))) {
        if (source[j] === '.') hasDot = true;
        j++;
      }
      const text = source.substring(i, j);
      col += j - i;
      i = j;
      pushToken(TokenKind.Number, text, tokenLine, tokenCol);
      continue;
    }

    // Strings
    if (c === '"' || c === "'") {
      const quote = c;
      let text = '';
      i++;
      col++;
      let closed = false;
      while (i < source.length) {
        const sc = source[i];
        if (sc === '\\' && i + 1 < source.length) {
          const next = source[i + 1];
          if (next === 'n') text += '\n';
          else if (next === 't') text += '\t';
          else if (next === 'r') text += '\r';
          else if (next === '\\') text += '\\';
          else if (next === quote) text += quote;
          else text += next;
          i += 2;
          col += 2;
        } else if (sc === quote) {
          i++;
          col++;
          closed = true;
          break;
        } else if (sc === '\n') {
          diagnostics.push({ line, col, message: 'Unterminated string literal at line break' });
          break;
        } else {
          text += sc;
          i++;
          col++;
        }
      }
      if (!closed && i >= source.length) {
        diagnostics.push({ line: tokenLine, col: tokenCol, message: 'Unterminated string literal at end of file' });
      }
      pushToken(TokenKind.String, text, tokenLine, tokenCol);
      continue;
    }

    // Multi-character & Single-character operators
    let kind: TokenKind = TokenKind.Comment;
    let len = 1;

    if (c === '-' && source[i + 1] === '>') {
      kind = TokenKind.Arrow;
      len = 2;
    } else if (c === '=' && source[i + 1] === '=') {
      kind = TokenKind.EqualEqual;
      len = 2;
    } else if (c === '!' && source[i + 1] === '=') {
      kind = TokenKind.BangEqual;
      len = 2;
    } else if (c === '<' && source[i + 1] === '=') {
      kind = TokenKind.LessEqual;
      len = 2;
    } else if (c === '>' && source[i + 1] === '=') {
      kind = TokenKind.GreaterEqual;
      len = 2;
    } else if (c === '&' && source[i + 1] === '&') {
      kind = TokenKind.And;
      len = 2;
    } else if (c === '|' && source[i + 1] === '|') {
      kind = TokenKind.Or;
      len = 2;
    } else {
      switch (c) {
        case '(': kind = TokenKind.LParen; break;
        case ')': kind = TokenKind.RParen; break;
        case '{': kind = TokenKind.LBrace; break;
        case '}': kind = TokenKind.RBrace; break;
        case '[': kind = TokenKind.LBracket; break;
        case ']': kind = TokenKind.RBracket; break;
        case ',': kind = TokenKind.Comma; break;
        case ':': kind = TokenKind.Colon; break;
        case ';': kind = TokenKind.Semicolon; break;
        case '.': kind = TokenKind.Dot; break;
        case '+': kind = TokenKind.Plus; break;
        case '-': kind = TokenKind.Minus; break;
        case '*': kind = TokenKind.Star; break;
        case '/': kind = TokenKind.Slash; break;
        case '%': kind = TokenKind.Percent; break;
        case '!': kind = TokenKind.Bang; break;
        case '=': kind = TokenKind.Equal; break;
        case '<': kind = TokenKind.Less; break;
        case '>': kind = TokenKind.Greater; break;
        default:
          diagnostics.push({
            line: tokenLine,
            col: tokenCol,
            message: `Unexpected character: '${c}'`,
          });
          i++;
          col++;
          continue;
      }
    }

    const tokenText = source.substring(i, i + len);
    pushToken(kind, tokenText, tokenLine, tokenCol);
    i += len;
    col += len;
  }

  tokens.push({ kind: TokenKind.End, text: '', line, col });
  return { tokens, diagnostics };
}
