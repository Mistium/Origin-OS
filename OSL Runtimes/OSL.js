// OSL.js
// description: an osl compiler and runtime written in js
// its very limited rn and doesnt support much of what osl3 can do
// author: @mistium

class tokenise {
  tokeniseEscaped(CODE, DELIMITER) {
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
        out.push(depth);
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

  parseEscaped(str) {
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

  destr(t, e = '"') {
    if ("object" == typeof t || "symbol" == typeof t) return t;
    const n = t + "", r = e + "";
    if (n.startsWith(r) && n.endsWith(r)) {
      let t = n.substring(1, n.length - 1);
      return this.parseEscaped(t);
    }
    return t
  };

  autoTokenise(CODE, DELIMITER) {
    if (CODE.indexOf("\\") !== -1) {
      return this.tokeniseEscaped(CODE, DELIMITER ?? " ");
    } else if (CODE.indexOf('"') !== -1 || CODE.indexOf("[") !== -1 || CODE.indexOf("{") !== -1 || CODE.indexOf("(") !== -1) {
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
    } else {
      return CODE.split(DELIMITER ?? " ");
    }
  }
}

class ast {
  constructor(CODE) {
    this.tokeniser = new tokenise()
    this.operators = ["+", "++", "-", "*", "/", "//", "%", "??", "^", "b+", "b-", "b/", "b*", "b^"]
    this.comparisons = ["!=", "==", "!==", "===", ">", "<", "!>", "!<", ">=", "<=", "in", "notIn"]
    this.logic = ["and", "or", "nor", "xor", "xnor", "nand"]
    this.bitwise = ["|", "&", "<<", ">>", "^^"]
    return this.generateFullAST({ CODE });
  }

  generateFullAST({ CODE, MAIN = true }) {
    let line = 0;
    CODE = (MAIN ? `/@line ${++line}\n` : "") + CODE.replace(/("(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`|'(?:[^'\\]|\\.)*')|[,{\[]\s*\n\s*[}\]]?|\n\s*[}\.\]]|;|(?<=[)"\]}a-zA-Z\d])\[|(?<=[)\]])\(|\n/gm, (match) => {
      if (match === "\n") return MAIN ? `\n/@line ${++line}\n` : "\n";
      if (match === ";") return "\n";
      if (match === "(") return ".call(";
      if (match === "[") return ".[";
      if ([",", "{", "}", "[", "]"].includes(match.trim()[0])) { line++; return match }
      if (match.startsWith("\n")) { line++; return match.replace(/\n\s*\./, ".") };
      return match;
    });
    CODE = this.tokeniser.autoTokenise(CODE, "\n").map(line => {
      line = line.trim();
      if (line === "endef") return ")";
      if (line.startsWith("def ") && !(line.endsWith("(") || line.endsWith(")"))) return line + " (";
      return line;
    }).join("\n");

    let lines = this.tokeniser.tokeniseLines(CODE).map((line) => {
      line = line.trim();
      if (line.startsWith("//") || line === "") return null;
      return this.generateAST({ CODE: line, MAIN: true });
    });

    for (let i = 0; i < lines.length; i++) {
      const cur = lines[i]
      if (!cur) continue;
      const type = cur?.[0]?.type;
      const data = cur?.[0]?.data;
      if (type === "unk" && data === "/@line") {
        let next = lines[i + 1];
        lines.splice(i--, 1);
        if (!next?.[0]) continue;
        next[0].line = cur[1].data;
      }
      if (type === "cmd" && ["for", "each", "class"].includes(data)) {
        if (data === "each") {
          if (cur?.[4]?.type === "blk") {
            cur[2].type = "str";
            continue;
          }
          const id = "EACH_I_" + randomString(10);
          lines.splice(i, 0, [{ ...cur[0], type: "asi", data: "=", left: this.evalToken(id), right: this.evalToken("0") }]);
          cur[3].data.splice(0, 0, [{ ...cur[0], type: "asi", data: "++", left: this.evalToken(id) }])
        }
        cur[1].type = "str"
        i++
      }
    }

    return lines.filter((line) =>
      line !== null &&
      line?.[0]?.data !== "/@line"
    );
  }

  generateAST({ CODE, START, MAIN }) {
    CODE = CODE + "";
    const start = CODE.split("\n", 1)[0]
    // tokenise and handle lambda and inline funcs
    let ast = []
    let tokens = this.tokeniser.tokeniseLineOSL(CODE)
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
    const types = ["inl", "opr", "cmp", "qst", "bit", "log"];
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
        const params = (node?.left?.parameters || []).map(p => p.data).join(",");
        const right = node.right;
        if (typeof right.data === "string" && !right.data.trim().startsWith("(\n")) {
          right.data = `(\nreturn ${right.data}\n)`;
        }
        return {
          type: "fnc",
          data: "function",
          parameters: [
            {
              type: "str",
              data: params
            },
            this.generateAST({ CODE: right.data, START: 0 })[0]
          ]
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

    // method commands
    if (ast[0].type === "mtd" &&
      ast[0].data[1].type === "mtv" &&
      ast.length === 1 && MAIN
    ) {
      ast.unshift(ast[0].data[0], {
        type: "asi",
        data: "=??",
        source: start
      });
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
      ast[0].type === "var" &&
      ast.length === 2 &&
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
        if (cases.all.every(v => ["str", "num"].includes(v[0].type))) {
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
      !(String(token.data).startsWith("/*") && token.type === "unk")
    ))
  }

  evalToken(cur, param) {
    const out = this.stringToToken(cur, param)
    out.source = out.type === "blk" ? "[ast BLK]" : cur;
    return out
  }

  stringToToken(cur, param) {
    const tk = this.tokeniser;
    if ((cur[0] === "{" && cur[cur.length - 1] === "}") || (cur[0] === "[" && cur[cur.length - 1] === "]")) {
      try {
        if (cur[0] === "[") {
          if (cur == "[]") return { type: "arr", data: [] }

          let tokens = tk.autoTokenise(cur.substring(1, cur.length - 1), ",");
          for (let i = 0; i < tokens.length; i++) {
            tokens[i] = this.generateAST({ CODE: ("" + tokens[i]).trim(), START: 0 })[0];
          }

          if (param) return { type: "mtv", data: "item", parameters: tokens };
          return { type: "arr", data: tokens }
        } else if (cur[0] === "{") {
          if (cur == "{}") return { type: "obj", data: {} }

          let output = {};
          let tokens = tk.autoTokenise(cur.substring(1, cur.length - 1), ",")
            .filter((token) => token.trim() !== "");
          for (let token of tokens) {
            let [key, value] = tk.autoTokenise(token, ":");
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
    else if (cur[0] + cur[cur.length - 1] === '""') return { type: "str", data: tk.destr(cur) }
    else if (cur[0] + cur[cur.length - 1] === "''") return { type: "str", data: tk.destr(cur, "'") }
    else if (cur[0] + cur[cur.length - 1] === "``") {
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
    else if (this.comparisons.indexOf(cur) !== -1) return { type: "cmp", data: cur }
    else if (cur === "?") return { type: "qst", data: cur }
    else if (this.logic.indexOf(cur) !== -1) return { type: "log", data: cur }
    else if (this.bitwise.indexOf(cur) !== -1) return { type: "bit", data: cur }
    else if (tk.autoTokenise(cur, ".").length > 1) {
      let method = tk.autoTokenise(cur, ".")
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
    else if (cur.endsWith(")")) {
      let out = { type: param ? "mtv" : "fnc", data: cur.substring(0, cur.indexOf("(")), parameters: [] }
      if (cur.endsWith("()")) return out
      let method = tk.autoTokenise(cur.substring(cur.indexOf("(") + 1, cur.length - 1), ",")
      method = method.map(v => {
        const tkns = tk.autoTokenise(v.trim(), " ");
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
    else if (cur.endsWith("=")) return { type: "asi", data: cur }
    else return { type: "unk", data: cur }
  }
}

class oslContext {
  constructor(ast) {
    this.ast = ast;
  }

  run() {
    if (this.fn) return this.fn();
    return null;
  }

  compile(options) {
    const ast = this.ast;
    let out = `Object.clone=function(e){try{if(null===e)return null;if("object"==typeof e){if(Array.isArray(e))return e.map((e=>Object.clone(e)));if(e instanceof RegExp)return new RegExp(e);{let n={};for(let r in e)e.hasOwnProperty(r)&&(n[r]=Object.clone(e[r]));return n}}return e}catch{return JSON.parse(JSON.stringify(e))}};\n`;
    for (let i = 0; i < ast.length; i++) {
      out += this.compileLine(ast[i]);
    }
    this.fn = new Function('', out);
    switch (options.output) {
      case 'none': return null;
      case 'string': return out;
      case 'function': return this.fn;
      default: throw new Error(`Unknown output option: ${options.output}`)
    }
  }

  compileLine(line) {
    let val = [];
    for (let i = 0; i < line.length; i++) {
      val[i] = this.compileNode(line[i]);
    }
    if (typeof val[0] === 'string') return `${val[0]};\n`;
    switch (val[0].type) {
      case 'cmd': return `${this.compileCMD(val[0], val.slice(1))};\n`;
      default: throw new Error(`Unknown line starter type: ${val[0].type}`);
    }
  }

  compileNode(node) {
    const dat = node.data
    switch (node.type) {
      case 'cmd': return node;
      case 'asi': return this.compileASI(node);
      case 'fnc': return this.compileFNC(node);
      case 'mtd': return this.compileMTD(node);
      case 'opr': return this.compileOPR(node);
      case 'cmp': return this.compileCMP(node);
      case 'num': return +node.data;
      case 'var': return node.data;
      case 'str': return JSON.stringify(dat);
      case 'blk': {
        const lines = [];
        for (let i = 0; i < dat.length; i++)
          lines.push(this.compileLine(dat[i]));
        return `\n${lines.join('')}`;
      }
      default: throw new Error(`Unknown node type: ${node.type}`);
    }
  }

  compileCMD(node, params) {
    // compiles CMD nodes

    switch (node.data) {
      case 'log': return `console.log(${params.join(',')})`;
      case 'if': {
        if (params.length < 2) throw new Error("If command requires at least 2 parameters");
        let out = `if (${params[0]}) {${params[1]}}`;
        let i = 2;
        while (i < params.length) {
          if (params[i] === 'else' && params[i + 1] === 'if') {
            out += ` else if (${params[i + 2]}) {${params[i + 3]}}`;
            i += 4;
          } else if (params[i] === 'else') {
            out += ` else {${params[i + 1]}}`;
            break;
          } else break;
        }
        return out;
      }
      case 'loop': return `for (let _ = 0; _ < (${params[0]}); _++) {${params[1]}}`;
      case 'return': return `return ${params[0]}`;
      default: throw new Error(`Unknown CMD name: ${node.data}`);
    }
  }

  compileASI(node) {
    let left = '';
    if (node.left.type === 'mtd') {
      const mtd = node.left.data;
      if (mtd[0].type === 'var' && mtd[0].data === 'this') {
        left += 'var ';
        mtd.shift();
      }
    }
    left += this.compileNode(node.left);
    const right = this.compileNode(node.right);
    switch (node.data) {
      case '=': return `${left} = Object.clone(${right})`;
      case '@=': return `${left} = ${right}`;
    }
    return ''
  }

  compileFNC(node) {
    const params = [];
    for (let i = 0; i < node.parameters.length; i++)
      params.push(this.compileNode(node.parameters[i]));

    switch (node.data) {
      case 'function': return `(function(${JSON.parse(params[0])}) {${params[1]}})`;
      default: return `${node.data}(${params.join(',')})`;
    }
  }

  compileMTD(node) {
    const out = [];
    for (let i = 0; i < node.data.length; i++)
      out.push(this.compileNode(node.data[i]));
    return out.join('.');
  }

  compileOPR(node) {
    const left = this.compileNode(node.left);
    const right = this.compileNode(node.right);
    switch (node.data) {
      case '+': return `${left} + ${right}`;
      case '-': return `${left} - ${right}`;
      case '*': return `${left} * ${right}`;
      case '/': return `${left} / ${right}`;
      case '%': return `${left} % ${right}`;
      default: throw new Error(`Unknown OPR: ${node.data}`);
    }
  }

  compileCMP(node) {
    const left = this.compileNode(node.left);
    const right = this.compileNode(node.right);
    switch (node.data) {
      case '==': return `String(${left} ?? "").toLowerCase() == String(${right} ?? "").toLowerCase()`;
      case '===': return `${left} === ${right}`;
      case '!=': return `String(${left} ?? "").toLowerCase() != String(${right} ?? "").toLowerCase()`;
      case '!==': return `${left} !== ${right}`;
      case '>': return `${left} > ${right}`;
      case '<': return `${left} < ${right}`;
      case '>=': return `${left} >= ${right}`;
      case '<=': return `${left} <= ${right}`;
      default: throw new Error(`Unknown CMP: ${node.data}`);
    }
  }
}

context = new oslContext(new ast(`
input = 12
if input >= 18 (
  log "you are an adult"
) else if input >= 13 (
  log "you are a teenager" 
) else (
  log "you are a child" 
)

// the ast above is a representation of this script`));
context.compile({ output: 'none' })
context.run()
// 'you are a child'