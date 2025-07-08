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
    code = code.replace(/("(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`|'(?:[^'\\]|\\.)*')|(?<=[\]"}\w\)])(?:\+\+|\?\?|->|==|!=|<=|>=|[><?+*^%/\-|&])(?=\S)/g, v => {
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
    const re = /("(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`|'(?:[^'\\]|\\.)*')|\/\*[^*]+|[,{\[]\s*\n\s*[}\]]?|\n\s*[}\.\]]|;|(?<=[)"\]}a-zA-Z\d])\[|(?<=[)\]])\(|(\n|^)\s*\/\/[^\n]+|\n/gm
    CODE = (MAIN ? `/@line ${++ line}\n` : "") + CODE.replace(re, (match) => {
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
    CODE: `//save @= import("~/packages/save/v1.osl")

isType = "normal"
if passed_Data == "SYS.onboot" (
  isType = "notif"
)

import "window_tools" as "wt"
import as "glass" from "packages"

if user.onboot.contains(my_path).not() (
  permission "request" "start run"
)
if window.permissions.contains("notifications").not() (
  permission "request" "notifications"
)

//save.init("fluficord@flufi")

portName = ("social:" ++ OuidNew())

portName.roturConnect()

window "min_size" 175 300

window.width = 900
window.height = 500

def "notifyCustom" "text,icon,title" (
  file "open" my_uuid
  local icn = file[11]
  local name = file[2]
  //file "set" 11 icon
  //file "set" 2 title
  notify text
  //file "set" 11 icn
  //file "set" 2 name
)

class Config (
  server = "flf-server"
  serversUrl = "https://raw.githubusercontent.com/ThePandaDever/flf/refs/heads/main/social/servers.json"
  servers = self.serversUrl.get().JsonParse()
  version = "0.5f-"
)
Settings = null

class Net (
  gotPingBack = false
  roturUsers = {}
  //roturToken = roturToken()
  
  getCooldown = 0
  getMessageCooldown = {}
  
  channels = null
  channelData = {}
  channelMessages = {}
  channelMessagesLoaded = {}
  channelUsers = {}
  
  onlineUsers = null
  messages = {}
  
  emotes = null
  roles = null
  tags = null
  shush = false
  users = {}
  isMod = false
  
  def wipe() (
    self.gotPingBack = false
    self.roturUsers = {}
    self.getCooldown = 0
    self.getMessageCooldown = {}
    self.channels = null
    self.channelData = {}
    self.channelMessages = {}
    self.channelMessagesLoaded = {}
    self.channelUsers = {}
    self.onlineUsers = null
    self.messages = {}
    self.emotes = null
    self.roles = null
    self.tags = null
    self.users = {}
    self.isMod = false
  )
  
  class packetworker (
    queue = []
    worker = null
    def start() (
      self.worker @= worker({
        oncreate: def() -> (
          portName.roturConnect()
        ),
        onframe: def() -> (
          if Net.packetworker.queue.len > 0 (
            void Config.server.roturSend(Net.packetworker.queue.pop())
          )
        )
      })
    )
  )
  
  class onlineworker (
    queue = []
    worker = null
    def start() (
      self.worker @= worker({
        oncreate: def() -> (
          oldtimer = timer
        ),
        onframe: def() -> (
          if (timer - oldtimer) > 120 (
            Net.send({"cmd":"ping"})
            oldtimer = timer
          )
        )
      })
    )
  )

  
  def send(data) (
    if Net.shush.not() (
      log "send" data
      data["version"] = Config.version.destr
      self.packetworker.queue.append(data)
    )
  )
  def update() (
    if new_network_data (
      log "get" packet["data"]
      Net.handlePacket(packet)
      new_network_data = false
    )
    self.getCooldown -= 1
    each this.msg self.getMessageCooldown.getKeys() (
      self.getMessageCooldown[msg] = self.getMessageCooldown[msg] - 1
    )
  )
  def handlePacket(p) (
    local data = p["data"]
    //log "get" data
    
    if data.getKeys().contains("cmd") (
      if data["cmd"] != "comb" (
        //log "get" data
      )
      switch data["cmd"] (
        case "ping"
          self.gotPingBack = true
          break
        
        case "channel_list"
          self.channels = data["data"]
          break
        case "channel_get"
          self.channelData[data["key"]] = data["data"]
          break
        case "channel_messages"
          self.channelMessages[data["key"]] = data["data"]
          self.channelMessagesLoaded[data["key"]] = true
          break
        case "channel_users"
          self.channelUsers[data["key"]] = data["data"]
          //log "users" + data["key"] data["data"]
          break
        
        case "message_get"
          self.messages[data["key"]] = data["data"]
          break
        case "message_new"
          if window.permissions.contains("notifications") (
          
          )
          break
        
        case "update_messages"
          self.getChannelMessages(data["data"], UI.neededMessagesDefault)
          break
        case "update_users"
          self.getOnlineUsers()
          break
        
        case "notif"
          if Settings["notifs"] ?? false or data["doanyway"] (
            notifyCustom data["text"] data["icon"] data["title"]
          )
          break
        case "isMod"
          self.isMod = data["data"]
          break
        
        case "user_online"
          self.onlineUsers = data["data"]
          if (username in self.onlineUsers).not() (
            self.onlineUsers @= self.onlineUsers.append(username)
          )
          UI.user_list.refresh()
          break
        case "user_settings_get"
          Settings = data["data"]
          if isType == "notif" and Settings["bg"].not() (
            window.close()
          )
          break
        case "user_tags_get"
          self.tags ??= {}
          self.tags[data["key"]] = data["data"]
          break
        case "user_get"
          self.users[data.key] = data.data
          UI.user_list.refresh()
          break
        
        case "emote_list"
          self.emotes = data["data"]
          break
        
        case "roles_list"
          self.roles = data["data"]
          UI.user_list.refresh()
          break
        
        case "comb"
          each this.i this.packet2 data["packets"] (
            self.handlePacket({"data":packet2})
          )
          break
        case "killshutthefuckupidontwantpingsanymoresoshush"
          self.packetworker.worker.kill()
          self.onlineworker.worker.kill()
          self.shush = true
          break
        
        default
          log "unknown packet command" + data["cmd"]
          //window "stop"
          break
      )
    )
  )
  def getOnlineUsers() (
    Net.send({"cmd":"user_online"})
  )
  def getConfig() (
    if self.getCooldown <= 0 (
      self.getCooldown = 20
      Net.send({"cmd":"user_settings_get"})
    )
  )
  def setConfigKey(key,value) (
    Net.send({"cmd":"user_settings_set","key":key,"value":value})
  )
  
  def ping() (
    Net.send({"cmd":"ping"})
    self.getCooldown = 50
  )
  
  def getChannelList() (
    Net.send({"cmd":"channel_list"})
    self.getCooldown = 10
  )
  def getChannel(channel) (
    Net.send({"cmd":"channel_get","data":channel})
    self.getCooldown = 20
  )
  def getChannelMessages(channel, amount) (
    Net.send({"cmd":"channel_messages","data":channel,"amount":amount})
    self.getCooldown = 10
  )
  def getMessage(message) (
    if self.getMessageCooldown[message] <= 0 (
      Net.send({"cmd":"message_get","data":message})
      self.getMessageCooldown[message] = 100
    )
  )
  def getChannelUsers(channel) (
    Net.send({"cmd":"channel_users","data":channel})
    self.getCooldown = 10
  )
  
  def sendMessage(content, channel, reply, attachments) (
    attachments = attachments == null ? null attachments
    Net.sendMessageRaw(channel,{"content":content,"attachments":attachments ?? [],"reply":reply})
  )
  def sendMessageRaw(channel,message) (
    Net.send({"cmd":"message_send","data":message,"channel":channel})
  )
  def deleteMessage(channel, message) (
    Net.send({"cmd":"message_delete","data":message,"channel":channel})
  )
  
  def toggleEmote(message, emote) (
    Net.send({"cmd":"emote_toggle","message":message,"emote":emote})
  )
)


class UI (
  selected_channel = null
  replying_message = null
  channelTypes = {
    "text": {
      icon: "w 4 line -6 -10 -3 10 line 3 -10 6 10 line -8 5 10 5 line -10 -5 8 -5"
    }
  }
  neededMessagesDefault = 15
  neededMessages = {}
  
  def getLocation() (
    return self.selected_channel ?? "no where"
  )
  
  def drawEmote(emote, size) (
    local e = Net.emotes[emote]
    if e["text"] (
      change size * -20 + .75 size * .5 + .75
      text e["text"] size * 35 : c#txtc
    ) else (
      icon e["icon"] ?? "grid-apps-full" size : c#txtc
    )
  )
  
  def drawText(text, size, color) (
    text text ?? "" size : c#color
  )
  def getUnFormattedText(text) (
  
  )
  def textHeight() (
    return 2
  )
  
  def drawPFP(user, w, h) (
    image "https://avatars.rotur.dev/" ++ (user ?? "_") ++ "?radius=256px" w + 1 h + 1
  )
  def drawUser(user, size, prefix) (
    if prefix == "prefix" (
      prefix = null
    )
    user ??= "?"
    user = (prefix ?? "") ++ user
    text user size
  )
   
  def colorPad(t) (
    return t.len == 2 ? t t.prepend("0")
  )
  
  def lerpColor(a,b,t) (
    local r1 = a.trim(2,3).toBase(16, 10).toNum()
    local g1 = a.trim(4,5).toBase(16, 10).toNum()
    local b1 = a.trim(6,7).toBase(16, 10).toNum()
    local r2 = b.trim(2,3).toBase(16, 10).toNum()
    local g2 = b.trim(4,5).toBase(16, 10).toNum()
    local b2 = b.trim(6,7).toBase(16, 10).toNum()
    return "#" ++ self.colorPad(floor(r2 - r1 * t + r1).toBase(10,16)) ++ self.colorPad(floor(g2 - g1 * t + g1).toBase(10,16)) ++ self.colorPad(floor(b2 - b1 * t + b1).toBase(10,16))
  )
  
  def gradText(text, size, a, b) (
    local len = text.len
    local chari = 0
    while chari < len (
      c lerpColor(a,b,chari / len)
      chari ++
      text text[chari] size
    )
  )
  
  class channel_list (
    width = 225
    real_width = self.width
    height = 0
    shown = true
    
    def update() (
      self.shown = window.width > 500
      self.real_width = self.shown ? self.width 0
      if self.shown (
        c prim
        glass:frame window.left window.top window.left + self.real_width window.bottom + 80 UI.channel_list.height - 15 + 10 "channel_list"
          UI.channel_list.list()
        frame "clear"
      )
    )
    def list() (
      local loaded = true
      each this.chn Net.channels (
        loaded = loaded and Net.channelData[chn] != null  
      )
      if Net.channels != null and loaded and typeof(Net.channels) == "array" (
        if Net.channels.len > 0 (
          local y = frame.top - 27.5 + frame.scroll
          self.height = 0
          each this.channel Net.channels (
            local channelData = Net.channelData[channel]
            goto 0 y
            local isSelected = UI.selected_channel == channel
            local col = isSelected ? global_accent window_colour
            if isSelected (
              square frame.width - 25 30 15 : c#col
              square frame.width - 25 30 10 : c#prim
            )
            square frame.width - 25 30 15 0 1
            if mouse_touching (
              cursor "pointer"
              if Input.mouse.leftClick (
                UI.selected_channel = channel
                UI.neededMessages[channel] = UI.neededMessagesDefault
                UI.user_list.refresh()
                UI.emote_menu.open = false
              )
            )
            goto frame.width * -.5 + 25 y
            icon UI.channelTypes[channelData["type"] ?? "unknown"].icon .9 : c#txtc
            text channel 10 : c#txtc chx#20
            
            if Net.channelUsers[channel] != Net.users.getKeys() (
              goto frame.width * -.5 + 25 + 10 y + 10
              icon "w 10 square 0 0 8 10" .6 : c#prim
              icon "locked" .6 : c#txtc
            )
            
            y -= 50
            self.height += 50
          )
        ) else (
          goto 0 0
          centext "no channels :(" 10 : c#txtc
        )
      ) else (
        goto 0 0
        direction timer * 720
        icon "sync" .75 : c#txtc
        direction 90
      )
    )
  )
  
  class topbar (
    def update() (
      local dragBox = [[2,2,UI.channel_list.real_width,0],[-2,2,-90,-40]]
      window "set_dragbox" dragBox
      self.locationBar()
      self.winButtons()
    )
    def winButtons() (
      window "show"
      direction 90
      loc -2 2 -45 -20
      c prim
      square 70 17 10
      change_x 25
      c txtc
      icon "close" 0.6 : hover_size#1.1
      if mouse_touching (
        cursor "pointer"
        if Input.mouse.leftClick (
          window "stop"
        )
      )
      icon "down" 0.6 : chx#-25 hover_size#1.1
      if mouse_touching (
        cursor "pointer"
        if Input.mouse.leftClick (
          window "minimise"
        )
      )
      icon "maximise" 0.6 : chx#-25 hover_size#1.1
      if mouse_touching (
        cursor "pointer"
        if Input.mouse.leftClick (
          window "maximise"
        )
      )
    )
    def locationBar() (
      frame window.left + UI.channel_list.real_width window.top window.right window.top - 40 (
        goto 0 0
        square frame.width frame.height : c#prim
        
        loc 2 9999 15 0
        text UI.getLocation() 10 : c#txtc
      )
    )
  )
  
  class messages (
    height = 1
    messageSize = 10
    def update() (
      c prim
      frame window.left + UI.channel_list.real_width window.top - 40 window.right - UI.user_list.real_width window.bottom + UI.input_bar.height self.height "messages" (
        local messages @= Net.channelMessages[UI.selected_channel]
        local start = frame.bottom - (self.height > frame.height - 15 ? (frame.scrollMax.height - frame.scroll) 0)
        local y = start
        local total_h = 0
        local isConnected @= def(msgData,otherData) -> (
          // if its the same user, and the messages are less than 2 minutes apart
          local timeconnected = msgData.timestamp != null and otherData.timestamp != null ? msgData.timestamp - otherData.timestamp < (2 * 60 * 1000) true
          //temp["time"] = timeconnected
          return msgData.user == otherData.user and timeconnected and msgData["reply"] == null
        )
        local sizeFunction = def(emote, spacing) -> (
          return spacing + (emotes[emote].len.toStr().len * 10)
        )
        local drawPFP @= UI.drawPFP
        local drawUser @= UI.drawUser
        local drawText @= UI.drawText
        local drawEmote @= UI.drawEmote
        local messageSize = self.messageSize
        contentCache ??= {}
        heightCache ??= {}
        isConnectedCache ??= {}
        each this.msgi this.msg messages (
          local msgData @= Net.messages[msg]
          local content = msgData.content.wrapText(frame.width / self.messageSize - 4)
          local Muser = msgData.user
          local cacheID = msgData.cacheID
          //temp = {}
          local doTitle = (messages[msgi + 1] != null) ? isConnected(msgData,Net.messages[messages[msgi + 1]]).not true
          local connected = (messages[msgi - 1] != null) ? isConnected(Net.messages[messages[msgi - 1]],msgData) false
          local height = 0
          emotes = msgData["emotes"]
          local emoteKeys = emotes.getKeys()
          height += content.split("\n").len * self.messageSize * 2.3
          height += doTitle ? (connected ? (self.messageSize * 2) 25) 0
          height += emotes.len > 0 ? 37.5 0
          height += msgData["reply"] != null ? 20 0
          total_h += height
          if y > frame.top (
            y += height
            Continue
          )
          if y + height < frame.bottom (
            y += height
            Continue
          )
          y += height * .5
          goto 0 y
          square frame.width height 0 0 1
          local hovered = mouse_touching
          if mouse_touching (
            c tert
            pen "opacity" UI.replying_message == msg ? 8 4
            square frame.width height 1
          ) else (
            if UI.replying_message == msg (
              c tert
              pen "opacity" 4
              square frame.width height 1
            )
          )
          
          if hovered (
            local actions @= {
              "reply": {
                "icon": "w 4 line 0 8 -8 0 cont 0 -8 line -8 0 -2 0 cutcircle 0 -8 8 4.5 45" + (UI.replying_message == msg ? "w 7 c" + prim + "line -9 -9 9 9 9 -9 -9 9 c" + txtc + "w 4 line -9 -9 9 9 line 9 -9 -9 9 c" ""),
                "code": def(msg) -> (
                  if UI.replying_message != msg (
                    UI.replying_message = msg
                  ) else (
                    UI.replying_message = null
                  )
                )
              },
              "react": {
                "icon": "w 2.5 cutcircle 0 0 9 0 180 dot -3 1.5 dot 3 1.5 cutcircle 0 2.5 6 18 30",
                "code": def(msg) -> (
                  UI.emote_menu.open = (UI.emote_menu.open and UI.emote_menu.message == msg).not()
                  UI.emote_menu.x = UI.mouse_x
                  UI.emote_menu.y = UI.mouse_y
                  UI.emote_menu.message = msg
                )
              }
            }
            if Net.isMod or Muser == username (
              actions["delete"] = {
                "icon": "bin",
                "code": def(msg) -> (
                  Net.deleteMessage(UI.selected_channel, msg)
                )
              }
            )
            local actionWidth = 22
            goto frame.right - 25 y + (height / 2) - 12
            change_x actionWidth / 2
            each this.actionKey actions.getKeys() (
              local action @= actions[actionKey]
              if action.shown !== null ? action.shown true (
                square 10 10 10 : c#prim hover_c#seco
                icon action["icon"] .6 : c#txtc
                if mouse_touching (
                  cursor "pointer"
                  if onclick (
                    action.code(msg)
                  )
                )
                change_x -actionWidth
              )
            )
          )
          
          if msgData["reply"] != null (
            goto frame.left + 50 y + (height / 2 - 13.5)
            local replyMessage @= Net.messages[msgData["reply"]]
            if replyMessage == null (
              Net.getMessage(msgData["reply"])
            )
            drawPFP(replyMessage.user, 14, 14)
            drawUser(replyMessage.user, self.messageSize * .8, "@") : chx#16 c#txtc chx#-6.25
            drawText(replyMessage.content.replace("\n"," ").trimText(frame.width / (self.messageSize * .8) - 16), self.messageSize * .8, txtc) : chx#5
            y -= 20
          )
          
          if doTitle (
            goto frame.left y + (height / 2 - 20)
            drawPFP(Muser, 25, 25) : chx#17.5 chy#0
            local roleColor = UI.user_list.roleColorUsers[Muser]
            if typeof(roleColor) == "string" (
              drawUser(Muser, self.messageSize) : chx#25 c#roleColor chx#-6.25 chy#6.25
            ) else (
              UI.gradText(Muser, self.messageSize, roleColor[1], roleColor[2]) : chx#25 c#roleColor chx#-6.25 chy#6.25
            )
            //log msgData.timestamp
            change_x -6
            local tags @= Net.tags[msgData.user] ?? []
            if tags.len > 0 (
              change_x -2
            )
            local tagi = 0
            for this.tagi tags.len (
              local tag @= tags[tagi]
              square 20 20 0 0 1 : chx#22 tooltip#tag.tooltip
              c txtc
              if tag.color != null (
                c tag.color
              )
              icon tag.icon .6 * (tag.size ?? 1)
            )
            change_x 6
            text msgData.timestamp.timestamp("to-relative") self.messageSize * .7 : chx#10 c#txtc
          )
          
          goto frame.left y + (height / 2 - (doTitle ? (self.messageSize * 2) -2.5))
          drawText(content,self.messageSize,txtc) : chx#36.5 chy#-15
          
          y += msgData["reply"] != null ? 20 0
          
          if emoteKeys.len > 0 (
            local x2 = frame.left
            local spacing = 27.5
            local y2 = y - (height * .5) + 20.5
            local showUsers = Settings["showEmoteUsers"]
            each this.emote emoteKeys (
              local emoteUsers @= emotes[emote]
              if emoteUsers.len > 0 (
                local w3 = sizeFunction(emote, spacing)
                if showUsers (
                  local w4 = emoteUsers.len * 25
                  w3 += w4
                  x2 += w4 / 2
                )
                goto x2 + 57.5 y2
                local pri = emoteUsers.contains(username.toLower()) ? seco prim
                local hov = emoteUsers.contains(username.toLower()) ? tert seco
                square w3 20 10 : c#pri hover_c#hov
                if mouse_touching (
                  cursor "pointer"
                  if onclick (
                    Net.toggleEmote(msg, emote)
                  )
                )
                goto x2 + 57.5 - (w3 * .5 - 10) y2
                drawEmote(emote, .75)
                goto x2 + 57.5 - (w3 * .5 - 25) y2
                text emoteUsers.len 10 : c#txtc
                if showUsers (
                  goto x2 + 57.5 - (w3 * .5 - 25) y2
                  each this.user emoteUsers (
                    drawPFP(user, 20, 20) : chx#25
                  )
                  x2 += w4 / 2
                )
                x2 += spacing + (emoteUsers.len.toStr().len * 10) + 17.5
              )
            )
          )
          
          //text connected ++ "," + doTitle ++ "," + temp["time"] 10 : c#txtc chx#30
          
          //log performance - start
          
          y += height * .5
        )
        self.height = total_h
      )
    )
  )
  
  class input_bar (
    height = 40
    def update() (
      frame window.left + UI.channel_list.real_width window.bottom + self.height window.right - UI.user_list.real_width window.bottom (
        local height = min(inputs["input_bar"].len * 23, 150)
        loc 9999 -2 0 height * .5 + 9
        c prim
        self.height = height + 18
        textbox frame.width - 15 self.height - 18 "input_bar" 8 {
          "bg_colour": prim,
          "text_colour": txtc,
          "line_numbers": false
        }
        if "enter".onKeyDown() and "shift".isKeyDown().not() (
          Net.sendMessage(inputs["input_bar"].join("\n"), UI.selected_channel, UI.replying_message)
          UI.replying_message = null
          inputs["input_bar"] = [""]
        )
      )
    )
  )
  
  class user_list (
    width = 215
    real_width = self.width
    height = 0
    shown = true
    
    taggedUsers = []
    sortedUsers = []
    roleColorUsers = {}
    roleCount = {}
    
    def refresh() (
      self.taggedUsers = self.tagUsers(Net.users.getKeys())
      self.sortedUsers = self.sortUsers(taggedUsers)
      self.roleColorUsers = self.colorUsers(taggedUsers)
      self.roleCount = {}
      each this.user self.taggedUsers (
        local role = user.role
        self.roleCount[role] ??= 0
        self.roleCount[role] ++
      )
    )
    
    def roleToNum(role) (
      return (["offline","online"] ++ (Net.roles.getKeys() ?? [])).index(role)
    )
    
    def sortRoles(roles) (
      return roles.map(def(r) -> (
        return {"name": r, "rank": self.roleToNum(r)}
      )).sortBy("rank","ascending")
    )
    
    def tagUsers(users) (
      local newUsers = []
      each this.user users (
        local newUser @= {
          "name": user,
          "role": self.sortRoles(Net.users[user]["roles"])[-1].name ?? (Net.onlineUsers.contains(user) ? "online" "offline")
        }
        newUser["rank"] = self.roleToNum(newUser["role"])
        newUsers @= newUsers.append(newUser)
      )
      return newUsers
    )
    
    def colorUsers(users) (
      local newUsers = {}
      each this.user users (
        local col = null
        local roles = Net.users[user.name]["roles"]
        each this.roleKey roles (
          local role = Net.roles[roleKey]
          if (role.color != null or role.colora != null) (
            col = self.getRoleColor(role)
            break
          )
        )
        newUsers[user.name] = col ?? txtc
      )
      return newUsers
    )
    
    def sortUsers(users) (
      return users.sortBy("rank","ascending").reverse()
    )
    
    def getRoleColor(role) (
      if role != null (
        if role.color != null (
          return role.color
        )
        if role.colora != null (
          return [role.colora,role.colorb]
        )
      )
      return txtc
    )
    
    def update() (
      self.shown = window.width > (600 + self.width)
      self.real_width = self.shown ? self.width 0
      if self.shown (
        c prim
        frame window.right - self.real_width window.top - 40 window.right window.bottom self.height + 10 "users" (
          goto 0 0
          line frame.left frame.top frame.left frame.bottom : c#prim
          
          local scroll = self.height > frame.height - 15 ? (frame.scroll) 0

          
          if UI.selected_channel == null (
            goto 0 0
            centext "select a channel :3" 8 : c#txtc
            self.height = 0
            frame "clear"
            return
          )
          local users @= Net.channelUsers[UI.selected_channel]
          
          if users == null (
            goto 0 0
            direction timer * 720
            icon "sync" .75 : c#txtc
            direction 90
            self.height = 0
          ) else (
            local start = frame.top + scroll
            local y = start
            local lastRole = null
            local roleColor = null
            each this.userData self.sortedUsers (
              local user = userData.name
              y -= 10
              
              local roleName = userData.role
              if roleName != lastRole (
                local role @= Net.roles[roleName]
                roleColor = self.getRoleColor(role)
                y -= 4
                goto frame.left + 10 y
                if typeof(roleColor) == "string" (
                  text roleName 10 : c#roleColor
                  text "-" 10 : chx#5
                  text self.roleCount[roleName] 10 : chx#5
                ) else (
                  local txt = roleName + "-" + self.roleCount[roleName]
                  void UI.gradText(txt, 10, roleColor[1], roleColor[2])
                )
                y -= 20
              )
              lastRole = roleName
              
              y -= 10
              
              goto 0 y
              square frame.width - 20 25 10 : c#prim
              set_x frame.left + 22
              UI.drawPFP(user, 25, 25)
              //icon "square 0 0 25 25" .5 : c#fff
              change 10 -10
              
              local back = "c" + prim + "w 30 dot 0 0"
              if Net.onlineUsers == null (
                icon back .5
                text "?" 6 : c#txtc chx#-3
              ) else if Net.onlineUsers.contains(user) (
                icon back + "c #03c200 w 19 dot 0 0" .5
              ) else (
                icon back + "c #424242 w 4.5 cutcircle 0 0 7 0 180" .5
              )
              
              change 12.5 10
              local roleUserColor = self.roleColorUsers[user]
              if typeof(roleUserColor) == "string" (
                c roleUserColor
                UI.drawUser(user.trimText(frame.width - 60 / 10), 10)
              ) else (
                void UI.gradText(user.trimText(frame.width - 60 / 10), 10, roleUserColor[1], roleUserColor[2])
              )
              
              local tags = Net.tags[user] ?? []
              if tags.len > 0 (
                change_x -10
                local tagi = 0
                for this.tagi tags.len (
                  local tag @= tags[tagi]
                  square 20 20 0 0 1 : chx#22 tooltip#tag.tooltip
                  c txtc
                  if tag.color != null (
                    c tag.color
                  )
                  icon tag.icon .6 * (tag.size ?? 1)
                )
              )
              
              y -= 20
            )
            self.height = start - y - 20
            //log self.height
          )
        )
      )
    )
  )
  
  class emote_menu (
    open = false
    x = 0
    y = 0
    message = null
    def update() (
      if self.open.not() (
        return
      )
      local width = 150
      local height = 200
      
      if self.y - (height * .5) < window.bottom + 10 + UI.input_bar.height (
        self.y = window.bottom + 10 + UI.input_bar.height + (height * .5)
      )
      if self.y + (height * .5) > window.top - 50 (
        self.y = window.top - 50 - (height * .5)
      )
      local x = self.x - (width * .5) - 20
      local y = self.y
      
      goto x y
      square width height 15 : c#global_accent
      square width height 10 : c#prim
      
      if Net.emotes != null (
        frame x - (width * .5) y + (height * .5) x + (width * .5) y - (height * .5) (
          local emote_size = 25
          local ex = frame.left + (emote_size * 1)
          local ey = frame.top - (emote_size * 1)
          each this.emoteKey Net.emotes.getKeys() (
            local emote = Net.emotes[emoteKey]
            goto ex ey
            square emote_size * 1.5 emote_size * 1.5 10 0 1
            if mouse_touching (
              cursor "pointer"
              if Input.mouse.leftClick (
                Net.toggleEmote(self.message, emoteKey)
                self.open = false
              )
            )
            c mouse_touching ? tert seco
            square emote_size * 1.5 emote_size * 1.5 10
            UI.drawEmote(emoteKey, emote_size / 17.5)
            ex += emote_size * 2
            if ex > frame.right (
              ex = frame.left + (emote_size * 1)
              ey -= emote_size * 2
            )
          )
        )
      ) else (
        goto x y
        direction timer * 720
        icon "sync" .75 : c#txtc
        direction 90
      )
    )
  )
  
  class info_panel (
    def setting(name, icn, current, callback, data) (
      c (current ?? false).toBool() ? tert prim
      square 10 10 15 : hover_c#seco chx#30 tooltip#name
      if mouse_touching (
        cursor "pointer"
        if onclick (
          callback(data)
        )
      )
      square 10 10 10 : c#prim
      icon icn .65 : c#txtc
    )
    def update() (
      if UI.channel_list.shown (
        goto 0 0
        line window.left + UI.channel_list.real_width - 2 window.bottom window.left + UI.channel_list.real_width - 2 window.bottom + 80 - 1 : c#prim
        frame window.left window.bottom + 80 window.left + UI.channel_list.real_width window.bottom (
          loc 2 9999 22.5 15
          image "https://avatars.rotur.dev/" ++ username ++ "?radius=50px" 40 40
          text username 10 : c#txtc chx#25 chy#9
          loc 2 -2 15 - 30 17.5
          
          local toggle @= def(key) -> (
            Settings[key] = Settings[key].not()
            Net.setConfigKey(key,Settings[key])
          )
          
          local settingKey = "notifs"
          self.setting("notifications", "notifications", Settings[settingKey], toggle, settingKey)
          
          settingKey = "bg"
          self.setting("background worker", "multitasking", Settings[settingKey], toggle, settingKey)
          
          settingKey = "showEmoteUsers"
          self.setting("show emote users", "accounts", Settings[settingKey], toggle, settingKey)
        )
      )
    )
  )
)

class Input (
  class mouse (
    leftClick = false
    leftDown = false
  )
  def update() (
    self.mouse.leftClick = mouse_left and self.mouse.leftDown.not()
    self.mouse.leftDown = mouse_left
  )
)

Net.ping()
Net.packetworker.start()
Net.onlineworker.start()

window.on("close", def() -> (
  void Config.server.roturSend({"cmd":"quit","version":Config.version})
))

mainloop:
  if isType == "notif" (
    Net.update()
    window.hide()
    window.resize(0,0)
    return
  )
  
  wt:load_theme
  Net.update()
  Input.update()
  
  if Net.gotPingBack and Net.channels == null and Net.getCooldown <= 0 (
    Net.getChannelList()
  )
  if Settings == null and Net.gotPingBack and Net.shush (
    Net.getConfig()
  )
  each this.channel Net.channels (
    if Net.channelData.getKeys().contains(channel).not() (
      if Net.getCooldown <= 0 (
        Net.getChannel(channel)
      )
    ) else if Net.channelUsers.getKeys().contains(channel).not() (
      if Net.getCooldown <= 0 (
        //log channel Net.channelUsers Net.channelUsers.getKeys()
        //Net.getChannelUsers(channel)
      )
    ) else (
      if UI.neededMessages[channel] > 0 and (Net.channelMessagesLoaded[channel] ?? false).not() (
        Net.getChannelMessages(channel, UI.neededMessages[channel] ?? 0)
        UI.neededMessages[channel] = 0
      )
    )
  )
  if UI.selected_channel != null (
    local msgs = Net.channelMessages[UI.selected_channel]
    if msgs (
      each this.msg msgs.reverse() ( 
        if Net.messages[msg] == null (
          Net.getMessage(msg)
        )
      )
    )
  )
  
  UI.mouse_x = mouse_x
  UI.mouse_y = mouse_y
  
  void UI.messages.update()
  void UI.input_bar.update()
  void UI.channel_list.update()
  void UI.user_list.update()
  void UI.emote_menu.update()
  void UI.topbar.update()
  void UI.info_panel.update()
  
  if false (
    goto 0 0
    square 200 100 10 : c#prim hover_c#seco
    if mouse_touching (
      cursor "pointer"
      if Input.mouse.leftClick (
        Net.sendMessage("hi","general")
      )
    )
    centext "funny message" 10 : c#txtc
  )
`, f: fs.readFileSync("/Users/sophie/Origin-OS/OSL Programs/apps/System/originWM.osl", "utf-8")
  }), null, 2));
}