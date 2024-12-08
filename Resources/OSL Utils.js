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
        if (depth === "[" || depth === "{" || depth === "(") b_depth ++
        if (depth === "]" || depth === "}" || depth === ")") b_depth --
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
        if (depth === "[" || depth === "{" || depth === "(") b_depth ++
        if (depth === "]" || depth === "}" || depth === ")") b_depth --
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
  } else if (CODE.indexOf('"') !== -1 || CODE.indexOf("[") !== -1 || CODE.indexOf("{") !== -1) {
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

function parseJsonLikeString(jsonLikeStr, replacements) {
// Create a string that defines the variables
let variableDefinitions = Object.entries(replacements)
  .map(([key, value]) => jsonLikeStr.indexOf("" + key) !== -1 ? `var ${key} = ${JSON.stringify(value)};` : "")
  .join('');

// Append the JSON-like string
let evalString = variableDefinitions + 'return ' + jsonLikeStr + ';';

// Use a function constructor to safely create a function to evaluate the string
return new Function(evalString)();
}

(function (Scratch) {
"use strict";

const vm = Scratch.vm;

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
    let name = "§" + randomString(32);
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

function compileCloseBrackets(OSL) {
  let out = [];
  let methods = {};
  let regExp = /.\(([^()]*)\)/; // Regular expression to match innermost parentheses containing spaces or non-alphanumeric characters

  let values = {};
  for (let line of OSL) {
    while (regExp.test(line)) {
      line = line.replace(regExp, (match, p1) => {
        let name = randomString(12); // Generate a random identifier

        if (match.startsWith(" ") || match.startsWith("(")) {
          out.push(`${name} = ${p1.trim()}`);

          if (match.startsWith("((")) {
            return `(${name}`;
          } else {
            return ` ${name}`;
          }
        } else {
          let temp = "§" + randomString(32);
          const trimmed = p1.trim();
          if (match[0] === "!") {
            out.push(`${name} = ${trimmed}`);
            return "!" + name;
          }
          if (trimmed.match(/^"([^"]|\\")+"$/) || trimmed === "" || trimmed.match(/^\W+$/) || !isNaN(+trimmed)) {
            methods[temp] = trimmed;
            return match[0] + temp;
          }

          methods[temp] = name;
          if (trimmed.indexOf(",") !== -1) {
            let inputs = trimmed.split(",");
            name = randomString(12);
            const cur = inputs[0].trim();
            if (/^\w+$/.test(cur)) {
              methods[temp] = cur;
            } else {
              out.push(`${name} = ${cur}`);
              methods[temp] = `${name}`;
            }
            for (let i = 1; i < inputs.length; i++) {
              name = randomString(12);
              const cur = inputs[i].trim();
              if (/^\w+$/.test(cur)) {
                methods[temp] += `,${cur}`;
              } else {
                methods[temp] += `,${name}`;
                out.push(`${name} = ${cur}`);
              }
            }
          } else {
            const cur = trimmed;
            if (/^\w+$/.test(cur)) {
              methods[temp] = cur;
            } else {
              out.push(`${name} = ${cur}`);
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

class OSLUtils {
  constructor() {
    this.regex = /"[^"]+"|{[^}]+}|\[[^\]]+\]|[^."(]*\((?:(?:"[^"]+")*[^.]+)*|\d[\d.]+\d|[^." ]+/g;
    this.operators = ["+", "++", "-", "*", "/", "//", "%", "??", "", "^", "b+", "b-", "b/", "b*", "b^"]
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
          opcode: "setOperators",
          blockType: Scratch.BlockType.COMMAND,
          text: "Set Operators [OPERATORS]",
          arguments: {
            OPERATORS: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '["+", "++", "-", "*", "/", "//", "%", "??", "", "^", "b+", "b-", "b/", "b*", "b^"]',
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

  evalToken(cur) {
    if ((cur[0] === "{" && cur[cur.length - 1] === "}") || (cur[0] === "[" && cur[cur.length - 1] === "]")) {
      try {
        if (cur[0] === "[") {
          let output = [];
          let depth = 0;
          let quotes = false;
          let current = "";
          for (let i = 1; i < cur.length - 1; i ++) {
            if (cur[i] === '"') {
              quotes = !quotes;
            }
            if (cur[i] === "[" || cur[i] === "{") {
              depth += 1;
            } else if (cur[i] === "]" || cur[i] === "}") {
              depth -= 1;
            }
            if (cur[i] !== "," || quotes || depth !== 0) current += cur[i]

            if (!quotes && cur[i] === "," && depth === 0) {
              output.push(this.generateAST({ CODE: current.trim() })[0])
              current = ""
            }
          }
  
          if (current !== "") {
            output.push(this.generateAST({ CODE: current.trim() })[0])
            current = ""
          }
          return { type: "arr", data: output }
        } else if (cur[0] === "{") {
          let output = {};
          let depth = 0;
          let quotes = false;
          let current = "";
          let cur_key = ""
          for (let i = 1; i < cur.length - 1; i ++) {
            if (cur[i] === '"') {
              quotes = !quotes;
            }
            if (cur[i] === "{" || cur[i] === "[") {
              depth += 1;
            } else if (cur[i] === "}" || cur[i] === "]") {
              depth -= 1;
            }
            if (cur[i] !== "," || quotes || depth !== 0) current += cur[i]

            if (!quotes && cur[i] === ":" && depth === 0) {
              cur_key = current.substring(0, current.length - 1)
              if (cur_key[0] === "\"" && cur_key[cur_key.length - 1] === "\"") {
                cur_key = cur_key.substring(1, cur_key.length - 1)
              }
              current = ""
            }
            if (!quotes && cur[i] === "," && depth === 0) {
              output[cur_key] = this.generateAST({ CODE: current.trim() })[0]
              current = ""
            }
          }
  
          if (current !== "") {
            output[cur_key] = this.generateAST({ CODE: current.trim() })[0]
            current = ""
          }
          return { type: "obj", data: output }
        }
      } catch(e) {
        console.error(e)
        return { type: "unk", data: cur }
      }
    } else if (cur[0] === "\"" && cur[cur.length - 1] === "\"") {
      return { type: "str", data: cur }
    } else if (!isNaN(+cur)) {
      return { type: "num", data: cur }
    } else if (this.operators.indexOf(cur) !== -1) {
      return { type: "opr", data: cur }
    } else if (this.comparisons.indexOf(cur) !== -1) {
      return { type: "cmp", data: cur }
    } else if (cur === "?") {
      return { type: "qst", data: cur }
    } else if (this.logic.indexOf(cur) !== -1) {
      return { type: "log", data: cur }
    } else if (this.bitwise.indexOf(cur) !== -1) {
      return { type: "bit", data: cur }
    } else if (this.unary.indexOf(cur) !== -1) {
      return { type: "ury", data: cur }
    } else if (autoTokenise(cur, ".").length > 1) {
      let method = autoTokenise(cur, ".")

      method = method.map((input) => {
        return this.evalToken(input)
      })

      return { type: "mtd", data: method }
    } else if (cur.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/)) {
      return { type: "var", data: cur }
    } else if (cur.endsWith(")")) {
      return { type: "fnc", data: cur }
    } else if (cur.indexOf(" ") !== -1) {
      return this.generateAST({ CODE: cur })[0]
    } else {
      return { type: "unk", data: cur }
    }
  }

  generateAST({ CODE }) {
    CODE = CODE + "";

    let ast = []
    let tokens = autoTokenise(CODE, " ")
    for (let i = 0; i < tokens.length; i++) {
      const cur = tokens[i]
      ast.push(this.evalToken(cur))
    }

    const types = ["opr", "cmp", "qst", "bit", "log", "ury"];
    for (let type of types) {
      for (let i = 0; i < ast.length; i++) {
        const cur = ast[i];
        if (cur?.type === type) {
          if (type === "qst") {
            cur.left = ast[i - 1];
            cur.right = ast[i + 1];
            cur.right2 = ast[i + 2];
            ast.splice(i - 1, 1);
            ast.splice(i, 2);
            i -= 1;
            continue;
          } else if (type === "ury") {
            cur.right = ast[i + 1];
            ast.splice(i+1, 1);
            continue;
          }
          cur.left = ast[i - 1];
          cur.right = ast[i + 1];
          ast.splice(i - 1, 1);
          ast.splice(i, 1);
          i -= 1;
        }
      }
    }

    return ast
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
      if (letter === "(") {
        depth += 1;
      } else if (letter === ")") {
        depth -= 1;
      }
      out += letter;
      if (depth === 0) {
        break;
      }
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
      if (arg.startsWith('"') && arg.endsWith('"')) {
        return arg;
      } else if (!isNaN(arg)) {
        return Number(arg);
      } else if (arg.startsWith("[") && arg.endsWith("]")) {
        return JSON.parse(arg);
      } else {
        return arg;
      }
    });
    if (typeof mapargs == "object") {
      return JSON.stringify(mapargs);
    } else {
      return mapargs;
    }
  }

  tokenise({ CODE }) {
    CODE = Scratch.Cast.toString(CODE);
    return JSON.stringify(tokenise(CODE, " "));
  }

  tokeniseraw({ CODE }) {
    CODE = Scratch.Cast.toString(CODE);
    return autoTokenise(Scratch.Cast.toString(CODE));
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
    return JSON.stringify(compileCloseBrackets(JSON.parse(CODE)));
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

  handleJSONvars({ CODE, VARS }) {
    try {
      return JSON.stringify(
        parseJsonLikeString(CODE ?? "[]", VARS ?? {})
      );
    } catch (e) {
      return "[]";
    }
  }

  inlineCompile({ CODE }) {
    CODE = Scratch.Cast.toString(CODE);
    const regex = /def\(([^)]*)\) -> \(\n?/gm

    let regex_data = []
    let array1;
    let done = false
    while (!done) {
      while ((array1 = regex.exec(CODE)) !== null) {
        let depth = 1
        let i = regex.lastIndex
        for (i; depth != 0 && i < CODE.length; i++) {
          const cur = CODE[i]
          if (cur === "(") depth++
          else if (cur === ")") depth--
        }
        regex_data.push([array1[1], CODE.substring(regex.lastIndex, i - 1).trim(), CODE.slice(array1.index, i)])
      }
    
      for (let i = 0; i < regex_data.length; i++) {
        let name = "func_" + randomString(10)
        let cur = regex_data[i]
        CODE = `def "${name}(${cur[0]})"\n${cur[1]}\nendef\n` + CODE.replace(cur[2], name)
      }
    
      if (regex.exec(CODE) === null) {
        done = true
      }
    }
    return CODE;
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

Scratch.extensions.register(new OSLUtils());
})(Scratch);
