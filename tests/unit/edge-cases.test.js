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
  )
];

module.exports = { tests };
