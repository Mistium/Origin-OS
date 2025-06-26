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