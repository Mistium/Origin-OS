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


function compileStringConcat(OSL) {
  let out = [];
  for (let line of OSL) {
    if (line && line.indexOf("`") !== -1) {
      line = line
        .replace(/\$\{([^\}]*)\}/gm, '" ++ $1 ++ "')
        .replace(' ++ "" ++ ', '" ++ "')
        .replace(/\`([^\`]+)\`/gm, '( "$1" )')
        .replace(' ++ "" ', " ")
        .replace(' "" ++ ', " ");
    }
    out.push(line);
  }
  return out;
}

function extractQuotes(OSL) {
  let quotes = {};
  let regExp = /"(?:[^\\"]*|\\.)*("|$)/gm;
  OSL = OSL.replace(regExp, (match) => {
    let name = "Â§" + randomString(32);
    quotes[name] = match;
    return name;
  });
  return [OSL, quotes];
}

function insertQuotes(OSL, quotes) {
  for (let key in quotes) {
    OSL = OSL.replaceAll(key, quotes[key]);
  }
  return OSL;
}


class OSLUtils {
  constructor() {
    this.regex = /"[^"]+"|{[^}]+}|\[[^\]]+\]|[^."(]*\((?:(?:"[^"]+")*[^.]+)*|\d[\d.]+\d|[^." ]+/g;
    this.operators = ["+", "++", "-", "*", "/", "//", "%", "??", "^", "b+", "b-", "b/", "b*", "b^"]
    this.comparisons = ["!=", "==", "!==", "===", ">", "<", "!>", "!<", ">=", "<=", "in", "notIn"]
    this.logic = ["and", "or", "nor", "xor", "xnor", "nand"]
    this.bitwise = ["|", "&", "<<", ">>", "^^"]
    this.unary = ["typeof", "new"]
    this.listVariable = "";
    // Pre-compile regex for generateFullAST to avoid recompilation
    this.fullASTRegex = /("(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`|'(?:[^'\\]|\\.)*')|\/\*[^*]+|[,{\[]\s*[\r\n]\s*[}\]]?|[\r\n]\s*[}\.\]]|;|(?<=[)"\]}a-zA-Z\d])\[|(?<=[)\]])\(|([\r\n]|^)\s*\/\/[^\r\n]+|[\r\n]/gm;
    this.lineTokeniserRegex = /("(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`|'(?:[^'\\]|\\.)*')|(?<=[\]"}\w\)])(?:\+\+|\?\?|->|==|!=|<=|>=|[><?+*^%/\-|&])(?=\S)/g;
    // Pre-compile line ending normalization regex
    this.lineEndingRegex = /\r\n/g;
    this.macLineEndingRegex = /\r/g;
    // Store inlinable functions
    this.inlinableFunctions = {};

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
    }

    if (typeof window !== "undefined") window.osl_tkn = this.tkn;
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
          opcode: "compileStringConcat",
          blockType: Scratch.BlockType.REPORTER,
          text: "Compile String Concat [CODE]",
          arguments: {
            CODE: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '["hello","world"]',
            },
          },
        },
        {
          opcode: "compileCloseBrackets",
          blockType: Scratch.BlockType.REPORTER,
          text: "Compile Close Brackets [CODE]",
          arguments: {
            CODE: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '["log \\"wow\\".left(1 + 1)"]',
            },
          },
        },
        {
          opcode: "cleanOSL",
          blockType: Scratch.BlockType.REPORTER,
          text: "Clean OSL [CODE]",
          arguments: {
            CODE: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '["log 10","text 10 : c#fff","text 10 : c#fff"]',
            },
          },
        },
        "---",
        {
          opcode: "extractQuotes",
          blockType: Scratch.BlockType.REPORTER,
          text: "Extract Quotes From [CODE]",
          arguments: {
            CODE: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'log "hello test"',
            },
          },
        },
        {
          opcode: "insertQuotes",
          blockType: Scratch.BlockType.REPORTER,
          text: "Insert Quotes From [QUOTES] Into [CODE]",
          arguments: {
            QUOTES: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "{}",
            },
            CODE: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "",
            },
          },
        },
        {
          opcode: "inlineCompile",
          blockType: Scratch.BlockType.REPORTER,
          text: "Compile Inline Functions [CODE]",
          arguments: {
            CODE: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: ""
            }
          }
        },
        {
          opcode: "handleJSONvars",
          blockType: Scratch.BlockType.REPORTER,
          text: "Handle JSON Variables [CODE] [VARS]",
          arguments: {
            CODE: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "",
            },
            VARS: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "",
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
              defaultValue: '["|", "&", "<<", ">>", "^^"]',
            },
          },
        },
        {
          opcode: "setUnary",
          blockType: Scratch.BlockType.COMMAND,
          text: "Set Unary [UNARY]",
          arguments: {
            UNARY: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '["typeof", "new"]',
            },
          },
        },
      ],
    };
  }

  // Detect if a function is inlinable (simple single return)
  isInlinableFunction(fnNode) {
    if (!fnNode || fnNode.type !== "fnc" || fnNode.data !== "function") return false;
    if (!fnNode.parameters || fnNode.parameters.length !== 2) return false;

    const body = fnNode.parameters[1];
    if (!body || body.type !== "blk" || !body.data || !Array.isArray(body.data)) return false;

    // Check if function body has exactly one statement that's a return
    if (body.data.length !== 1 || !Array.isArray(body.data[0])) return false;
    const statement = body.data[0];
    if (statement.length < 2 || statement[0].type !== "cmd" || statement[0].data !== "return") return false;

    return true;
  }

  // Calculate the complexity cost of inlining vs function call
  calculateInliningBenefit(funcName, parameters, returnExpression) {
    let totalParamComplexity = 0;
    let totalParamUsage = 0;

    const funcInfo = this.inlinableFunctions[funcName];
    if (!funcInfo) return false;

    // Calculate complexity for each parameter
    for (let i = 0; i < funcInfo.parameters.length; i++) {
      const paramName = funcInfo.parameters[i];
      const paramExpr = parameters[i];
      const usageCount = this.countParameterUsage(returnExpression, paramName);

      totalParamUsage += usageCount;

      // Complex expressions get higher cost when used multiple times
      if (!this.isSimpleExpression(paramExpr)) {
        totalParamComplexity += usageCount * 2; // Penalty for complex expressions
      } else {
        totalParamComplexity += usageCount * 0.5; // Simple expressions are cheap
      }
    }

    // Don't inline if the complexity cost is too high
    // Function call overhead = ~3 units, so only inline if total cost < 6
    return totalParamComplexity < 6;
  }

  // Extract parameters from function definition
  extractFunctionParameters(paramString) {
    if (!paramString || paramString.trim() === "") return [];
    return autoTokenise(paramString.trim(), ",").map(p => p.trim()).filter(p => p);
  }

  // Substitute parameters in an AST node
  substituteParameters(node, paramMap) {
    if (!node || typeof node !== "object") return node;

    if (Array.isArray(node)) {
      return node.map(item => this.substituteParameters(item, paramMap));
    }

    const result = { ...node };

    // If this is a variable that matches a parameter, replace it
    if (node.type === "var" && paramMap.hasOwnProperty(node.data)) {
      return paramMap[node.data];
    }

    // Recursively process all object properties
    for (const key in result) {
      if (result.hasOwnProperty(key) && key !== "source") {
        result[key] = this.substituteParameters(result[key], paramMap);
      }
    }

    return result;
  }

  // Check if a parameter expression is simple (safe to inline directly)
  isSimpleExpression(expr) {
    if (!expr || typeof expr !== "object") return true;

    // Simple types that are safe to duplicate
    if (["var", "str", "num", "unk"].includes(expr.type)) return true;

    // Complex expressions should be cached
    return false;
  }

  // Count how many times each parameter is used in the expression
  countParameterUsage(node, paramName) {
    if (!node || typeof node !== "object") return 0;

    let count = 0;

    if (Array.isArray(node)) {
      return node.reduce((sum, item) => sum + this.countParameterUsage(item, paramName), 0);
    }

    // If this is the parameter variable, count it
    if (node.type === "var" && node.data === paramName) {
      count++;
    }

    // Recursively count in all object properties
    for (const key in node) {
      if (node.hasOwnProperty(key) && key !== "source") {
        count += this.countParameterUsage(node[key], paramName);
      }
    }

    return count;
  }

  // Try to inline a function call with parameter caching for complex expressions
  tryInlineFunction(funcName, parameters) {
    const inlineFunc = this.inlinableFunctions[funcName];
    if (!inlineFunc) return null;

    if (parameters.length !== inlineFunc.parameters.length) return null;

    // Check if inlining would actually be beneficial
    if (!this.calculateInliningBenefit(funcName, parameters, inlineFunc.returnExpression)) {
      return null; // Skip inlining - function call is better
    }

    const paramMap = {};
    const tempVars = [];

    // Analyze each parameter
    for (let i = 0; i < inlineFunc.parameters.length; i++) {
      const paramName = inlineFunc.parameters[i];
      const paramExpr = parameters[i];
      const usageCount = this.countParameterUsage(inlineFunc.returnExpression, paramName);

      // If parameter is used multiple times and is complex, create a temp variable
      if (usageCount > 1 && !this.isSimpleExpression(paramExpr)) {
        const tempVarName = `__temp_${paramName}_${randomString(8)}`;
        tempVars.push({
          name: tempVarName,
          value: paramExpr
        });
        paramMap[paramName] = {
          type: "var", num: this.tkn.var,
          data: tempVarName,
          source: tempVarName
        };
      } else {
        // Simple expression or used only once - inline directly
        paramMap[paramName] = paramExpr;
      }
    }

    // Substitute parameters in the return expression
    let inlinedExpr = this.substituteParameters(inlineFunc.returnExpression, paramMap);

    // If we have temp variables, wrap the expression in a block that declares them
    if (tempVars.length > 0) {
      // Create assignment statements for temp variables
        const assignments = tempVars.map(tempVar => [
        {
          type: "asi", num: this.tkn.asi,
          data: "@=",
          source: `${tempVar.name} @= ${tempVar.value.source || "[expression]"}`,
          left: {
            type: "var", num: this.tkn.var,
            data: tempVar.name,
            source: tempVar.name
          },
          right: tempVar.value
        }
      ]);      // Create a return statement with the inlined expression
      const returnStmt = [
        {
          type: "cmd", num: this.tkn.cmd,
          data: "return",
          source: `return ${inlinedExpr.source || "[inlined]"}`
        },
        inlinedExpr
      ];

      // Return a block with temp variable assignments followed by the return
      return {
        type: "blk", num: this.tkn.blk,
        data: [...assignments, returnStmt],
        source: "[inlined with temps]"
      };
    }

    return inlinedExpr;
  }

  // Register inlinable functions during AST generation
  registerInlinableFunction(name, fnNode) {
    if (!this.isInlinableFunction(fnNode)) return;

    const paramString = fnNode.parameters[0].data || fnNode.parameters[0].source;
    const parameters = this.extractFunctionParameters(paramString);
    const body = fnNode.parameters[1];
    const returnStatement = body.data[0];

    // Extract the return expression (everything after the return command)
    const returnExpression = returnStatement.slice(1);

    this.inlinableFunctions[name] = {
      parameters: parameters,
      returnExpression: returnExpression.length === 1 ? returnExpression[0] : returnExpression
    };
  }

  // Normalize line endings using pre-compiled regex for better performance
  normalizeLineEndings(text) {
    return text.replace(this.lineEndingRegex, '\n').replace(this.macLineEndingRegex, '\n');
  }

  compileBrackets(OSL) {
    let out = [];
    let methods = {};
    let regExp = /.\(([^()]*)\)/; // Regular expression to match innermost parentheses containing spaces or non-alphanumeric characters

    let static_types = ["str", "num", "unk"]

    const isStatic = val => static_types.includes(this.evalToken(val).type)

    for (let line of OSL) {
      while (regExp.test(line)) {
        line = line.replace(regExp, (match, p1) => {
          let name = randomString(12); // Generate a random identifier

          if (match.startsWith(" ") || match.startsWith("(")) {
            out.push(`this.${name} @= ${p1.trim()}`);

            if (match.startsWith("((")) {
              return `(${name}`;
            } else {
              return ` ${name}`;
            }
          } else {
            let temp = "Â§" + randomString(32);
            const trimmed = p1.trim();
            if (match[0] === "!") {
              out.push(`${name} @= ${trimmed}`);
              return "!" + name;
            }
            if (trimmed.match(/^"([^"]|\\")+"$/) || trimmed === "" || trimmed.match(/^\W+$/) || !isNaN(+trimmed)) {
              methods[temp] = trimmed;
              return match[0] + temp;
            }

            methods[temp] = name;
            if (trimmed.indexOf(",") !== -1) {
              let inputs = autoTokenise(trimmed, ",");
              name = randomString(12);
              const cur = inputs[0].trim();
              if (isStatic(cur)) {
                methods[temp] = cur;
              } else {
                out.push(`this.${name} @= ${cur}`);
                methods[temp] = `${name}`;
              }
              for (let i = 1; i < inputs.length; i++) {
                name = randomString(12);
                const cur = inputs[i].trim();
                if (isStatic(cur)) {
                  methods[temp] += `,${cur}`;
                } else {
                  out.push(`this.${name} @= ${cur}`);
                  methods[temp] += `,${name}`;
                }
              }
            } else {
              const cur = trimmed;
              if (isStatic(cur)) {
                methods[temp] = cur;
              } else {
                out.push(`this.${name} @= ${cur}`);
                methods[temp] = name;
              }
            }
            return `${match[0] + temp}`;
          }
        });
      }
      out.push(line);
    }

    out = out.join("\n");
    let key_reg;
    for (let key of Object.keys(methods).reverse()) {
      key_reg = new RegExp(key, "gm");
      out = out.replace(key_reg, `(${methods[key]})`);
    }
    return out.split("\n");
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
    return out
  }

  stringToToken(cur, param) {
    let start = cur[0]
    const tkn = this.tkn;
    if (cur === "/@line") return { type: "unk", num: tkn.unk, data: "/@line" }
    if (!isNaN(+`${cur}`.replaceAll("_", ""))) return { type: "num", num: tkn.num, data: +`${cur}`.replaceAll("_", "") }
    else if (cur === "true" || cur === "false") return { type: "raw", num: tkn.raw, data: cur === "true" }
    else if (this.operators.indexOf(cur) !== -1) return { type: "opr", num: tkn.opr, data: cur }
    else if (cur === "++") return { type: "opr", num: tkn.opr, data: "++" }
    else if (cur === "--") return { type: "unk", num: tkn.unk, data: "--" }
    else if (this.comparisons.indexOf(cur) !== -1) return { type: "cmp", num: tkn.cmp, data: cur }
    else if (cur.endsWith("=")) return { type: "asi", num: tkn.asi, data: cur }
    else if (start + cur[cur.length - 1] === '""') return { type: "str", num: tkn.str, data: destr(cur) }
    else if (start + cur[cur.length - 1] === "''") return { type: "str", num: tkn.str, data: destr(cur, "'") }
    else if (start + cur[cur.length - 1] === "``") {
      return {
        type: "tsr", num: this.tkn.tsr, data: parseTemplate(destr(cur, "`")).filter(v => v !== "").map(v => {
          if (v.startsWith("${")) return this.generateAST({ CODE: v.slice(2, -1), START: 0 })[0]
          else return { type: "str", num: tkn.str, data: v }
        })
      }
    }
    else if (cur === "?") return { type: "qst", num: tkn.qst, data: cur }
    else if (this.logic.indexOf(cur) !== -1) return { type: "log", num: tkn.log, data: cur }
    else if (this.bitwise.indexOf(cur) !== -1) return { type: "bit", num: tkn.bit, data: cur }
    else if (cur.startsWith("...")) return { type: "spr", num: tkn.spr, data: this.evalToken(cur.substring(3)) }
    else if (["!", "-", "+"].includes(start) && cur.length > 1) return { type: "ury", num: tkn.ury, data: start, right: this.evalToken(cur.slice(1)) };
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
            else return { type: "arr", num: this.tkn.arr, data: [] };
          }

          let tokens = autoTokenise(cur.substring(1, cur.length - 1), ",");
          while (tokens[tokens.length - 1] === "") tokens.pop();
          tokens = tokens.map(token => {
            token = String(token).trim()
            if (token === "") return null;
            return token;
          });
          for (let i = 0; i < tokens.length; i++) {
            tokens[i] = this.generateAST({ CODE: tokens[i], START: 0 })[0];
          }

          if (param) {
            const obj = { type: "mtv", num: this.tkn.mtv, data: "item", parameters: tokens };
            obj.isStatic = tokens.every(token => this.isStaticToken(token));
            if (obj.isStatic) {
              if (tokens.length === 1 && tokens[0].type === "str") {
                return {type: "mtv", num: this.tkn.mtv, data: tokens[0].data}
              }
              obj.static = tokens.map(token => token.data);
            }
            return obj;
          }
          const arr = { type: "arr", num: this.tkn.arr, data: tokens };
          arr.isStatic = tokens.every(token => this.isStaticToken(token));
          if (arr.isStatic) arr.static = tokens.map(token => token.data);
          return arr;
        } else if (cur[0] === "{") {
          if (cur == "{}") return { type: "obj", num: this.tkn.obj, data: {} }

          let output = {};
          let tokens = autoTokenise(cur.substring(1, cur.length - 1), ",")
            .filter((token) => token.trim() !== "");
          for (let token of tokens) {
            let [key, value] = autoTokenise(token, ":");
            key = key.trim();
            if (key[0] === "\"" && key[key.length - 1] === "\"") {
              key = key.substring(1, key.length - 1);
            }
            if (value === undefined) output[key] = null;
            else output[key] = this.generateAST({ CODE: ("" + value).trim(), START: 0 })[0];
          }
          return { type: "obj", num: this.tkn.obj, data: output };
        }
      } catch (e) {
        console.error(e)
        return { type: "unk", num: this.tkn.unk, data: cur }
      }
    }
    else if (cur === "null") return { type: "unk", num: this.tkn.unk, data: null }
    else if (cur.match(/^(!+)?[a-zA-Z_][a-zA-Z0-9_]*$/)) return { type: "var", num: this.tkn.var, data: cur }
    else if (cur === "->") return { type: "inl", num: this.tkn.inl, data: "->" }
    else if (cur.startsWith("(\n") && cur.endsWith(")")) return { type: "blk", num: this.tkn.blk, data: this.generateFullAST({ CODE: cur.substring(2, cur.length - 1).trim(), START: 0, MAIN: false }) }
    else if (cur.startsWith("(") && cur.endsWith(")")) {
      let end = this.findMatchingParentheses(cur, 0);
      if (end === -1) return { type: "unk", num: this.tkn.unk, data: cur, parse_error: "Unmatched parentheses" };
      const body = cur.substring(1, end).trim();
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
    else return { type: "unk", num: this.tkn.unk, data: cur }
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

  generateAST({ CODE, START, MAIN }) {
    CODE = CODE + "";
    // Normalize line endings to handle Windows/Mac differences
    CODE = this.normalizeLineEndings(CODE);
    const start = CODE.split("\n", 1)[0]
    let handlingMods = false;
    // tokenise and handle lambda and inline funcs
    let ast = []
    let tokens = this.tokeniseLineOSL(CODE)
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
        token.data = [token.data.substring(0, pivot - 1), this.evalToken(token.data.substring(pivot))]
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
      for (let i = START ?? (["asi", "inl"].includes(type) ? 1 : 2); i < ast.length; i++) {
        const cur = ast[i];
        let prev = ast[i - 1];
        let next = ast[i + 1];

        if (cur?.type === type) {
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

      if (node.type === "fnc" && typeof node.data === "string" && this.inlinableFunctions[node.data]) {
        const inlined = this.tryInlineFunction(node.data, node.parameters || []);
        if (inlined) {
          return evalASTNode(inlined);
        }
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
        let params = (node?.left?.parameters ?? []).map(p => p.data).join(",");
        if (node.left?.type === "var") params = node.left.data;
        const right = node.right;
        if (typeof right.data === "string" && !right.data.trim().startsWith("(\n") && node.left) {
          params = node.left.source.replace(/^\(| +|\)$/gi, "");
          right.data = `(\nreturn ${right.source}\n)`;
        }
        return {
          type: "fnc", num: this.tkn.fnc,
          data: "function",
          parameters: [
            {
              type: "str", num: this.tkn.str,
              data: params,
              source: params
            },
            this.generateAST({ CODE: right.data, START: 0 })[0]
          ]
        }
      }
      if (node.type === "mtd") {
        if (node.data.length !== 2) return node;
        if (["str", "num"].includes(node.data[0].type))
          switch (node.data[1].data) {
            case "len": return this.evalToken(node.data[0].data.length);
          }
        return node;
      }
      if (node.type === "opr" && node.left && node.right) {
        node.right = evalASTNode(node.right);

        // If both operands are numbers, evaluate the operation
        if (node.left.type === "num" && node.right.type === "num" && ["+", "-", "/", "*", "%", "^"].includes(node.data)) {
          let result;
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
            source: result.toString()
          };
        }
      }
      return node;
    }

    // Evaluate each node in the AST
    for (let i = 0; i < ast.length; i++) {
      ast[i] = evalASTNode(ast[i]);
    }

    // def command -> assignment conversion
    let first = ast[0] ?? {};
    let second = ast[1] ?? {};
    const local = first.data === "local" && first.type === "var";
    if (
      first.type === "var" &&
      first.data === "def" &&
      second.type === "fnc"
    ) {
      if (local) {
        ast.splice(0, 1);
        if (ast.length === 0) return [];
        first = ast[0] ?? {};
        second = ast[1] ?? {};
      }
      first.data = second.data;
      ast.splice(1, 0, {
        type: "asi", num: this.tkn.asi,
        data: "=",
        source: start
      });
      const params = second.parameters.map(p => (p.set_type ? `${p.set_type} ` : "") + (
        p.type === "mtd" ?
          p.data.map(p2 => p2.data).join(".") :
          p.data
      )).join(",")
      const funcNode = {
        type: "fnc", num: this.tkn.fnc,
        data: "function",
        parameters: [
          {
            type: "str", num: this.tkn.str,
            data: params,
            source: params
          },
          ast[3]
        ]
      };
      if (local) {
        ast[0] = this.generateAST({ CODE: "this." + ast[0].data, START: 0 })[0]
      }
      ast[2] = funcNode;
      ast.splice(3, 1);

      // Register for inlining if it's a simple function
      this.registerInlinableFunction(first.data, funcNode);
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
          { type: "asi", num: this.tkn.asi, data: "=??", source: start }
        );
      }
    }

    // assignment node creation
    for (let i = START ?? 1; i < ast.length; i++) {
      const cur = ast[i];
      let prev = ast[i - 1];
      let next = ast[i + 1];

      if (cur?.type === "asi") {
        if (ast[0].data === "local") {
          prev = this.generateAST({ CODE: "this." + prev.source, START: 0 })[0];
          ast.splice(0, 1);
          i -= 1;
        }
        if (ast.length > 1 && i > 1) {
          cur.set_type = String(ast?.[i - 2]?.data ?? "").toLowerCase();
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

        cur.source = start;
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

    if (ast[0].type === "cmd" &&
      ast[0].data === "switch"
    ) {
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
            if ((v[0]?.data ?? null) !== null) newCases[String(v[0]?.data ?? "").toLowerCase()] = v[1]
          })
          cases.type = "object"
          cases.all = newCases;
        }
        ast[0].cases = cases
      }
    }

    if (ast[0].type === "cmd" && ast.every(v => ["str", "cmd", "num", "raw"].includes(v.type))) {
      ast[0].isStatic = true;
      ast[0].full = ast.map(v => v.data);
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
    if (MAIN) this.inlinableFunctions = {};
    let line = 0;
    // Normalize line endings to Unix-style (\n) to handle Windows/Mac differences
    CODE = this.normalizeLineEndings(CODE.trim());
    CODE = (MAIN ? `/@line ${++line}\n` : "") + CODE.replace(this.fullASTRegex, (match) => {
      if (match === "\n") return MAIN ? `\n/@line ${++line}\n` : "\n";
      if (match === ";") return "\n";
      if (match === "(") return ".call(";
      if (match === "[") return ".[";
      if ([",", "{", "}", "[", "]"].includes(match.trim()[0])) { line++; return match }
      if (match.trim().startsWith("//")) { line++; return ""; }
      if (match.startsWith("\n")) { line++; return match.replace(/\n\s*\./, ".") };
      return match;
    });
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

    for (let i = 0; i < lines.length; i++) {
      const cur = lines[i]
      if (!cur) continue;
      const type = cur[0]?.type;
      const data = cur[0]?.data;
      if (type === "unk" && data === "/@line") {
        let next = lines[i + 1];
        lines.splice(i--, 1);
        if (!next) continue;
        next[0].line = cur[1].data;
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
            }
          } else {
            cur[1].type = "str";
            cur[1].num = this.tkn.str;
          }
        }
        i++
      }
      if (type === "cmd" && data === "def") {
        if (cur.length < 3) {
          lines[i] = this.generateError(cur[0], "Incomplete function definition. Expected: def name(param1, param2) ( ... )");
          continue;
        }
        if (cur[cur.length - 1].type !== "blk") {
          lines[i] = this.generateError(cur[0], "Function body missing. Add a block: ( ... )");
          continue;
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

  splitmethods({ CODE }) {
    CODE = Scratch.Cast.toString(CODE);
    return JSON.stringify(CODE.match(this.regex) || []);
  }

  getMethodInputs({ CODE }) {
    CODE = Scratch.Cast.toString(CODE);
    let depth = 1;
    let out = "";
    for (letter of CODE) {
      if (letter === "(") depth += 1;
      else if (letter === ")") depth -= 1;

      out += letter;
      if (depth === 0) break;
    }
    const argsString = out;
    const args = [];
    let currentArg = "";
    let inQuotes = false;

    for (let i = 0; i < argsString.length; i++) {
      const char = argsString.charAt(i);
      if (char === "," && !inQuotes) {
        args.push(currentArg.trim());
        currentArg = "";
      } else {
        currentArg += char;
        if (char === '"') inQuotes = !inQuotes;
      }
    }
    if (currentArg.trim() !== "") {
      args.push(currentArg.trim());
    }

    let mapargs = args.map((arg) => {
      arg = arg.trim();
      if (arg.startsWith('"') && arg.endsWith('"')) return arg;
      else if (!isNaN(arg)) return Number(arg);
      else if (arg.startsWith("[") && arg.endsWith("]")) return JSON.parse(arg);
      else return arg;
    });
    if (typeof mapargs == "object") return JSON.stringify(mapargs);
    return mapargs;
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

  compileStringConcat({ CODE }) {
    CODE = Scratch.Cast.toString(CODE);
    return JSON.stringify(compileStringConcat(JSON.parse(CODE)));
  }

  compileCloseBrackets({ CODE }) {
    CODE = Scratch.Cast.toString(CODE);
    return JSON.stringify(this.compileBrackets(JSON.parse(CODE)));
  }

  cleanOSL({ CODE }) {
    return JSON.stringify(
      JSON.parse(CODE)
        .join("\n")
        .replace(this.lineEndingRegex, '\n')
        .replace(this.macLineEndingRegex, '\n')
        .replace(/\n+/gi, "\n")
        .replace(/\n +/gm, "\n")
        .replace(/\n\/[^\n\r]+/gm, "")
        .trim()
        .split("\n"),
    );
  }

  extractQuotes({ CODE }) {
    CODE = Scratch.Cast.toString(CODE);
    return JSON.stringify(extractQuotes(CODE));
  }

  insertQuotes({ QUOTES, CODE }) {
    CODE = Scratch.Cast.toString(CODE);
    return insertQuotes(CODE, JSON.parse(QUOTES));
  }

  inlineCompile({ CODE }) {
    return ""
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

  setUnary({ UNARY }) {
    UNARY = Scratch.Cast.toString(UNARY);
    this.unary = JSON.parse(UNARY);
  }
}

if (typeof Scratch !== "undefined") {
  Scratch.extensions.register(new OSLUtils());
} else {
  let utils = new OSLUtils();
  const fs = require("fs");

  fs.writeFileSync("lol.json", JSON.stringify(utils.generateFullAST({
    CODE: fs.readFileSync("/Users/sophie/Origin-OS/OSL Programs/apps/System/originWM.osl", "utf-8")
  }), null, 2));
}