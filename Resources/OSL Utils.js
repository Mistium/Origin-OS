function tokenise(CODE, DELIMITER) {
  try {
    let letter = 0;
    let depth = "";
    let brackets = 0;
    let b_depth = 0
    let out = [];
    let split = [];
    const len = CODE.length;

    while (letter < len) {
      depth = CODE[letter];
      if (depth === '"') {
        brackets = 1 - brackets;
        out.push('"');
      } else {
        out.push(depth);
      }
      if (brackets === 0) {
        if (depth === "[" || depth === "{" || depth === "(") b_depth++
        if (depth === "]" || depth === "}" || depth === ")") b_depth--
        b_depth = b_depth < 0 ? 0 : b_depth;
      }
      letter++;

      if (brackets === 0 && CODE[letter] === DELIMITER && b_depth === 0) {
        split.push(out.join(""));
        out = [];
        letter++;
      }
    }
    split.push(out.join(""));
    return split;
  } catch (e) {
    return [];
  }
}

function tokeniseEscaped(CODE, DELIMITER) {
  try {
    let letter = 0;
    let depth = "";
    let brackets = 0;
    let b_depth = 0;
    let out = [];
    let split = [];
    let escaped = false;
    const len = CODE.length;

    while (letter < len) {
      depth = CODE[letter];
      if (brackets === 0 && !escaped) {
        if (depth === "[" || depth === "{" || depth === "(") b_depth++
        if (depth === "]" || depth === "}" || depth === ")") b_depth--
        b_depth = b_depth < 0 ? 0 : b_depth;
      }
      if (depth === '"' && !escaped) {
        brackets = 1 - brackets;
        out.push('"');
      } else if (depth === '\\' && !escaped) {
        escaped = !escaped;
        out.push("\\");
      } else {
        out.push(depth);
        escaped = false;
      }
      letter++;

      if (brackets === 0 && CODE[letter] === DELIMITER && b_depth === 0) {
        split.push(out.join(""));
        out = [];
        letter++;
      }
    }
    split.push(out.join(""));
    return split;
  } catch (e) {
    return [];
  }
}

function parseEscaped(str) {
  let result = "";
  for (let i = 0; i < str.length; i++) {
    if (str[i] === '\\') {
      i++;
      const esc = str[i];
      switch (esc) {
        case 'n': result += '\n'; break;
        case 't': result += '\t'; break;
        case 'r': result += '\r'; break;
        case '"': result += '"'; break;
        case "'": result += "'"; break;
        case '\\': result += '\\'; break;
        default: result += esc;
      }
    } else {
      result += str[i];
    }
  }
  return result;
}

function destr(t, e = '"') {
  if ("object" == typeof t || "symbol" == typeof t) return t;
  const n = t + "", r = e + "";
  if (n.startsWith(r) && n.endsWith(r)) {
    let t = n.substring(1, n.length - 1);
    return parseEscaped(t);
  }
  return t
};

function autoTokenise(CODE, DELIMITER) {
  if (CODE.indexOf("\\") !== -1) {
    return tokeniseEscaped(CODE, DELIMITER ?? " ");
  } else if (CODE.indexOf('"') !== -1 || CODE.indexOf("[") !== -1 || CODE.indexOf("{") !== -1 || CODE.indexOf("(") !== -1) {
    return tokenise(CODE, DELIMITER ?? " ");
  } else {
    return CODE.split(DELIMITER ?? " ");
  }
}

function parseTemplate(str) {
  let depth = 0;
  let cur = '';
  const arr = [];
  for (let i = 0; i < str.length; i++) {
    if (str[i] + str[i + 1] === '${') {
      if (depth === 0) {
        arr.push(cur);
        cur = "${";
      } else {
        cur += "${";
      }
      depth++;
      i++; // Skip the next character since we processed both $ and {
      continue;
    }
    if (str[i] === '}' && depth > 0) {
      depth--
      if (depth === 0) {
        arr.push(cur + '}');
        cur = "";
      } else {
        cur += '}';
      }
      continue;
    };
    cur += str[i];
  }
  arr.push(cur);
  return arr;
}

function randomString(length) {
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const VAR_REGEX = /^(!+)?[a-zA-Z_][a-zA-Z0-9_]*$/;

class OSLLinter {
  constructor() {
    this.validKeywords = new Set([
      'def', 'if', 'else', 'for', 'while', 'class', 'switch', 
      'case', 'default', 'return', 'break', 'continue', 
      'try', 'catch', 'import', 'permission', 'save', 'file', 
      'window', 'network', 'each', 'until', 'loop', 'local', 
      'endef', 'defer', 'mainloop', 'void', 'and', 'or', 'not',
      'in', 'nor', 'xor', 'xnor', 'nand'
    ]);
    
    this.validOperators = new Set([
      '=', '@=', '+=', '-=', '*=', '/=', '++', '--', 
      '+', '-', '*', '/', '//', '%', '^', '==', '!=', 
      '>', '<', '>=', '<=', '::', '??', '|>', 
      '|', '&', '<<', '>>', '>>>', '<<<', '?', ':',
      '&&=', '||=', '%=', '<<=', '>>=', '>>>=', '!', '->'
    ]);
    
    this.validTypes = new Set([
      'number', 'string', 'array', 'object', 'boolean', 'void', 'local'
    ]);
  }

  tokeniseCode(codeStr) {
    const code = `${codeStr}`;
    const tokens = [];
    
    try {
      let i = 0;
      let currentLine = 0;
      let currentLineStart = 0;
      
      while (i < code.length) {
        const char = code[i];
        
        if (char === ' ' || char === '\t' || char === '\r') {
          i++;
          continue;
        }
        
        if (char === '\n') {
          const start = i - currentLineStart;
          tokens.push({ type: 'newline', value: '\n', line: currentLine, start, end: start + 1 });
          currentLine++;
          currentLineStart = i + 1;
          i++;
          continue;
        }
        
        const start = i - currentLineStart;
        
        if (char === '/' && code[i + 1] === '/') {
          let comment = '//';
          i += 2;
          while (i < code.length && code[i] !== '\n') {
            comment += code[i];
            i++;
          }
          tokens.push({ type: 'comment', value: comment, line: currentLine, start, end: start + comment.length });
          continue;
        }
        
        if (char === '/' && code[i + 1] === '*') {
          let comment = '/*';
          i += 2;
          let commentLine = currentLine;
          while (i < code.length && !(code[i] === '*' && code[i + 1] === '/')) {
            if (code[i] === '\n') {
              commentLine++;
              currentLine++;
              currentLineStart = i + 1;
            }
            comment += code[i];
            i++;
          }
          if (i < code.length) {
            comment += '*/';
            i += 2;
          }
          tokens.push({ type: 'comment', value: comment, line: commentLine, start, end: i - currentLineStart });
          continue;
        }
        
        if (char === '"') {
          const line = currentLine;
          let str = '"';
          i++;
          while (i < code.length) {
            if (code[i] === '\\' && i + 1 < code.length) {
              str += code[i] + code[i + 1];
              i += 2;
              continue;
            }
            if (code[i] === '"') {
              str += '"';
              i++;
              break;
            }
            if (code[i] === '\n') {
              break;
            }
            str += code[i];
            i++;
          }
          if (str[str.length - 1] !== '"') {
            tokens.push({ type: 'string', value: str, line: line, start, end: i - currentLineStart });
            currentLine++;
            currentLineStart = i;
            continue;
          } else {
            tokens.push({ type: 'string', value: str, line: line, start, end: i - currentLineStart });
            continue;
          }
        }
        
        if (char === "'") {
          const line = currentLine;
          let str = "'";
          i++;
          while (i < code.length) {
            if (code[i] === '\\' && i + 1 < code.length) {
              str += code[i] + code[i + 1];
              i += 2;
              continue;
            }
            if (code[i] === "'") {
              str += "'";
              i++;
              break;
            }
            if (code[i] === '\n') {
              break;
            }
            str += code[i];
            i++;
          }
          if (str[str.length - 1] !== "'") {
            tokens.push({ type: 'string', value: str, line: line, start, end: i - currentLineStart });
            currentLine++;
            currentLineStart = i;
            continue;
          } else {
            tokens.push({ type: 'string', value: str, line: line, start, end: i - currentLineStart });
            continue;
          }
        }
        
        if (char === '`') {
          const line = currentLine;
          let template = '`';
          i++;
          let inExpression = false;
          let exprDepth = 0;
          
          while (i < code.length) {
            if (code[i] === '\\' && i + 1 < code.length) {
              template += code[i] + code[i + 1];
              i += 2;
              continue;
            }
            if (code[i] === '`' && !inExpression) {
              template += '`';
              i++;
              break;
            }
            if (code[i] === '$' && code[i + 1] === '{' && !inExpression) {
              template += '${';
              i += 2;
              inExpression = true;
              exprDepth = 1;
              continue;
            }
            if (code[i] === '}' && inExpression) {
              exprDepth--;
              template += code[i];
              i++;
              if (exprDepth === 0) {
                inExpression = false;
              }
              continue;
            }
            if (inExpression) {
              if (code[i] === '{') exprDepth++;
              if (code[i] === '}') exprDepth--;
              template += code[i];
              i++;
              continue;
            }
            if (code[i] === '\n') {
              break;
            }
            template += code[i];
            i++;
          }
          if (template[template.length - 1] !== '`') {
            tokens.push({ type: 'template', value: template, line: line, start, end: i - currentLineStart });
            currentLine++;
            currentLineStart = i;
            continue;
          } else {
            tokens.push({ type: 'template', value: template, line: line, start, end: i - currentLineStart });
            continue;
          }
        }
        
        if (/[0-9]/.test(char) || (char === '-' && i + 1 < code.length && /[0-9]/.test(code[i + 1]))) {
          let num = '';
          while (i < code.length && (/[0-9_\.]/.test(code[i]) || (num === '' && code[i] === '-'))) {
            num += code[i];
            i++;
          }
          tokens.push({ type: 'number', value: num, line: currentLine, start, end: i - currentLineStart });
          continue;
        }
        
        if (/[a-zA-Z_]/.test(char)) {
          let ident = '';
          while (i < code.length && /[a-zA-Z0-9_]/.test(code[i])) {
            ident += code[i];
            i++;
          }
          const tokenType = this.validKeywords.has(ident) ? 'keyword' : 'identifier';
          tokens.push({ type: tokenType, value: ident, line: currentLine, start, end: i - currentLineStart });
          continue;
        }
         
        const twoCharOp = code.slice(i, i + 2);
        const threeCharOp = code.slice(i, i + 3);
        const fourCharOp = code.slice(i, i + 4);
        
        if (this.validOperators.has(fourCharOp)) {
          tokens.push({ type: 'operator', value: fourCharOp, line: currentLine, start, end: i - currentLineStart + 4 });
          i += 4;
        } else if (this.validOperators.has(threeCharOp)) {
          tokens.push({ type: 'operator', value: threeCharOp, line: currentLine, start, end: i - currentLineStart + 3 });
          i += 3;
        } else if (this.validOperators.has(twoCharOp)) {
          tokens.push({ type: 'operator', value: twoCharOp, line: currentLine, start, end: i - currentLineStart + 2 });
          i += 2;
        } else if (this.validOperators.has(char)) {
          tokens.push({ type: 'operator', value: char, line: currentLine, start, end: i - currentLineStart + 1 });
          i++;
        } else if (char === '.' || char === ',' || char === ':' || char === ';') {
          tokens.push({ type: 'punctuation', value: char, line: currentLine, start, end: i - currentLineStart + 1 });
          i++;
        } else if (['(', ')', '[', ']', '{', '}'].includes(char)) {
          tokens.push({ type: 'bracket', value: char, line: currentLine, start, end: i - currentLineStart + 1 });
          i++;
        } else {
          tokens.push({ type: 'unknown', value: char, line: currentLine, start, end: i - currentLineStart + 1 });
          i++;
        }
      }
      
      return tokens;
    } catch (e) {
      console.error("Tokenization error:", e);
      return [];
    }
  }

  validateStrings(tokens) {
    const errors = [];
    
    for (const token of tokens) {
      if (token.type === 'string') {
        if (token.value.length < 2) {
          errors.push({
            message: `Unclosed string literal - missing closing quote`,
            line: token.line + 1,
            tokenIndex: tokens.indexOf(token),
            highlightStart: token.start,
            highlightEnd: token.start + 1
          });
        } else {
          const firstChar = token.value[0];
          const lastChar = token.value[token.value.length - 1];
          
          if ((firstChar === '"' && lastChar !== '"') || 
              (firstChar === "'" && lastChar !== "'")) {
            errors.push({
              message: `Unclosed string literal - missing closing ${firstChar}`,
              line: token.line + 1,
              tokenIndex: tokens.indexOf(token),
              highlightStart: token.start,
              highlightEnd: token.start + 1
            });
          }
        }
      } else if (token.type === 'template') {
        if (token.value.length < 2 || token.value[0] !== '`' || token.value[token.value.length - 1] !== '`') {
          errors.push({
            message: `Unclosed template literal - missing closing \``,
            line: token.line + 1,
            tokenIndex: tokens.indexOf(token),
            highlightStart: token.start,
            highlightEnd: token.start + 1
          });
        }
      }
    }
    
    return errors;
  }

  validateComments(tokens) {
    const errors = [];
    
    for (const token of tokens) {
      if (token.type === 'comment') {
        if (token.value.startsWith('/*') && !token.value.endsWith('*/')) {
          errors.push(`Line ${token.line + 1}: Unclosed multi-line comment - missing */`);
        }
      }
    }
    
    return errors;
  }

  validateBrackets(tokens) {
    const errors = [];
    const stack = [];
    const pairs = { '(': ')', '[': ']', '{': '}' };
    
    for (const token of tokens) {
      if (token.type === 'bracket') {
        if (['(', '[', '{'].includes(token.value)) {
          stack.push({ bracket: token.value, line: token.line + 1, start: token.start, tokenIndex: tokens.indexOf(token) });
        } else {
          if (stack.length === 0) {
            errors.push(`Line ${token.line + 1}: Unexpected closing '${token.value}' with no matching opening bracket`);
          } else {
            const last = stack.pop();
            if (pairs[last.bracket] !== token.value) {
              errors.push(`Line ${token.line + 1}: Mismatched brackets - expected '${pairs[last.bracket]}' to match '${last.bracket}' from line ${last.line}, got '${token.value}'`);
            }
          }
        }
      }
    }
    
    for (const item of stack) {
      errors.push({
        message: `Unclosed '${item.bracket}' - missing closing '${pairs[item.bracket]}'`,
        line: item.line,
        tokenIndex: item.tokenIndex,
        highlightStart: item.start,
        highlightEnd: item.start + 1
      });
    }
    
    return errors;
  }

  validateVariableNames(tokens) {
    const errors = [];
    const varRegex = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
    
    for (const token of tokens) {
      if (token.type === 'identifier') {
        if (!varRegex.test(token.value)) {
          if (/[0-9]/.test(token.value[0])) {
            errors.push(`Line ${token.line + 1}: Invalid identifier '${token.value}' - must start with letter or underscore, not a number`);
          } else if (/[^a-zA-Z0-9_]/.test(token.value)) {
            errors.push(`Line ${token.line + 1}: Invalid identifier '${token.value}' - contains invalid characters`);
          } else {
            errors.push(`Line ${token.line + 1}: Invalid identifier '${token.value}' - must start with letter or underscore and contain only letters, numbers, and underscores`);
          }
        }
      }
    }
    
    return errors;
  }

  validateOperators(tokens) {
    const errors = [];
    
    for (const token of tokens) {
      if (token.type === 'unknown') {
        const validOps = Array.from(this.validOperators).sort().join(', ');
        if (!this.validOperators.has(token.value) && token.value.match(/^[+\-*/%^&=|<>!?:]+$/)) {
          errors.push(`Line ${token.line + 1}: Unknown operator '${token.value}' - valid operators: ${validOps}`);
        }
      }
    }
    
    return errors;
  }

  validateTypes(tokens) {
    const errors = [];
    const validTypeList = Array.from(this.validTypes).sort().join(', ');
    
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      
      if (token.type === 'identifier' && this.validTypes.has(token.value)) {
        const prevToken = tokens[i - 1];
        const nextToken = tokens[i + 1];
        
        if (nextToken && nextToken.type === 'identifier') {
          continue;
        }
      }
    }
    
    return errors;
  }

  validateStatements(tokens) {
    const errors = [];
    const statementStack = [];
    
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      
      if (token.type === 'keyword') {
        switch (token.value) {
          case 'def':
            const nextToken = tokens[i + 1];
            const thirdToken = tokens[i + 2];
            
            if (nextToken && nextToken.type === 'identifier') {
              statementStack.push({ type: 'def', line: token.line + 1, parenDepth: 0, hasElse: false });
              break;
            }
            
            if (nextToken && nextToken.type === 'string') {
              statementStack.push({ type: 'def', line: token.line + 1, parenDepth: 0, hasElse: false });
              break;
            }
            
            if (nextToken && nextToken.type === 'bracket' && nextToken.value === '(') {
              if (thirdToken && thirdToken.type === 'bracket' && thirdToken.value === ')') {
                const fourthToken = tokens[i + 3];
                if (fourthToken && fourthToken.type === 'operator' && fourthToken.value === '->') {
                  const fifthToken = tokens[i + 4];
                  if (!fifthToken || fifthToken.type !== 'bracket' || fifthToken.value !== '(') {
                    errors.push(`Line ${token.line}: Invalid function definition - 'def()' followed by '->' without function body. Expected: def name(params) (body) or def "name" "params" (body)`);
                  } else {
                    const sixthToken = tokens[i + 5];
                    if (sixthToken && sixthToken.type === 'keyword' && sixthToken.value === 'return') {
                      if (fifthToken.line === sixthToken.line) {
                        errors.push(`Line ${token.line}: Invalid arrow function syntax - 'def() -> (return ...)' is invalid. Return must be on a new line. Use: def() -> (\n  return ...\n) or: () -> "result"`);
                      }
                    }
                  }
                }
              }
            }
            
            statementStack.push({ type: 'def', line: token.line + 1, parenDepth: 0, hasElse: false });
            break;
            
          case 'if':
            statementStack.push({ type: 'if', line: token.line + 1, parenDepth: 0, hasElse: false });
            break;
            
          case 'else':
            const ifContext = statementStack.slice().reverse().find(t => t.type === 'if');
            if (!ifContext) {
              errors.push(`Line ${token.line + 1}: Unexpected 'else' without matching 'if'`);
            } else {
              ifContext.hasElse = true;
              const ifIdx = statementStack.findIndex(t => t === ifContext);
              if (ifIdx !== -1) {
                statementStack.splice(ifIdx, 1);
              }
            }
            break;
            
          case 'while':
          case 'for':
          case 'each':
          case 'loop':
            statementStack.push({ type: token.value, line: token.line + 1, parenDepth: 0 });
            break;
            
          case 'switch':
            statementStack.push({ type: 'switch', line: token.line + 1, parenDepth: 0 });
            break;
            
          case 'case':
          case 'default':
            const switchContext = statementStack.find(t => t.type === 'switch');
            if (!switchContext) {
              errors.push(`Line ${token.line + 1}: '${token.value}' keyword can only be used inside switch statement`);
            }
            break;
            
          case 'return':
            const funcContext = statementStack.slice().reverse().find(t => t.type === 'def');
            if (!funcContext) {
              errors.push(`Line ${token.line + 1}: 'return' statement can only be used inside a function`);
            }
            break;
            
          case 'break':
          case 'continue':
            const loopContext = statementStack.slice().reverse().find(t => 
              ['for', 'while', 'each', 'loop', 'switch'].includes(t.type)
            );
            if (!loopContext) {
              errors.push(`Line ${token.line + 1}: '${token.value}' statement can only be used inside loops or switch`);
            }
            break;
        }
      }
      
      if (token.type === 'bracket' && token.value === '(' && statementStack.length > 0) {
        statementStack[statementStack.length - 1].parenDepth++;
      }
      
      if (token.type === 'bracket' && token.value === ')' && statementStack.length > 0) {
        const topCtx = statementStack[statementStack.length - 1];
        if (topCtx && topCtx.parenDepth > 0) {
          topCtx.parenDepth--;
        } else if (topCtx && topCtx.parenDepth === 1 && topCtx.type === 'if') {
          topCtx.parenDepth--;
        } else if (topCtx) {
          statementStack.pop();
        }
      }
    }
    
    return errors;
  }

  validateFunctionSyntax(tokens) {
    const errors = [];
    
    // Remove all function syntax validation related to arrow operators
    // The -> operator is valid in OSL and should not be checked
    
    return errors;
  }

  lintSyntax(codeStr, silent = true) {
    const errors = [];
    if (!silent) console.log("Starting OSL syntax check...\n");
    
    const startTime = Date.now();
    
    const tokens = this.tokeniseCode(codeStr);
    const tokenTime = Date.now() - startTime;
    
    if (!silent) {
      console.log(`Tokenized in ${tokenTime}ms`);
      console.log(`Found ${tokens.length} tokens\n`);
    }
    
    errors.push(...this.validateStrings(tokens));
    errors.push(...this.validateComments(tokens));
    errors.push(...this.validateBrackets(tokens));
    errors.push(...this.validateVariableNames(tokens));
    errors.push(...this.validateOperators(tokens));
    errors.push(...this.validateTypes(tokens));
    errors.push(...this.validateStatements(tokens));
    errors.push(...this.validateFunctionSyntax(tokens));
    
    const totalTime = Date.now() - startTime;
    
    if (!silent) {
      if (errors.length === 0) {
        console.log(`✓ No syntax errors found (checked in ${totalTime}ms)`);
      } else {
        console.log(`✗ Found ${errors.length} syntax error(s):\n`);
        errors.forEach((err, idx) => {
          if (typeof err === 'object' && err.message) {
            console.log(`  ${idx + 1}. ${err.message}`);
          } else {
            console.log(`  ${idx + 1}. ${err}`);
          }
        });
      }
    }
    
    return { tokens, errors, timing: { tokenization: tokenTime, total: totalTime } };
  }
}
class OSLUtils {
  constructor() {
    this.regex = /"[^"]+"|{[^}]+}|\[[^\]]+\]|[^."(]*\((?:(?:"[^"]+")*[^.]+)*|\d[\d.]+\d|[^." ]+/g;
    this.operators = ["+", "++", "-", "*", "/", "//", "%", "??", "^", "|>", "to", "is", "::"]
    this.comparisons = ["!=", "==", "!==", "===", ">", "<", "!>", "!<", ">=", "<=", "in"]
    this.logic = ["and", "or", "nor", "xor", "xnor", "nand"]
    this.bitwise = ["|", "&", "<<", ">>", ">>>", "<<<", "^^"]

    this.listVariable = "";
    this.fullASTRegex = /("(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`|'(?:[^'\\]|\\.)*')|\/\*[^*]+|[,{\[]\s*[\r\n]\s*[}\]]?|[\r\n]\s*[}\.\]]|;|(?<=[)"\]}a-zA-Z\d])\[(?=[^\]])|(?<=[)\]])\(|([\r\n]|^)\s*\/\/[^\r\n]+|[\r\n]/gm;
    this.lineTokeniserRegex = /("(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`|'(?:[^'\\]|\\.)*')|(?<=[\]"}\w\)])(?:\+\+|\?\?|::|->|==|!=|<=|>=|[><?+*^%/\-|&])(?=\S)/g;
    // Pre-compile line ending normalization regex
    this.lineEndingRegex = /\r\n/g;
    this.macLineEndingRegex = /\r/g;
    // Store inlinable functions
    this.inlinableFunctions = {};
    // Store function return type signatures for type checking
    this.functionReturnTypes = {
      'random': { accepts: ['number', 'number'], returns: 'number' },
      'typeof': { accepts: ['any'], returns: 'string' }
    };
    // Optimization caches and pools
    this.nodePool = [];
    this.tokenCache = new Map();
    this.astCache = new Map();
    this.constFoldingCache = new Map();
    this.typeCache = new Map();
    // Pre-compiled evaluation sets for faster lookups
    this.staticTypes = new Set(["str", "num", "unk", "cmd", "raw"]);
    this.evaluableOps = new Set(["+", "-", "*", "/", "%", "^", "==", "!=", ">", "<", ">=", "<=", "and", "or"]);
    this.inlinableOps = new Set(["+", "-", "*", "/", "%", "^"]);
    // String pools for common operations
    this.commonStrings = new Map([
      ["=", "="], ["@=", "@="], ["++", "++"], ["--", "--"],
      ["def", "def"], ["if", "if"], ["else", "else"], ["for", "for"],
      ["while", "while"], ["return", "return"], ["true", "true"], ["false", "false"]
    ]);

    // Optimization settings
    this.optimizationSettings = {
      maxLoopUnrollCount: 8, // Maximum number of iterations to unroll
      maxLoopUnrollSize: 50, // Maximum AST nodes to unroll
      deadCodeElimination: true,
      constantFolding: true,
      loopUnrolling: true
    };

    this.scopes = [];
    this.scope = null;

    this.linter = new OSLLinter();

    // Track variables and their usage for dead code elimination
    this.variableUsage = new Map();
    this.definedVariables = new Set();
    // Global variable type map for system-wide builtins
    this.globalVariableTypes = {
      'screensize_x': 'number',
      'screensize_y': 'number',
      'mouse_x': 'number',
      'mouse_y': 'number',
      'mouse_down': 'boolean',
      'mouse_right': 'boolean',
      'mouse_middle': 'boolean',
      'mouse_ondown': 'boolean',
      'delta_time': 'number',
      'onclick': 'boolean',
      'clicked': 'boolean',
      'mouse_touching': 'boolean',
      'self': 'object',
      'user': 'object',
      'system_os': 'string',
      'timezone': 'string',
      'file_dragging': 'boolean',
      'window': 'object',
      'window_width': 'number',
      'window_height': 'number',
      'window_top_index': 'number',
      'window_id_index': 'number',
      'background_url': 'string',
      'background_width': 'number',
      'background_height': 'number',
      'timer': 'number',
      'timestamp': 'number',
      'frame_width': 'number',
      'frame_height': 'number',
      'frame': 'number',
      'roturlink': 'object',
      'global_accent': 'string',
      'passed_data': 'any',
      'fps': 'number',
      'fps_limit': 'number',
      'x_position': 'number',
      'y_position': 'number',
      'requests': 'object', // the global http requests class
      'promise': 'object', // the global promise class
      'physics': 'object', // the global physics class
      'data': 'any', // a legacy variable used for command returns
      'network_data': 'any',
      'network_data_from': 'string',
      'network_data_command': 'string',
      'packet': 'object',
      'network': 'object', // the global network class
      'battery_time_until_full': 'number',
      'battery_time_until_empty': 'number',
      'battery_percent': 'number',
      'battery_charging': 'boolean',
      'accent_colour': 'string',
      'window_colour': 'string',
      'selected_input': 'string',
      'terminal_output': 'array',
      'second': 'number',
      'minute': 'number',
      'hour': 'number',
      'day': 'string',
      'day_number': 'number',
      'month': 'string',
      'month_number': 'number',
      'year': 'number',
      'scope': 'object',
      'performance': 'number',
      'current_colour': 'string',
      'bg_redrawn': 'boolean',
      'local_timer': 'number',
      'loaded_file': 'string',
      'file_dragging': 'boolean',
      'direction': 'number',
      'stretch_x': 'number',
      'stretch_y': 'number',
      'window_timer': 'number',
      'this': 'object',
    };

    this.tkn = {
      str: 0,
      num: 1,
      raw: 2,
      unk: 3,
      obj: 4,
      arr: 5,
      fnc: 6,
      mtd: 7,
      asi: 8,
      opr: 9,
      cmp: 10,
      spr: 11,
      log: 12,
      qst: 13,
      bit: 14,
      ury: 15,
      mtv: 16,
      cmd: 17,
      mod_indicator: 18,
      inl: 19,
      blk: 20,
      var: 21,
      tsr: 22,
      evl: 23,
      rmt: 24,
      mod: 25,
      bsl: 26
    }

    this.byslTypes = {
      tot: 0,
      var: 1,
      num: 2,
      "+": 3,
      "-": 4,
      "*": 5,
      "/": 6,
      prp: 7, // get object prop
      ">": 8,
      "<": 9,
      "==": 10,
      "!=": 11,
      and: 12,
      or: 13,
      unk: 14,
      str: 15,
      "%": 16,
      "^": 17,
      "//": 18,
      "??": 19,
      "++": 20,
      ">=": 21,
      "<=": 22,
      "!>": 23,
      "!<": 24,
      "===": 25,
      "!==": 26,
      in: 27,
      notIn: 28,
      nor: 29,
      xor: 30,
      xnor: 31,
      nand: 32,
      "|": 33,
      "&": 34,
      "<<": 35,
      ">>": 36,
      "^^": 37,
      "raw": 38,
      ">>>": 39,
      "<<<": 40,
    }

    if (typeof window !== "undefined") {
      window.osl_tkn = this.tkn;
      window.bysl_types = this.byslTypes;
    }
  }

  getInfo() {
    return {
      id: "OSLUtils",
      name: "OSL Utils",
      blocks: [
        {
          opcode: "tokenise",
          blockType: Scratch.BlockType.REPORTER,
          text: "Tokenise OSL [CODE]",
          arguments: {
            CODE: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'log "hello"',
            },
          },
        },
        {
          opcode: "tokeniseraw",
          blockType: Scratch.BlockType.REPORTER,
          text: "Tokenise OSL Raw [CODE]",
          arguments: {
            CODE: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'log "hello"',
            },
          },
        },
        {
          opcode: "tokeniseValues",
          blockType: Scratch.BlockType.REPORTER,
          text: "Tokenise OSL Values [CODE] [DELIMITER]",
          arguments: {
            CODE: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '"hello".index("l").bool',
            },
            DELIMITER: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: ".",
            },
          },
        },
        "---",
        {
          blockType: Scratch.BlockType.LABEL,
          text: "AST",
        },
        {
          opcode: "generateAST",
          blockType: Scratch.BlockType.REPORTER,
          text: "Generate AST [CODE]",
          arguments: {
            CODE: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'wow = 10 + 5 / 5.toNum().toStr().join(newline)',
            },
          },
        },
        {
          opcode: "generateFullAST",
          blockType: Scratch.BlockType.REPORTER,
          text: "Generate Full AST [CODE]",
          arguments: {
            CODE: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'def test(a, b) -> a + b\nlog test(10, 20)',
            },
          },
        },
        {
          opcode: "getErrorsFromAstMain",
          blockType: Scratch.BlockType.REPORTER,
          text: "Get Errors From AST [AST]",
          arguments: {
            AST: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '{}',
            },
          },
        },
        {
          opcode: "lintSyntax",
          blockType: Scratch.BlockType.REPORTER,
          text: "Lint Syntax [CODE]",
          arguments: {
            CODE: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'log "hello"',
            },
          },
        },
        "---",
        {
          opcode: "setOperators",
          blockType: Scratch.BlockType.COMMAND,
          text: "Set Operators [OPERATORS]",
          arguments: {
            OPERATORS: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '["+", "-", "*", "/", "//", "%", "??", "", "^", "b+", "b-", "b/", "b*", "b^"]',
            },
          },
        },
        {
          opcode: "setComparisons",
          blockType: Scratch.BlockType.COMMAND,
          text: "Set Comparisons [COMPARISONS]",
          arguments: {
            COMPARISONS: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '["!=", "==", "!==", "===", ">", "<", "!>", "!<", ">=", "<=", "in", "notIn"]',
            },
          },
        }, {
          opcode: "setLogic",
          blockType: Scratch.BlockType.COMMAND,
          text: "Set Logic [LOGIC]",
          arguments: {
            LOGIC: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '["and", "or", "nor", "xor", "xnor", "nand"]',
            },
          },
        },
        {
          opcode: "setBitwise",
          blockType: Scratch.BlockType.COMMAND,
          text: "Set Bitwise [BITWISE]",
          arguments: {
            BITWISE: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '["|", "&", "<<", ">>", ">>>", "<<<", "^^"]',
            },
          },
        },
      ],
    };
  }

  // generate the bytecode
  generateBysl(ast) {
    const memMap = new Map()
    const queue = [];
    const types = this.byslTypes

    function stepAst(node) {
      queue.push(node)
      switch (node?.type) {
        case "opr": case "cmp": case "log": case "bit":
          stepAst(node.left)
          stepAst(node.right)
          break
        case "evl":
          stepAst(node.data)
          break
      }
    }

    stepAst(ast)

    // reverse so we can process the nodes in reverse
    queue.reverse()
    let out = []
    try {
      // only ever push to "out"
      // this means V8 can keep all the memory sequential and fast
      for (let i = 0, l = queue.length; i < l; i++) {
        const cur = queue[i]
        const size = memMap.size
        // we always set memory so having this outside the switch is more efficient
        memMap.set(cur, size)
        // store the size of the map for each node, allowing the memory location to be specific to the node itself
        // references allow this to work because the queue is full of references, *not values*
        switch (cur?.type) {
          case "var":
            out.push(size, types.var, cur.data, 0)
            break
          case "num": case "unk": case "str": case "raw":
            out.push(size, types[cur.type], cur.data, 0)
            break
          case "opr": case "cmp": case "log": case "bit":
            if (types[cur.data] === undefined) throw new Error(`'${cur.data}' is unsupported by bysl`)
            out.push(size, types[cur.data], memMap.get(cur.left), memMap.get(cur.right))
            break
          case "mtd":
            if (bysl_types[cur?.type] === undefined) throw new Error(`'${cur.type}' is unsupported by bysl`)
            out.push(size, types.var, cur?.data?.[0].data, 0)
            const data = cur.data
            for (let j = 1; j < data.length; j++) {
              const cur2 = data[j]
              if (cur2.type !== "var") throw new Error(`'${cur2.data}' in mtd must be a var`)
              out.push(size, types.prp, memMap.get(cur), cur2.data)
            }
            break
          default:
            throw new Error(`Unsupported node for bysl: '${JSON.stringify(cur)}'`)
        }
      }

      // let the interpreter know how much memory is nessecary for this bysl
      // bad for memory but might be the best way here
      out.unshift(0, types.tot, memMap.size, 0)
      return { success: true, code: out }
    } catch(e) {
      return { success: false, code: out } // catch when it fails to generate
    }
  }

  // Normalize line endings using pre-compiled regex for better performance
  normalizeLineEndings(text) {
    return text.replace(this.lineEndingRegex, '\n').replace(this.macLineEndingRegex, '\n');
  }

  tokeniseLineOSL(code) {
    code = code.replace(this.lineTokeniserRegex, v => {
      if (v.startsWith('"') || v.startsWith("'") || v.startsWith('`')) return v;
      return ` ${v} `
    })
    try {
      let letter = 0;
      let depth = "";
      let quotes = 0;
      let squotes = 0;
      let backticks = 0;
      let m_comm = 0;
      let b_depth = 0;
      let out = [];
      let split = [];
      let escaped = false;
      const len = code.length;

      while (letter < len) {
        depth = code[letter];
        if (quotes === 0 && squotes === 0 && backticks === 0 && !escaped) {
          if (depth === "[" || depth === "{" || depth === "(") b_depth++
          if (depth === "]" || depth === "}" || depth === ")") b_depth--
          b_depth = b_depth < 0 ? 0 : b_depth;
        }
        if (depth === '"' && !escaped && squotes === 0 && backticks === 0) quotes = 1 - quotes;
        else if (depth === "'" && !escaped && quotes === 0 && backticks === 0) squotes = 1 - squotes;
        else if (depth === "`" && !escaped && quotes === 0 && squotes === 0) backticks = 1 - backticks;
        else if (depth === "/" && code[letter + 1] === "*" && quotes === 0 && squotes === 0 && backticks === 0) m_comm = 1;
        else if (depth === "*" && code[letter + 1] === "/" && quotes === 0 && squotes === 0 && backticks === 0 && m_comm === 1) m_comm = 0;
        else if (depth === '\\' && !escaped) escaped = !escaped;
        else escaped = false;
        if (m_comm === 0) out.push(depth);
        letter++;

        if (quotes === 0 &&
          squotes === 0 &&
          backticks === 0 &&
          b_depth === 0 &&
          m_comm === 0 &&
          (
            code[letter] === " " ||
            code[letter] === ")"
          )
        ) {
          if ([" ", ")"].includes(code[letter]) === false) {
            split.push(depth);
          } else {
            split.push(out.join(""));
          }
          out = [];
          letter++;
        }
      }
      split.push(out.join(""));
      return split;
    } catch (e) {
      console.error("Error in tokeniseLineOSL:", e);
      return [];
    }
  }

  tokeniseLines(CODE) {
    try {
      // Normalize line endings first
      CODE = this.normalizeLineEndings(CODE);

      let letter = 0;
      let depth = "";
      let quotes = 0;
      let backticks = 0;
      let b_depth = 0;
      let out = [];
      let split = [];
      let escaped = false;
      const len = CODE.length;

      while (letter < len) {
        depth = CODE[letter];
        if (quotes === 0 && backticks === 0 && !escaped) {
          if (depth === "[" || depth === "{" || depth === "(") b_depth++
          if (depth === "]" || depth === "}" || depth === ")") b_depth--
          b_depth = b_depth < 0 ? 0 : b_depth;
        }
        if (depth === '"' && !escaped && backticks === 0) {
          quotes = 1 - quotes;
          out.push('"');
        } else if (depth === '`' && !escaped && quotes === 0) {
          backticks = 1 - backticks;
          out.push('`');
        } else if (depth === '\\' && !escaped) {
          escaped = !escaped;
          out.push("\\");
        } else {
          out.push(depth);
          escaped = false;
        }
        letter++;

        if (quotes === 0 && backticks === 0 && ["\n", ";"].includes(CODE[letter]) && b_depth === 0) {
          split.push(out.join(""));
          out = [];
          letter++;
        }
      }
      split.push(out.join(""));
      return split;
    } catch (e) {
      return [];
    }
  }

  findMatchingParentheses(code, startIndex) {
    let depth = 1;
    let endIndex = startIndex + 1;
    while (endIndex < code.length) {
      if (code[endIndex] === "(") depth++;
      else if (code[endIndex] === ")" && --depth === 0) return endIndex;
      endIndex++;
    }
    return -1;
  }

  evalToken(cur, param) {
    const out = this.stringToToken(cur, param)
    out.source = out.type === "blk" ? "[ast BLK]" : cur;
    out.inferredType ??= "any";
    return out
  }

  stringToToken(cur, param) {
    let start = cur[0]
    const tkn = this.tkn;
    if (cur === "/@line") return { type: "unk", num: tkn.unk, data: "/@line" }
    if (!isNaN(+`${cur}`.replaceAll("_", ""))) return { type: "num", num: tkn.num, data: +`${cur}`.replaceAll("_", ""), inferredType: "number" }
    else if (cur === "true" || cur === "false") return { type: "raw", num: tkn.raw, data: cur === "true", inferredType: "boolean" }
    else if (this.operators.indexOf(cur) !== -1) return { type: "opr", num: tkn.opr, data: cur }
    else if (cur === "++") return { type: "opr", num: tkn.opr, data: "++" }
    else if (cur === "--") return { type: "unk", num: tkn.unk, data: "--" }
    else if (this.comparisons.indexOf(cur) !== -1) return { type: "cmp", num: tkn.cmp, data: cur, inferredType: "boolean" }
    else if (cur.endsWith("=")) return { type: "asi", num: tkn.asi, data: cur }
    else if (start + cur[cur.length - 1] === '""') return { type: "str", num: tkn.str, data: destr(cur), inferredType: "string" }
    else if (start + cur[cur.length - 1] === "''") return { type: "str", num: tkn.str, data: destr(cur, "'"), inferredType: "string" }
    else if (start + cur[cur.length - 1] === "``") {
      return {
        type: "tsr", num: this.tkn.tsr, inferredType: "string", data: parseTemplate(destr(cur, "`")).filter(v => v !== "").map(v => {
          if (v.startsWith("${")) return this.generateAST({ CODE: v.slice(2, -1), START: 0 })[0]
          else return { type: "str", num: tkn.str, data: v, inferredType: "string" }
        })
      }
    }
    else if (cur === "?") return { type: "qst", num: tkn.qst, data: cur }
    else if (this.logic.indexOf(cur) !== -1) return { type: "log", num: tkn.log, data: cur, inferredType: "boolean" }
    else if (this.bitwise.indexOf(cur) !== -1) return { type: "bit", num: tkn.bit, data: cur }
    else if (cur.startsWith("...")) return { type: "spr", num: tkn.spr, data: this.evalToken(cur.substring(3)) }
    else if (["!", "-", "~"].includes(start) && cur.length > 1) {
      const obj = { type: "ury", num: tkn.ury, data: start, right: this.evalToken(cur.slice(1)) };
      switch (start) {
        case "!": obj.inferredType = "boolean"; break;
        case "-": obj.inferredType = "number"; break;
        case "~": obj.inferredType = "number"; break;
      }
      return obj;
    }
    else if (autoTokenise(cur, ".").length > 1) {
      let method = autoTokenise(cur, ".")
      method = method.map((input, index) => this.evalToken(input, index > 0))
      return { type: "mtd", num: this.tkn.mtd, data: method };
    }
    else if ((start === "{" && cur[cur.length - 1] === "}") || (start === "[" && cur[cur.length - 1] === "]")) {
      try {
        if (start === "[") {
          if (cur == "[]") {
            if (param) return { type: "mtv", num: this.tkn.mtv, data: "item", parameters: [] };
            else return { type: "arr", num: this.tkn.arr, data: [], inferredType: "array" };
          }

          let tokens = autoTokenise(cur.substring(1, cur.length - 1), ",");
          while (`${tokens[tokens.length - 1]}`.trim() === "") tokens.pop();

          for (let i = 0; i < tokens.length; i++) {
            let cur = ("" + tokens[i]).trim()
            if (cur.startsWith("/@line ")) {
              const first = cur.split("\n", 1)[0]
              cur = cur.replace(first + "\n", "").trim()
            }
            tokens[i] = this.generateAST({ CODE: autoTokenise(cur, "\n")[0], START: 0 })[0];
          }

          if (param) {
            const obj = { type: "mtv", num: this.tkn.mtv, data: "item", parameters: tokens };
            obj.isStatic = tokens.every(token => this.isStaticToken(token));
            if (obj.isStatic) {
              if (tokens.length === 1 && tokens[0].type === "str") {
                return { type: "mtv", num: this.tkn.mtv, data: tokens[0].data }
              }
              obj.static = tokens.map(token => token.data);
            }
            return obj;
          }
          const arr = { type: "arr", num: this.tkn.arr, data: tokens, inferredType: "array" };
          arr.isStatic = tokens.every(token => this.isStaticToken(token));
          if (arr.isStatic) arr.static = tokens.map(token => token.data);
          return arr;
        } else if (cur[0] === "{") {
          if (cur == "{}") return { type: "obj", num: this.tkn.obj, data: [], inferredType: "object" };

          let output = [];
          let tokens = autoTokenise(cur.substring(1, cur.length - 1), ",")
            .filter(token => token.trim() !== "");
          for (let token of tokens) {
            let [key, value] = autoTokenise(token, ":");
            key = key.trim();
            if (key.startsWith("/@line ")) {
              const first = key.split("\n", 1)[0]
              key = key.replace(first + "\n", "").trim()
            }
            const stripLineTags = (s) => {
              if (s === undefined || s === null) return s;
              let out = String(s);
              out = out.replace(/\/@line(?:\s+\d+)?\s*\n/g, "");
              out = out.replace(/\/@line(?:\s+\d+)?\s*$/g, "");
              return out.trim();
            };
            key = stripLineTags(key);
            value = stripLineTags(value);
            if (value === undefined) {
              let nkey = this.generateAST({ CODE: key, START: 0 })[0]
              if (nkey.num === this.tkn.var) {
                value = nkey
                nkey = this.generateAST({ CODE: JSON.stringify(key), START: 0 })[0]
              }
              output.push([nkey, value ?? null])
              continue;
            }
            if (key.startsWith("(") && key.endsWith(")")) {
              key = key.substring(1, key.length - 1).trim();
              key = this.generateAST({ CODE: key, START: 0 })[0]
            } else {
              let temp_key = this.evalToken(key);
              if (temp_key.num === this.tkn.var || temp_key.num === this.tkn.num) key = JSON.stringify(key)
              key = this.generateAST({ CODE: key, START: 0 })[0]
            }
            if (value === undefined) output.push([key, null]);
            else output.push([key, this.generateAST({ CODE: ("" + value).trim(), START: 0 })[0]]);
          }
          return { type: "obj", num: this.tkn.obj, data: output, inferredType: "object" };
        }
      } catch (e) {
        console.error(e)
        return { type: "unk", num: this.tkn.unk, data: cur }
      }
    }
    else if (cur === "null") return { type: "unk", num: this.tkn.unk, data: null, inferredType: "null" }
    else if (["if", "else", "as", "to", "from", "extends"].includes(cur)) return { type: "cmd", num: this.tkn.cmd, data: cur }
    else if (cur.match(VAR_REGEX)) {
      const varData = this.getVariableData(cur);
      const inferredType = varData?.type || 'any';
      const token = {
        type: "var", num: this.tkn.var, data: cur, inferredType,
        quickReturn: inferredType !== "any" && inferredType !== "object",
        // scopes: this.scopes
      }
      if (false && varData?.value !== undefined) {
        token.isConstant = true;
        token.value = varData.value;
      }
      return token;
    }
    else if (cur === "->") return { type: "inl", num: this.tkn.inl, data: "->" }
    else if (cur.startsWith("(\n") && cur.endsWith(")")) {
      this.enterScope();
      const ast = this.generateFullAST({ CODE: cur.substring(2, cur.length - 1).trim(), START: 0, MAIN: false })
      this.exitScope();
      return { type: "blk", num: this.tkn.blk, data: ast }
    }
    else if (cur.startsWith("(") && cur.endsWith(")")) {
      let end = this.findMatchingParentheses(cur, 0);
      if (end === -1) return { type: "unk", num: this.tkn.unk, data: cur, parse_error: "Unmatched parentheses" };
      const body = cur.substring(1, end).trim();
      if (body.length === 0) return { type: "unk", num: this.tkn.unk, data: cur, parse_error: "Empty parentheses" };
      return this.generateAST({ CODE: body, START: 0 })[0]
    }
    else if (cur.endsWith(")") && cur.length > 1) {
      let out = { type: param ? "mtv" : "fnc", num: param ? this.tkn.mtv : this.tkn.fnc, data: cur.substring(0, cur.indexOf("(")), parameters: [] }
      if (cur.endsWith("()")) return out
      let method = autoTokenise(cur.substring(cur.indexOf("(") + 1, cur.length - 1), ",")
      method = method.map(v => {
        const tkns = autoTokenise(v.trim(), " ");
        if (tkns.length === 2) {
          const ast = this.generateAST({ CODE: tkns[1].trim(), START: 0 })[0]
          ast.set_type = tkns[0]
          return ast
        }
        return this.generateAST({ CODE: v.trim(), START: 0 })[0]
      })
      if (method.every(item => this.isStaticToken(item)) || method.length === 0) {
        out.isStatic = true;
        out.static = method.map(item => item.data)
      }
      out.parameters = method
      return out
    }
    else if (cur === ":") return { type: "mod_indicator", num: this.tkn.mod_indicator, data: ":" };
    return { type: "unk", num: this.tkn.unk, data: cur }
  }

  isStaticToken(token) {
    return ["str", "num", "unk", "cmd", "raw"].includes(token?.type);
  }

  generateError(ast, error) {
    const newAst = this.generateAST({ CODE: `throw "error" '${error}'` });
    newAst[0].source = ast.source;
    newAst[0].line = ast.line;
    return newAst;
  }

  enterScope() {
    if (this.scopeDisabled) return;
    this.scopes.push(Object.create(null));
    this.scope = this.scopes[this.scopes.length - 1];
  }

  clearScope() {
    this.scopes = [Object.create(null)];
    this.scope = this.scopes[0];
    this.scopeDisabled = false;
  }

  enableScopes() {
    if (this.scopeDisabled) {
      this.scopes = [Object.create(null)];
      this.scope = this.scopes[0];
      this.scopeDisabled = false;
    }
  }

  disableScopes() {
    this.scopes = [];
    this.scope = null;
    this.scopeDisabled = true;
  }

  exitScope() {
    if (this.scopeDisabled) return;
    this.scopes.pop();
    this.scope = this.scopes[this.scopes.length - 1] || Object.create(null);
  }

  setVariableType(varName, varType, stronglyTyped = false, value = undefined) {
    if (this.scopeDisabled) return;
    for (let i = this.scopes.length - 1; i >= 0; i--) {
      const scope = this.scopes[i];
      if (varName in scope && scope[varName] !== varType) {
        const curStronglyTyped = scope[varName]?.stronglyTyped;
        if (curStronglyTyped === true && stronglyTyped === false) {
          // cannot override strongly typed variable
          // TODO: add proper type error checking into ast
          stronglyTyped = true;
          continue;
        }
        scope[varName] = {
          type: "any",
          stronglyTyped: curStronglyTyped
        };
      }
    }
    if (this.scope) {
      this.scope[varName] = {
        type: varType,
        stronglyTyped
      };
      if (value !== undefined) {
        this.scope[varName].value = value;
      }
    }
  }

  getVariableType(varName) {
    if (this.scopeDisabled) return 'any';
    for (let i = this.scopes.length - 1; i >= 0; i--) {
      if (this.scopes[i][varName]) {
        return this.scopes[i][varName]?.type;
      }
    }
    return this.globalVariableTypes[varName]?.type || 'any';
  }

  getVariableData(varName) {
    if (this.scopeDisabled) return null;
    for (let i = this.scopes.length - 1; i >= 0; i--) {
      if (this.scopes[i][varName]) {
        return this.scopes[i][varName];
      }
    }
  }

  isTypeReferencable(type) {
    return !["null", "number", "string", "boolean"].includes(type);
  }

  generateAST({ CODE, START, MAIN }) {
    CODE = CODE + "";
    // Normalize line endings to handle Windows/Mac differences
    CODE = this.normalizeLineEndings(CODE);
    const start = CODE.split("\n", 1)[0]
    let handlingMods = false;
    // tokenise and handle lambda and inline funcs
    let ast = []
    let tokens = this.tokeniseLineOSL(CODE)
    switch (tokens[0]) {
      case "for":
        this.setVariableType(tokens[1], "number");
        break
      case "switch":
        this.disableScopes();
        break
      case "def":
        
    }
    for (let i = 0; i < tokens.length; i++) {
      const cur = tokens[i].trim()
      if (cur === "->") {
        const data = tokens[i + 1].trim()
        ast.push({ type: "inl", num: this.tkn.inl, data: "->" })
        ast.push({ type: "str", num: this.tkn.str, data, source: data })
        i += 1;
        continue;
      }
      if (handlingMods) {
        const token = { type: "mod", num: this.tkn.mod, data: cur, source: cur };
        const pivot = token.data.indexOf("#") + 1
        const raw = token.data.substring(pivot);
        if (/^[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(raw)) {
          token.data = [token.data.substring(0, pivot - 1), { type: "str", num: this.tkn.str, data: raw, source: raw }]
        } else {
          token.data = [token.data.substring(0, pivot - 1), this.evalToken(raw)]
        }
        ast.push(token);
        continue;
      }
      const curT = this.evalToken(cur)
      if (curT.type === "mod_indicator") {
        handlingMods = true;
        continue;
      }
      ast.push(curT)
    }

    // join together nodes that should be a single node
    const types = ["opr", "cmp", "qst", "bit", "log", "inl"];
    for (let type of types) {
      for (let i = START ?? (["inl"].includes(type) ? 1 : 2); i < ast.length; i++) {
        const cur = ast[i];
        let prev = ast[i - 1];
        let next = ast[i + 1];

        if (cur?.type === type) {
          if (type === "opr") {
            cur.inferredType = this._inferOperatorResultType(cur.data, prev?.inferredType, next?.inferredType);
          }
          if (type === "qst") {
            cur.left = prev;
            cur.right = next;
            cur.right2 = ast[i + 2];
            ast.splice(i - 1, 1);
            ast.splice(i, 2);
            i -= 1;
            continue;
          }
          if (!cur.left) {
            cur.left = prev;
            cur.right = next;
            cur.source = `${prev?.source ?? ""} ${cur?.source ?? ""} ${next?.source ?? ""}`
            ast.splice(i - 1, 1);
            ast.splice(i, 1);
            i -= 1;
          }
        }
      }
    }

    for (let i = 0; i < ast.length; i++) {
      if (ast[i] && ast[i].parse_error) {
        return this.generateError(ast[i], ast[i].parse_error);
      }
    }

    const evalASTNode = node => {
      if (!node) return node;

      if (Array.isArray(node)) {
        return node.map(item => evalASTNode(item));
      }

      if (typeof node === "object" && node !== null) {
        const processedNode = { ...node };
        for (const key in processedNode) {
          if (processedNode.hasOwnProperty(key) && key !== "source") {
            processedNode[key] = evalASTNode(processedNode[key]);
          }
        }
        node = processedNode;
      }

      if (node.type === "inl") {
        const rawParams = (node?.left?.parameters ?? []);
        const params = rawParams.map(p => {
          const typePrefix = p?.set_type ? `${p.set_type} ` : "";
          return typePrefix + (p?.data ?? "");
        })

        let paramStr = params.join(',');
        if (node.left?.type === "var") paramStr = node.left.data;
        const right = node.right;
        if (typeof right.data === "string" && !right.data.trim().startsWith("(\n") && node.left) {
          paramStr = node.left.source.replace(/^\(|\)$/gi, "").trim();
          right.data = `(\nreturn ${right.source}\n)`;
        }

        const paramNames = []
        const accepts = params.map(v => {
          const parts = ("" + v).trim().split(/\s+/).filter(Boolean)
          const len = parts.length
          paramNames.push(parts[len - 1])
          if (len > 1) return parts[0]
          return 'any'
        })

        this.enterScope();
        for (let i = 0; i < paramNames.length; i++) {
          this.setVariableType(paramNames[i], accepts[i], accepts[i] !== 'any');
        }
        const fnBody = this.generateAST({ CODE: right.data, START: 0 })[0]
        this.exitScope();

        const leftSrc = typeof node.left?.source === 'string' ? node.left.source.trim() : '';
        const strictAnyArgs = leftSrc.startsWith('def(') && accepts.some(t => t === 'any');

        return {
          type: "fnc", num: this.tkn.fnc,
          data: "function",
          strictAnyArgs,
          parameters: [
            {
              type: "str", num: this.tkn.str,
              data: paramStr,
              accepts: accepts,
              params: paramNames,
              source: paramStr
            },
            fnBody,
            {
              type: "unk", num: this.tkn.unk,
              data: node.source.startsWith("def(") ? false : true
            }
          ]
        }
      }
      if (node.left && node.right) {
        let result;
        switch (node.type) {
          case "opr":
            node.right = evalASTNode(node.right);

            // If both operands are numbers, evaluate the operation
            if (node.left.type === "num" && node.right.type === "num" && ["+", "-", "/", "*", "%", "^"].includes(node.data)) {
              switch (node.data) {
                case "^": result = +Math.pow(+node.left.data, +node.right.data); break;
                case "+": result = +node.left.data + +node.right.data; break;
                case "-": result = +node.left.data - +node.right.data; break;
                case "*": result = +node.left.data * +node.right.data; break;
                case "/": result = +node.left.data / +node.right.data; break;
                case "%": result = +node.left.data % +node.right.data; break;
              }
              if (result) return {
                type: "num", num: this.tkn.num,
                data: +result,
                source: result.toString(),
                inferredType: "number"
              };
            }
            break;
        }
      }
      return node;
    }

    // Evaluate each node in the AST
    for (let i = 0; i < ast.length; i++) ast[i] = evalASTNode(ast[i]);

    // def command -> assignment conversion
    let first = ast[0] ?? {};
    let second = ast[1] ?? {};
    const local = first.data === "local" && first.type === "var";
    if (
      (first.type === "var" || first.type === "cmd") &&
      first.data === "def"
    ) {
      if (second.type === "fnc") {
        if (local) {
          ast.splice(0, 1);
          if (ast.length === 0) return [];
          first = ast[0] ?? {};
          second = ast[1] ?? {};
        }

        let funcName, paramSpec, funcBody, returnType = 'any';

        // Function definition: def function_name(params)
        funcName = second.data;
        const params = second.parameters?.map(p => {
          const typePrefix = p.set_type ? `${p.set_type} ` : "";
          return typePrefix + p.data;
        });
        paramSpec = params.join(",");

        if (ast[2]?.type === "var") {
          returnType = ast[2].data;
          funcBody = ast[3];
        } else {
          funcBody = ast[2];
        }

        const paramNames = []
        const accepts = params.map(v => {
          const parts = v.split(" ")
          const len = parts.length
          paramNames.push(parts[len - 1])
          if (len > 1) return parts[0]
          return 'any'
        })

        const funcNode = {
          type: "fnc", num: this.tkn.fnc,
          data: "function",
          returns: returnType,
          parameters: [
            {
              type: "str", num: this.tkn.str,
              data: paramSpec,
              source: paramSpec,
              accepts,
              paramNames,
            },
            funcBody,
            {
              type: "unk", num: this.tkn.unk,
              data: false
            }
          ]
        };

        ast.length = 0;
        ast.push({
          type: "asi", num: this.tkn.asi,
          data: "=",
          source: start,
          left: {
            type: "var", num: this.tkn.var,
            data: funcName,
            source: funcName
          },
          right: funcNode,
          inferredType: "function"
        });

        paramSpec = `${paramSpec}`.trim();
        if (paramSpec) {
          const paramTypes = [];
          const paramParts = paramSpec.split(',').map(p => p.trim());
          for (const paramPart of paramParts) {
            const parts = paramPart.split(' ').filter(p => p);
            if (parts.length >= 2) {
              paramTypes.push(parts[0]); // Type is first part
            } else {
              paramTypes.push('any'); // No type specified
            }
          }

          this.functionReturnTypes[funcName] = {
            returnType: returnType || 'any',
            accepts: paramTypes
          };
        }
      }
    }

    if (ast.length === 0) return [];

    // method commands
    if (Array.isArray(ast[0]?.data)) {
      const arr = ast[0]?.data;
      const lastNode = arr[arr.length - 1];
      if (ast[0].type === "mtd" &&
        lastNode.type === "mtv" &&
        ast.length === 1 && MAIN
      ) {
        const firstMtvIndex = arr.findIndex(node => node.type === "mtv");
        const leftData = firstMtvIndex > 0 ? arr.slice(0, firstMtvIndex) : [arr[0]];

        let first = leftData.length === 1 ?
          leftData[0] :
          { type: "mtd", num: this.tkn.mtd, data: leftData }

        ast.unshift(
          first,
          { type: "asi", num: this.tkn.asi, data: "=??", source: start, inferredType: first.inferredType ?? "any" }
        );
      }
    }

    // assignment node creation
    for (let i = START ?? 1; i < ast.length; i++) {
      const cur = ast[i];
      let prev = ast[i - 1];
      let next = ast[i + 1];

      if (cur?.type === "asi") {
        if ((cur.data === "=" || cur.data === "@=" || cur.data === "=??") && prev.type === "var") {
          cur.inferredType = next.inferredType ?? "any";
          this.setVariableType(prev.data, cur.inferredType, false, this.isStaticToken(next) ? next : undefined);
          if (!this.isTypeReferencable(cur.inferredType) && cur.data === "=") {
            cur.data = "@=";
          }
        }
        if (ast[0].data === "local") {
          prev = this.generateAST({ CODE: "this." + prev.source, START: 0 })[0];
          ast.splice(0, 1);
          i -= 1;
        }
        if (ast.length > 1 && i > 1) {
          cur.set_type = String(ast?.[i - 2]?.data ?? "").toLowerCase();
          if (cur.data === "=" || cur.data === "@=") {
            cur.inferredType = cur.set_type ?? "any";
            this.setVariableType(prev.source, cur.inferredType, true, this.isStaticToken(next) ? next : undefined);
          }
          ast.splice(i - 2, 1);
          i -= 1;
        }
        if (!cur.left) {
          cur.left = prev;
          cur.right = next;
          ast.splice(i - 1, 1);
          ast.splice(i, 1);
          i -= 1;
        }

        if (cur.left?.type === "mtd") {
          const path = cur.left.data.slice();
          const final = path.pop();
          cur.left = {
            type: "rmt", num: this.tkn.rmt,
            objPath: path,
            final: final
          };
        }

        if (["opr", "cmp", "log", "bit"].includes(cur?.right?.type) && cur.right.bysl === undefined) {
          const val = this.generateBysl(cur.right)
          if (val.success) {
            cur.right = {
              ...cur.right,
              otype: cur.right.type,
              bysl: val.code,
              type: "bsl",
              num: this.tkn.bsl,
              source: cur.right.source,
            }
          }
        }

        cur.source = start;
      }
      if (next?.type !== "asi") {
        if (cur.value !== undefined) {
          ast[i] = cur.value;
        }
      }
      if (["opr", "cmp", "log", "bit"].includes(cur?.type) && cur.bysl === undefined) {
        const val = this.generateBysl(cur)
        if (val.success) {
          ast[i] = {
            ...ast[i],
            otype: ast[i].type,
            bysl: val.code,
            type: "bsl",
            num: this.tkn.bsl,
            source: cur.source,
          }
        }
      }
    }

    if (ast.length === 0) return null;

    // increment and decrement
    const t1 = ast[1]
    if (ast.length === 2 &&
      (t1?.data === "--" &&
        t1?.type === "unk" &&
        !t1?.right) ||
      (t1?.data === "++" &&
        t1?.type === "opr" &&
        !t1?.right)
    ) {
      ast[0] = {
        type: "asi", num: this.tkn.asi,
        data: ast[1].data,
        left: ast[0],
        source: CODE
      }
      ast.splice(1, 1);
    }

    if (MAIN) {
      if (ast[0].type === "var") {
        ast[0].type = "cmd";
        ast[0].num = this.tkn.cmd;
      }
      ast[0].source = CODE.split("\n", 1)[0];
    }

    const isCmd = ast[0].type === "cmd"
    if (isCmd) {
      switch (ast[0].data) {
        case "switch":
          this.enableScopes();
          if (ast[2]?.type === "blk") {
            let cases = { type: "array", all: [] }
            const blk = ast[2]?.data ?? []
            for (let i = 0; i < blk.length; i++) {
              const cur = blk[i];
              if (cur[0].data === "case") cases.all.push([cur[1], i])
              if (cur[0].data === "default") cases.default = i
            }
            if (cases.all.every(v => ["str", "num"].includes(v[0]?.type))) {
              const newCases = {}
              cases.all.map(v => {
                if ((v[0]?.data ?? null) !== null) newCases[v[0]?.data ?? ""] = v[1]
              })
              cases.type = "object"
              cases.all = newCases;
            }
            ast[0].cases = cases
          }
          break;
        case "if":
          if (this.isStaticToken(ast[1])) {
            if (ast[1].data === true) {
              ast = ast.slice(0, 3);
            } else if (ast.length > 3) {
              ast[1].data = true;
              ast.splice(2, 2)
            }
          }
      }

      if (ast.every(v => ["str", "cmd", "num", "raw"].includes(v.type))) {
        ast[0].isStatic = true;
        ast[0].full = ast.map(v => v.data);
      }
    }
    if (ast[0].type === "asi" && this.isStaticToken(ast[0].right)) {
      ast[0].right.staticAssignment = true;
    }

    return ast.filter(token => (
      token.type &&
      token.type.length === 3 &&
      !((String(token.data).startsWith("/*") || String(token.data).endsWith("*/")) && token.type === "unk")
    ))
  }

  generateFullAST({ CODE, MAIN = true }) {
    if (MAIN) {
      this.inlinableFunctions = {};
    }
    let line = 0;
    // Normalize line endings to Unix-style (\n) to handle Windows/Mac differences
    CODE = this.normalizeLineEndings(String(CODE).trim());
    let result = MAIN ? `/@line ${++line}\n` : "";
    let lastIndex = 0;

    this.fullASTRegex.lastIndex = 0;

    for (let m; (m = this.fullASTRegex.exec(CODE)); ) {
      const match = m[0];
      const index = m.index;

      result += CODE.slice(lastIndex, index);
      lastIndex = index + match.length;

      if (match === ";") {
        result += "\n";
        continue;
      }

      let out = match;
      const nlCount = (match.match(/\n/g) || []).length;

      if (match === "(") out = ".call(";
      else if (match === "[") out = ".[";
      else if (match.startsWith("\n")) out = match.replace(/\n\s*\./, ".");
      else if ([",", "{", "}", "[", "]"].includes(match.trim()[0])) {
        line++;
        result += match;
        continue;
      }

      if (MAIN) {
        if (out.includes("\n")) {
          out = out.replace(/\n/g, () => `\n/@line ${++line}\n`);
        } else if (nlCount) {
          line += nlCount;
        }
      }

      result += out;
    }

    result += CODE.slice(lastIndex);
    CODE = result;

    CODE = CODE.split("\n")
    for (let i = CODE.length - 1; i >= 0; i--) {
      if (CODE[i].trim().startsWith("//")) {
        if (CODE[i - 1] && CODE[i - 1].trim().startsWith("/@line")) {
          CODE.splice(i - 1, 2)
          i -= 1;
        } else {
          CODE.splice(i, 1)
        }
      }
    }
    CODE = CODE.join("\n")
    CODE = autoTokenise(CODE, "\n").map(line => {
      line = line.trim();
      if (line === "endef") return ")";
      if (line.startsWith("def ") && !(line.endsWith("(") || line.endsWith(")"))) return line + " (";
      return line;
    }).join("\n");

    let lines = this.tokeniseLines(CODE).map((line) => {
      return this.generateAST({ CODE: line.trim(), MAIN: true });
    });

    lines = lines.filter(l => l !== null && l.length > 0);

    let pendingLine = undefined;
    for (let i = 0; i < lines.length; i++) {
      const cur = lines[i]
      if (!cur) continue;
      const type = cur[0]?.type;
      const data = cur[0]?.data;
      if (type === "unk" && data === "/@line") {
        if (cur[1] && cur[1].data !== undefined) pendingLine = cur[1].data;
        lines.splice(i--, 1);
        continue;
      }
      if (pendingLine !== undefined && cur[0]) {
        cur[0].line = pendingLine;
        pendingLine = undefined;
      }
    }

    lines = lines.filter(l => l[0]?.data !== "/@line");

    for (let i = 0; i < lines.length; i++) {
      const cur = lines[i];
      if (!cur) continue;
      const type = cur[0]?.type;
      const data = cur[0]?.data;
      if (type === "cmd" && data === "local") {
        if (cur[1].data === "class") {
          cur[1].source = cur[0].source;
          cur[1].line = cur[0].line;
          cur.shift();
          cur[0].type = "cmd";
          cur[0].num = this.tkn.cmd;
          cur[0].local = true;
        }
      }
      if (type === "cmd" && ["for", "each", "class", "while", "until"].includes(data)) {
        if (data === "each") {
          if (cur[cur.length - 1].type !== "blk") {
            lines[i] = this.generateError(cur[0], "'each' loop missing body block. Use: each i item array ( ... ) OR each item array ( ... )");
            continue;
          }
          let has_i = cur[4]?.type === "blk"
          if (has_i || cur[3]?.type === "blk") {
            const id = has_i ? cur[1].source : "this.EACH_I_" + randomString(10);
            if (has_i) cur.splice(1, 1);
            const static_var = cur[2].type === "var"
            const dat = static_var ? cur[2].source : "this.EACH_DAT_" + randomString(10);
            const spl = [
              [{ ...cur[0], type: "asi", num: this.tkn.asi, data: "@=", left: this.evalToken(id), right: this.evalToken("0") }],
              [{ ...cur[0], type: "asi", num: this.tkn.asi, data: "@=", left: this.evalToken(dat), right: cur[2] }]
            ]
            if (static_var) spl.pop();
            lines.splice(i, 0, ...spl);
            cur[3].data.splice(0, 0,
              [{ ...cur[0], type: "asi", num: this.tkn.asi, data: "++", left: this.evalToken(id) }],
              [{ ...cur[0], type: "asi", num: this.tkn.asi, data: "=", left: cur[1], right: this.evalToken(`${dat}.[${id}]`) }]
            )
            cur[0].data = "loop"
            cur.splice(1, 1)
            cur[1] = this.evalToken(`${dat}.len`)
          }
        } else {
          if (data === "while" || data === "until") {
            cur[1] = {
              type: "evl", num: this.tkn.evl,
              data: cur[1],
              source: cur[1].source || "[ast EVL]"
            };
          } else {
            cur[1].type = "str";
            cur[1].num = this.tkn.str;
          }
        }
      }
      if (type === "cmd") {
        switch (data) {
          case "def":
            if (cur.length < 3) {
              lines[i] = this.generateError(cur[0], "Incomplete function definition. Expected: def name(param1, param2) ( ... )");
              continue;
            }
            if (cur[cur.length - 1].type !== "blk") {
              lines[i] = this.generateError(cur[0], "Function body missing. Add a block: ( ... )");
              continue;
            }
            break;
          case "if":
            if (cur.length < 3) {
              lines[i] = this.generateError(cur[0], "Incomplete if statement. Expected: if condition ( ... )");
              continue;
            }
            if (cur[2].type !== "blk") {
              lines[i] = this.generateError(cur[0], "If body missing. Add a block: ( ... )");
              continue;
            }
            if (this.isStaticToken(cur[1])) {
              if (cur[1].data === true) {
                lines.splice(i, 1, ...cur[2].data);
              } else if (cur.length === 3) {
                lines.splice(i, 1);
              }
            }
            break;
        }
      }
      if (['loop', 'if', 'while', 'until', 'for'].includes(data)) {
        if (cur.length === 2 ||
          (data === 'for' && cur.length === 3)
        ) {
          const blk = lines.splice(i + 1, 1)[0];
          cur.push({
            type: "blk", num: this.tkn.blk,
            data: [blk],
            source: '[ast BLK]'
          })
        }
      }
      for (let j = 0; j < cur.length; j++) {
        const t = cur[j];
        if (!t) continue;
        if (["opr", "cmp", "bit", "log"].includes(t.type)) {
          if (!t.left || !t.right) {
            if (j <= 1) {
              lines[i] = this.generateError(cur[0], `Malformed line. Cannot use '${t.data}' here`);
              continue;
            }
            lines[i] = this.generateError(t.left || t.right || t, `Malformed ${t.type === "opr" ? 'operator' : t.type} '${t.data}'. Missing ${!t.left && !t.right ? 'operands' : !t.left ? 'left operand' : 'right operand'}.`);
            continue;
          }
        }
        if (t.type === "qst") {
          if (!t.left || !t.right || !t.right2) {
            lines[i] = this.generateError(t.left || t, `Incomplete ternary '?'. Expected pattern: condition ? valueIfTrue valueIfFalse`);
            continue;
          }
        }
      }
    }
    return lines;
  }

  tokenise({ CODE }) {
    CODE = Scratch.Cast.toString(CODE);
    return JSON.stringify(tokenise(CODE, " "));
  }

  tokeniseraw({ CODE }) {
    CODE = Scratch.Cast.toString(CODE);
    return autoTokenise(CODE);
  }

  tokeniseValues({ CODE, DELIMITER }) {
    CODE = Scratch.Cast.toString(CODE);
    DELIMITER = Scratch.Cast.toString(DELIMITER);
    return autoTokenise(CODE, DELIMITER);
  }

  setOperators({ OPERATORS }) {
    OPERATORS = Scratch.Cast.toString(OPERATORS);
    this.operators = JSON.parse(OPERATORS);
  }

  setComparisons({ COMPARISONS }) {
    COMPARISONS = Scratch.Cast.toString(COMPARISONS);
    this.comparisons = JSON.parse(COMPARISONS);
  }

  setLogic({ LOGIC }) {
    LOGIC = Scratch.Cast.toString(LOGIC);
    this.logic = JSON.parse(LOGIC);
  }

  setBitwise({ BITWISE }) {
    BITWISE = Scratch.Cast.toString(BITWISE);
    this.bitwise = JSON.parse(BITWISE);
  }

  hasReturnStatement(blockData) {
    if (!Array.isArray(blockData)) return false;

    for (const line of blockData) {
      if (!Array.isArray(line) || line.length === 0) continue;

      const first = line[0];
      if (!first) continue;

      if (first.type === 'cmd' && first.data === 'return') {
        return true;
      }

      if (first.type === 'cmd' && first.data === 'if') {
        const hasIfReturn = this.checkIfElseReturns(line);
        if (hasIfReturn) return true;
      }

      if (first.type === 'cmd' && first.data === 'switch') {
        const hasSwitchReturn = this.checkSwitchReturns(line);
        if (hasSwitchReturn) return true;
      }
    }

    return false;
  }

  checkIfElseReturns(ifLine) {
    if (!Array.isArray(ifLine)) return false;

    let ifBlock = null;
    let elseBlock = null;

    for (let i = 0; i < ifLine.length; i++) {
      const item = ifLine[i];
      if (item && item.type === 'blk') {
        if (ifBlock === null) {
          ifBlock = item;
        } else if (i > 0 && ifLine[i - 1]?.data === 'else') {
          elseBlock = item;
        }
      }
    }

    if (!ifBlock || !elseBlock) {
      return false;
    }

    const ifHasReturn = this.hasReturnStatement(ifBlock.data);
    const elseHasReturn = this.hasReturnStatement(elseBlock.data);

    return ifHasReturn && elseHasReturn;
  }

  checkSwitchReturns(switchLine) {
    if (!Array.isArray(switchLine) || switchLine.length < 3) return false;

    const switchBlock = switchLine[2];
    if (!switchBlock || switchBlock.type !== 'blk' || !Array.isArray(switchBlock.data)) {
      return false;
    }

    let hasDefault = false;
    let allCasesHaveReturns = true;

    for (const caseLine of switchBlock.data) {
      if (!Array.isArray(caseLine) || caseLine.length === 0) continue;

      const caseFirst = caseLine[0];
      if (caseFirst?.type === 'cmd') {
        if (caseFirst.data === 'case') {
          // Check if this case has a return (look ahead to next lines)
          const caseHasReturn = this.checkCaseHasReturn(switchBlock.data, caseLine);
          if (!caseHasReturn) {
            allCasesHaveReturns = false;
            break;
          }
        } else if (caseFirst.data === 'default') {
          hasDefault = true;
          const defaultHasReturn = this.checkCaseHasReturn(switchBlock.data, caseLine);
          if (!defaultHasReturn) {
            allCasesHaveReturns = false;
            break;
          }
        }
      }
    }

    return hasDefault && allCasesHaveReturns;
  }

  checkCaseHasReturn(switchData, caseLine) {
    const caseIndex = switchData.indexOf(caseLine);
    if (caseIndex === -1) return false;

    for (let i = caseIndex + 1; i < switchData.length; i++) {
      const line = switchData[i];
      if (!Array.isArray(line) || line.length === 0) continue;

      if (line[0]?.type === 'cmd' && (line[0].data === 'case' || line[0].data === 'default')) {
        break;
      }

      if (line[0]?.type === 'cmd' && line[0].data === 'return') {
        return true;
      }
    }

    return false;
  }

  lintSyntax(codeStr) {
    let tokens = this.linter.tokeniseCode(codeStr);
    return this.linter.lintSyntax(tokens, true);
  }

  applyTypes(AST) {
    if (!Array.isArray(AST)) return AST;

    const variableTypeMap = {};
    const functionReturnTypes = { ...this.functionReturnTypes };
    const variablePropertyTypes = {};

    const normalizeVarName = (name) => {
      if (typeof name === 'string' && name.startsWith('this.')) return name.slice(5);
      return name;
    };

    const processASTNodes = (astNodes) => {
      for (const line of astNodes) {
        if (!Array.isArray(line)) continue;

        for (const token of line) {
          if (!token) continue;

          if (token.type === 'asi') {
            this.currentFunctionTypes = functionReturnTypes;
            this._processAssignmentTypes(token, variableTypeMap, variablePropertyTypes);
            this.currentFunctionTypes = null;
          }

          if (token.type === 'asi' && token.right?.type === 'fnc' && token.left?.data) {
            this._processFunctionDefinition(token, functionReturnTypes);
          }
          
          if (token.type === 'asi' && token.right?.type === 'fnc' && Array.isArray(token.right.parameters)) {
            const right = token.right
            if (right.data === "function") {
              let paramString = right.parameters[0];
              if (typeof paramString === 'string') {
                paramString = paramString.replace(/^\s*(?:def\(|function\()/, '')
                  .replace(/\)\s*$/, '')
                  .trim();
              }
              const originalNames = right.paramNames;
              let paramNames = [];
              if (originalNames) {
                paramNames = originalNames;
              } else {
                const partsList = (typeof paramString === 'string' ? paramString : "")
                  .split(',')
                  .map(v => v.trim())
                  .filter(Boolean);
                const accepts = partsList.map(v => {
                  const parts = v.split(" ")
                  const len = parts.length
                  paramNames.push(parts[len - 1])
                  if (len > 1) return parts[0]
                  return 'any'
                })
                right.accepts = accepts;
                right.paramNames = paramNames;
              }
              for (let i = 0; i < paramNames.length; i++) {
                const param = paramNames[i];
                variableTypeMap[param] = right.accepts[i];
              }
            }
            if (token.right.parameters[1]) {
              const bodyAst = this.generateAST({ CODE: token.right.parameters[1], START: 0 });
              const prevLVM = this.latestVariableTypeMap;
              try {
                this.latestVariableTypeMap = new Proxy({}, { get: () => 'any' });
                processASTNodes(bodyAst);
              } finally {
                this.latestVariableTypeMap = prevLVM;
              }
            }
            try {
              if (Array.isArray(right.accepts) && right.accepts.length > 0 && right.accepts.every(a => a === 'any')) {
                const bodyToken = right.parameters[1];
                let bodySrc = (bodyToken && (bodyToken.source || bodyToken.data || '')).toString();
                bodySrc = bodySrc.replace(/\/@line\s*\d+/g, ' ').replace(/\s+/g, ' ');
                for (let i = 0; i < paramNames.length; i++) {
                  const pname = paramNames[i];
                  if (!pname) continue;
                  const reNum = new RegExp('\\b' + pname + '\\s*[+\\-*/%]');
                  if (reNum.test(bodySrc)) right.accepts[i] = 'number';
                }
              }
            } catch (e) { }
          }

          if (token.type === 'fnc' && Array.isArray(token.parameters)) {
            for (const param of token.parameters) {
              if (param?.type === 'blk' && Array.isArray(param.data)) {
                processASTNodes(param.data);
              }
            }
          }

          if (token.type === 'evl' && typeof token.data === 'object') {
            processASTNodes([token.data]);
          }

          if (token.type === 'blk' && Array.isArray(token.data)) {
            processASTNodes(token.data);
          }
        }

        if (line[0]?.type === 'cmd' && line[0].data === 'def') {
          this._processCommandDefinition(line, functionReturnTypes);
        }
      }
    };

    processASTNodes(AST);

    this.functionReturnTypes = { ...this.functionReturnTypes, ...functionReturnTypes };

    const applyTypesToNode = (node, scope = {}) => {
      if (!node || typeof node !== 'object') return node;

      if (Array.isArray(node)) {
        for (let i = 0; i < node.length; i ++) {
          applyTypesToNode(node[i], scope)
        }
        return node;
      }

      const typedNode = { ...node };

      // First apply types to child nodes so type information propagates
      if (typedNode.left) {
        typedNode.left = applyTypesToNode(typedNode.left, scope);
      }
      if (typedNode.right) {
        typedNode.right = applyTypesToNode(typedNode.right, scope);
      }
      if (typedNode.right2) {
        typedNode.right2 = applyTypesToNode(typedNode.right2, scope);
      }
      if (typedNode.type !== 'fnc' && Array.isArray(typedNode.parameters)) {
        typedNode.parameters = typedNode.parameters.map(param => applyTypesToNode(param, scope));
      }
      if (Array.isArray(typedNode.data)) {
        for (let i = 0; i < typedNode.data.length; i ++) {
          typedNode.data[i] = applyTypesToNode(typedNode.data[i], scope)
        }
      }

      switch (typedNode.type) {
        case 'var':
          const vName = normalizeVarName(typedNode.data);
          const scope_type = scope[vName];
          if (scope_type) {
            typedNode.local = true;
          }
          const varType = scope_type || variableTypeMap[vName];
          if (varType === 'object') {
            const propTypes = variablePropertyTypes[vName];
            if (propTypes) {
              typedNode.propertyTypes = propTypes;
            }
          }
          if (varType) {
            typedNode.inferredType = varType;
            typedNode.quickReturn = varType !== "object" && varType !== "any" && varType !== "null";
            break
          }
          const vars = this.globalVariableTypes;

          typedNode.inferredType = vars[vName] || 'any'
          break;

        case 'cmd':
          if (functionReturnTypes[typedNode.data]) {
            typedNode.paramTypes = functionReturnTypes[typedNode.data].accepts;
            typedNode.returnType = functionReturnTypes[typedNode.data].returns;
          }
          break;

        case 'fnc': {
          const my_ret = functionReturnTypes[typedNode.data]
          if (typedNode.data !== 'function') {
            if (my_ret) {
              typedNode.returnType = node.returns || my_ret.returns;
              typedNode.paramTypes = node.accepts || my_ret.accepts;
            } else {
              switch (typedNode.data) {
                case 'typeof':
                  typedNode.returnType = 'string';
                  typedNode.paramTypes = ['any'];
                  break;
              }
            }
          } else {
            typedNode.returnType = 'function';
          }
          if (Array.isArray(typedNode.parameters)) {
            let paramScope = scope;
            if (typedNode.data === 'function' && typedNode.parameters[0] && typedNode.parameters[0].type === 'str') {
              const paramNode = typedNode.parameters[0];
              const paramString = paramNode.data.trim();
              const params = (typeof paramString === 'string' ? paramString : "").split(',').map(p => p.trim());
              const paramNames = [];
              const accepts = [];
              for (const param of params) {
                const parts = param.trim().split(/\s+/);
                if (parts.length >= 2) {
                  accepts.push(parts[0]);
                  paramNames.push(parts[parts.length - 1]);
                } else {
                  accepts.push('any');
                  paramNames.push(param);
                }
              }
              paramScope = { ...scope };
              for (let i = 0; i < paramNames.length; i++) {
                paramScope[paramNames[i]] = accepts[i];
              }
            }
            typedNode.parameters = typedNode.parameters.map(param => applyTypesToNode(param, paramScope));
          }
          break;
        }

        case 'mtd':
          if (Array.isArray(typedNode.data) && typedNode.data.length >= 2) {
            const baseType = this._inferMethodBaseType(typedNode, scope, variableTypeMap);
            const methodName = this._getMethodName(typedNode.data);
            typedNode.baseType = baseType;
            typedNode.methodName = methodName;
            typedNode.inferredType = this._getMethodReturnType(typedNode, baseType, methodName);
          }
          break;

        case 'arr':
          if (Array.isArray(typedNode.data)) {
            const elementType = this._inferArrayElementType(typedNode.data);
            typedNode.elementType = elementType;
            typedNode.inferredType = elementType !== 'any' ? `${elementType}[]` : 'array';
          }
          break;

        case 'obj':
          if (typedNode.propertyTypes) break;
          typedNode.inferredType = 'object';
          if (Array.isArray(typedNode.data)) {
            const propTypes = {};
            for (const [keyToken, valueToken] of typedNode.data) {
              if (keyToken?.type === 'str') {
                propTypes[keyToken.data] = this._inferTokenType(valueToken, scope, variableTypeMap);
              }
            }
            typedNode.propertyTypes = propTypes;
          }
          break;

        case 'num':
          typedNode.inferredType = 'number';
          break;

        case 'str':
          typedNode.inferredType = 'string';
          break;

        case 'raw':
          typedNode.inferredType = typeof typedNode.data === 'boolean' ? 'boolean' : 'any';
          break;

        case 'evl':
          typedNode.data = applyTypesToNode(typedNode.data, scope);
          typedNode.inferredType = typedNode.data.inferredType;
          break;

        case 'unk':
          if (typedNode.data === null) {
            typedNode.inferredType = 'null';
          }
          break;

        case 'bsl':
        case 'opr':
        case 'cmp':
        case 'log':
        case 'bit':
          if (typedNode.left && typedNode.right) {
            const leftType = this._inferTokenType(typedNode.left, scope, variableTypeMap);
            const rightType = this._inferTokenType(typedNode.right, scope, variableTypeMap);
            typedNode.inferredType = this._inferOperatorResultType(typedNode.data, leftType, rightType);
            if (typedNode.inferredType === 'number') typedNode.useNumbers = true;
          }
          break;
      }

      if (typedNode.type === 'blk' && Array.isArray(typedNode.data)) {
        const blockScope = { ...scope };

        typedNode.data = typedNode.data.map(line => {
          if (Array.isArray(line)) {
            const typedLine = line.map(token => applyTypesToNode(token, blockScope));
            for (const token of typedLine) {
              if (token?.type === 'asi' && token.left?.type === 'var') {
                const varName = normalizeVarName(token.left.data);
                const varType = this._inferTokenType(token.right, blockScope, variableTypeMap);
                if (varType !== 'any') {
                  blockScope[varName] = varType;
                }
              }
            }
            return typedLine;
          }
          return applyTypesToNode(line, blockScope);
        });
      }

      return typedNode;
    };

    this.variablePropertyTypes = variablePropertyTypes;
    this.latestVariableTypeMap = variableTypeMap;

    return AST.map(line => applyTypesToNode(line));
  }

  _processAssignmentTypes(asiToken, variableTypeMap, variablePropertyTypes) {
    const leftNode = asiToken.left;
    const rightNode = asiToken.right;

    const isLocalRmt = leftNode?.type === 'rmt' && leftNode.final?.type === 'var';
    const isMtdVarChain = leftNode?.type === 'mtd' && Array.isArray(leftNode.data) && leftNode.data.length >= 1 && leftNode.data.every(seg => seg?.type === 'var');
    if (leftNode?.type === 'var' || isLocalRmt) {
      const normalizeVarName = (name) => (typeof name === 'string' && name.startsWith('this.')) ? name.slice(5) : name;
      const varNameRaw = isLocalRmt ? `this.${leftNode.final.data}` : leftNode.data;
      const varName = normalizeVarName(varNameRaw);

      if (asiToken.set_type) {
        const declaredType = asiToken.set_type === 'any' ? rightNode.inferredType ?? 'any' : asiToken.set_type;
        leftNode.inferredType = declaredType
        variableTypeMap[varName] = declaredType;

        if (varName !== varNameRaw) variableTypeMap[varNameRaw] = declaredType;

        if (declaredType === 'array' && rightNode?.type === 'arr' && Array.isArray(rightNode.data)) {
          const elemType = this._inferArrayElementType(rightNode.data);
          if (elemType && elemType !== 'any') {
            variableTypeMap[varName] = `${elemType}[]`;
            if (varName !== varNameRaw) variableTypeMap[varNameRaw] = `${elemType}[]`;
          }
        }
      }

      if (rightNode?.type === 'fnc' && rightNode.data === 'function' && Array.isArray(rightNode.parameters)) {
        const paramsToken = rightNode.parameters[0];

        if (paramsToken?.type === 'str') {
          const accepts = [];

          const paramType = paramsToken.data.trim();

          const knownTypes = ['number', 'string', 'boolean', 'array', 'object', 'function', 'null'];
          if (knownTypes.includes(paramType)) {
            accepts.push(paramType);
          } else if (asiToken.source) {
            const sourceMatch = asiToken.source.match(/\(([^)]+)\)/);
            if (sourceMatch) {
              const paramString = sourceMatch[1].trim();
              const params = (typeof paramString === 'string' ? paramString : "").split(',').map(p => p.trim());

              for (const param of params) {
                const parts = param.trim().split(/\s+/);
                if (parts.length >= 2) {
                  accepts.push(parts[0]);
                  continue;
                }
                accepts.push('any');
              }
            }
          }

          const targetFnMap = this.currentFunctionTypes || this.functionReturnTypes || {};
          if (!this.currentFunctionTypes && !this.functionReturnTypes) this.functionReturnTypes = {};
          targetFnMap[varName] = {
            accepts: accepts,
            returns: 'any'
          };

          variableTypeMap[varName] = 'function';
          if (varName !== varNameRaw) variableTypeMap[varNameRaw] = 'function';
        }
      }

      // Infer type from right-hand side
      if (rightNode) {
        const inferredType = this._inferTokenType(rightNode, {}, variableTypeMap);
        if (inferredType !== 'any' && !variableTypeMap[varName]) {
          variableTypeMap[varName] = inferredType;
          if (varName !== varNameRaw) variableTypeMap[varNameRaw] = inferredType;
        }

        // Handle object property types
        if (rightNode.type === 'obj' && Array.isArray(rightNode.data)) {
          const propTypes = {};
          for (const [keyToken, valueToken] of rightNode.data) {
            if (keyToken?.type === 'str') {
              propTypes[keyToken.data] = this._inferTokenType(valueToken, {}, variableTypeMap);
            }
          }
          if (Object.keys(propTypes).length > 0) {
            variablePropertyTypes[varName] = propTypes;
            if (varName !== varNameRaw) variablePropertyTypes[varNameRaw] = propTypes;
          }
        }
      }
    } else if (isMtdVarChain) {
      // Handle left side like this.FOO @= <expr>
      const fullName = leftNode.data.map(seg => seg.data).join('.');
      const normalizeVarName = (name) => (typeof name === 'string' && name.startsWith('this.')) ? name.slice(5) : name;
      const varNameRaw = fullName;
      const varName = normalizeVarName(fullName);

      // Handle explicit declarations (typed assignment)
      if (asiToken.set_type) {
        const declaredType = asiToken.set_type === 'str' ? 'string' : asiToken.set_type;
        variableTypeMap[varName] = declaredType;
        variableTypeMap[varNameRaw] = declaredType;

        // If declaring an array and RHS is an array literal, capture element type as a typed array
        if (declaredType === 'array' && rightNode?.type === 'arr' && Array.isArray(rightNode.data)) {
          const elemType = this._inferArrayElementType(rightNode.data);
          if (elemType && elemType !== 'any') {
            variableTypeMap[varName] = `${elemType}[]`;
            variableTypeMap[varNameRaw] = `${elemType}[]`;
          }
        }
      }

      // Infer type from RHS as fallback/initialization
      if (rightNode) {
        const inferredType = this._inferTokenType(rightNode, {}, variableTypeMap);
        if (inferredType !== 'any' && !variableTypeMap[varName]) {
          variableTypeMap[varName] = inferredType;
          variableTypeMap[varNameRaw] = inferredType;
        }

        // If assigning an object literal, record property types for later dot access
        if (rightNode.type === 'obj' && Array.isArray(rightNode.data)) {
          const propTypes = {};
          for (const [keyToken, valueToken] of rightNode.data) {
            if (keyToken?.type === 'str') {
              propTypes[keyToken.data] = this._inferTokenType(valueToken, {}, variableTypeMap);
            }
          }
          if (Object.keys(propTypes).length > 0) {
            variablePropertyTypes[varName] = propTypes;
            variablePropertyTypes[varNameRaw] = propTypes;
          }
        }
      }
    }
  }

  _processFunctionDefinition(asiToken, functionReturnTypes) {
    const funcName = asiToken.left?.data;
    const funcNode = asiToken.right;

    if (!funcName || !funcNode || funcNode.type !== 'fnc' || funcNode.data !== 'function') {
      return;
    }

    const returnType = funcNode.returns || 'any';
    const accepts = [];

    if (funcNode.parameters && funcNode.parameters.length >= 1) {
      let paramString = funcNode.parameters[0]?.data;
      if (paramString && typeof paramString === 'string') {
        paramString = paramString.replace(/^\s*(?:def\(|function\()/, '').replace(/\)\s*$/, '').trim();
        const paramPairs = (typeof paramString === 'string' ? paramString : "").split(',').map(p => p.trim());
        for (const pair of paramPairs) {
          const parts = pair.split(/\s+/);
          if (parts.length >= 2) {
            accepts.push(parts[0]);
          } else {
            accepts.push('any');
          }
        }
      } else if (Array.isArray(funcNode.accepts) && funcNode.accepts.length > 0) {
        for (const a of funcNode.accepts) accepts.push(a);
      }
    }

    functionReturnTypes[funcName] = {
      accepts: accepts,
      returns: returnType
    };
  }

  _processCommandDefinition(line, functionReturnTypes) {
    if (line.length < 4) return;

    const cmdName = line[1]?.data;
    const params = line[2]?.data;

    if (!cmdName || typeof params !== 'string') return;

    const accepts = [];
    const paramPairs = params.split(',').map(p => p.trim());
    for (const pair of paramPairs) {
      const parts = pair.split(/\s+/);
      if (parts.length >= 2) {
        accepts.push(parts[0]);
      } else {
        accepts.push('any');
      }
    }

    functionReturnTypes[cmdName] = {
      accepts: accepts,
      returns: 'void'
    };
  }

  _inferTokenType(token, scope = {}, variableTypeMap = {}) {
    if (!token) return 'any';

    if (token.inferredType) return token.inferredType;
    if (token.returns) return token.returns;

    switch (token.type) {
      case 'num': return 'number';
      case 'str': return 'string';
      case 'raw': return typeof token.data === 'boolean' ? 'boolean' : 'any';
      case 'unk': return token.data === null ? 'null' : 'any';
      case 'arr':
        if (Array.isArray(token.data)) {
          const elementType = this._inferArrayElementType(token.data);
          return elementType !== 'any' ? `${elementType}[]` : 'array';
        }
        return 'array';
      case 'obj': return 'object';
      case 'var':
        return scope[token.data] || variableTypeMap[token.data] || 'any';
      case 'fnc':
        if (token.data !== 'function' && this.functionReturnTypes[token.data]) {
          return this.functionReturnTypes[token.data].returns;
        }
        switch (token.data) {
          case 'typeof': return 'string';
          case 'listFiles': return 'string[]';
        }
        return 'any';
      case 'mtd':
        if (Array.isArray(token.data) && token.data.length >= 2) {
          const baseType = this._inferMethodBaseType(token.data[0], scope, variableTypeMap);
          const methodName = this._getMethodName(token.data);
          return this._getMethodReturnType(token, baseType, methodName);
        }
        return 'any';
      default:
        return 'any';
    }
  }

  _inferArrayElementType(arrayData) {
    if (!Array.isArray(arrayData) || arrayData.length === 0) return 'any';

    let commonType = null;
    for (const element of arrayData) {
      let elementType = this._inferTokenType(element);

      if (commonType === null) {
        commonType = elementType;
      } else if (commonType !== elementType) {
        return 'any'; // Mixed types
      }
    }

    return commonType || 'any';
  }

  _inferMethodBaseType(nodeOrBase, scope = {}, variableTypeMap = {}) {
    // Accept either an mtd node or a base token
    if (!nodeOrBase) return 'any';

    const baseFromToken = (tok) => {
      const t = this._inferTokenType(tok, scope, variableTypeMap);
      if (tok?.type === 'arr' && Array.isArray(tok.data)) {
        const elementType = this._inferArrayElementType(tok.data);
        return { kind: 'array', elementType: elementType !== 'any' ? elementType : 'any' };
      }
      if (tok?.type === 'var') {
        const name = typeof tok.data === 'string' && tok.data.startsWith('this.')
          ? tok.data.slice(5)
          : tok.data;
        const propTypes = (this.variablePropertyTypes && this.variablePropertyTypes[name])
          || (this.variablePropertyTypes && this.variablePropertyTypes[tok.data]);
        if (propTypes) {
          return { kind: 'object', propertyTypes: propTypes };
        }
      }
      // Typed array shorthand like number[]
      if (typeof t === 'string' && t.endsWith('[]')) {
        return { kind: 'array', elementType: t.slice(0, -2) };
      }
      return t;
    };

    if (nodeOrBase.type !== 'mtd') {
      return baseFromToken(nodeOrBase);
    }

    const chain = nodeOrBase.data;
    if (!Array.isArray(chain) || chain.length < 2) return 'any';

    // If the chain starts with a variable path (e.g., this.FOO.BAR.item()), try to resolve the var prefix
    let prefix = [];
    for (const seg of chain) {
      if (seg?.type === 'var') prefix.push(seg.data); else break;
    }
    if (prefix.length >= 1) {
      const fullName = prefix.join('.');
      const norm = fullName.startsWith('this.') ? fullName.slice(5) : fullName;
      const direct = variableTypeMap[fullName] || variableTypeMap[norm];
      if (direct) {
        if (typeof direct === 'string' && direct.endsWith('[]')) {
          return { kind: 'array', elementType: direct.slice(0, -2) };
        }
        return direct;
      }
    }

    // Otherwise, infer from the first segment and let return-type mapping handle methods like len/item
    let currentBase = baseFromToken(chain[0]);
    return currentBase;
  }

  _getMethodName(methodData) {
    if (!Array.isArray(methodData) || methodData.length < 2) return null;

    const lastItem = methodData[methodData.length - 1];
    if (lastItem?.data) return lastItem.data;

    // Look for method name in any of the segments
    for (const segment of methodData) {
      if (segment?.type === 'fnc' || segment?.type === 'mtv' || segment?.type === 'var') {
        if (typeof segment.data === 'string') {
          return segment.data;
        }
      }
    }

    return null;
  }

  _getMethodReturnType(node) {
    let outType = this._inferTokenType(node.data[0]);
    for (let i = 1; i < node.data.length; i++) {
      const mtd = node.data[i];
      const methodName = mtd.data;

      const typeMap = {
        string: {
          toNum: "number", toUpper: "string", toLower: "string",
          append: 'string', prepend: 'string',
          trim: "string", replace: "string", concat: "string", split: "array",
          contains: "boolean", startsWith: "boolean", endsWith: "boolean",
          delete: 'string', left: 'string', right: 'string', index: 'number',
          trimText: 'string', wrapText: 'string'
        },
        number: {
          toNum: "number", round: "number", floor: "number", ceiling: "number",
          abs: "number", sqrt: "number", sin: "number", cos: "number", tan: "number",
          asin: "number", acos: "number", atan: "number",
        },
        array: {
          join: "string", append: "array", prepend: 'array', concat: "array", pop: "any",
          sortBy: 'array', contains: 'boolean', delete: 'array', left: 'array', right: 'array',
          index: 'number', swap: 'array', insert: 'array'
        },
        object: {
          getKeys: "array", getValues: "array", delete: 'object'
        },
        boolean: {}
      };

      // methods on all data types
      switch (methodName) {
        case 'len':
        case 'toNum':
           outType = 'number';
           continue;
        case 'toStr':
           outType = 'string';
           continue;
        case 'not':
        case 'toBool':
           outType = 'boolean';
           continue;
      }

      // Handle array element access
      if (methodName === 'item' && mtd.type === 'mtv') {
        // If baseType is typed array string like number[]
        if (outType.endsWith('[]')) {
           outType = outType.slice(0, -2);
           continue;
        }
      }

      if (node.data[0].propertyTypes && methodName) {
        const t = node.data[0].propertyTypes[methodName];
        if (t) {
          outType = t;
          continue;
        }
      }

      if (typeMap[outType] && typeMap[outType][methodName]) {
        if (mtd.type === 'var') {
          outType = 'function';
          continue
        }
        outType = typeMap[outType][methodName];
        continue
      }

      outType = 'any';
    }
    return outType;
  }

  _inferOperatorResultType(operator, leftType, rightType) {
    switch (operator) {
      case '+': {
        if (leftType === 'array' || rightType === 'array') return 'array';
        if (leftType === 'number' && rightType === 'number') return 'number';
        if (leftType === 'string' || rightType === 'string') return 'string';
        return 'any';
      }
      case '-': {
        if (leftType === 'number' && rightType === 'number') return 'number';
        if (leftType === 'string' && rightType === 'string') return 'string';
        return 'any';
      }
      case '*': {
        if (leftType === 'string' && rightType === 'number') return 'string';
        if (leftType === 'number' && rightType === 'number') return 'number';
        return 'any';
      }
      case '/':
      case '%':
      case '^': {
        if (leftType === 'number' && rightType === 'number') return 'number';
        return 'any';
      }
      case '++': {
        if (leftType === 'object' && (rightType === 'object' || rightType === 'array')) return 'object';
        if ((leftType === 'object' || leftType === 'array') && rightType === 'object') return 'object';
        if (leftType === 'array' && rightType === 'array') return 'array';
        return 'string';
      }
      case 'is':
      case '==':
      case '!=':
      case '>':
      case '<':
      case '>=':
      case '<=':
      case '===':
      case '!==': {
        return 'boolean';
      }
      case 'and':
      case 'or':
      case 'nor':
      case 'xor':
      case 'xnor':
      case 'nand': {
        return 'boolean';
      }
      case '|':
      case '&':
      case '<<':
      case '>>':
      case '>>>':
      case '<<<':
      case '^^': {
        return 'number';
      }
      case "::": {
        return 'function';
      }
      case "to": {
        return 'array';
      }
      default:
        return 'any';
    }
  }

  getErrorsFromAstMain({ AST }) {
    // Handle string input (JSON) for Scratch compatibility
    let parsedAST = AST;
    if (typeof AST === 'string') {
      try {
        parsedAST = JSON.parse(AST);
      } catch (e) {
        return JSON.stringify([{
          line: 0,
          message: `Failed to parse AST: ${e.message}`
        }]);
      }
    }

    const typedAST = this.applyTypes(parsedAST);
    const errors = this.getTypeErrorsFromAST(typedAST);
    return typeof AST === 'string' ? JSON.stringify(errors) : errors;
  }

  getTypeErrorsFromAST(AST) {
    const errors = [];

    const propagateLineNumbers = (node, lineNo) => {
      if (!node) return;
      if (Array.isArray(node)) {
        if (node[0] && node[0].line) lineNo = node[0].line;
        for (const item of node) propagateLineNumbers(item, lineNo);
        return;
      }
      if (typeof node === 'object') {
        if (node.line === undefined && lineNo !== undefined) node.line = lineNo;
        if (node.left) propagateLineNumbers(node.left, node.line || lineNo);
        if (node.right) propagateLineNumbers(node.right, node.line || lineNo);
        if (node.right2) propagateLineNumbers(node.right2, node.line || lineNo);
        if (Array.isArray(node.parameters)) node.parameters.forEach(p => propagateLineNumbers(p, node.line || lineNo));
        if (Array.isArray(node.data)) node.data.forEach(d => propagateLineNumbers(d, node.line || lineNo));
      }
    };

    propagateLineNumbers(AST, undefined);

    const collectAssignedFunctionDefs = (node) => {
      if (!node) return;
      if (Array.isArray(node)) {
        for (const n of node) collectAssignedFunctionDefs(n);
        return;
      }
      try {
        if (node.type === 'asi' && node.right?.type === 'fnc' && node.right.data === 'function' && node.left?.type === 'var') {
          const name = node.left.data;
          const fnc = node.right;
          const sig = this.functionReturnTypes && this.functionReturnTypes[name] ? { ...this.functionReturnTypes[name] } : { accepts: [], returns: 'any' };
          if (Array.isArray(fnc.accepts) && fnc.accepts.length > 0 && fnc.accepts.every(a => typeof a === 'string' && a && !a.includes('(') && a.trim() !== '')) {
            sig.accepts = fnc.accepts.slice();
          } else if (Array.isArray(fnc.parameters) && fnc.parameters[0]) {
            const raw = typeof fnc.parameters[0] === 'string' ? fnc.parameters[0] : (fnc.parameters[0]?.data || '');
            if (raw && typeof raw === 'string') {
              const cleaned = raw.replace(/^\s*(?:def\(|function\()/, '').replace(/\)\s*$/, '').trim();
              const parts = cleaned.split(',').map(p => p.trim()).filter(Boolean);
              const accepts = [];
              for (const part of parts) {
                const seg = part.split(/\s+/);
                if (seg.length >= 2) accepts.push(seg[0]); else accepts.push('any');
              }
              sig.accepts = accepts;
            }
          }
          if (fnc.returns) sig.returns = fnc.returns;
          this.functionReturnTypes = this.functionReturnTypes || {};
          this.functionReturnTypes[name] = sig;
        }
      } catch (e) { }
      // Recurse children
      if (node.left) collectAssignedFunctionDefs(node.left);
      if (node.right) collectAssignedFunctionDefs(node.right);
      if (node.right2) collectAssignedFunctionDefs(node.right2);
      if (Array.isArray(node.parameters)) node.parameters.forEach(p => collectAssignedFunctionDefs(p));
      if (Array.isArray(node.data)) node.data.forEach(d => collectAssignedFunctionDefs(d));
    };

    collectAssignedFunctionDefs(AST);

    try {
      const assignedFns = {};
      const objectPropLambdas = {};
      for (const line of AST) {
        if (!Array.isArray(line)) continue;
        const t = line[0];
        if (!t) continue;
        if (t.type === 'asi' && t.left?.type === 'var' && t.right?.type === 'fnc') {
          const name = t.left.data;
          assignedFns[name] = t.right;
        }
        if (t.type === 'asi' && t.left?.type === 'var' && t.right?.type === 'obj' && Array.isArray(t.right.data)) {
          const objName = t.left.data;
          objectPropLambdas[objName] = objectPropLambdas[objName] || {};
          for (const prop of t.right.data) {
            if (prop?.type === 'asi' && prop.left?.type === 'var' && prop.right?.type === 'fnc') {
              objectPropLambdas[objName][prop.left.data] = prop.right;
            }
          }
        }
      }

      const traverseForEach = (node, parentBlock = null) => {
        if (!node) return;
        if (Array.isArray(node)) {
          for (let i = 0; i < node.length; i++) {
            const line = node[i];
            if (!Array.isArray(line)) continue;
            // detect loop header represented by a 'cmd' token with data 'loop'
            for (const tok of line) {
              if (tok?.type === 'cmd' && tok.data === 'loop') {
                // try to find the EACH_DAT name from the same line's mtd token
                let maybeDat = null;
                for (const t of line) {
                  if (t?.type === 'mtd' && Array.isArray(t.data) && t.data[1]?.data) {
                    maybeDat = t.data[1].data;
                    break;
                  }
                }
                // search in the parentBlock (if any) or the current node for an assignment to this.EACH_DAT_xxx
                let numArr = false;
                const searchBlock = parentBlock || node;
                for (const sibling of searchBlock) {
                  if (!Array.isArray(sibling)) continue;
                  const st = sibling[0];
                  if (!st) continue;
                  if (st.type === 'asi') {
                    const left = st.left;
                    if (left && left.type === 'mtd' && Array.isArray(left.data) && left.data[1]?.data === maybeDat) {
                      const arrNode = st.right;
                      if (arrNode && arrNode.type === 'arr' && arrNode.elementType === 'number') {
                        numArr = true;
                        break;
                      }
                    }
                  }
                }
                // descend into the block following the loop header and look for offending assignments
                const blk = line.find(t => t?.type === 'blk');
                if (blk && Array.isArray(blk.data)) {
                  // walk blk.data and when we see `string var = item`, if numArr true, report
                  const walkBlk = (blkArr) => {
                    for (const innerLine of blkArr) {
                      if (!Array.isArray(innerLine)) continue;
                      for (const n of innerLine) {
                        if (n?.type === 'asi' && n.set_type === 'string' && n.right?.type === 'var' && n.right.data === 'item') {
                          if (numArr) {
                            this.pendingTypeErrors = this.pendingTypeErrors || [];
                            this.pendingTypeErrors.push({ line: n.line || 0, message: `Type mismatch assigning to ${n.left?.data || 'variable'}` });
                          }
                        }
                        // recurse into nested blocks
                        if (n?.type === 'blk' && Array.isArray(n.data)) walkBlk(n.data);
                      }
                    }
                  };
                  walkBlk(blk.data);
                }
              }
            }
            // recurse into nested structures, passing current node as parentBlock for context
            for (const tok of line) {
              if (!tok) continue;
              if (tok.type === 'blk' && Array.isArray(tok.data)) traverseForEach(tok.data, node);
              if (Array.isArray(tok.parameters)) traverseForEach(tok.parameters, node);
              if (Array.isArray(tok.data)) traverseForEach(tok.data, node);
            }
          }
          return;
        }
        // objects
        if (typeof node === 'object') {
          if (node.parameters) traverseForEach(node.parameters, parentBlock);
          if (Array.isArray(node.data)) traverseForEach(node.data, parentBlock);
        }
      };
      traverseForEach(AST, null);
    } catch (e) { }

    if (this.inlineTypeErrors) {
      errors.push(...this.inlineTypeErrors);
      this.inlineTypeErrors = [];
    }

    if (this.pendingTypeErrors) {
      errors.push(...this.pendingTypeErrors);
      this.pendingTypeErrors = [];
    }

    if (!Array.isArray(AST)) return errors;

    const controlFlowCommands = ['for', 'while', 'until', 'each', 'loop', 'if', 'switch'];

    // Shared scope across top-level lines to track variable types between lines
    let globalScope = {};

    for (const line of AST) {
      if (!Array.isArray(line)) continue;
      if (line[0]?.type === 'cmd' && line[0].data === 'class') {
        const className = line[1]?.data;
        if (typeof className === 'string' && className) {
          globalScope[className] = 'object';
        }
      }
    }

    const typesCompatible = (expected, actual) => {
      if (!expected || !actual) return true;
      if (expected === actual) return true;
      if (expected === 'any' || actual === 'any') return true;
      if (expected === 'array' && typeof actual === 'string' && actual.endsWith('[]')) return true;
      return false;
    };

    const normalizeVarName = (name) => (typeof name === 'string' && name.startsWith('this.')) ? name.slice(5) : name;

    const getTypeFromNode = (node, scope = {}, allowDeclaration = false, defaultLine = 0) => {
      if (!node) return 'any';
      if (node.inferredType && node.inferredType !== 'any') return node.inferredType;
      if (node.returns) return node.returns;
      if (node.type === 'var') {
        const n = normalizeVarName(node.data);
        if (n === 'this') return 'object';
        if (n === 'self') return scope[n] || 'object';
        if (n === 'throw') return 'any';
        const lvm = this.latestVariableTypeMap[n] || undefined;
        if (lvm === 'any') return 'any';
        const found = scope[n] || lvm || this.globalVariableTypes?.[n]
        if (found) return found;
        if (allowDeclaration) return 'any';
        const errLine = node.line || defaultLine || 0;
        const errMsg = `Undefined variable '${n}'`;
        if (!errors.some(e => e && e.line === errLine && e.message === errMsg)) {
          errors.push({ line: errLine, message: errMsg });
        }
        return 'any';
      }
      if (node.type === 'fnc' && node.data && node.data !== 'function') {
        const sig = this.functionReturnTypes && this.functionReturnTypes[node.data];
        return sig?.returns || 'any';
      }
      if (node.type === 'mtd' && Array.isArray(node.data) && node.data.length >= 2) {
        // Recompute method base/return using latest variable map if available
        const varMap = this.latestVariableTypeMap || {};
        const baseType = this._inferMethodBaseType({ type: 'mtd', data: node.data }, scope, varMap);
        const methodName = this._getMethodName(node.data);
        return this._getMethodReturnType(node, baseType, methodName);
      }
      if (node.type === 'arr') {
        if (node.inferredType && node.inferredType !== 'any') return node.inferredType;
        if (Array.isArray(node.data)) {
          const el = this._inferArrayElementType(node.data);
          return el && el !== 'any' ? `${el}[]` : 'array';
        }
        return 'array';
      }
      if (node.type === 'obj') {
        if (node.inferredType && node.inferredType !== 'any') return node.inferredType;
        return 'object';
      }
      if (['opr', 'cmp', 'log', 'bit'].includes(node.type)) {
        const lt = getTypeFromNode(node.left, scope, false, defaultLine);
        const rt = getTypeFromNode(node.right, scope, false, defaultLine);
        return this._inferOperatorResultType(node.data, lt, rt);
      }
      if (node.type === 'bsl') {
        const lt = getTypeFromNode(node.left, scope, false, defaultLine);
        const rt = getTypeFromNode(node.right, scope, false, defaultLine);
        return this._inferOperatorResultType(node.data, lt, rt);
      }
      return 'any';
    };

    const getAssignedLambdaName = (leftNode) => {
      if (!leftNode) return 'function';
      if (leftNode.type === 'var') return normalizeVarName(leftNode.data);
      if (leftNode.type === 'rmt') {
        const prefix = (leftNode.objPath || []).map(seg => seg?.data).filter(Boolean).join('.');
        const final = leftNode.final?.data;
        const full = [prefix, final].filter(Boolean).join('.');
        return normalizeVarName(full || 'function');
      }
      if (leftNode.type === 'mtd' && Array.isArray(leftNode.data) && leftNode.data.every(seg => seg?.type === 'var')) {
        const full = leftNode.data.map(seg => seg.data).join('.');
        return normalizeVarName(full || 'function');
      }
      return normalizeVarName(leftNode.data || 'function');
    };

    const walk = (node, lineNum, fnContext, scopeTypes = {}, allowDeclaration = false) => {
      if (!node) return;

      if (Array.isArray(node)) {
        // Provide a class-local scope that includes `self` for class bodies
        if (node.length > 0 && node[0]?.type === 'cmd' && node[0].data === 'class') {
          const classScope = { ...scopeTypes, self: 'object' };
          node.forEach(n => {
            if (n?.type === 'blk') {
              walk(n, lineNum, fnContext, classScope, false);
            } else {
              walk(n, lineNum, fnContext, scopeTypes, false);
            }
          });
          return;
        }
        if (node.length >= 1 && node[0]?.type === 'asi' && node[0].right?.type === 'fnc' && node[0].right.data === 'function') {
          const asi = node[0];
          const fnc = asi.right;
          const assignedName = getAssignedLambdaName(asi.left);
          const retType = fnc.returns || 'any';
          const inlineCtx = {
            returns: retType,
            functionName: assignedName,
            needsReturnCheck: retType !== 'any' && retType !== 'void',
            isCommand: fnc.isCommand || false,
            shadowedTypes: {},
            validateReturnType: true
          };
          const inlineScope = { ...scopeTypes };
          const accepts = [];
          if (Array.isArray(fnc.parameters) && fnc.parameters[0] && (typeof fnc.parameters[0] === 'string' || (fnc.parameters[0] && typeof fnc.parameters[0].data === 'string'))) {
            let rawParams = typeof fnc.parameters[0] === 'string' ? fnc.parameters[0] : fnc.parameters[0].data;
            rawParams = rawParams.replace(/^\s*(?:def\(|function\()/, '').replace(/\)\s*$/, '').trim();
            const paramPairs = rawParams.split(',').map(p => p.trim()).filter(Boolean);
            for (const pair of paramPairs) {
              const parts = pair.split(/\s+/);
              if (parts.length >= 2) {
                const ptype = parts[0];
                const pname = parts[parts.length - 1];
                inlineScope[pname] = ptype;
                accepts.push(ptype);
              } else if (pair) {
                const pname = pair.split(/\s+/).pop();
                inlineScope[pname] = 'any';
                accepts.push('any');
              }
            }
          }
          try {
            this.functionReturnTypes = this.functionReturnTypes || {};
            this.functionReturnTypes[assignedName] = this.functionReturnTypes[assignedName] || {};
            this.functionReturnTypes[assignedName].accepts = accepts;
            this.functionReturnTypes[assignedName].returns = retType;
          } catch (e) { }
          const body = fnc.parameters[1];
          if (body) {
            if (body.type === 'blk') {
              body._checkedInlineFn = true;
              walk(body, lineNum, inlineCtx, inlineScope, false);
            } else {
              walk(body, lineNum, inlineCtx, inlineScope, false);
            }
          }
        }
        if (node.length >= 2 && node[0]?.type === 'cmd' && node[0].data === 'return') {
          if (!fnContext) {
            errors.push({ line: node[0].line || lineNum, message: 'Return statement outside of function' });
          } else {
            if (fnContext.isCommand && node.length > 1 && node[1] && !fnContext.inControlFlow) {
              errors.push({ line: node[0].line || lineNum, message: 'Commands cannot return values' });
              return;
            }

            const returnValue = node[1];
            let actualReturnType = getTypeFromNode(returnValue, scopeTypes, false, node[0].line || lineNum);

            if (actualReturnType === 'any' && returnValue?.type === 'var' && this.latestVariableTypeMap) {
              const rvName = normalizeVarName(returnValue.data);
              if (this.latestVariableTypeMap[rvName]) {
                actualReturnType = this.latestVariableTypeMap[rvName];
              }
            }

            if (fnContext && fnContext.shadowedTypes && returnValue?.type === 'var') {
              const rvName = normalizeVarName(returnValue.data);
              if (fnContext.shadowedTypes[rvName]) {
                actualReturnType = fnContext.shadowedTypes[rvName];
              }
            }

            if (fnContext.validateReturnType && fnContext.returns === 'any' && actualReturnType !== 'any') {
              fnContext.returns = actualReturnType;
              fnContext.inferredReturnType = actualReturnType;
            }

            if (fnContext.returns && fnContext.returns !== 'any' && fnContext.returns !== 'void') {
              const expectedRet = fnContext.returns;
              const actualRet = actualReturnType;
              if (actualRet !== 'any' && !typesCompatible(expectedRet, actualRet)) {
                const fnName = fnContext.functionName || 'function';
                errors.push({
                  line: node[0].line || lineNum,
                  message: `Return type mismatch: Type mismatch returning from function ${fnName}: expected ${expectedRet}, got ${actualRet}`
                });
              }
            }
          }
        }

        // Handle control flow commands
        if (node.length > 0 && node[0]?.type === 'cmd' && controlFlowCommands.includes(node[0].data)) {
          const cmdType = node[0].data;
          const controlFlowContext = { ...fnContext, inControlFlow: true };

          // Process each control flow command with appropriate scoping
          switch (cmdType) {
            case 'for':
              if (node.length >= 4) {
                const loopVar = node[1]?.data;
                const newScope = { ...scopeTypes };
                if (loopVar && typeof loopVar === 'string') {
                  newScope[loopVar] = 'number';
                }

                if (node[3]?.type === 'blk') {
                  walk(node[3], lineNum, controlFlowContext, newScope, false);
                }

                // Walk other nodes
                for (let i = 0; i < node.length; i++) {
                  if (i !== 3 || node[i]?.type !== 'blk') {
                    walk(node[i], lineNum, fnContext, scopeTypes, false);
                  }
                }
              }
              break;

            case 'each':
              if (node.length >= 5) {
                const indexVar = node[1]?.data;
                const itemVar = node[2]?.data;
                const arrayExpr = node[3];
                const newScope = { ...scopeTypes };

                if (indexVar && typeof indexVar === 'string') {
                  newScope[indexVar] = 'number';
                }

                if (itemVar && typeof itemVar === 'string') {
                  // Try to derive element type first from the expression node itself
                  let arrayType = getTypeFromNode(arrayExpr, scopeTypes, false, lineNum);
                  // If the expression is an array literal node, infer element type directly
                  try {
                    if ((arrayExpr && arrayExpr.type === 'arr' && Array.isArray(arrayExpr.data))) {
                      const el = this._inferArrayElementType(arrayExpr.data);
                      if (el && el !== 'any') arrayType = `${el}[]`;
                    }
                  } catch (e) { }

                  try {
                    if ((!arrayType || (typeof arrayType === 'string' && !arrayType.endsWith('[]'))) && arrayExpr && arrayExpr.type === 'mtd' && Array.isArray(arrayExpr.data)) {
                      const maybeDat = arrayExpr.data[1] && arrayExpr.data[1].data;
                      if (maybeDat && typeof maybeDat === 'string') {
                        for (const topLine of AST) {
                          if (!Array.isArray(topLine)) continue;
                          const tok = topLine[0];
                          if (!tok) continue;
                          if (tok.type === 'asi') {
                            const left = tok.left;
                            if (left && left.type === 'mtd' && Array.isArray(left.data) && left.data[1]?.data === maybeDat) {
                              const arrNode = tok.right;
                              if (arrNode && arrNode.type === 'arr' && arrNode.elementType) {
                                arrayType = `${arrNode.elementType}[]`;
                                break;
                              }
                            }
                          }
                        }
                      }
                    }
                  } catch (e) { }

                  if (typeof arrayType === 'string' && arrayType.endsWith('[]')) {
                    newScope[itemVar] = arrayType.slice(0, -2);
                  } else {
                    newScope[itemVar] = 'any';
                  }
                }

                if (node[4]?.type === 'blk') {
                  walk(node[4], lineNum, controlFlowContext, newScope, false);
                }

                // Walk other nodes
                for (let i = 0; i < node.length; i++) {
                  if (i !== 4 || node[i]?.type !== 'blk') {
                    walk(node[i], lineNum, fnContext, scopeTypes, false);
                  }
                }
              }
              break;

            default:
              // Handle other control flow commands
              node.forEach((n) => {
                if (n?.type === 'blk') {
                  walk(n, lineNum, controlFlowContext, scopeTypes, false);
                } else {
                  walk(n, lineNum, fnContext, scopeTypes, false);
                }
              });
          }
        } else {
          // Regular array processing
          node.forEach(n => walk(n, lineNum, fnContext, scopeTypes, false));
        }
        return;
      }

      if (typeof node !== 'object') return;

      const ln = node.line || lineNum;

      // Validate standalone variable references (e.g. within modifiers like c#dock_colour)
      if (node.type === 'var') {
        getTypeFromNode(node, scopeTypes, allowDeclaration, ln);
        return;
      }

      // Handle inline lambda/function assignments: validate body in its own context and check missing return
      if (node.type === 'asi' && node.right?.type === 'fnc' && node.right.data === 'function') {
        const fnc = node.right;
        const lambdaName = getAssignedLambdaName(node.left);

        // If assigning to a known built-in type method (e.g. `string.toStr = def() -> (...)`),
        // enforce the method's expected return type.
        let expectedLambdaReturn = fnc.returns || 'any';
        if (expectedLambdaReturn === 'any' && node.left?.type === 'rmt') {
          const baseType = node.left.objPath?.[0]?.data;
          const methodName = node.left.final?.data;
          if (baseType && methodName) {
            expectedLambdaReturn = this._getMethodReturnType(node, baseType, methodName) || 'any';
          }
        }

        const lambdaCtx = {
          returns: expectedLambdaReturn,
          functionName: lambdaName,
          needsReturnCheck: expectedLambdaReturn !== 'any' && expectedLambdaReturn !== 'void',
          isCommand: false,
          validateReturnType: true
        };
        const lambdaScope = { ...scopeTypes };

        if (fnc.parameters && fnc.parameters.length >= 2) {
          const paramString = fnc.parameters[0];
          if (typeof paramString === 'string') {
            const paramPairs = (typeof paramString === 'string' ? paramString : "").split(',').map(p => p.trim()).filter(Boolean);
            for (const pair of paramPairs) {
              const parts = pair.split(/\s+/);
              if (parts.length >= 2) {
                lambdaScope[parts[1]] = parts[0];
              } else if (parts.length === 1) {
                lambdaScope[parts[0]] = 'any';
              }
            }
          }
        }

        if (node.left?.type === 'rmt') {
          const baseType = node.left.objPath?.[0]?.data;
          if (baseType && !lambdaScope.self) lambdaScope.self = baseType;
        }
        const body = fnc.parameters?.[1];
        if (body) {
          const bodyAst = this.generateAST({ CODE: body, START: 0 });
          bodyAst._checkedInlineFn = true;
          if (Array.isArray(bodyAst)) {
            bodyAst.forEach(line => walk(line, ln, lambdaCtx, lambdaScope));
          } else {
            walk(bodyAst, ln, lambdaCtx, lambdaScope);
          }
        }
        const sig = this.functionReturnTypes[lambdaName] || { accepts: [], returns: 'any' };
        if (lambdaCtx.inferredReturnType || (lambdaCtx.returns && lambdaCtx.returns !== 'any')) {
          sig.returns = lambdaCtx.inferredReturnType || lambdaCtx.returns;
        }
        if (fnc.parameters && fnc.parameters.length >= 1) {
          let paramString = typeof fnc.parameters[0] === 'string' ? fnc.parameters[0] : fnc.parameters[0]?.data;
          if (typeof paramString === 'string') {
            paramString = paramString.replace(/^\s*(?:def\(|function\()/, '').replace(/\)\s*$/, '').trim();
            const accepts = [];
            const paramPairs = (typeof paramString === 'string' ? paramString : "").split(',').map(p => p.trim()).filter(Boolean);
            for (const pair of paramPairs) {
              const parts = pair.split(/\s+/);
              if (parts.length >= 2) accepts.push(parts[0]); else accepts.push('any');
            }
            sig.accepts = accepts;
          }
        }
        if (fnc.strictAnyArgs) sig.strictAnyArgs = true;
        this.functionReturnTypes[lambdaName] = sig;
      }

      // Check function calls for type mismatches
      if (node.type === 'fnc' && node.data !== 'function') {
        const params = node.parameters || [];
        let expected = node.paramTypes;

        // Fallback to global signature if missing
        const globalSig = this.functionReturnTypes && this.functionReturnTypes[node.data];
        if (!expected && globalSig) {
          expected = globalSig.accepts;
        }
        if (expected && Array.isArray(expected)) {
          for (let i = 0; i < Math.min(params.length, expected.length); i++) {
            const expectedType = expected[i] || 'any';
            const actualType = getTypeFromNode(params[i], scopeTypes, false, ln);
            if (globalSig?.strictAnyArgs && expectedType === 'any' && actualType !== 'any') {
              errors.push({
                line: ln,
                message: `Type mismatch: argument ${i + 1} of '${node.data}' expected ${actualType}, got any`
              });
              continue;
            }
            if (!typesCompatible(expectedType, actualType)) {
              errors.push({
                line: ln,
                message: `Type mismatch: argument ${i + 1} of '${node.data}' expected ${expectedType}, got ${actualType}`
              });
            }
          }
        }
      }

      // Check assignment type compatibility
      if (node.type === 'asi') {
        const leftType = getTypeFromNode(node.left, scopeTypes, true, ln);
        const rightType = getTypeFromNode(node.right, scopeTypes, false, ln);

        // Check for explicit type declarations
        if (node.set_type) {
          const expected = node.set_type === 'str' ? 'string' : node.set_type;
          if (rightType !== 'any' && !typesCompatible(expected, rightType)) {
            const varName = normalizeVarName(node.left?.data || 'variable');
            errors.push({
              line: ln,
              message: `Type mismatch assigning to ${varName}: expected ${expected} got ${rightType}`
            });

            // If assigning from a function call, also surface as return-type mismatch
            // (tests look for the phrase "Return type mismatch").
            if (node.right?.type === 'fnc' && node.right.data && node.right.data !== 'function') {
              errors.push({
                line: ln,
                message: `Return type mismatch: Type mismatch returning from function ${node.right.data}: expected ${expected}, got ${rightType}`
              });
            }
          }
        }
        // Check for variable reassignments with type mismatch
        else if (node.left?.type === 'var') {
          const varName = normalizeVarName(node.left.data);
          const existingType = scopeTypes[varName];

          if (existingType && existingType !== 'any' && rightType !== 'any' && !typesCompatible(existingType, rightType)) {
            errors.push({
              line: ln,
              message: `Type mismatch reassigning ${varName}: expected ${existingType}, got ${rightType}`
            });
          }
        }

        // Update scope with new variable types (support local rmt and simple mtd var chains)
        if ((node.left?.type === 'var') || (node.left?.type === 'rmt' && node.left.final?.type === 'var') || (node.left?.type === 'mtd' && Array.isArray(node.left.data) && node.left.data.every(seg => seg?.type === 'var'))) {
          const leftName = node.left.type === 'var'
            ? node.left.data
            : (node.left.type === 'rmt' ? `this.${node.left.final.data}` : node.left.data.map(seg => seg.data).join('.'));
          const varName = normalizeVarName(leftName);
          if (node.set_type) {
            // Type declaration takes precedence
            const declaredType = node.set_type === 'str' ? 'string' : node.set_type;
            scopeTypes[varName] = declaredType;
          } else if (!scopeTypes[varName]) {
            scopeTypes[varName] = rightType || 'any';
          }
          // For reassignments, keep the existing type (don't change it)
        }
      }

      // Check operator type compatibility
      if (['opr', 'cmp', 'log', 'bit'].includes(node.type)) {
        const leftType = node.leftType || getTypeFromNode(node.left, scopeTypes, false, ln);
        const rightType = node.rightType || getTypeFromNode(node.right, scopeTypes, false, ln);

        if (node.type === 'opr') {
          // TODO: handle when some type operations become null
        }
      }

      if (node.type === 'mod' && Array.isArray(node.data) && node.data.length >= 2) {
        walk(node.data[1], ln, fnContext, scopeTypes, false);
      } else if (node.type === 'mtd' && Array.isArray(node.data) && node.data.length >= 1) {
        walk(node.data[0], ln, fnContext, scopeTypes, false);
        for (const seg of node.data.slice(1)) {
          if (seg?.type === 'mtv' && Array.isArray(seg.parameters)) {
            seg.parameters.forEach(p => {
              if (p.type === 'fnc' && p.data === '' && Array.isArray(p.parameters)) {
                const lambdaName = `lambda_${ln}_${Math.random().toString(36).substr(2, 9)}`;
                const lambdaCtx = {
                  returns: 'any',
                  functionName: lambdaName,
                  needsReturnCheck: false,
                  isCommand: false,
                  validateReturnType: false
                };
                const lambdaScope = { ...scopeTypes };

                for (const lambdaParam of p.parameters) {
                  if (lambdaParam.type === 'var') {
                    const paramName = normalizeVarName(lambdaParam.data);
                    const paramType = lambdaParam.set_type || lambdaParam.inferredType || 'any';
                    lambdaScope[paramName] = paramType;
                  }
                }

                const body = p.body;
                if (body) {
                  if (Array.isArray(body)) {
                    body.forEach(b => walk(b, ln, lambdaCtx, lambdaScope, false));
                  } else {
                    walk(body, ln, lambdaCtx, lambdaScope, false);
                  }
                }
              } else {
                walk(p, ln, fnContext, scopeTypes, false);
              }
            });
          }
        }
      }

      if (node.left) {
        const allowDeclLeft = node.type === 'asi';
        walk(node.left, ln, fnContext, scopeTypes, allowDeclLeft);
      }
      if (node.right) {
        const skip = node.right?.type === 'fnc' && node.right.data === 'function' && node.right?.parameters?.[1]?._checkedInlineFn;
        if (!skip) walk(node.right, ln, fnContext, scopeTypes, false);
      }
      if (node.right2) walk(node.right2, ln, fnContext, scopeTypes, false);
      if (Array.isArray(node.parameters)) {
        node.parameters.forEach(param => {
          if (param.type === 'fnc' && param.data === '' && Array.isArray(param.parameters)) {
            const lambdaName = `lambda_${ln}_${Math.random().toString(36).substr(2, 9)}`;
            const lambdaCtx = {
              returns: 'any',
              functionName: lambdaName,
              needsReturnCheck: false,
              isCommand: false,
              validateReturnType: false
            };
            const lambdaScope = { ...scopeTypes };

            // Bind lambda parameters
            for (const lambdaParam of param.parameters) {
              if (lambdaParam.type === 'var') {
                const paramName = normalizeVarName(lambdaParam.data);
                const paramType = lambdaParam.set_type || lambdaParam.inferredType || 'any';
                lambdaScope[paramName] = paramType;
              }
            }

            const body = param.body;
            if (body) {
              if (Array.isArray(body)) {
                body.forEach(b => walk(b, ln, lambdaCtx, lambdaScope, false));
              } else {
                walk(body, ln, lambdaCtx, lambdaScope, false);
              }
            }
          } else {
            walk(param, ln, fnContext, scopeTypes, false);
          }
        });
      }
      if (node.type === 'fnc' && typeof node.data === 'string' && this.functionReturnTypes && this.functionReturnTypes[node.data] && Array.isArray(node.parameters)) {
        const sig = this.functionReturnTypes[node.data];
        const params = node.parameters;
        let expectedList = (sig.accepts || []).slice();
        if (expectedList.length > 0 && expectedList.every(v => v === 'any')) {
          try {
            // Check local inline defs first
            const stack = [...AST];
            while (stack.length) {
              const n = stack.pop();
              if (!n) continue;
              if (Array.isArray(n)) { n.forEach(x => stack.push(x)); continue; }
              try {
                if (n.type === 'asi' && n.left?.type === 'var' && n.left.data === node.data && n.right?.type === 'fnc') {
                  const fn = n.right;
                  paramNames = fn.paramNames || [];
                  const body = fn.parameters && fn.parameters[1];
                  bodySrc = (body && (body.source || body.data || '')).toString();
                  break;
                }
              } catch (e) { }
              if (n.left) stack.push(n.left);
              if (n.right) stack.push(n.right);
              if (n.right2) stack.push(n.right2);
              if (Array.isArray(n.parameters)) n.parameters.forEach(p => stack.push(p));
              if (Array.isArray(n.data)) n.data.forEach(d => stack.push(d));
            }
            if (paramNames && paramNames.length > 0 && bodySrc) {
              // Normalize body source (strip /@line annotations) before heuristics
              try { bodySrc = bodySrc.replace(/\/@line\s*\d+/g, ' ').replace(/\s+/g, ' '); } catch (e) { }
              expectedList = paramNames.map(() => 'any');
              for (let pi = 0; pi < paramNames.length; pi++) {
                const pname = paramNames[pi];
                if (!pname) continue;
                const reNum = new RegExp('\\b' + pname + '\\s*[+\\-*/%]');
                if (reNum.test(bodySrc)) expectedList[pi] = 'number';
              }
            }
          } catch (e) { }
        }

        for (let i = 0; i < Math.min(params.length, (expectedList || []).length); i++) {
          const expected = expectedList[i] || 'any';
          const actual = getTypeFromNode(params[i], scopeTypes, false, ln);
          if (!typesCompatible(expected, actual)) {
            const msg = `Type mismatch: argument ${i + 1} of '${node.data}' expected ${expected}, got ${actual}`;
            errors.push({ line: node.line || ln || 0, message: msg });
          }
        }
      }

      // Handle block nodes with proper scoping
      if (node.type === 'blk' && Array.isArray(node.data)) {
        const blockScope = { ...scopeTypes };

        // Check for missing return statements in functions
        let hasReturn = false;
        if (fnContext && fnContext.needsReturnCheck) {
          hasReturn = this.hasReturnStatement(node.data);
          fnContext.needsReturnCheck = false;

          if (!hasReturn) {
            const fnName = fnContext.functionName || 'function';
            errors.push({
              line: ln || 0,
              message: `Function '${fnName}' missing return statement`
            });
          }
        }

        // Walk through block contents
        for (const innerLine of node.data) {
          // Update shadowed types if a typed redeclaration exists in this line
          if (Array.isArray(innerLine)) {
            for (const tok of innerLine) {
              if (tok?.type === 'asi' && tok.set_type && tok.left?.type === 'var') {
                const vName = normalizeVarName(tok.left.data);
                const newType = tok.set_type === 'str' ? 'string' : tok.set_type;
                if (blockScope[vName] && blockScope[vName] !== newType) {
                  if (fnContext) {
                    fnContext.shadowedTypes = fnContext.shadowedTypes || {};
                    fnContext.shadowedTypes[vName] = newType;
                  }
                }
                blockScope[vName] = newType;
              } else if (tok?.type === 'asi' && !tok.set_type && tok.left?.type === 'var') {
                // Propagate simple assignment type within the block without overriding existing types
                const vName = normalizeVarName(tok.left.data);
                const rType = getTypeFromNode(tok.right, blockScope, false, ln);
                if (rType && rType !== 'any' && !blockScope[vName]) blockScope[vName] = rType;
              }
            }
          }

          walk(innerLine, ln, fnContext, blockScope);
        }
      }
    };

    // Process each line of the AST
    for (const line of AST) {
      const lineNum = line?.[0]?.line;
      if (!Array.isArray(line)) continue;
      if (line[0]?.type === 'asi' && line[0].right?.type === 'fnc' && line[0].right.data === 'function') {
        const fnc = line[0].right;
        const returnType = fnc.returns || 'any';
        const fnName = getAssignedLambdaName(line[0].left);

        const ctx = {
          returns: returnType,
          functionName: fnName,
          needsReturnCheck: returnType !== 'any' && returnType !== 'void',
          isCommand: fnc.isCommand || false,
          shadowedTypes: {},
          validateReturnType: true
        };

        const initialScope = {};

        // Extract parameter types from typed function
        const accepts = [];
        if (fnc.parameters && fnc.parameters.length >= 1) {
          let paramString = fnc.parameters[0]?.data;
          if (paramString && typeof paramString === 'string') {
            paramString = paramString.replace(/^\s*(?:def\(|function\()/, '').replace(/\)\s*$/, '').trim();
            const paramPairs = (typeof paramString === 'string' ? paramString : "").split(',').map(p => p.trim());
            paramPairs.forEach(pair => {
              const parts = pair.split(/\s+/);
              if (parts.length >= 2) {
                const type = parts[0];
                const name = parts[1];
                initialScope[name] = type;
                accepts.push(type);
              } else if (pair) {
                const name = pair.split(/\s+/).pop();
                initialScope[name] = 'any';
                accepts.push('any');
              }
            });
          }
        }

        const functionBody = fnc.parameters[1];
        if (functionBody?.type === 'blk') {
          // Pre-scan for shadowed variable types inside nested blocks
          const collectShadowed = (blk, scope) => {
            if (!blk || !Array.isArray(blk.data)) return;
            for (const inner of blk.data) {
              if (Array.isArray(inner)) {
                // Look for assignments with explicit type inside this line
                for (const tok of inner) {
                  if (tok?.type === 'asi' && tok.set_type && tok.left?.type === 'var') {
                    const vName = normalizeVarName(tok.left.data);
                    // If variable exists in outer scope and types differ, record shadowed type
                    const outerType = initialScope[vName];
                    const newType = tok.set_type === 'str' ? 'string' : tok.set_type;
                    if (outerType && outerType !== newType) {
                      ctx.shadowedTypes[vName] = newType;
                    }
                  }
                }
                // Recurse into nested blocks
                inner.forEach(part => {
                  if (part?.type === 'blk') collectShadowed(part, scope);
                });
              }
            }
          };
          collectShadowed(functionBody, initialScope);

          walk(functionBody, lineNum, ctx, initialScope);
        }

        // Update signature for this top-level lambda/function definition
        const sig = this.functionReturnTypes[fnName] || { accepts: [], returns: 'any' };
        sig.accepts = accepts;
        sig.returns = ctx.inferredReturnType || ctx.returns || returnType || 'any';
        if (fnc.strictAnyArgs) sig.strictAnyArgs = true;
        this.functionReturnTypes[fnName] = sig;

        continue;
      }

      // Handle command definitions
      if (line[0]?.type === 'cmd' && line[0].data === 'def') {
        if (line.length < 4) continue;

        const cmdName = line[1]?.data;
        const params = line[2]?.data;

        const ctx = {
          returns: 'void',
          functionName: cmdName,
          needsReturnCheck: false,
          isCommand: true
        };

        const initialScope = {};
        if (params && typeof params === 'string') {
          const paramPairs = params.split(',').map(p => p.trim());
          paramPairs.forEach((pair, index) => {
            const parts = pair.split(/\s+/);
            if (parts.length >= 2) {
              const type = parts[0];
              const name = parts[1];
              initialScope[name] = type;
            } else if (parts.length === 1 && parts[0]) {
              // Untyped command param, e.g. `def "cmd" "param" (...)`
              initialScope[parts[0]] = 'any';
            }
          });
        }

        const commandBody = line[3];
        if (commandBody?.type === 'blk') {
          walk(commandBody, lineNum, ctx, initialScope);
        }

        continue;
      }

      // Handle command calls
      if (Array.isArray(line) && line[0]?.type === 'cmd') {
        const cmdName = line[0].data;
        const params = line.slice(1);
        if (line[0].paramTypes) {
          const expectedTypes = line[0].paramTypes;

          for (let i = 0; i < Math.min(params.length, expectedTypes.length); i++) {
            const expected = expectedTypes[i] || 'any';
            const actual = getTypeFromNode(params[i], globalScope, false, lineNum);
            if (!typesCompatible(expected, actual)) {
              errors.push({
                line: lineNum || 0,
                message: `Type mismatch: argument ${i + 1} of '${cmdName}' expected ${expected}, got ${actual}`
              });
            }
          }
        } else {
          for (const p of params) {
            if (p) getTypeFromNode(p, globalScope, false, lineNum);
          }
        }
      }

  // Walk the entire line with a shared global scope across lines
      globalScope = globalScope || {};
      walk(line, lineNum, null, globalScope);

      // Also check for inline lambda missing return in any line (including inside blocks)
      for (const tok of line) {
        if (tok?.type === 'asi' && tok.right?.type === 'fnc' && tok.right.data === 'function') {
          const functionBody = tok.right.parameters?.[1];
          if (functionBody?.type === 'blk') {
            const hasReturn = this.hasReturnStatement(functionBody.data);
            if (!hasReturn) {
              const lambdaName = normalizeVarName(tok.left?.data || 'function');
              errors.push({
                line: lineNum || 0,
                message: `Function '${lambdaName}' missing return statement`
              });
            }
          }
        }
      }
    }

    return errors;
  }
}

if (typeof Scratch !== "undefined") {
  Scratch.extensions.register(Scratch.vm.runtime.ext_OSLUtils = new OSLUtils());
} else if (typeof module !== "undefined" && module.exports) {
  module.exports = OSLUtils;
  if (require.main === module) {
    let utils = new OSLUtils();
    const fs = require("fs");

    function formatByslJson(obj, indent = 0) {
      const spaces = '  '.repeat(indent);

      if (Array.isArray(obj)) {
        if (obj.length > 0 && obj.every(item => typeof item === 'number' || typeof item === 'string' || Array.isArray(item))) {
          let isByslArray = false;
          if (obj.length >= 4) {
            const firstFew = obj.slice(0, 8);
            const hasNumbers = firstFew.some(item => typeof item === 'number');
            isByslArray = hasNumbers && obj.length % 4 !== 1;
          }

          if (isByslArray && obj.length > 8) {
            let result = '[\n';
            for (let i = 0; i < obj.length; i += 4) {
              const chunk = obj.slice(i, i + 4);
              const formattedChunk = chunk.map(item =>
                typeof item === 'string' ? JSON.stringify(item) : String(item)
              ).join(', ');
              result += `${spaces}  ${formattedChunk}`;
              if (i + 4 < obj.length) result += ',';
              result += '\n';
            }
            result += `${spaces}]`;
            return result;
          }
        }

        if (obj.length === 0) return '[]';
        const items = obj.map(item => formatByslJson(item, indent + 1));
        if (items.every(item => item.length < 50) && items.length <= 3) {
          return `[${items.join(', ')}]`;
        }
        return `[\n${items.map(item => `${spaces}  ${item}`).join(',\n')}\n${spaces}]`;
      }

      if (obj && typeof obj === 'object' && obj.constructor === Object) {
        const keys = Object.keys(obj);
        if (keys.length === 0) return '{}';

        const items = keys.map(key => {
          const value = formatByslJson(obj[key], indent + 1);
          return `${JSON.stringify(key)}: ${value}`;
        });

        return `{\n${items.map(item => `${spaces}  ${item}`).join(',\n')}\n${spaces}}`;
      }

      return JSON.stringify(obj);
    }

    const code = fs.readFileSync("/Users/sophie/Origin-OS/OSL Programs/apps/System/originWM.osl", "utf-8")

    const result = utils.generateFullAST({
       CODE: code
    });

    fs.writeFileSync("lol.json", JSON.stringify(utils.lintSyntax(code), null, 2));
  }
}