function tokenise(CODE) {
  try {
    let letter = 0;
    let depth = "";
    let brackets = 0;
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
      letter++;

      if (brackets === 0 && CODE[letter] === " ") {
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

function tokeniseEscaped(CODE) {
  try {
    let letter = 0;
    let depth = "";
    let brackets = 0;
    let out = [];
    let split = [];
    let escaped = false;
    const len = CODE.length;

    while (letter < len) {
      depth = CODE[letter];
      if (depth === '"' && !escaped) {
        brackets = 1 - brackets;
        out.push('"');
      } else if (depth === '\\') {
        escaped = !escaped;
        out.push("\\");
      } else {
        out.push(depth);
        escaped = false;
      }
      letter++;

      if (brackets === 0 && CODE[letter] === " ") {
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

function autoTokenise(CODE) {
  if (CODE.indexOf("\\") !== -1) {
    return tokeniseEscaped(CODE);
  } else if (CODE.indexOf('"') !== -1) {
    return tokenise(CODE);
  } else {
    return CODE.split(" ");
  }
}


class OSLComp {
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
              output.push(this.evalToken(current))
              current = ""
            }
          }
  
          if (current !== "") {
            output.push(this.evalToken(current))
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
              output[cur_key] = this.evalToken(current)
              current = ""
            }
          }
  
          if (current !== "") {
            output[cur_key] = this.evalToken(current)
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
    } else if (["+", "++", "-", "*", "/", "//", "%", "??", "", "^", "b+", "b-", "b/", "b*", "b^"].indexOf(cur) !== -1) {
      return { type: "opr", data: cur }
    } else if (["!=", "==", "!==", "===", ">", "<", "!>", "!<", ">=", "<=", "in", "notIn"].indexOf(cur) !== -1) {
      return { type: "cmp", data: cur }
    } else if (cur === "?") {
      return { type: "qst", data: cur }
    } else if (["and", "or", "nor", "xor", "xnor", "nand"].indexOf(cur) !== -1) {
      return { type: "log", data: cur }
    } else if (["|", "&", "<<", ">>", "^^"].indexOf(cur) !== -1) {
      return { type: "bit", data: cur }
    } else if (cur.indexOf(".") !== -1) {
      let method = cur.match(this.regex)
      for (let i = 0; i < method.length; i++) {
        method[i] = this.evalToken(method[i])
      }
      return { type: "mtd", data: method }
    } else if (cur.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/)) {
      return { type: "var", data: cur }
    } else if (cur.endsWith(")")) {
      return { type: "fnc", data: cur }
    } else {
      return { type: "unk", data: cur }
    }
  }

  generateAST({ CODE }) {
    CODE = CODE + "";

    let ast = []
    let tokens = autoTokenise(CODE)
    for (let i = 0; i < tokens.length; i++) {
      const cur = tokens[i]
      ast.push(this.evalToken(cur))
    }

    const types = ["opr", "cmp", "qst", "bit", "log"];
    for (let type of types) {
      for (let i = 2; i < ast.length; i++) {
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

}


let comp = new OSLComp()

console.log(JSON.stringify(comp.generateAST({ CODE: "wow = [\"hello world\",[\"arraw2\",var],val + 10,10] and {\"key\":value,obj:{obj2:var}}" }), null, 4))
