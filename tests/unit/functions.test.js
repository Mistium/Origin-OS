const helper = require('../helper.js');

const tests = [
  helper.createTest(
    'function with no argument types',
    `def add(a, b) number (
      return a + b
    )
    log add()`,
    { expectNoErrors: true }
  ),

  helper.createTest(
    'simple function with correct return type',
    `def add(number a, number b) number (
      return a + b
    )
    log add(1, 2)`,
    { expectNoErrors: true }
  ),
  
  helper.createTest(
    'function with wrong return type should fail',
    `def add(number a, number b) number (
      return "hello"
    )
    log add(1, 2)`,
    { expectErrors: ['Return type mismatch'] }
  ),
  
  helper.createTest(
    'function missing return statement',
    `def add(number a, number b) number (
      local number x = a + b
    )
    log add(1, 2)`,
    { expectErrors: ['missing return'] }
  ),
  
  helper.createTest(
    'function with correct argument types',
    `def greet(string name, number age) string (
      return "Hello " + name
    )
    log greet("Alice", 25)`,
    { expectNoErrors: true }
  ),
  
  helper.createTest(
    'function call with wrong argument type',
    `def add(number a, number b) number (
      return a + b
    )
    log add(1, "hi")`,
    { expectErrors: ['Type mismatch'] }
  ),
  
  helper.createTest(
    'nested function calls with type conversion',
    `def double(number x) number (
      return x * 2
    )
    def stringify(string s) string (
      return s
    )
    log stringify(double("not_number"))`,
    { expectErrors: ['Type mismatch'] }
  ),
  
  helper.createTest(
    'recursive function with wrong argument types',
    `def factorial(number n) number (
      if n <= 1 (
        return 1
      ) else (
        return n * factorial("not_number")
      )
    )
    log factorial(5)`,
    { expectErrors: ['Type mismatch'] }
  ),

  helper.createTest(
    'function parameter used with wrong type in log',
    `def lol(number x) any (
      return "hi"
    )
    lol("no")`,
    { expectErrors: ['Type mismatch'] }
  ),

  helper.createTest(
    'function parameter null',
    `def add(number input) number (
      return number + 1
    )
    add(null)`,
    { expectErrors: ['Type mismatch'] }
  ),

  helper.createTest(
    'function parameter variable array',
    `def add(number input) number (
      return number + 1
    )
    local val = []
    add(val)`,
    { expectErrors: ['Type mismatch'] }
  ),
  
  helper.createTest(
    'function parameter used with wrong type in local assignment',
    `def process(string text) string (
      number length = text
      return "done"
    )`,
    { expectErrors: ['Type mismatch assigning to length'] }
  ),
  
  helper.createTest(
    'function returning wrong type in assignment',
    `def getValue() string (
      return "text"
    )
    def test() any (
      number result = getValue()
      return result
    )`,
    { expectErrors: ['Type mismatch assigning to result: expected number got string'] }
  ),

  helper.createTest(
    'basic typed function',
    `def pick(number hi) object (
      return hi
    )
    pick(10)`,
    { expectErrors: ['Type mismatch returning from function pick: expected object, got number'] }
  ),

  helper.createTest(
      'unary keyword typeof',
      `def test() string (
        return typeof(123)
      )
      test()`,
      { expectNoErrors: true }
    ),
  helper.createTest(
    'higher-order function accepts compatible lambda',
    `def apply(function fn, number value) number (
      return fn(value)
    )
    def test() number (
      return apply((number x) -> (
        return x * 3
      ), 7)
    )`,
    { expectNoErrors: true }
  ),
  helper.createTest(
    'higher-order function with incompatible lambda param should fail',
    `def apply(function fn, number value) number (
      return fn(value)
    )
    def test() number (
      return apply((string s) -> (
        return s
      ), 7)
    )`,
    { expectErrors: ['Type mismatch'] }
  ),
];

module.exports = { tests };
