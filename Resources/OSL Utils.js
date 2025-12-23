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
  const out = [];
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (ch === '\\') {
      i++;
      const esc = str[i];
      switch (esc) {
        case 'n': out.push('\n'); break;
        case 't': out.push('\t'); break;
        case 'r': out.push('\r'); break;
        case '"': out.push('"'); break;
        case "'": out.push("'"); break;
        case '\\': out.push('\\'); break;
        default:
          // If the string ends with a lone backslash, keep it.
          if (esc === undefined) out.push('\\');
          else out.push(esc);
      }
    } else {
      out.push(ch);
    }
  }
  return out.join("");
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

function splitDotsTopLevel(str) {
  // Split on '.' only at top-level (not inside quotes/backticks or (), [], {}).
  // Uses slicing rather than per-char buffer joins for speed.
  let quotes = 0;
  let squotes = 0;
  let backticks = 0;
  let escaped = false;
  let depth = 0;
  let last = 0;
  const parts = [];
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];

    if (!escaped) {
      if (ch === '"' && squotes === 0 && backticks === 0) { quotes = 1 - quotes; continue; }
      if (ch === "'" && quotes === 0 && backticks === 0) { squotes = 1 - squotes; continue; }
      if (ch === '`' && quotes === 0 && squotes === 0) { backticks = 1 - backticks; continue; }
    }

    if ((quotes || squotes || backticks) && ch === '\\' && !escaped) {
      escaped = true;
      continue;
    }
    escaped = false;

    if (quotes || squotes || backticks) continue;

    if (ch === '(' || ch === '[' || ch === '{') depth++;
    else if (ch === ')' || ch === ']' || ch === '}') depth = Math.max(0, depth - 1);

    if (depth === 0 && ch === '.') {
      parts.push(str.slice(last, i));
      last = i + 1;
    }
  }
  parts.push(str.slice(last));
  return parts;
}

function parseTemplate(str) {
  let depth = 0;
  const arr = [];
  const cur = [];

  const flush = () => {
    arr.push(cur.join(''));
    cur.length = 0;
  };

  for (let i = 0; i < str.length; i++) {
    if (str[i] + str[i + 1] === '${') {
      if (depth === 0) {
        flush();
        cur.push('${');
      } else {
        cur.push('${');
      }
      depth++;
      i++; // Skip the next character since we processed both $ and {
      continue;
    }
    if (str[i] === '}' && depth > 0) {
      depth--
      if (depth === 0) {
        cur.push('}');
        flush();
      } else {
        cur.push('}');
      }
      continue;
    };
    cur.push(str[i]);
  }
  flush();
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

function isVarNameFast(str) {
  if (typeof str !== 'string' || str.length === 0) return false;
  let i = 0;
  const len = str.length;

  // Optional one-or-more leading '!'
  while (i < len && str.charCodeAt(i) === 33) i++;
  if (i >= len) return false;

  // First identifier char: [A-Za-z_]
  let c = str.charCodeAt(i);
  const isAlpha = (c >= 65 && c <= 90) || (c >= 97 && c <= 122);
  if (!(isAlpha || c === 95)) return false;
  i++;

  // Rest: [A-Za-z0-9_]*
  for (; i < len; i++) {
    c = str.charCodeAt(i);
    const isNum = c >= 48 && c <= 57;
    const isA = (c >= 65 && c <= 90) || (c >= 97 && c <= 122);
    if (!(isNum || isA || c === 95)) return false;
  }
  return true;
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
    this.operators = ["+", "++", "-", "*", "/", "//", "%", "??", "^", "|>", "to", "::"]
    this.comparisons = ["!=", "==", "!==", "===", ">", "<", "!>", "!<", ">=", "<=", "in"]
    this.logic = ["and", "or", "nor", "xor", "xnor", "nand"]
    this.bitwise = ["|", "&", "<<", ">>", ">>>", "<<<", "^^"]
    this.unary = ["typeof", "new"]
    this.listVariable = "";
    this.fullASTRegex = /("(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`|'(?:[^'\\]|\\.)*')|\/\*[^*]+|[,{\[]\s*[\r\n]\s*[}\]]?|[\r\n]\s*[}\.\]]|;|(?<=[)"\]}a-zA-Z\d])\[(?=[^\]])|(?<=[)\]])\(|([\r\n]|^)\s*\/\/[^\r\n]+|[\r\n]/gm;
    this.lineTokeniserRegex = /("(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`|'(?:[^'\\]|\\.)*')|(?<=[\]"}\w\)])(?:\+\+|\?\?|::|->|==|!=|<=|>=|[><?+*^%/\-|&])(?=\S)/g;
    this.maybeNeedsLineTokeniserRegex = /[+*^%/\-|&<>=?!:]/;
    // Pre-compile line ending normalization regex
    this.lineEndingRegex = /\r\n/g;
    this.macLineEndingRegex = /\r/g;
    // Store inlinable functions
    this.inlinableFunctions = {};
    // Eagerly compiling expressions to BYSL during parsing is expensive and not required
    // for correct AST generation/type checking. Keep it opt-in.
    this.precompileByslExpressions = false;
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

    // Faster membership checks for token classification
    this.operatorSet = new Set(this.operators);
    this.comparisonSet = new Set(this.comparisons);
    this.logicSet = new Set(this.logic);
    this.bitwiseSet = new Set(this.bitwise);
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

    // Track variables and their usage for dead code elimination
    this.variableUsage = new Map();
    this.definedVariables = new Set();

    // Built-in variable types (used heavily by applyTypes)
    this.builtinVarTypes = {
      file_types: 'object',
      timestamp: 'number',
      performance: 'number',
      data: 'any',
      mouse_touching: 'boolean',
      mouse_x: 'number',
      mouse_y: 'number',
      onclick: 'boolean',
      clicked: 'boolean',
      inputs: 'object',
      username: 'string',
      user: 'object',
      window: 'object'
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

  clearCachedBysl(node) {
    if (!node || typeof node !== "object") return;

    if (Array.isArray(node)) {
      node.forEach(item => this.clearCachedBysl(item));
      return;
    }

    if (node.bysl !== undefined) {
      delete node.bysl;
    }

    for (const key in node) {
      if (node.hasOwnProperty(key) && key !== "source") {
        this.clearCachedBysl(node[key]);
      }
    }
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

    // If the function has a declared signature with specific parameter types,
    // and any parameter is unused in the return expression, avoid inlining to
    // preserve type checking on the call site.
    const sig = this.functionReturnTypes?.[funcName];
    if (sig && Array.isArray(sig.accepts) && sig.accepts.some(t => t && t !== 'any')) {
      for (let i = 0; i < funcInfo.parameters.length; i++) {
        const paramName = funcInfo.parameters[i];
        const usageCount = this.countParameterUsage(returnExpression, paramName);
        if (usageCount === 0) {
          return false;
        }
      }
    }

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
    // Use strict threshold to preserve function calls for type checking
    return totalParamComplexity < 1;
  }

  // Extract parameters from function definition
  extractFunctionParameters(paramString) {
    if (!paramString || paramString.trim() === "") return [];
    return autoTokenise(paramString.trim(), ",").map(p => {
      const parts = p.trim().split(/\s+/);
      // If there are multiple parts, assume the last one is the parameter name
      // e.g., "number a" -> "a", "string param" -> "param"
      return parts.length > 1 ? parts[parts.length - 1] : p.trim();
    }).filter(p => p);
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
      const substituted = paramMap[node.data];
      if (substituted && typeof substituted === "object") {
        const newNode = { ...substituted };
        delete newNode.bysl;
        return newNode;
      }
      return substituted;
    }

    if (result.bysl !== undefined) delete result.bysl;

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
  tryInlineFunction(funcName, parameters, lineNum = 0) {
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
        const tempVarName = `temp_${paramName}_${randomString(8)}`;
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

    this.clearCachedBysl(inlinedExpr);

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
    if (this.maybeNeedsLineTokeniserRegex.test(code)) {
      code = code.replace(this.lineTokeniserRegex, v => {
        if (v.startsWith('"') || v.startsWith("'") || v.startsWith('`')) return v;
        return ` ${v} `
      })
    }
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
        if (m_comm === 0) {
          // Avoid generating tokens that are purely top-level whitespace.
          // Keep spaces when inside quotes/backticks or inside brackets.
          if (depth !== " " || quotes || squotes || backticks || b_depth > 0) {
            out.push(depth);
          }
        }
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
          const token = out.join("").trim();
          if (token) split.push(token);
          out = [];
          letter++;
        }
      }
      {
        const token = out.join("").trim();
        if (token) split.push(token);
      }
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
      let quotes = 0;
      let backticks = 0;
      let b_depth = 0;
      let escaped = false;
      let segmentStart = 0;
      const split = [];
      const len = CODE.length;

      while (letter < len) {
        const ch = CODE[letter];

        // Track bracket depth only when not inside quotes/backticks and not escaped
        if (quotes === 0 && backticks === 0 && !escaped) {
          if (ch === "[" || ch === "{" || ch === "(") b_depth++;
          else if (ch === "]" || ch === "}" || ch === ")") b_depth--;
          if (b_depth < 0) b_depth = 0;
        }

        // Track quoting/escaping
        if (ch === '"' && !escaped && backticks === 0) {
          quotes = 1 - quotes;
          escaped = false;
        } else if (ch === '`' && !escaped && quotes === 0) {
          backticks = 1 - backticks;
          escaped = false;
        } else if (ch === '\\' && !escaped) {
          escaped = true;
        } else {
          escaped = false;
        }

        // Split at top-level newline/semicolon
        if (quotes === 0 && backticks === 0 && b_depth === 0 && (ch === "\n" || ch === ";")) {
          split.push(CODE.slice(segmentStart, letter));
          segmentStart = letter + 1;
        }

        letter++;
      }

      split.push(CODE.slice(segmentStart));
      return split;
    } catch (e) {
      return [];
    }
  }

  stripCommentsPreserveNewlines(CODE) {
    // Remove // and /* */ comments while preserving newlines and not touching quoted strings.
    // This keeps /@line marker accounting accurate.
    CODE = this.normalizeLineEndings(CODE + "");
    const out = [];

    let i = 0;
    let quotes = 0;
    let squotes = 0;
    let backticks = 0;
    let escaped = false;

    while (i < CODE.length) {
      const ch = CODE[i];
      const next = i + 1 < CODE.length ? CODE[i + 1] : '';

      if (!escaped) {
        if (ch === '"' && squotes === 0 && backticks === 0) {
          quotes = 1 - quotes;
          out.push(ch);
          i++;
          continue;
        }
        if (ch === "'" && quotes === 0 && backticks === 0) {
          squotes = 1 - squotes;
          out.push(ch);
          i++;
          continue;
        }
        if (ch === '`' && quotes === 0 && squotes === 0) {
          backticks = 1 - backticks;
          out.push(ch);
          i++;
          continue;
        }
      }

      if (ch === '\\' && (quotes || squotes || backticks) && !escaped) {
        escaped = true;
        out.push(ch);
        i++;
        continue;
      }
      escaped = false;

      const inString = quotes || squotes || backticks;
      if (!inString && ch === '/' && next === '/') {
        // Line comment: replace everything until newline with spaces (keep newline).
        out.push(' ', ' ');
        i += 2;
        while (i < CODE.length && CODE[i] !== '\n') {
          out.push(' ');
          i++;
        }
        continue;
      }
      if (!inString && ch === '/' && next === '*') {
        // Block comment: replace with spaces, but preserve newlines.
        out.push(' ', ' ');
        i += 2;
        while (i < CODE.length) {
          const c = CODE[i];
          const n = i + 1 < CODE.length ? CODE[i + 1] : '';
          if (c === '*' && n === '/') {
            out.push(' ', ' ');
            i += 2;
            break;
          }
          out.push(c === '\n' ? '\n' : ' ');
          i++;
        }
        continue;
      }

      out.push(ch);
      i++;
    }

    return out.join('');
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
    const strCur = typeof cur === 'string' ? cur : String(cur);
    let start = strCur[0]
    const tkn = this.tkn;

    const parseSingle = (code) => {
      const ast = this.generateAST({ CODE: code, START: 0 });
      if (Array.isArray(ast) && ast.length > 0) return ast[0];
      return { type: "unk", num: tkn.unk, data: code };
    };
    if (strCur === "/@line") return { type: "unk", num: tkn.unk, data: "/@line" }

    // Fast numeric literal detection (avoid expensive replaceAll/isNaN on non-numbers)
    const firstCode = strCur.charCodeAt(0);
    const secondCode = strCur.length > 1 ? strCur.charCodeAt(1) : 0;
    const maybeNumber =
      (firstCode >= 48 && firstCode <= 57) ||
      (firstCode === 46 && (secondCode >= 48 && secondCode <= 57));
    if (maybeNumber) {
      if (strCur.indexOf("_") === -1) {
        const n = +strCur;
        if (n === n) return { type: "num", num: tkn.num, data: n };
      } else {
        const n = +strCur.replace(/_/g, "");
        if (n === n) return { type: "num", num: tkn.num, data: n };
      }
    }

    if (strCur === "true" || strCur === "false") return { type: "raw", num: tkn.raw, data: strCur === "true" }
    else if (this.operatorSet.has(strCur)) return { type: "opr", num: tkn.opr, data: strCur }
    else if (strCur === "++") return { type: "opr", num: tkn.opr, data: "++" }
    else if (strCur === "--") return { type: "unk", num: tkn.unk, data: "--" }
    else if (this.comparisonSet.has(strCur)) return { type: "cmp", num: tkn.cmp, data: strCur }
    else if (strCur.endsWith("=")) return { type: "asi", num: tkn.asi, data: strCur }
    else if (start + strCur[strCur.length - 1] === '""') return { type: "str", num: tkn.str, data: destr(strCur) }
    else if (start + strCur[strCur.length - 1] === "''") return { type: "str", num: tkn.str, data: destr(strCur, "'") }
    else if (start + strCur[strCur.length - 1] === "``") {
      return {
        type: "tsr", num: this.tkn.tsr, data: parseTemplate(destr(strCur, "`")).filter(v => v !== "").map(v => {
          if (v.startsWith("${")) {
            const expr = v.slice(2, -1).trim();
            if (!expr) return { type: "unk", num: tkn.unk, data: "" };
            return parseSingle(expr);
          }
          return { type: "str", num: tkn.str, data: v }
        })
      }
    }
    else if (strCur === "?") return { type: "qst", num: tkn.qst, data: strCur }
    else if (this.logicSet.has(strCur)) return { type: "log", num: tkn.log, data: strCur }
    else if (this.bitwiseSet.has(strCur)) return { type: "bit", num: tkn.bit, data: strCur }
    else if (strCur.startsWith("...")) return { type: "spr", num: tkn.spr, data: this.evalToken(strCur.substring(3)) }
    else if (["!", "-", "+"].includes(start) && strCur.length > 1) return { type: "ury", num: tkn.ury, data: start, right: this.evalToken(strCur.slice(1)) };
    else if (
      strCur.indexOf(".") !== -1 &&
      // Dotted expressions should be single-line tokens like `a.b` or `a.b()`.
      // Multi-line tokens (especially blocks) may contain dots inside their contents.
      strCur.indexOf("\n") === -1 &&
      start !== "(" &&
      start !== "[" &&
      start !== "{"
    ) {
      // Fast-path for very common simple identifiers.
      const canSimpleSplit =
        strCur.indexOf('"') === -1 &&
        strCur.indexOf("'") === -1 &&
        strCur.indexOf('`') === -1 &&
        strCur.indexOf('[') === -1 &&
        strCur.indexOf('{') === -1 &&
        strCur.indexOf('(') === -1 &&
        strCur.indexOf('\\') === -1;

      let method = canSimpleSplit ? strCur.split(".") : autoTokenise(strCur, ".");
      if (method.length > 1) {
        method = method.map((input, index) => this.evalToken(input, index > 0))
        return { type: "mtd", num: this.tkn.mtd, data: method };
      }
    }
    else if ((start === "{" && strCur[strCur.length - 1] === "}") || (start === "[" && strCur[strCur.length - 1] === "]")) {
      try {
        if (start === "[") {
          if (strCur == "[]") {
            if (param) return { type: "mtv", num: this.tkn.mtv, data: "item", parameters: [] };
            else return { type: "arr", num: this.tkn.arr, data: [] };
          }

          let tokens = autoTokenise(strCur.substring(1, strCur.length - 1), ",");
          while (`${tokens[tokens.length - 1]}`.trim() === "") tokens.pop();

          for (let i = 0; i < tokens.length; i++) {
            let cur = ("" + tokens[i]).trim()
            if (cur.startsWith("/@line ")) {
              const first = cur.split("\n", 1)[0]
              cur = cur.replace(first + "\n", "").trim()
            }
            tokens[i] = parseSingle(cur);
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
          const arr = { type: "arr", num: this.tkn.arr, data: tokens };
          arr.isStatic = tokens.every(token => this.isStaticToken(token));
          if (arr.isStatic) arr.static = tokens.map(token => token.data);
          return arr;
        } else if (cur[0] === "{") {
          if (cur == "{}") return { type: "obj", num: this.tkn.obj, data: [] }

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
            if (value === undefined) {
              let nkey = parseSingle(key);
              if (nkey.num === this.tkn.var) {
                value = nkey
                nkey = parseSingle(JSON.stringify(key));
              }
              output.push([nkey, value ?? null])
              continue;
            }
            if (key.startsWith("(") && key.endsWith(")")) {
              key = key.substring(1, key.length - 1).trim();
              key = parseSingle(key);
            } else {
              let temp_key = this.evalToken(key);
              if (temp_key.num === this.tkn.var || temp_key.num === this.tkn.num) key = JSON.stringify(key)
              key = parseSingle(key);
            }
            if (value === undefined) output.push([key, null]);
            else output.push([key, parseSingle(("" + value).trim())]);
          }
          return { type: "obj", num: this.tkn.obj, data: output };
        }
      } catch (e) {
        console.error(e)
        return { type: "unk", num: this.tkn.unk, data: cur }
      }
    }
    else if (cur === "null") return { type: "unk", num: this.tkn.unk, data: null }
    else if (["if", "else", "as", "to", "from"].includes(cur)) return { type: "cmd", num: this.tkn.cmd, data: cur }
    else if (isVarNameFast(cur)) return { type: "var", num: this.tkn.var, data: cur }
    else if (cur === "->") return { type: "inl", num: this.tkn.inl, data: "->" }
    else if (cur.startsWith("(\n") && cur.endsWith(")")) return { type: "blk", num: this.tkn.blk, data: this.generateFullAST({ CODE: cur.substring(2, cur.length - 1).trim(), START: 0, MAIN: false }) }
    else if (cur.startsWith("(") && cur.endsWith(")")) {
      let end = this.findMatchingParentheses(cur, 0);
      if (end === -1) return { type: "unk", num: this.tkn.unk, data: cur, parse_error: "Unmatched parentheses" };
      const body = cur.substring(1, end).trim();
      if (!body) return { type: "unk", num: this.tkn.unk, data: cur, parse_error: "Empty parentheses '()' is invalid syntax" };
      return parseSingle(body);
    }
    else if (cur.endsWith(")") && cur.length > 1) {
      let out = { type: param ? "mtv" : "fnc", num: param ? this.tkn.mtv : this.tkn.fnc, data: cur.substring(0, cur.indexOf("(")), parameters: [] }
      if (cur.endsWith("()")) return out
      let method = autoTokenise(cur.substring(cur.indexOf("(") + 1, cur.length - 1), ",")
      method = method.map(v => {
        const tkns = autoTokenise(v.trim(), " ");
        if (tkns.length === 2) {
          const ast = parseSingle(tkns[1].trim());
          ast.set_type = tkns[0]
          return ast
        }
        return parseSingle(v.trim());
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
    const ln = ast?.line;
    const src = ast?.source;
    const msg = String(error ?? "");
    const t = this.tkn;

    const out = [
      { type: "var", num: t.var, data: "throw", source: src ?? "throw", line: ln },
      { type: "str", num: t.str, data: "error", source: '"error"', line: ln },
      { type: "str", num: t.str, data: msg, source: JSON.stringify(msg), line: ln }
    ];
    return out;
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
      const cur = tokens[i]
      if (!cur) continue;
      if (cur === "->") {
        const data = (tokens[i + 1] || "").trim()
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
        const inlined = this.tryInlineFunction(node.data, node.parameters || [], node.line);
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
        const rawParams = (node?.left?.parameters ?? []);
        let params = rawParams
          .map(p => {
            if (!p || typeof p !== 'object') return '';
            const name = typeof p.data === 'string' ? p.data : (typeof p.source === 'string' ? p.source : '');
            const typePrefix = p.set_type ? `${p.set_type} ` : '';
            return (typePrefix + name).trim();
          })
          .filter(Boolean);

        let paramStr = params.join(',');
        if (node.left?.type === "var") paramStr = node.left.data;
        const right = node.right;
        if (typeof right.data === "string" && !right.data.trim().startsWith("(\n") && node.left) {
          // For `def(...) -> expr` we already have the typed params via `params` above.
          // For other inline forms like `(a, b) -> expr`, fall back to parsing the source.
          if (!(node.left?.type === 'fnc' && node.left?.data === 'def')) {
            paramStr = node.left.source.replace(/^\(|\)$/gi, "").trim();
          }
          right.data = `(\nreturn ${right.source}\n)`;
        }

        const paramNames = []
        const accepts = params.map(v => {
          const parts = v.split(" ")
          const len = parts.length
          paramNames.push(parts[len - 1])
          if (len > 1) return parts[0]
          return 'any'
        })
        
        return {
          type: "fnc", num: this.tkn.fnc,
          data: "function",
          parameters: [
            {
              type: "str", num: this.tkn.str,
              data: paramStr,
              accepts: accepts,
              params: paramNames,
              source: paramStr
            },
            this.generateAST({ CODE: right.data, START: 0 })[0] ?? { type: "unk", num: this.tkn.unk, data: right.data },
            {
              type: "unk", num: this.tkn.unk,
              data: node.source.startsWith("def(") ? false : true
            }
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
          right: funcNode
        });

        this.registerInlinableFunction(funcName, funcNode);

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
          prev = this.generateAST({ CODE: "this." + prev.source, START: 0 })[0] ?? prev;
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

        if (this.precompileByslExpressions && ["opr", "cmp", "log", "bit"].includes(cur?.right?.type) && cur.right.bysl === undefined) {
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
      if (this.precompileByslExpressions && ["opr", "cmp", "log", "bit"].includes(cur?.type) && cur.bysl === undefined) {
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
    // Strip comments early (preserving newlines) so line marker insertion stays correct.
    CODE = this.stripCommentsPreserveNewlines(CODE);
    CODE = (MAIN ? `/@line ${++line}\n` : "") + CODE.replace(this.fullASTRegex, (match) => {
      // Preserve semantics inside literals/comments, but still advance `line` for any real newlines.
      // IMPORTANT: do not inject /@line markers inside quoted strings or block comments.
      const first = match?.[0];
      const isQuoted = first === '"' || first === "'" || first === '`';
      if (isQuoted) {
        const nl = (match.match(/\n/g) || []).length;
        if (nl) line += nl;
        return match;
      }

      if (match === ";") return "\n";
      if (match === "(") return ".call(";
      if (match === "[") return ".[";

      // Newline + dot continuation: join lines but still advance original line count.
      // (No /@line marker inserted because the newline is removed.)
      if (match.startsWith("\n") && /\n\s*\./.test(match)) {
        const nl = (match.match(/\n/g) || []).length;
        if (nl) line += nl;
        return match.replace(/\n\s*\./, ".");
      }

      // For any other match containing newlines, inject /@line markers after each newline.
      if (match.indexOf("\n") !== -1) {
        return match.replace(/\n/g, () => (MAIN ? `\n/@line ${++line}\n` : "\n"));
      }

      return match;
    });
    CODE = autoTokenise(CODE, "\n").map(line => {
      line = line.trim();
      if (line === "endef") return ")";
      if (line.startsWith("def ") && !(line.endsWith("(") || line.endsWith(")"))) return line + " (";
      return line;
    }).join("\n");

    let lines = this.tokeniseLines(CODE).map((line) => this.generateAST({ CODE: line.trim(), MAIN: true }));

    lines = lines.filter(l => l !== null && l.length > 0);

    // Apply /@line markers in a single linear pass (avoid O(n^2) splice/filter on large files)
    {
      const processed = [];
      let pendingLine = null;
      for (let i = 0; i < lines.length; i++) {
        const cur = lines[i];
        if (!cur || cur.length === 0) continue;
        const head = cur[0];
        if (head?.type === "unk" && head?.data === "/@line") {
          pendingLine = cur[1]?.data;
          continue;
        }
        if (pendingLine !== null && pendingLine !== undefined) {
          head.line = pendingLine;
          pendingLine = null;
        }
        processed.push(cur);
      }
      lines = processed;
    }

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
    return this.applyTypes(lines, { inPlace: true });
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

  _stepAstNode(node, vars) {
    const t = this.tkn;
    switch (node.num) {
      case t.fnc:
        if (node.data === "function") { // we found a function def
          const blk = node.parameters[1];
          if (blk?.num !== t.blk) break;
          const params = node.parameters[0];
          if (params?.num !== t.str) break;

          if (node.parameters[2]?.data === true) return

          if (params.data.trim().length > 0) {
            const parts = params.data.split(",")
            let newParams = []
            for (const part of parts) {
              if (!vars.has(part))
                vars.set(part, vars.size)
              newParams.push(vars.get(part))
            }

            node.parameters[0].data = newParams.join(",")
          }

          this._stepAstNode(
            node.parameters[1],
            vars
          )
        } else {
          for (const param of node.parameters)
            this._stepAstNode(param, vars)
        }
        break
      case t.blk:
        for (const line of node.data)
          for (const node of line)
            this._stepAstNode(node, vars);
        break
      case t.var:
        if (vars === null) return;
        if (vars.has(node.data))
          node.id = vars.get(node.data);
        break;
      case t.asi:
        const l = node.left;
        if (l) {
          if (node.data === "@=" || node.data === "=") {
            const lockedVars = [
              'timer', 'timestamp', 'frame_width', 'frame_height', 'frame_height',
              'save_directory', 'current_colour', 'performance', 'fps_limit',
              'infinity', 'timestamp', 'direction', 'this', 'self', 'file_dragging',
              'mouse_x', 'mouse_y', 'x_position', 'y_position', 'frame',
              'window_width', 'window_height', 'stretch_x', 'stretch_y', 'window_timer',
              'local_timer', 'bg_redrawn', 'window_id_index', 'loaded_file', 'scope'
            ]
            if (!vars.has(l.data) && l.num === t.var &&
              !lockedVars.includes(l.data.toLowerCase()))
              vars.set(l.data, vars.size);
            if (l.num === t.rmt && l.objPath[0].data === "this" &&
              l.objPath.length === 1 && !vars.has(l.final.data) &&
              !lockedVars.includes(l.final.data.toLowerCase()))
              vars.set(l.final.data, vars.size);
          }

          this._stepAstNode(l, vars)
        }
        if (node.right) this._stepAstNode(node.right, vars)
        break;
      case t.bit:
      case t.opr:
      case t.cmp:
        if (node.left) this._stepAstNode(node.left, vars)
        if (node.right) this._stepAstNode(node.right, vars)
        break;
      case t.qst:
        if (node.left) this._stepAstNode(node.left, vars)
        if (node.right) this._stepAstNode(node.right, vars)
        if (node.right2) this._stepAstNode(node.right2, vars)
        break
      case t.arr:
      case t.mtd: {
        for (const val of node.data)
          this._stepAstNode(val, vars);
        break;
      };
      case t.mtv: {
        if (!node.parameters) break;
        for (const val of node.parameters)
          this._stepAstNode(val, vars);
        break;
      };
      case t.obj:
        for (const pair of node.data)
          for (const part of pair)
            this._stepAstNode(part, vars);
        break;
      case t.rmt:
        for (const item of node.objPath)
          this._stepAstNode(item, vars);
        this._stepAstNode(node.final, vars);
        break;
    }
    return vars;
  }

  _applyVariableIds(ast) {
    const vars = new Map();
    for (const line of ast) {
      for (const node of line) {
        this._stepAstNode(node, vars);
      }
    }
    return ast
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

  // Check if a case has a return statement before the next case/default
  checkCaseHasReturn(switchData, caseLine) {
    const caseIndex = switchData.indexOf(caseLine);
    if (caseIndex === -1) return false;

    // Look for return statement between this case and the next case/default
    for (let i = caseIndex + 1; i < switchData.length; i++) {
      const line = switchData[i];
      if (!Array.isArray(line) || line.length === 0) continue;

      // Stop if we hit another case or default
      if (line[0]?.type === 'cmd' && (line[0].data === 'case' || line[0].data === 'default')) {
        break;
      }

      // Found a return statement
      if (line[0]?.type === 'cmd' && line[0].data === 'return') {
        return true;
      }
    }

    return false;
  }

  refineTypes(AST) {
    // Process function inlining and capture type errors that would be lost
    this.pendingTypeErrors = [];

    if (!Array.isArray(AST)) return;

    // Initialize functionReturnTypes if not already done
    if (!this.functionReturnTypes) {
      this.functionReturnTypes = {};
    }

    // Process lambda functions first so they're available for type checking.
    // Must be in-place because some callers ignore the return value.
    this.applyTypes(AST, { inPlace: true });

    // Check function calls before inlining to catch argument type mismatches
    for (const line of AST) {
      if (!Array.isArray(line)) continue;
      this.checkFunctionCallTypes(line);
    }
  }

  checkFunctionCallTypes(line) {
    const isCompatible = (expected, actual) => {
      if (!expected || !actual) return true;
      if (expected === actual) return true;
      if (expected === 'any' || actual === 'any') return true;
      if (expected === 'array' && typeof actual === 'string' && actual.endsWith('[]')) return true;
      return false;
    };

    const traverseNode = (node) => {
      if (!node || typeof node !== 'object') return;

      if (Array.isArray(node)) {
        node.forEach(item => traverseNode(item));
        return;
      }

      // Check function calls
      if (node.type === 'fnc' && typeof node.data === 'string' && node.data !== 'function') {
        const sig = this.functionReturnTypes[node.data];
        if (sig && Array.isArray(node.parameters)) {
          const params = node.parameters;
          for (let i = 0; i < Math.min(params.length, sig.accepts.length); i++) {
            const expected = sig.accepts[i] || 'any';
            const actual = this.inferBasicType(params[i]);
            if (!isCompatible(expected, actual)) {
              this.pendingTypeErrors.push({
                line: node.line || 0,
                message: `Type mismatch: argument ${i + 1} of '${node.data}' expected ${expected}, got ${actual}`
              });
            }
          }
        }
      }

      // Recursively check child nodes
      if (node.left) traverseNode(node.left);
      if (node.right) traverseNode(node.right);
      if (node.right2) traverseNode(node.right2);
      if (Array.isArray(node.parameters)) traverseNode(node.parameters);
      if (Array.isArray(node.data)) traverseNode(node.data);
    };

    traverseNode(line);
  }

  inferBasicType(token) {
    if (!token) return 'any';
    if (token.inferredType) return token.inferredType;
    if (token.returns) return token.returns;
    if (token.type === 'var') {
      const name = typeof token.data === 'string' && token.data.startsWith('this.') ? token.data.slice(5) : token.data;
      if (this.latestVariableTypeMap && this.latestVariableTypeMap[name]) return this.latestVariableTypeMap[name];
    }
    if (token.type === 'num') return 'number';
    if (token.type === 'str') return 'string';
    if (token.type === "arr") return 'array';
    if (token.type === 'unk' && token.data === null) return 'null';
    if (token.type === 'raw') return typeof token.data === 'boolean' ? 'boolean' : 'any';
    return 'any';
  }

  applyTypes(AST, options) {
    if (!Array.isArray(AST)) return AST;

    const inPlace = options?.inPlace === true;

    const variableTypeMap = Object.create(null);
    const functionReturnTypes = { ...this.functionReturnTypes };
    const variablePropertyTypes = Object.create(null);

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

          if (token.type === 'asi' && token.right?.type === 'fnc' && token.left?.data && token.set_type !== 'function') {
            this._processFunctionDefinition(token, functionReturnTypes);
          }
          
          if (token.type === 'asi' && token.right?.type === 'fnc' && Array.isArray(token.right.parameters)) {
            const right = token.right
            if (right.data === "function") {
              // handle assigned function
              const paramNode = right.parameters[0];
              const originalNames = paramNode.paramNames;
              let paramNames = [];
              if (originalNames) {
                paramNames = originalNames;
              } else {
                const accepts = paramNode.data.split(",").map(v => {
                  const parts = v.split(" ")
                  const len = parts.length
                  paramNames.push(parts[len - 1])
                  if (len > 1) return parts[0]
                  return 'any'
                })
                paramNode.accepts = accepts;
                paramNode.paramNames = paramNames;
              }
              for (let i = 0; i < paramNames.length; i++) {
                const param = paramNames[i];
                variableTypeMap[param] = paramNode.accepts[i];
              }
            }
            for (const param of token.right.parameters) {
              if (param?.type === 'blk' && Array.isArray(param.data)) {
                processASTNodes(param.data);
              }
            }
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
        if (!inPlace) return node.map(item => applyTypesToNode(item, scope));
        for (let i = 0; i < node.length; i++) node[i] = applyTypesToNode(node[i], scope);
        return node;
      }

      const typedNode = inPlace ? node : { ...node };

      // Blocks are scope-sensitive; handle early and don't double-walk.
      if (typedNode.type === 'blk' && Array.isArray(typedNode.data)) {
        const blockScope = inPlace ? Object.create(scope) : { ...scope };

        if (!inPlace) {
          typedNode.data = typedNode.data.map(line => {
            if (Array.isArray(line)) {
              const typedLine = line.map(token => applyTypesToNode(token, blockScope));
              for (const token of typedLine) {
                if (token?.type === 'asi' && token.left?.type === 'var') {
                  const varName = normalizeVarName(token.left.data);
                  const varType = token.right?.inferredType || token.right?.returnType || token.right?.returns || this._inferTokenType(token.right, blockScope, variableTypeMap);
                  if (varType !== 'any') {
                    blockScope[varName] = varType;
                  }
                }
              }
              return typedLine;
            }
            return applyTypesToNode(line, blockScope);
          });
        } else {
          for (let i = 0; i < typedNode.data.length; i++) {
            const line = typedNode.data[i];
            if (Array.isArray(line)) {
              for (let j = 0; j < line.length; j++) {
                line[j] = applyTypesToNode(line[j], blockScope);
              }
              for (let j = 0; j < line.length; j++) {
                const token = line[j];
                if (token?.type === 'asi' && token.left?.type === 'var') {
                  const varName = normalizeVarName(token.left.data);
                  const varType = token.right?.inferredType || token.right?.returnType || token.right?.returns || this._inferTokenType(token.right, blockScope, variableTypeMap);
                  if (varType !== 'any') blockScope[varName] = varType;
                }
              }
              typedNode.data[i] = line;
            } else {
              typedNode.data[i] = applyTypesToNode(line, blockScope);
            }
          }
        }

        return typedNode;
      }

      // Recurse once into children so inference can read inferredType directly.
      if (typedNode.left) typedNode.left = applyTypesToNode(typedNode.left, scope);
      if (typedNode.right) typedNode.right = applyTypesToNode(typedNode.right, scope);
      if (typedNode.right2) typedNode.right2 = applyTypesToNode(typedNode.right2, scope);
      if (Array.isArray(typedNode.parameters)) {
        if (!inPlace) typedNode.parameters = typedNode.parameters.map(param => applyTypesToNode(param, scope));
        else for (let i = 0; i < typedNode.parameters.length; i++) typedNode.parameters[i] = applyTypesToNode(typedNode.parameters[i], scope);
      }
      if (Array.isArray(typedNode.data)) {
        if (!inPlace) typedNode.data = typedNode.data.map(item => applyTypesToNode(item, scope));
        else for (let i = 0; i < typedNode.data.length; i++) typedNode.data[i] = applyTypesToNode(typedNode.data[i], scope);
      }

      switch (typedNode.type) {
        case 'var': {
          const vName = normalizeVarName(typedNode.data);
          const scope_type = scope[vName];
          if (scope_type) typedNode.local = true;
          const varType = scope_type || variableTypeMap[vName];
          if (varType) {
            typedNode.inferredType = varType;
            typedNode.quickReturn = varType !== "object" && varType !== "any" && varType !== "null";
            break;
          }
          typedNode.inferredType = this.builtinVarTypes[vName] || 'any';
          break;
        }

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
              typedNode.returnType = my_ret.returns;
              typedNode.paramTypes = my_ret.accepts;
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
          break;
        }

        case 'mtd':
          if (Array.isArray(typedNode.data) && typedNode.data.length >= 2) {
            const base = typedNode.data[0];
            const baseType = base?.inferredType || base?.returnType || base?.returns || this._inferMethodBaseType(typedNode, scope, variableTypeMap);
            const methodName = this._getMethodName(typedNode.data);
            typedNode.baseType = baseType;
            typedNode.methodName = methodName;
            typedNode.inferredType = this._getMethodReturnType(baseType, methodName);
          }
          break;

        case 'arr':
          if (Array.isArray(typedNode.data)) {
            // Infer element type from already-typed elements to avoid deep _inferTokenType walks
            let elementType = null;
            for (const el of typedNode.data) {
              if (!el) continue;
              const t = el.inferredType || el.returnType || el.returns || this.inferBasicType(el);
              if (!t || t === 'any') continue;
              if (elementType === null) elementType = t;
              else if (elementType !== t) { elementType = 'any'; break; }
            }
            if (elementType == null) elementType = 'any';
            typedNode.elementType = elementType;
            typedNode.inferredType = elementType !== 'any' ? `${elementType}[]` : 'array';
          }
          break;

        case 'obj':
          typedNode.inferredType = 'object';
          if (Array.isArray(typedNode.data)) {
            const propTypes = {};
            for (const pair of typedNode.data) {
              if (!Array.isArray(pair) || pair.length < 2) continue;
              const keyToken = pair[0];
              const valueToken = pair[1];
              if (keyToken?.type === 'str') {
                propTypes[keyToken.data] = valueToken?.inferredType || valueToken?.returnType || valueToken?.returns || this._inferTokenType(valueToken, scope, variableTypeMap);
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
          typedNode.inferredType = typedNode.data?.inferredType;
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
            const leftType = typedNode.left.inferredType || typedNode.left.returnType || typedNode.left.returns || this._inferTokenType(typedNode.left, scope, variableTypeMap);
            const rightType = typedNode.right.inferredType || typedNode.right.returnType || typedNode.right.returns || this._inferTokenType(typedNode.right, scope, variableTypeMap);
            typedNode.inferredType = this._inferOperatorResultType(typedNode.data, leftType, rightType);
            if (typedNode.inferredType === 'number') typedNode.useNumbers = true;
          }
          break;
      }

      return typedNode;
    };

    this.variablePropertyTypes = variablePropertyTypes;
    this.latestVariableTypeMap = variableTypeMap;

    let result;
    if (!inPlace) {
      result = AST.map(line => applyTypesToNode(line));
    } else {
      for (let i = 0; i < AST.length; i++) AST[i] = applyTypesToNode(AST[i]);
      result = AST;
    }

    // Mark as typed so downstream consumers can skip redundant work.
    // Non-enumerable so JSON/stringification stays clean.
    try {
      if (result && !result.__oslTypesApplied) {
        Object.defineProperty(result, '__oslTypesApplied', {
          value: true,
          enumerable: false,
          configurable: true
        });
      }
    } catch (_) {
      // ignore
    }

    return result;
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
          } else {
            if (asiToken.source) {
              const sourceMatch = asiToken.source.match(/\(([^)]+)\)/);
              if (sourceMatch) {
                const paramString = sourceMatch[1].trim();
                const params = paramString.split(',').map(p => p.trim());
                
                for (const param of params) {
                  const parts = param.trim().split(/\s+/);
                  if (parts.length >= 2) {
                    accepts.push(parts[0]);
                    continue;
                  }
                  accepts.push('any');
                }
              } else {
                accepts.push('any');
              }
            } else {
              accepts.push('any');
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
      const paramString = funcNode.parameters[0]?.data;
      if (paramString && typeof paramString === 'string') {
        const paramPairs = paramString.split(',').map(p => p.trim());
        for (const pair of paramPairs) {
          const parts = pair.split(/\s+/);
          if (parts.length >= 2) {
            accepts.push(parts[0]); // Type is first part
          } else {
            accepts.push('any');
          }
        }
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
        }
        return 'any';
      case 'mtd':
        if (Array.isArray(token.data) && token.data.length >= 2) {
          const baseType = this._inferMethodBaseType(token.data[0], scope, variableTypeMap);
          const methodName = this._getMethodName(token.data);
          return this._getMethodReturnType(baseType, methodName);
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

  _getMethodReturnType(baseType, methodName) {
    // Allow user-defined method overrides like `string.toStr = (...) -> (...)`.
    // If present, prefer the recorded signature over the built-in mapping.
    try {
      if (this.functionReturnTypes && typeof baseType === 'string' && methodName) {
        const key = `${baseType}.${methodName}`;
        const sig = this.functionReturnTypes[key];
        if (sig && typeof sig.returns === 'string' && sig.returns) return sig.returns;
      }
    } catch (_) {
      // ignore
    }

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
        return 'number';
      case 'toStr':
        return 'string';
      case 'not':
      case 'toBool':
        return 'boolean';
    }

    const type = typeof baseType;

    // Handle array element access
    if (methodName === 'item') {
      // If baseType is typed array string like number[]
      if (type === 'string' && baseType.endsWith('[]')) {
        return baseType.slice(0, -2);
      }
      // If baseType came from an AST node with elementType
      if (baseType && type === 'object' && baseType.elementType) {
        return baseType.elementType || 'any';
      }
    }

    // Handle typed array base type
    if (type === 'string' && baseType.endsWith('[]')) {
      baseType = 'array';
    }
    if (type === 'object' && baseType?.kind === 'array') {
      baseType = 'array';
    }

    // Handle object property access when we know property types
    if (baseType && type === 'object' && baseType.propertyTypes && methodName) {
      const t = baseType.propertyTypes[methodName];
      if (t) return t;
    }

    if (typeMap[baseType] && typeMap[baseType][methodName]) {
      return typeMap[baseType][methodName];
    }

    return 'any';
  }

  _inferOperatorResultType(operator, leftType, rightType) {
    switch (operator) {
      case '+': {
        if (leftType === 'array' || rightType === 'array') return 'array';
        if (leftType === 'string' || rightType === 'string') return 'string';
        if (leftType === 'number' && rightType === 'number') return 'number';
        return 'any';
      }
      case '-': {
        if (leftType === 'number' && rightType === 'number') return 'number';
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
        if (leftType === 'string' || rightType === 'string') return 'string';
        if (leftType === 'array' && rightType === 'array') return 'array';
        return 'any';
      }
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

    // Apply types to the AST. For very large ASTs this is performance-sensitive.
    // If the AST already came from applyTypes/generateFullAST, skip the second pass.
    const typedAST = (parsedAST && parsedAST.__oslTypesApplied)
      ? parsedAST
      : this.applyTypes(parsedAST, { inPlace: true });
    
    // Then get type errors using the typed AST
    const errors = this.getTypeErrorsFromAST(typedAST);
    
    // Return as JSON string for Scratch compatibility, or array for direct use
    return typeof AST === 'string' ? JSON.stringify(errors) : errors;
  }

  getTypeErrorsFromAST(AST) {
    const errors = [];

    // Include any pending errors from function inlining
    if (this.inlineTypeErrors) {
      errors.push(...this.inlineTypeErrors);
      this.inlineTypeErrors = [];
    }

    if (this.pendingTypeErrors) {
      errors.push(...this.pendingTypeErrors);
      this.pendingTypeErrors = [];
    }

    if (!Array.isArray(AST)) return errors;

    const controlFlowCommands = new Set(['for', 'while', 'until', 'each', 'loop', 'if', 'switch']);

    // Shared scope across top-level lines to track variable types between lines
    let globalScope = Object.create(null);

    const typesCompatible = (expected, actual) => {
      if (!expected || !actual) return true;
      if (expected === actual) return true;
      if (expected === 'any' || actual === 'any') return true;
      if (expected === 'array' && typeof actual === 'string' && actual.endsWith('[]')) return true;
      return false;
    };

    const normalizeVarName = (name) => (typeof name === 'string' && name.startsWith('this.')) ? name.slice(5) : name;

    const getTypeFromNode = (node, scope = {}) => {
      if (!node) return 'any';
      if (node.returns) return node.returns;
      if (node.type === 'mtd' && Array.isArray(node.data) && node.data.length >= 2) {
        // Recompute method base/return using latest variable map if available.
        // Important: do this BEFORE trusting `node.inferredType`, because method return
        // types can change due to user-defined overrides recorded during type checking.
        const varMap = this.latestVariableTypeMap || {};
        const baseType = this._inferMethodBaseType({ type: 'mtd', data: node.data }, scope, varMap);
        const methodName = this._getMethodName(node.data);
        return this._getMethodReturnType(baseType, methodName);
      }
      if (node.inferredType && node.inferredType !== 'any') return node.inferredType;
      if (node.type === 'var') {
        const n = normalizeVarName(node.data);
        if (this.latestVariableTypeMap && this.latestVariableTypeMap[n] === 'any') return 'any';
        const lvm = (this.latestVariableTypeMap && this.latestVariableTypeMap[n]) || undefined;
        return scope[n] || lvm || 'any';
      }
      if (node.type === 'fnc' && node.data && node.data !== 'function') {
        const sig = this.functionReturnTypes && this.functionReturnTypes[node.data];
        return sig?.returns || 'any';
      }
      if (['opr','cmp','log','bit','bsl'].includes(node.type)) {
        const lt = getTypeFromNode(node.left, scope);
        const rt = getTypeFromNode(node.right, scope);
        return this._inferOperatorResultType(node.data, lt, rt);
      }
      return 'any';
    };

    const walkIterative = (root, lineNum, fnContext, scopeTypes = Object.create(null)) => {
      // Iterative DFS to avoid call-stack overflows on very deep/large ASTs.
      const stack = [{ kind: 'node', node: root, lineNum, fnContext, scope: scopeTypes }];

      while (stack.length) {
        const frame = stack.pop();
        if (!frame) continue;

        if (frame.kind === 'afterInlineLambda') {
          const { lambdaName, fnc, lambdaCtx } = frame;
          const sig = this.functionReturnTypes[lambdaName] || { accepts: [], returns: 'any' };
          if (typeof lambdaCtx.inferredReturnType === 'string' && lambdaCtx.inferredReturnType) {
            sig.returns = lambdaCtx.inferredReturnType;
          } else if (lambdaCtx.returns && lambdaCtx.returns !== 'any') {
            sig.returns = lambdaCtx.returns;
          }
          if (fnc.parameters && fnc.parameters.length >= 1) {
            const paramString = fnc.parameters[0]?.data;
            if (typeof paramString === 'string') {
              const accepts = [];
              const paramPairs = paramString.split(',').map(p => p.trim()).filter(Boolean);
              for (let i = 0; i < paramPairs.length; i++) {
                const parts = paramPairs[i].split(/\s+/);
                if (parts.length >= 2) accepts.push(parts[0]);
                else accepts.push('any');
              }
              sig.accepts = accepts;
            }
          }
          this.functionReturnTypes[lambdaName] = sig;
          continue;
        }

        if (frame.kind === 'blk') {
          const blk = frame.node;
          if (!blk || !Array.isArray(blk.data)) continue;

          if (!frame._inited) {
            frame._inited = true;
            frame._scope = Object.create(frame.parentScope);

            if (frame.fnContext && frame.fnContext.needsReturnCheck) {
              const hasReturn = this.hasReturnStatement(blk.data);
              frame.fnContext.needsReturnCheck = false;
              if (!hasReturn) {
                const fnName = frame.fnContext.functionName || 'function';
                errors.push({
                  line: frame.lineNum || 0,
                  message: `Function '${fnName}' missing return statement`
                });
              }
            }
          }

          const k = frame.idx;
          if (k >= blk.data.length) continue;

          // Process next line in-order, updating the scope before walking it.
          const innerLine = blk.data[k];

          if (Array.isArray(innerLine)) {
            for (let x = 0; x < innerLine.length; x++) {
              const tok = innerLine[x];
              if (tok?.type === 'asi' && tok.set_type && tok.left?.type === 'var') {
                const vName = normalizeVarName(tok.left.data);
                const newType = tok.set_type === 'str' ? 'string' : tok.set_type;
                if (frame._scope[vName] && frame._scope[vName] !== newType) {
                  if (frame.fnContext) {
                    frame.fnContext.shadowedTypes = frame.fnContext.shadowedTypes || {};
                    frame.fnContext.shadowedTypes[vName] = newType;
                  }
                }
                frame._scope[vName] = newType;
              } else if (tok?.type === 'asi' && !tok.set_type && tok.left?.type === 'var') {
                const vName = normalizeVarName(tok.left.data);
                const rType = getTypeFromNode(tok.right, frame._scope);
                if (rType && rType !== 'any' && !frame._scope[vName]) frame._scope[vName] = rType;
              }
            }
          }

          // Re-push block frame to continue with next line, then walk this line.
          stack.push({ ...frame, idx: k + 1 });
          stack.push({ kind: 'node', node: innerLine, lineNum: frame.lineNum, fnContext: frame.fnContext, scope: frame._scope });
          continue;
        }

        if (frame.kind === 'array') {
          const arr = frame.node;
          if (!Array.isArray(arr) || arr.length === 0) continue;

          if (!frame._inited) {
            frame._inited = true;

            // Handle return statements
            if (arr.length >= 2 && arr[0]?.type === 'cmd' && arr[0].data === 'return') {
              if (!frame.fnContext) {
                errors.push({ line: arr[0].line || frame.lineNum, message: 'Return statement outside of function' });
              } else {
                if (frame.fnContext.isCommand && arr[1] && !frame.fnContext.inControlFlow) {
                  errors.push({ line: arr[0].line || frame.lineNum, message: 'Commands cannot return values' });
                  continue;
                }

                const returnValue = arr[1];
                let actualReturnType = getTypeFromNode(returnValue, frame.scope);

                if (actualReturnType === 'any' && returnValue?.type === 'var' && this.latestVariableTypeMap) {
                  const rvName = normalizeVarName(returnValue.data);
                  if (this.latestVariableTypeMap[rvName]) actualReturnType = this.latestVariableTypeMap[rvName];
                }

                if (frame.fnContext.shadowedTypes && returnValue?.type === 'var') {
                  const rvName = normalizeVarName(returnValue.data);
                  if (frame.fnContext.shadowedTypes[rvName]) actualReturnType = frame.fnContext.shadowedTypes[rvName];
                }

                if (frame.fnContext.validateReturnType && frame.fnContext.returns === 'any' && actualReturnType !== 'any') {
                  frame.fnContext.returns = actualReturnType;
                  frame.fnContext.inferredReturnType = actualReturnType;
                }

                if (frame.fnContext.returns && frame.fnContext.returns !== 'any' && frame.fnContext.returns !== 'void') {
                  const expectedRet = frame.fnContext.returns;
                  const actualRet = actualReturnType;
                  if (actualRet !== 'any' && !typesCompatible(expectedRet, actualRet)) {
                    const fnName = frame.fnContext.functionName || 'function';
                    errors.push({
                      line: arr[0].line || frame.lineNum,
                      message: `Return type mismatch: Type mismatch returning from function ${fnName}: expected ${expectedRet}, got ${actualRet}`
                    });
                  }
                }
              }
            }

            // Handle control flow commands with dedicated scheduling (matches old order)
            if (arr[0]?.type === 'cmd' && controlFlowCommands.has(arr[0].data)) {
              const cmdType = arr[0].data;
              const controlFlowContext = { ...(frame.fnContext || {}), inControlFlow: true };

              const pushNode = (n, ctx, sc) => {
                if (!n) return;
                stack.push({ kind: 'node', node: n, lineNum: frame.lineNum, fnContext: ctx, scope: sc });
              };

              if (cmdType === 'for' && arr.length >= 4) {
                const loopVar = arr[1]?.data;
                const newScope = Object.create(frame.scope);
                if (loopVar && typeof loopVar === 'string') newScope[loopVar] = 'number';

                // Walk other nodes after the block
                const other = [];
                for (let i = 0; i < arr.length; i++) {
                  if (i !== 3 || arr[i]?.type !== 'blk') other.push(arr[i]);
                }
                for (let i = other.length - 1; i >= 0; i--) pushNode(other[i], frame.fnContext, frame.scope);
                if (arr[3]?.type === 'blk') pushNode(arr[3], controlFlowContext, newScope);
                continue;
              }

              if (cmdType === 'each' && arr.length >= 5) {
                const indexVar = arr[1]?.data;
                const itemVar = arr[2]?.data;
                const arrayExpr = arr[3];
                const newScope = Object.create(frame.scope);

                if (indexVar && typeof indexVar === 'string') newScope[indexVar] = 'number';
                if (itemVar && typeof itemVar === 'string') {
                  const arrayType = getTypeFromNode(arrayExpr);
                  if (typeof arrayType === 'string' && arrayType.endsWith('[]')) newScope[itemVar] = arrayType.slice(0, -2);
                  else newScope[itemVar] = 'any';
                }

                const other = [];
                for (let i = 0; i < arr.length; i++) {
                  if (i !== 4 || arr[i]?.type !== 'blk') other.push(arr[i]);
                }
                for (let i = other.length - 1; i >= 0; i--) pushNode(other[i], frame.fnContext, frame.scope);
                if (arr[4]?.type === 'blk') pushNode(arr[4], controlFlowContext, newScope);
                continue;
              }

              // Default control-flow scheduling
              for (let i = arr.length - 1; i >= 0; i--) {
                const n = arr[i];
                if (n?.type === 'blk') pushNode(n, controlFlowContext, frame.scope);
                else pushNode(n, frame.fnContext, frame.scope);
              }
              continue;
            }
          }

          const i = frame.idx;
          if (i >= arr.length) continue;
          stack.push({ ...frame, idx: i + 1 });
          stack.push({ kind: 'node', node: arr[i], lineNum: frame.lineNum, fnContext: frame.fnContext, scope: frame.scope });
          continue;
        }

        // kind === 'node'
        const node = frame.node;
        if (!node) continue;

        if (Array.isArray(node)) {
          stack.push({ kind: 'array', node, idx: 0, lineNum: frame.lineNum, fnContext: frame.fnContext, scope: frame.scope, _inited: false });
          continue;
        }

        if (typeof node !== 'object') continue;

        const ln = node.line || frame.lineNum;

        // Inline lambda assignment: validate body with its own context, then update signature after.
        if (node.type === 'asi' && node.right?.type === 'fnc' && node.right.data === 'function') {
          const fnc = node.right;

          const getAssignableName = (left) => {
            if (!left) return 'function';
            if (left.type === 'var' && typeof left.data === 'string') return left.data;
            if (left.type === 'rmt' && left.final?.type === 'var' && typeof left.final.data === 'string') {
              const prefix = Array.isArray(left.objPath) ? left.objPath.filter(s => s?.type === 'var').map(s => s.data) : [];
              if (prefix.length) return `${prefix.join('.')}.${left.final.data}`;
              return `this.${left.final.data}`;
            }
            if (left.type === 'mtd' && Array.isArray(left.data) && left.data.length && left.data.every(seg => seg?.type === 'var')) {
              return left.data.map(seg => seg.data).join('.');
            }
            return 'function';
          };

          const getSelfBaseTypeFromAssignment = (left) => {
            // Custom type methods are defined like: string.toStr = def() -> (...)
            // In that case, docs specify `self` is the receiver value (a string here).
            const builtinTypes = new Set(['string', 'number', 'array', 'object', 'boolean']);
            if (!left) return null;
            if (left.type === 'rmt' && Array.isArray(left.objPath) && left.objPath[0]?.type === 'var') {
              const root = left.objPath[0].data;
              if (builtinTypes.has(root)) return root;
            }
            if (left.type === 'mtd' && Array.isArray(left.data) && left.data[0]?.type === 'var') {
              const root = left.data[0].data;
              if (builtinTypes.has(root)) return root;
            }
            return null;
          };

          const lambdaName = normalizeVarName(getAssignableName(node.left));
          const lambdaCtx = {
            returns: fnc.returns || 'any',
            functionName: lambdaName,
            needsReturnCheck: true,
            isCommand: false,
            validateReturnType: true
          };
          const lambdaScope = Object.create(null);

          const selfBaseType = getSelfBaseTypeFromAssignment(node.left);
          if (selfBaseType) lambdaScope.self = selfBaseType;

          if (fnc.parameters && fnc.parameters.length >= 1) {
            const paramString = fnc.parameters[0]?.data;
            if (typeof paramString === 'string') {
              const paramPairs = paramString.split(',').map(p => p.trim()).filter(Boolean);
              for (let i = 0; i < paramPairs.length; i++) {
                const parts = paramPairs[i].split(/\s+/);
                if (parts.length >= 2) lambdaScope[parts[1]] = parts[0];
              }
            }
          }
          const body = fnc.parameters?.[1];
          if (body?.type === 'blk') {
            body._checkedInlineFn = true;
            stack.push({ kind: 'afterInlineLambda', lambdaName, fnc, lambdaCtx });
            stack.push({ kind: 'node', node: body, lineNum: ln, fnContext: lambdaCtx, scope: lambdaScope });
          } else {
            // Still ensure signature exists
            this.functionReturnTypes[lambdaName] = this.functionReturnTypes[lambdaName] || { accepts: [], returns: 'any' };
          }
        }

        // Function calls: arg type checking
        if (node.type === 'fnc' && node.data !== 'function') {
          const params = node.parameters || [];
          let expected = node.paramTypes;
          if (!expected && this.functionReturnTypes && this.functionReturnTypes[node.data]) {
            expected = this.functionReturnTypes[node.data].accepts;
          }
          if (expected && Array.isArray(expected)) {
            for (let i = 0; i < Math.min(params.length, expected.length); i++) {
              const expectedType = expected[i] || 'any';
              const actualType = getTypeFromNode(params[i], frame.scope);
              if (!typesCompatible(expectedType, actualType)) {
                errors.push({
                  line: ln,
                  message: `Type mismatch: argument ${i + 1} of '${node.data}' expected ${expectedType}, got ${actualType}`
                });
              }
            }
          }
        }

        // Assignment checks + scope update
        if (node.type === 'asi') {
          const rightType = getTypeFromNode(node.right, frame.scope);

          if (node.set_type) {
            const expected = node.set_type === 'str' ? 'string' : node.set_type;
            if (rightType !== 'any' && !typesCompatible(expected, rightType)) {
              const varName = normalizeVarName(node.left?.data || 'variable');
              errors.push({
                line: ln,
                message: `Type mismatch assigning to ${varName}: expected ${expected} got ${rightType}`
              });
            }
          } else if (node.left?.type === 'var') {
            const varName = normalizeVarName(node.left.data);
            const existingType = frame.scope[varName];
            if (existingType && existingType !== 'any' && rightType !== 'any' && !typesCompatible(existingType, rightType)) {
              errors.push({
                line: ln,
                message: `Type mismatch reassigning ${varName}: expected ${existingType}, got ${rightType}`
              });
            }
          }

          if ((node.left?.type === 'var') || (node.left?.type === 'rmt' && node.left.final?.type === 'var') || (node.left?.type === 'mtd' && Array.isArray(node.left.data) && node.left.data.every(seg => seg?.type === 'var'))) {
            const leftName = node.left.type === 'var'
              ? node.left.data
              : (node.left.type === 'rmt' ? `this.${node.left.final.data}` : node.left.data.map(seg => seg.data).join('.'));
            const vName = normalizeVarName(leftName);
            if (node.set_type) {
              frame.scope[vName] = node.set_type === 'str' ? 'string' : node.set_type;
            } else if (rightType !== 'any' && !frame.scope[vName]) {
              frame.scope[vName] = rightType;
            }
          }
        }

        // Schedule block contents after children (matches old traversal order)
        if (node.type === 'blk' && Array.isArray(node.data)) {
          stack.push({ kind: 'blk', node, idx: 0, lineNum: ln, fnContext: frame.fnContext, parentScope: frame.scope, _inited: false });
        }

        // Children traversal (reverse push to preserve original order)
        if (Array.isArray(node.parameters) && node.parameters.length) {
          for (let i = node.parameters.length - 1; i >= 0; i--) {
            stack.push({ kind: 'node', node: node.parameters[i], lineNum: ln, fnContext: frame.fnContext, scope: frame.scope });
          }
        }
        if (node.right2) stack.push({ kind: 'node', node: node.right2, lineNum: ln, fnContext: frame.fnContext, scope: frame.scope });
        if (node.right) {
          const skip = node.right?.type === 'fnc' && node.right.data === 'function' && node.right?.parameters?.[1]?._checkedInlineFn;
          if (!skip) stack.push({ kind: 'node', node: node.right, lineNum: ln, fnContext: frame.fnContext, scope: frame.scope });
        }
        if (node.left) stack.push({ kind: 'node', node: node.left, lineNum: ln, fnContext: frame.fnContext, scope: frame.scope });
      }
    };

    // Process each line of the AST
    for (const line of AST) {
      const lineNum = line?.[0]?.line;
      if (!Array.isArray(line)) continue;
      if (line[0]?.type === 'asi' && line[0].right?.type === 'fnc' && line[0].right.data === 'function') {
        const fnc = line[0].right;
        const returnType = fnc.returns || 'any';
        
        const ctx = {
          returns: returnType,
          functionName: line[0].left?.data || 'function',
          needsReturnCheck: true,
          isCommand: fnc.isCommand || false,
          shadowedTypes: {}
        };

        const initialScope = {};
        
        // Extract parameter types from typed function
        if (fnc.parameters && fnc.parameters.length >= 1) {
          const paramString = fnc.parameters[0]?.data;
          if (paramString && typeof paramString === 'string') {
            const paramPairs = paramString.split(',').map(p => p.trim());
            paramPairs.forEach(pair => {
              const parts = pair.split(/\s+/);
              if (parts.length >= 2) {
                const type = parts[0];
                const name = parts[1];
                initialScope[name] = type;
              }
            });
          }
        }

        const functionBody = fnc.parameters[1];
        if (functionBody?.type === 'blk') {
          // Pre-scan for shadowed variable types inside nested blocks (iterative to avoid recursion)
          const stack = [functionBody];
          while (stack.length) {
            const blk = stack.pop();
            if (!blk || !Array.isArray(blk.data)) continue;
            for (let bi = 0; bi < blk.data.length; bi++) {
              const inner = blk.data[bi];
              if (!Array.isArray(inner)) continue;

              for (let ti = 0; ti < inner.length; ti++) {
                const tok = inner[ti];
                if (tok?.type === 'asi' && tok.set_type && tok.left?.type === 'var') {
                  const vName = normalizeVarName(tok.left.data);
                  const outerType = initialScope[vName];
                  const newType = tok.set_type === 'str' ? 'string' : tok.set_type;
                  if (outerType && outerType !== newType) ctx.shadowedTypes[vName] = newType;
                }
              }

              for (let pi = 0; pi < inner.length; pi++) {
                const part = inner[pi];
                if (part?.type === 'blk') stack.push(part);
              }
            }
          }

          walkIterative(functionBody, lineNum, ctx, initialScope);
        }
        
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
              initialScope[`ARG${index + 1}`] = type;
            }
          });
        }

        const commandBody = line[3];
        if (commandBody?.type === 'blk') {
          walkIterative(commandBody, lineNum, ctx, initialScope);
        }
        
        continue;
      }

      // Handle command calls
      if (Array.isArray(line) && line[0]?.type === 'cmd') {
        const cmdName = line[0].data;
        if (line[0].paramTypes) {
          const expectedTypes = line[0].paramTypes;
          const params = line.slice(1);

          for (let i = 0; i < Math.min(params.length, expectedTypes.length); i++) {
            const expected = expectedTypes[i] || 'any';
            const actual = getTypeFromNode(params[i]);
            if (!typesCompatible(expected, actual)) {
              errors.push({
                line: lineNum || 0,
                message: `Type mismatch: argument ${i + 1} of '${cmdName}' expected ${expected}, got ${actual}`
              });
            }
          }
        }
      }

      // Walk the entire line with a shared global scope across lines
      walkIterative(line, lineNum, null, globalScope);
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

    const result = utils.generateFullAST({
      CODE: `obj = {"> " ++ func(): "lmao", key: "value", "key": "value"}`, f: fs.readFileSync("/Users/sophie/Origin-OS/OSL Programs/apps/System/originWM.osl", "utf-8")
    });

    fs.writeFileSync("lol.json", formatByslJson(result));
  }
}