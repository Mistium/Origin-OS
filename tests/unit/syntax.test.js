const helper = require('../helper.js');

function findFirst(node, predicate) {
  if (predicate(node)) return node;
  if (Array.isArray(node)) {
    for (const item of node) {
      const found = findFirst(item, predicate);
      if (found) return found;
    }
  } else if (node && typeof node === 'object') {
    for (const value of Object.values(node)) {
      const found = findFirst(value, predicate);
      if (found) return found;
    }
  }
  return null;
}

const tests = [
  helper.createTest(
    'switch string cases produce object mapping',
    `def pick(string x) string (
      switch x (
        case "A"
          return "gotA"
        case "b"
          return "gotB"
        default
          return "other"
      )
    )
    log pick("A")`,
    {
      expectNoErrors: true,
      customAssert: (h) => {
        const ast = h.generateAST(`def pick(string x) string (
          switch x (
            case "A"
              return "gotA"
            case "b"
              return "gotB"
            default
              return "other"
          )
        )`);

        const sw = findFirst(ast, n => Array.isArray(n) && n[0]?.type === 'cmd' && n[0]?.data === 'switch')?.[0];
        assert.true(!!sw, 'Expected to find switch command node');
        assert.equals(sw.cases?.type, 'object', 'Expected switch cases to be object-optimized for literal cases');
        assert.true(typeof sw.cases?.all?.a === 'number', 'Expected case "A" to map to key a');
        assert.true(typeof sw.cases?.all?.b === 'number', 'Expected case "b" to map to key b');
        assert.true(typeof sw.cases?.default === 'number', 'Expected default case index');
      }
    }
  ),

  helper.createTest(
    'switch non-literal case keeps array cases',
    `def pick(number x) number (
      switch x (
        case x
          return 1
        default
          return 0
      )
    )
    log pick(2)`,
    {
      expectNoErrors: true,
      customAssert: (h) => {
        const ast = h.generateAST(`def pick(number x) number (
          switch x (
            case x
              return 1
            default
              return 0
          )
        )`);

        const sw = findFirst(ast, n => Array.isArray(n) && n[0]?.type === 'cmd' && n[0]?.data === 'switch')?.[0];
        assert.true(!!sw, 'Expected to find switch command node');
        assert.equals(sw.cases?.type, 'array', 'Expected non-literal case to avoid object mapping');
        assert.true(Array.isArray(sw.cases?.all), 'Expected cases.all to be an array');
      }
    }
  ),

  helper.createTest(
    'ternary operator syntax',
    `def test() number (
      return 1 == 1 ? 10 20
    )
    test()`,
    { expectNoErrors: true }
  ),

  helper.createTest(
    'comparison operators set',
    `def test() boolean (
      return 1 != 2 and 1 == 1 and 1 !== 2 and 1 === 1 and 2 > 1 and 1 < 2 and 2 >= 2 and 1 <= 1
    )
    test()`,
    { expectNoErrors: true }
  ),

  helper.createTest(
    'comparison operators !> and !<',
    `def test() boolean (
      return 1 !> 2 and 2 !< 1
    )
    test()`,
    { expectNoErrors: true }
  ),

  helper.createTest(
    'comparison operator in',
    `def test() boolean (
      array xs = [1, 2, 3]
      return 2 in xs
    )
    test()`,
    { expectNoErrors: true }
  ),

  helper.createTest(
    'nullish coalescing operator ??',
    `def test() number (
      any x = null
      return x ?? 5
    )
    test()`,
    { expectNoErrors: true }
  ),

  helper.createTest(
    'operator to',
    `def test() array (
      return 1 to 2
    )
    test()`,
    { expectNoErrors: true }
  ),

  helper.createTest(
    'operator ++ (string concat)',
    `def test() string (
      return "a" ++ "b"
    )
    test()`,
    { expectNoErrors: true }
  ),

  helper.createTest(
    'bitwise operators',
    `def test() number (
      return (5 & 3) | 8
    )
    test()`,
    { expectNoErrors: true }
  ),

  helper.createTest(
    'bitwise shift operators',
    `def test() number (
      return (1 << 2) + (8 >> 1) + (8 >>> 1) + (8 <<< 1)
    )
    test()`,
    { expectNoErrors: true }
  ),

  helper.createTest(
    'bitwise operator ^^',
    `def test() number (
      return 5 ^^ 3
    )
    test()`,
    { expectNoErrors: true }
  ),

  helper.createTest(
    'logic keywords',
    `def test() boolean (
      return true and false or true
    )
    test()`,
    { expectNoErrors: true }
  ),

  helper.createTest(
    'logic keywords nand/xor/xnor/nor',
    `def test() boolean (
      return (true nand true) or (true xor false) or (true xnor true) or (false nor false)
    )
    test()`,
    { expectNoErrors: true }
  ),

  helper.createTest(
    'unary operators ! + -',
    `def test() number (
      boolean b = !false
      number x = -5
      number y = +5
      if b (
        return x + y
      ) else (
        return 0
      )
    )
    test()`,
    { expectNoErrors: true }
  ),

  helper.createTest(
    'postfix increment and decrement',
    `def test() number (
      number x = 1
      x++
      x--
      return x
    )
    test()`,
    { expectNoErrors: true }
  ),

  helper.createTest(
    'spread operator in array literal',
    `def test() array (
      array xs = [1, 2]
      array ys = [...xs, 3]
      return ys
    )
    test()`,
    { expectNoErrors: true }
  ),

  helper.createTest(
    'command modifiers syntax (: c#fff)',
    `def test() number (
      log 10 : c#fff
      return 0
    )
    test()`,
    { expectNoErrors: true }
  ),

  helper.createTest(
    'pipeline operator |>',
    `def test() string (
      function toStr = (number x) -> (
        return x.toStr()
      )
      return 10 |> toStr
    )
    test()`,
    { expectNoErrors: true }
  ),

  helper.createTest(
    'typed call-argument syntax (type value)',
    `def id(any x) any (
      return x
    )
    def test() any (
      return id(number 1)
    )
    test()`,
    { expectNoErrors: true }
  ),

  helper.createTest(
    'number literal underscores',
    `def test() number (
      return 1_000 + 2_000
    )
    test()`,
    { expectNoErrors: true }
  ),

  helper.createTest(
    'single-quoted string literal',
    `def test() string (
      return 'hello'
    )
    test()`,
    { expectNoErrors: true }
  ),

  helper.createTest(
    'template string with interpolation expression',
    `def test() string (
      string s = \`x=\${1 + 2}\`
      return s
    )
    test()`,
    { expectNoErrors: true }
  ),

  helper.createTest(
    'object computed key syntax',
    `def test() any (
      number k = 1
      object o = {(k): "v"}
      return o[k]
    )
    test()`,
    { expectNoErrors: true }
  ),

  helper.createTest(
    'semicolon acts as statement separator',
    `def test() number (
      number x = 1; return x
    )
    test()`,
    { expectNoErrors: true }
  ),
];

module.exports = { tests };
