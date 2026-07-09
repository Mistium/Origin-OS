const helper = require('../helper.js');

// These tests pin the AST shapes that originOS's OSL->JS compiler
// (origin-fractch: osl/compiler.fractch) depends on. If the tokeniser
// changes any of these contracts, the compiler's emitted code will
// silently mis-scope variables or fall back to the interpreter.
// Added 2026-07-09 while fixing compiled-scope bugs:
//  - `def name(...)` desugars to `name = function(...)`, so def-functions
//    must land wherever a plain untyped `=` lands (globals at top level).
//  - `local x` desugars to a `this.x` rmt write, which the interpreter
//    maps to a local scope slot via getThisIdx (runtime.fractch:2406).
//  - typed declarations keep set_type on a var-left asi; the interpreter
//    sends them to globals at top level (scope depth <= 1) and to locals
//    inside functions (depth > 1).
//  - nested statements keep [cmd, ...inputs] arrays so a compiler can
//    derive cmd.inputs from the statement slice at any nesting depth.

function firstStmt(code) {
  return helper.generateAST(code)[0];
}

const tests = [
  helper.createTest(
    'def statement desugars to `name = function(params, blk)`',
    'noop = 1',
    {
      customAssert: () => {
        const stmt = firstStmt('def cc(number x, number y) (\n  return x + y\n)');
        const tok = stmt[0];
        if (tok.type !== 'asi' || tok.data !== '=') throw new Error(`expected asi "=", got ${tok.type}:${tok.data}`);
        if (!tok.left || tok.left.type !== 'var' || tok.left.data !== 'cc') throw new Error('expected left to be var "cc"');
        if (!tok.right || tok.right.type !== 'fnc' || tok.right.data !== 'function') throw new Error('expected right to be fnc "function"');
        const params = tok.right.parameters || [];
        if (!params.some(p => p && p.type === 'blk')) throw new Error('expected a blk parameter carrying the body');
      }
    }
  ),

  helper.createTest(
    'inline arrow `def() -> (...)` is the function() builtin with a blk param',
    'noop = 1',
    {
      customAssert: () => {
        const stmt = firstStmt('fn @= def() -> (\n  return 1\n)');
        const tok = stmt[0];
        if (tok.type !== 'asi') throw new Error(`expected asi, got ${tok.type}`);
        if (!tok.right || tok.right.type !== 'fnc' || tok.right.data !== 'function') throw new Error('expected right to be fnc "function"');
      }
    }
  ),

  helper.createTest(
    '`local x @= v` desugars to an rmt write through `this`',
    'noop = 1',
    {
      customAssert: () => {
        const stmt = firstStmt('local fn @= def() -> (\n  return 1\n)');
        const tok = stmt[0];
        if (tok.type !== 'asi' || tok.data !== '@=') throw new Error(`expected asi "@=", got ${tok.type}:${tok.data}`);
        if (!tok.left || tok.left.type !== 'rmt') throw new Error(`expected rmt left, got ${tok.left && tok.left.type}`);
        const path = tok.left.objPath || [];
        if (!path[0] || path[0].data !== 'this') throw new Error('expected objPath to start at `this`');
        if (!tok.left.final || tok.left.final.data !== 'fn') throw new Error('expected final var "fn"');
      }
    }
  ),

  helper.createTest(
    'typed declaration keeps set_type on a var-left asi',
    'noop = 1',
    {
      customAssert: () => {
        const tok = firstStmt('number tv = 13')[0];
        if (tok.type !== 'asi') throw new Error(`expected asi, got ${tok.type}`);
        if (tok.set_type !== 'number') throw new Error(`expected set_type "number", got ${tok.set_type}`);
        if (!tok.left || tok.left.type !== 'var' || tok.left.data !== 'tv') throw new Error('expected left var "tv"');
      }
    }
  ),

  helper.createTest(
    'nested if statements keep [cmd, cond, blk, else, blk] statement arrays',
    'noop = 1',
    {
      customAssert: () => {
        const stmt = firstStmt('if a == 1 (\n  if b == 2 (\n    r = 1\n  )\n) else (\n  r = 2\n)');
        const kinds = stmt.map(t => t.type + (typeof t.data === 'string' ? ':' + t.data : ''));
        if (stmt[0].type !== 'cmd' || stmt[0].data !== 'if') throw new Error(`outer stmt should start with cmd:if, got ${kinds.join('|')}`);
        if (stmt[3] === undefined || stmt[3].data !== 'else') throw new Error(`expected else at index 3, got ${kinds.join('|')}`);
        const thenBlk = stmt[2];
        if (thenBlk.type !== 'blk' || !Array.isArray(thenBlk.data)) throw new Error('expected then-blk with statement array');
        const inner = thenBlk.data[0];
        if (!Array.isArray(inner) || inner[0].type !== 'cmd' || inner[0].data !== 'if') throw new Error('expected nested statement array starting with cmd:if');
        if (inner.length < 3) throw new Error('nested if statement should carry its cond and blk in the same array (used to derive cmd.inputs)');
      }
    }
  ),

  helper.createTest(
    'ternary condition and branches survive tokenisation',
    'noop = 1',
    {
      customAssert: () => {
        const stmt = firstStmt('x = random(1,2) == 1 ? "a" ""');
        const tok = stmt[0];
        if (!tok.right || tok.right.type !== 'qst') throw new Error(`expected qst right, got ${tok.right && tok.right.type}`);
        if (!tok.right.left || !tok.right.right || tok.right.right2 === undefined) throw new Error('qst should carry left/right/right2');
      }
    }
  )
];

module.exports = { tests };
