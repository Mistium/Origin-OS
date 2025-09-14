const helper = require('../helper.js');

const tests = [
  helper.createTest(
    'valid number arithmetic',
    `def test() number (
      number a = 5
      number b = 3
      return a + b * 2
    )`,
    { expectNoErrors: true }
  ),
  
  helper.createTest(
    'string concatenation with plus operator',
    `def test() string (
      string a = "hello"
      string b = "world"
      return a + b
    )`,
    { expectNoErrors: true }
  ),
  
  helper.createTest(
    'mixed type addition - number and string',
    `def test() string (
      number a = 5
      string b = "test"
      return a + b
      // "5 test" - OSL joins with a space
    )`,
    { expectNoErrors: true }
  ),
  
  helper.createTest(
    'string concatenation with concat method',
    `def test() string (
      string a = "hello"
      string b = "world"
      return a ++ " " ++ b
      // "hello world"
    )`,
    { expectNoErrors: true }
  ),
  
  helper.createTest(
    'number subtraction',
    `def test() number (
      number result = 10 - 3
      return result
      // 7
    )`,
    { expectNoErrors: true }
  ),
  
  helper.createTest(
    'string subtraction - string replacement',
    `def test() string (
      string a = "hello world"
      string b = "world"
      return a - b
      // "hello "
    )`,
    { expectNoErrors: true }
  ),
  
  helper.createTest(
    'multiplication on numbers',
    `def test() number (
      number a = 4
      number b = 5
      return a * b
      // 20
    )`,
    { expectNoErrors: true }
  ),
  
  helper.createTest(
    'string and number multiplication',
    `def test() string (
      string a = "hi"
      number b = 3
      return a * b
      // "hihihi"
    )`,
    { expectNoErrors: true }
  ),
  
  helper.createTest(
    'division on numbers',
    `def test() number (
      number a = 15
      number b = 3
      return a / b
      // 5
    )`,
    { expectNoErrors: true }
  ), // division doesnt work on strings
  
  helper.createTest(
    'modulo operation',
    `def test() number (
      number remainder = 17 % 5
      return remainder
    )`,
    { expectNoErrors: true }
  ),
  
  helper.createTest(
    'compound assignment operators',
    `def test() number (
      number x = 10
      x += 5
      x -= 2
      x *= 3
      x /= 2
      return x
    )`,
    { expectNoErrors: true }
  ),
  
  helper.createTest(
    'compound assignment with strings',
    `def test() string (
      string x = "hello"
      x += " world"
      return x
    )`,
    { expectNoErrors: true }
  )
];

module.exports = { tests };
