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

function autoTokenise(CODE, DELIMITER) {
  if (CODE.indexOf("\\") !== -1) {
    return tokeniseEscaped(CODE, DELIMITER ?? " ");
  } else if (CODE.indexOf('"') !== -1 || CODE.indexOf("[") !== -1 || CODE.indexOf("{") !== -1 || CODE.indexOf("(") !== -1) {
    return tokenise(CODE, DELIMITER ?? " ");
  } else {
    return CODE.split(DELIMITER ?? " ");
  }
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
        out.push(depth);
        letter++;

        if (quotes === 0 &&
          squotes === 0 &&
          b_depth === 0 &&
          m_comm === 0 &&
          (
            code[letter] === " " ||
            code[letter] === ")" ||
            (
              this.operators.includes(depth) &&
              (depth !== "-" && /[\d"]/.test(code[letter - 2]))
            )
          )
        ) {
          if ([" ", ")"].includes(code[letter]) === false) {
            while (code[letter] === "=" || code[letter] === depth || (depth === "-" && code[letter] === ">")) {
              depth += code[letter];
              letter++;
            }
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
    out.source = cur;
    return out
  }

  stringToToken(cur, param) {
    if ((cur[0] === "{" && cur[cur.length - 1] === "}") || (cur[0] === "[" && cur[cur.length - 1] === "]")) {
      try {
        if (cur[0] === "[") {
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
    } else if (cur[0] === "\"" && cur[cur.length - 1] === "\"") return { type: "str", data: cur }
    else if (!isNaN(+cur)) return { type: "num", data: +cur }
    else if (cur === "true" || cur === "false") return { type: "var", data: cur === "true" }
    else if (this.operators.indexOf(cur) !== -1) return { type: "opr", data: cur }
    else if (this.comparisons.indexOf(cur) !== -1) return { type: "cmp", data: cur }
    else if (cur === "?") return { type: "qst", data: cur }
    else if (this.logic.indexOf(cur) !== -1) return { type: "log", data: cur }
    else if (this.bitwise.indexOf(cur) !== -1) return { type: "bit", data: cur }
    else if (this.unary.indexOf(cur) !== -1) return { type: "ury", data: cur }
    else if (autoTokenise(cur, ".").length > 1) {
      let method = autoTokenise(cur, ".")
      method = method.map((input, index) => this.evalToken(input, index > 0))
      return { type: "mtd", data: method };
    }
    else if (cur === "null") return { type: "unk", data: null }
    else if (cur.match(/^(!+)?[a-zA-Z_][a-zA-Z0-9_]*$/)) return { type: "var", data: cur }
    else if (cur === "->") return { type: "inl", data: "->" }
    else if (cur.startsWith("(\n") && cur.endsWith(")")) return { type: "blk", data: this.generateFullAST({ CODE: cur.substring(2, cur.length - 1).trim(), START: 0 }) }
    else if (cur.startsWith("(") && cur.endsWith(")")) {
      let end = this.findMatchingParentheses(cur, 0);
      if (end === -1) return { type: "unk", data: cur };
      const body = cur.substring(1, end).trim();
      return this.generateAST({ CODE: body, START: 0 })[0]
    }
    else if (cur.endsWith(")")) {
      let out = { type: param ? "mtv" : "fnc", data: cur.substring(0, cur.indexOf("(")), parameters: [] }
      if (cur.endsWith("()")) return out
      let method = autoTokenise(cur.substring(cur.indexOf("(") + 1, cur.length - 1), ",")
      method = method.map(v => {
        const tkns = autoTokenise(v.trim(), " ");
        if (tkns.length === 1) return this.generateAST({ CODE: v.trim(), START: 0 })[0]
        else if (tkns.length === 2) {
          const ast = this.generateAST({ CODE: tkns[1].trim(), START: 0 })[0]
          ast.set_type = tkns[0]
          return ast
        }
      })
      out.parameters = method
      return out
    }
    else if (cur === ":") return { type: "mod_indicator", data: ":" };
    else if (cur.endsWith("=")) return { type: "asi", data: cur }
    else return { type: "unk", data: cur }
  }

  isStaticToken(token) {
    return ["str", "num", "unk"].includes(token.type);
  }

  generateAST({ CODE, START, MAIN }) {
    CODE = CODE + "";

    let ast = []
    let tokens = this.tokeniseLineOSL(CODE)
    for (let i = 0; i < tokens.length; i++) {
      const cur = tokens[i].trim()
      if (cur === "->") {
        ast.push({ type: "inl", data: "->" })
        ast.push({ type: "str", data: tokens[i + 1].trim() })
        i += 1
        continue
      }
      ast.push(this.evalToken(cur))
    }

    let modifiers = false;
    for (let token of ast) {
      if (modifiers && token.type === "unk") {
        token.type = "mod"
        const pivot = token.data.indexOf("#") + 1
        token.data = [token.data.substring(0, pivot - 1), this.evalToken(token.data.substring(pivot))]
      }
      if (token.type === "mod_indicator") modifiers = true
    }

    const types = ["inl", "opr", "cmp", "qst", "bit", "log"];
    for (let type of types) {
      for (let i = START ?? (type === "asi" ? 1 : 2); i < ast.length; i++) {
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
            ast.splice(i - 1, 1);
            ast.splice(i, 1);
            i -= 1;
          }
        }
      }
    }

    const evalASTNode = node => {
      if (!node) return node;
      if (node.type === "inl") {
        const params = (node?.left?.parameters || []).map(p => p.data).join(",");
        return {
          type: "fnc",
          data: "function",
          parameters: [
            {
              type: "str",
              data: params
            },
            this.generateAST({ CODE: node.right.data, START: 0 })[0]
          ],
        }
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
            data: +result
          };
        }
      }
      return node;
    }

    // Evaluate each node in the AST
    for (let i = 0; i < ast.length; i++) {
      ast[i] = evalASTNode(ast[i]);
    }

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
        source: CODE
      });
      console.log(JSON.stringify(second.parameters))
      ast[2] = {
        type: "fnc",
        data: "function",
        parameters: [
          {
            type: "str",
            data: second.parameters.map(p => (p.set_type ? `${p.set_type} ` : "") + (
              p.type === "mtd" ?
              p.data.map(p2 => p2.data).join(".") :
              p.data
            )).join(",")
          },
          ast[3]
        ]
      };
      ast.splice(3, 1);
    }

    if (ast.length === 0) return [];

    if (ast[0].type === "mtd" && ast[0].data[1].type === "mtv" && ast.length === 1) {
      ast.unshift(ast[0].data[0], {
        type: "asi",
        data: "=??",
        source: CODE
      });
    }

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
        cur.source = CODE;
      }
    }

    if (ast.length === 0) return null;

    if (ast.length === 2 &&
      ast[0].type === "var" &&
      (ast[1]?.data === "--" && ast[1]?.type === "unk") ||
      (ast[1]?.data === "++" && ast[1]?.type === "opr")
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
      ast[0].source = CODE;
    }

    return ast.filter(token => (
      token.type &&
      token.type.length === 3 &&
      !(String(token.data).startsWith("/*") && token.type === "unk")
    ))
  }

  generateFullAST({ CODE }) {
    CODE = CODE + "";
    CODE = CODE.replace(/("(?:[^\\"]*|\\.)*(?:"|$))|\n\s*\./gm, (match) => {
      if (match.startsWith("\n")) return match.replace(/\n\s*\./, ".");
      return match;
    });
    CODE = autoTokenise(CODE, "\n").map(line => {
      line = line.trim();
      if (line === "endef") return ")";
      if (line.startsWith("def ") && !(line.endsWith("(") || line.endsWith(")"))) return line + " (";
      return line;
    }).join("\n");

    let lines = autoTokenise(CODE, "\n").map((line) => {
      line = line.trim();
      if (line.startsWith("//") || line === "") return null;
      line = line.replace(/("(?:[^\\"]*|\\.)*(?:"|$))|(?<=[)"\]}a-zA-Z\d])\[|(?<=[)\]])\(/gm, (match) => {
        if (match === "(") return ".call(";
        if (match === "[") return ".[";
        return match;
      });

      return this.generateAST({ CODE: line, MAIN: true });
    });

    for (let i = 0; i < lines.length; i++) {
      const cur = lines[i]
      if (!cur) continue;
      if (
        cur?.[0]?.type === "cmd" &&
        ["for", "each", "class"].includes(cur?.[0]?.data)
      ) {
        if (cur?.[4]?.type === "blk" && cur[0].data === "each") cur[2].type = "str"
        cur[1].type = "str"
        i++
      }
    }

    return lines.filter((line) => line !== null);
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
    CODE: fs.readFileSync("/Users/sophie/Origin-OS/OSL Programs/apps/System/Studio.osl", "utf-8")
  }), null, 2));
}