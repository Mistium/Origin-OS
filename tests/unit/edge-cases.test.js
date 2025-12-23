const helper = require('../helper.js');

const tests = [
  
  helper.createTest(
    'empty function body',
    `def emptyFunc() number (
      // Empty body
    )`,
    { expectErrors: ['Function \'emptyFunc\' missing return statement'] } // OSL requires return statements
  ),
  
  helper.createTest(
    'function with no return statement',
    `def test() number (
      number x = 5
      log x
    )`,
    { expectErrors: ['Function \'test\' missing return statement'] } // OSL requires return statements for typed functions
  ),
  
  helper.createTest(
    'recursive function call',
    `def factorial(number n) number (
      if n <= 1 (
        return 1
      ) else (
        return n * factorial(n - 1)
      )
    )
    log factorial(5)`,
    { expectNoErrors: true }
  ),
  
  helper.createTest(
    'division by zero constant',
    `def test() number (
      return 10 / 0
    )`,
    { expectNoErrors: true }
  ),
  
  helper.createTest(
    'accessing property on null',
    `def test() null (
      null obj = null
      return obj.property
    )`,
    { expectNoErrors: true }
  ),
  
  helper.createTest(
    'array index out of bounds',
    `def test() number (
      array arr = [1, 2, 3]
      return arr[10]
    )`,
    { expectNoErrors: true }
  ),
  
  helper.createTest(
    'mixed type arithmetic is allowed',
    `def test() string (
      string text = "hello"
      number num = 42
      boolean flag = true
      return text + num + flag
    )`,
    { expectNoErrors: true }
  ),
  
  helper.createTest(
    'shadowed variable in nested scope',
    `def test() number (
      number x = 5
      if true (
        string x = "shadowed"
        log x
      )
      return x
    )`,
    { expectErrors: ['Return type mismatch'] }
  ),
  
  helper.createTest(
    'very deeply nested function call',
    `def level1() number (
      return level2()
    )
    def level2() number (
      return level3()
    )
    def level3() number (
      return 42
    )
    log level1()`,
    { expectNoErrors: true }
  ),

  helper.createTest(
    'empty grouping parentheses should error',
    `def test() number (
      number x = ()
      return 0
    )
    test()`,
    {
      expectNoErrors: true,
      customAssert: (h) => {
        const ast = h.generateAST(`def test() number (
          number x = ()
          return 0
        )
        test()`);

        const findThrowLine = (node) => {
          if (Array.isArray(node)) {
            for (const item of node) {
              const found = findThrowLine(item);
              if (found) return found;
            }
            if (node[0]?.type === 'var' && node[0]?.data === 'throw') return node;
          } else if (node && typeof node === 'object') {
            for (const value of Object.values(node)) {
              const found = findThrowLine(value);
              if (found) return found;
            }
          }
          return null;
        };

        const throwLine = findThrowLine(ast);
        assert.true(!!throwLine, 'Expected parser to generate a throw line for empty parentheses');
        const msg = String(throwLine?.[2]?.data ?? '');
        assert.true(msg.includes('Empty parentheses'), `Expected parse error message to mention empty parentheses, got: ${msg}`);
      }
    }
  ),

  helper.createTest(
    'function call with whitespace-only argument list should not crash',
    `def id(number x) number (
      return x
    )
    def test() number (
      return id( )
    )
    test()`,
    { expectNoErrors: true }
  ),

  helper.createTest(
    'template string with empty interpolation should not crash',
    `def test() string (
      string s = \`hi \${} there\`
      return s
    )
    test()`,
    { expectNoErrors: true }
  ),

  helper.createTest(
    'template string with whitespace interpolation should not crash',
    `def test() string (
      string s = \`hi \${   } there\`
      return s
    )
    test()`,
    { expectNoErrors: true }
  )
];

module.exports = { tests };
