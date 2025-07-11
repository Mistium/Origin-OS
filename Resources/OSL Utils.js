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
        cur = "$";
      }
      depth++;
      continue;
    }
    if (str[i] === '}') {
      depth--
      if (depth === 0) {
        arr.push(cur + '}');
        cur = "";
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
    this.fullASTRegex = /("(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`|'(?:[^'\\]|\\.)*')|\/\*[^*]+|[,{\[]\s*\n\s*[}\]]?|\n\s*[}\.\]]|;|(?<=[)"\]}a-zA-Z\d])\[|(?<=[)\]])\(|(\n|^)\s*\/\/[^\n]+|\n/gm;
    this.lineTokeniserRegex = /("(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`|'(?:[^'\\]|\\.)*')|(?<=[\]"}\w\)])(?:\+\+|\?\?|->|==|!=|<=|>=|[><?+*^%/\-|&])(?=\S)/g;
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
      let m_comm = 0;
      let b_depth = 0;
      let out = [];
      let split = [];
      let escaped = false;
      const len = code.length;

      while (letter < len) {
        depth = code[letter];
        if (quotes === 0 && squotes === 0 && !escaped) {
          if (depth === "[" || depth === "{" || depth === "(") b_depth++
          if (depth === "]" || depth === "}" || depth === ")") b_depth--
          b_depth = b_depth < 0 ? 0 : b_depth;
        }
        if (depth === '"' && !escaped && squotes === 0) quotes = 1 - quotes;
        else if (depth === "'" && !escaped && quotes === 0) squotes = 1 - squotes;
        else if (depth === "/" && code[letter + 1] === "*" && quotes === 0 && squotes === 0) m_comm = 1;
        else if (depth === "*" && code[letter + 1] === "/" && quotes === 0 && squotes === 0 && m_comm === 1) m_comm = 0;
        else if (depth === '\\' && !escaped) escaped = !escaped;
        else escaped = false;
        if (m_comm === 0) out.push(depth);
        letter++;

        if (quotes === 0 &&
          squotes === 0 &&
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

        if (brackets === 0 && ["\n", ";"].includes(CODE[letter]) && b_depth === 0) {
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
    if (cur === "/@line") return { type: "unk", data: "/@line" }
    if ((start === "{" && cur[cur.length - 1] === "}") || (start === "[" && cur[cur.length - 1] === "]")) {
      try {
        if (start === "[") {
          if (cur == "[]") return { type: "arr", data: [] }

          let tokens = autoTokenise(cur.substring(1, cur.length - 1), ",");
          for (let i = 0; i < tokens.length; i++) {
            tokens[i] = this.generateAST({ CODE: ("" + tokens[i]).trim(), START: 0 })[0];
          }

          if (param) return { type: "mtv", data: "item", parameters: tokens };
          return { type: "arr", data: tokens }
        } else if (cur[0] === "{") {
          if (cur == "{}") return { type: "obj", data: {} }

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
          return { type: "obj", data: output };
        }
      } catch (e) {
        console.error(e)
        return { type: "unk", data: cur }
      }
    }
    else if (start + cur[cur.length - 1] === '""') return { type: "str", data: destr(cur) }
    else if (start + cur[cur.length - 1] === "''") return { type: "str", data: destr(cur, "'") }
    else if (start + cur[cur.length - 1] === "``") {
      return {
        type: "tsr", data: parseTemplate(destr(cur, "`")).filter(v => v !== "").map(v => {
          if (v.startsWith("${")) return this.generateAST({ CODE: v.slice(2, -1), START: 0 })[0]
          else return { type: "str", data: v }
        })
      }
    }
    else if (!isNaN(+cur)) return { type: "num", data: +cur }
    else if (cur === "true" || cur === "false") return { type: "var", data: cur === "true" }
    else if (this.operators.indexOf(cur) !== -1) return { type: "opr", data: cur }
    else if (cur === "--") return { type: "unk", data: "--" }
    else if (this.comparisons.indexOf(cur) !== -1) return { type: "cmp", data: cur }
    else if (cur === "?") return { type: "qst", data: cur }
    else if (this.logic.indexOf(cur) !== -1) return { type: "log", data: cur }
    else if (this.bitwise.indexOf(cur) !== -1) return { type: "bit", data: cur }
    else if (cur.endsWith("=")) return { type: "asi", data: cur }
    else if (["!", "-", "+"].includes(start) && cur.length > 1) return { type: "ury", data: start, right: this.evalToken(cur.slice(1)) };
    else if (cur.startsWith("...")) return { type: "spr", data: this.evalToken(cur.substring(3)) }
    else if (autoTokenise(cur, ".").length > 1) {
      let method = autoTokenise(cur, ".")
      method = method.map((input, index) => this.evalToken(input, index > 0))
      return { type: "mtd", data: method };
    }
    else if (cur === "null") return { type: "unk", data: null }
    else if (cur.match(/^(!+)?[a-zA-Z_][a-zA-Z0-9_]*$/)) return { type: "var", data: cur }
    else if (cur === "->") return { type: "inl", data: "->" }
    else if (cur.startsWith("(\n") && cur.endsWith(")")) return { type: "blk", data: this.generateFullAST({ CODE: cur.substring(2, cur.length - 1).trim(), START: 0, MAIN: false }) }
    else if (cur.startsWith("(") && cur.endsWith(")")) {
      let end = this.findMatchingParentheses(cur, 0);
      if (end === -1) return { type: "unk", data: cur };
      const body = cur.substring(1, end).trim();
      return this.generateAST({ CODE: body, START: 0 })[0]
    }
    else if (cur.endsWith(")") && cur.length > 1) {
      let out = { type: param ? "mtv" : "fnc", data: cur.substring(0, cur.indexOf("(")), parameters: [] }
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
      out.parameters = method
      return out
    }
    else if (cur === ":") return { type: "mod_indicator", data: ":" };
    else return { type: "unk", data: cur }
  }

  isStaticToken(token) {
    return ["str", "num", "unk"].includes(token.type);
  }

  generateError(source, error) {
    const ast = this.generateAST({ CODE: `throw "error" '${error}'` });
    ast[0].source = source;
    return ast;
  }

  generateAST({ CODE, START, MAIN }) {
    CODE = CODE + "";
    const start = CODE.split("\n", 1)[0]
    // tokenise and handle lambda and inline funcs
    let ast = []
    let tokens = this.tokeniseLineOSL(CODE)
    for (let i = 0; i < tokens.length; i++) {
      const cur = tokens[i].trim()
      if (cur === "->") {
        const data = tokens[i + 1].trim()
        ast.push({ type: "inl", data: "->" })
        ast.push({ type: "str", data, source: data })
        i += 1
        continue
      }
      ast.push(this.evalToken(cur))
    }

    // modifier node creation
    let modifiers = false;
    for (let token of ast) {
      if (modifiers && token.type === "unk") {
        token.type = "mod"
        const pivot = token.data.indexOf("#") + 1
        token.data = [token.data.substring(0, pivot - 1), this.evalToken(token.data.substring(pivot))]
      }
      if (token.type === "mod_indicator") modifiers = true
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

    // eval static nodes
    const evalASTNode = node => {
      if (!node) return node;
      if (node.type === "inl") {
        let params = (node?.left?.parameters ?? []).map(p => p.data).join(",");
        if (node.left?.type === "var") params = node.left.data;
        const right = node.right;
        if (typeof right.data === "string" && !right.data.trim().startsWith("(\n") && node.left) {
          params = node.left.source.replace(/^\(| +|\)$/gi, "");
          right.data = `(\nreturn ${right.source}\n)`;
        }
        return {
          type: "fnc",
          data: "function",
          parameters: [
            {
              type: "str",
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
        // Recursively evaluate left and right nodes first
        node.left = evalASTNode(node.left);
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
            type: "num",
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
    const first = ast[0] ?? {};
    const second = ast[1] ?? {};
    if (
      first.type === "var" &&
      first.data === "def" &&
      second.type === "fnc"
    ) {
      first.data = second.data;
      ast.splice(1, 0, {
        type: "asi",
        data: "=",
        source: start
      });
      const params = second.parameters.map(p => (p.set_type ? `${p.set_type} ` : "") + (
        p.type === "mtd" ?
        p.data.map(p2 => p2.data).join(".") :
        p.data
      )).join(",")
      ast[2] = {
        type: "fnc",
        data: "function",
        parameters: [
          {
            type: "str",
            data: params,
            source: params
          },
          ast[3]
        ]
      };
      ast.splice(3, 1);
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
          { type: 'mtd', data: leftData }

        ast.unshift(
          first, 
          { type: "asi", data: "=??", source: start }
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
          prev = this.generateAST({ CODE: "this." + prev.data, START: 0 })[0];
          ast.splice(0, 1);
          i -= 1;
        }
        if (ast.length > 1 && i > 1) {
          cur.set_type = ast[i - 2].data;
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
        type: "asi",
        data: ast[1].data,
        left: ast[0],
        source: CODE
      }
      ast.splice(1, 1);
    }

    if (ast[0].type === "var" && MAIN) {
      ast[0].type = "cmd";
      ast[0].source = CODE.split("\n", 1)[0];
    }

    // switch statements
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
            if (v[0]?.data) newCases[String(v[0]?.data ?? "").toLowerCase()] = v[1]
          })
          cases.type = "object"
          cases.all = newCases;
        }
        ast[0].cases = cases
      }
    }

    return ast.filter(token => (
      token.type &&
      token.type.length === 3 &&
      !((String(token.data).startsWith("/*") || String(token.data).endsWith("*/")) && token.type === "unk")
    ))
  }

  generateFullAST({ CODE, MAIN = true }) {
    let line = 0;
    CODE = (MAIN ? `/@line ${++ line}\n` : "") + CODE.replace(this.fullASTRegex, (match) => {
      if (match === "\n") return MAIN ? `\n/@line ${++ line}\n` : "\n";
      if (match === ";") return "\n";
      if (match === "(") return ".call(";
      if (match === "[") return ".[";
      if ([",", "{", "}", "[", "]"].includes(match.trim()[0])) { line ++; return match }
      if (match.trim().startsWith("//")) { line ++; return ""; }
      if (match.startsWith("\n")) { line ++; return match.replace(/\n\s*\./, ".") };
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
      if (type === "cmd" && ["for", "each", "class", "while", "until"].includes(data)) {
        if (data === "each") {
          if (cur[cur.length - 1].type !== "blk") {
            lines[i] = this.generateError(cur[0].source, "Each loops require a block after the variable(s). Example: each i arr ( ... )");
            continue;
          }
          let has_i = cur[4]?.type === "blk"
          if (has_i || cur[3]?.type === "blk") {
            const id = has_i ? cur[1].source : "this.EACH_I_" + randomString(10);
            if (has_i) cur.splice(1, 1);
            const static_var = cur[2].type === "var"
            const dat = static_var ? cur[2].source : "EACH_DAT_" + randomString(10);
            const spl = [
              [{...cur[0], type: "asi", data: "=", left: this.evalToken(id), right: this.evalToken("0")}],
              [{...cur[0], type: "asi", data: "@=", left: this.evalToken(dat), right: cur[2] }]
            ]
            if (static_var) spl.pop();
            lines.splice(i, 0, ...spl);
            cur[3].data.splice(0, 0, 
              [{...cur[0], type: "asi", data: "++", left: this.evalToken(id) }],
              [{...cur[0], type: "asi", data: "=", left: cur[1], right: this.evalToken(`${dat}.[${id}]`) }]
            )
            cur[0].data = "loop"
            cur.splice(1, 1)
            cur[1] = this.evalToken(`${dat}.len`)
          }
        } else {
          if (data === "while" || data === "until") {
            cur[1] = {
              type: "evl",
              data: cur[1],
              source: cur[1].source || "[ast EVL]"
            }
          } else cur[1].type = "str";
        }
        i++
      }
      if (type === "cmd" && data === "def") {
        if (cur.length < 3) {
          lines[i] = this.generateError(cur[0].source, "Function definitions require at least one parameter. Example: def myFunc(a, b) -> a + b");
          continue;
        }
        if (cur[cur.length - 1].type !== "blk") {
          lines[i] = this.generateError(cur[0].source, "Function definitions require a block after the parameters. Example: def myFunc(a, b) -> a + b ( ... )");
          continue;
        }
      }
      if (['loop', 'if', 'while', 'until', 'for'].includes(data)) {
        if (cur.length === 2 || 
           (data === 'for' && cur.length === 3)
        ) {
          const blk = lines.splice(i + 1, 1)[0];
          cur.push({
            type: "blk",
            data: [blk],
            source: '[ast BLK]'
          })
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
        .replace(/\n+/gi, "\n")
        .replace(/\n +/gm, "\n")
        .replace(/\n\/[^\n]+/gm, "")
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

  inlineCompile() {
    return "";
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
    CODE: `
def setup() (
  window.setResizable(false)

  window_colour = #fff
  log window_colour

  platforms = []
  
  player = {
    x: -200,
    y: 150,
    xv: 0,
    yv: 0,
    icn: "c #000 w 5 square 0 0 7 10 w 19 dot 0 0 w 5 line 7 -10 7 -20 line -7 -10 -7 -20 c #fff line 7 3 0 3",
    dead: false,
    score: 0,
  }

  platforms = [
    {
      x: -250,
      y: 80
    },
    {x: 150,y: 0}
  ]

  platform = {
    new: def() -> (
      local me = self.clone()
      me.y = random(window.bottom + 50, window.top - 150)
      void platforms.append(me)
    ),
    icn: "c #000 w 5 square 0 0 30 5 c #fff w 4 square 0 0 30 5 c #000 w 3 square 0 0 30 5 w 7 square 0 0 26 3",
    x: window.width,
    y: 0,
  }

  last = timer
)
jumpheld = false
jump = false
left = false
rigth = false
def setjump() (
  if gamepad.buttons[1]["pressed"] or gamepad.buttons[2]["pressed"] or "space".isKeyDown() (
    if jumpheld (
      jump = false
    ) else (
      jump = true
    )
    jumpheld = true
  ) else (
    jumpheld = false
  )
)
def setleft() (
  if gamepad.axes[1].x ?? 0 < -0.2 or gamepad.buttons[15]["pressed"] or "a".isKeyDown() (
    left = true
  ) else (
    left = false
  )
)

def setright() (
  if gamepad.axes[1].x ?? 0 > 0.2 or gamepad.buttons[16]["pressed"] or "d".isKeyDown() (
    right = true
  ) else (
    right = false
  )
)
object io = {
  haptic: def(option) -> (
    local configs = {
      jump1: {
        duration: 200,
        weakMagnitude: 0.075,
        strongMagnitude: 0.04,
      },
      jump2: {
        duration: 170,
        weakMagnitude: 0.05,
        strongMagnitude: 0.02,
      },
      land: {
        duration: 100,
        weakMagnitude: 0.2,
        strongMagnitude: 0.3,
      },
      dead: {
        duration: 300,
        weakMagnitude: 0.7,
        strongMagnitude: 0.7
      }
    }
    
    if gamepads.len > 0 (
      void gamepad.haptic(configs[option])
    )
  )
}

log setup

setup()
log window_colour
player.dead = true

mainloop:
array gamepads = getGamepads()
if gamepads.len > 0 (
  gamepad @= gamepads[1]
)
setjump()
setleft()
setright()
if player.dead (
  goto 0 window.bottom + 50
  centext "You died, press space to play again" 10 : c#000
  
  if jump (
    player.dead = false
  )
) else (
  if timer > last (
    last = timer + random(1, 2.5)
    void platform.new()
  )

  if jump (
    if player.grounded or player.double (
      if player.grounded (
        io.haptic("jump1")
      ) else (
        io.haptic("jump2")
      )
      player.double = player.grounded
      player.grounded = false
      player.yv = 13
    )
  )
  if left (
    player.xv -= 1
  )
  if right (
    player.xv += 1
  )
)
goto player.x player.y
icon player.icn 2
player.x += player.xv
player.y += player.yv
player.xv *= 0.9
player.yv -= 0.4

if player.dead.not() and player.grounded (
  player.x -= 3 + (player.score / 10)
)

for i platforms.len (
  cur @= platforms[i]
  goto cur.x cur.y
  if player.dead.not() (
    cur.x -= 3 + (player.score / 10)
  )
  icon platform.icn 3
  
  if abs(player.x - cur.x) < 100 and player.y - cur.y < 70 and player.y > cur.y - 20 (
    if player.y < cur.y + 50 (
      if player.y < cur.y (
        player.yv = -5
      ) else if abs(player.x - cur.x) > 95 (
        player.x = cur.x + (player.x - cur.x < 0 ? -101 101)
      )
    ) else (
      player.yv = 0
      if abs(player.x - cur.x) < 100 and player.y > cur.y (
        if player.grounded.not() (
          player.score ++
          io.haptic("land")
        )
        player.grounded = true
        player.y = cur.y + 70
      )
    )
  )
)
goto 0 window.top - 40
centext "Score: " ++ player.score 10 : c#000

if player.x < window.left - 40 or player.y < window.bottom or player.x > window.right + 40 (
  setup()
  io.haptic("dead")
  player.dead = true
)

import "win-buttons"
`, f: fs.readFileSync("/Users/sophie/Origin-OS/OSL Programs/apps/System/originWM.osl", "utf-8")
  }), null, 2));
}