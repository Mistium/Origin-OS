const helper = require('../helper.js');

const tests = [
  helper.createTest(
    'inline function with wrong return type should fail',
    `def test() number (
      function square = (number x) -> (
        return "not a number"
      )
      return square(5)
    )`,
    { expectErrors: ['Return type mismatch'] }
  ),

  helper.createTest(
    'inline function missing return statement should fail',
    `def test() number (
      function square = (number x) -> (
        local number y = x * x
      )
      return square(5)
    )`,
    { expectErrors: ['missing return'] }
  ),

  helper.createTest(
    'inline function with wrong parameter type should fail',
    `def test() number (
      function square = (number x) -> (
        return x * x
      )
      return square("not a number")
    )`,
    { expectErrors: ['Type mismatch: argument 1 of \'square\' expected number, got string'] }
  ),

  helper.createTest(
    'inline function with missing parameter type',
    `def test() number (
      function square = (x) -> (
        return x * x
      )
      return square(5)
    )`,
    { expectNoErrors: true }
  ),

  helper.createTest(
    'inline function with correct parameter types',
    `def test() number (
      function square = (number x) -> (
        return x * x
      )
      return square(5)
    )`,
    { expectNoErrors: true }
  ),
  
  helper.createTest(
    'inline function with mixed parameter types',
    `def test() number (
      function square = (string x) -> (
        return x * x
      )
      return square(5)
    )`,
    { expectErrors: ['Type mismatch: argument 1 of \'square\' expected string, got number'] }
  ),
  
  helper.createTest(
    'inline function with flexible return type',
    `def test() number (
      function toStr = (number x) -> (
        return x
      )
      return 0
    )`,
    { expectNoErrors: true }
  ),
  
  helper.createTest(
    'inline function stored in variable and called',
    `def test() string (
      function formatter = (string text, number num) -> (
        return text.concat(num.toStr())
      )
      return formatter("Count: ", 42)
    )`,
    { expectNoErrors: true }
  ),
  
  helper.createTest(
    'inline function passed as parameter',
    `def apply(function fn, number value) number (
      return fn(value)
    )
    def test() number (
      function double = (number x) -> (
        return x * 2
      )
      return apply(double, 10)
    )`,
    { expectNoErrors: true }
  ),
  
  helper.createTest(
    'nested inline function expressions',
    `def test() number (
      function outer = (number x) -> (
        function inner = (number y) -> (
          return x + y
        )
        return inner(5)
      )
      return outer(3)
    )`,
    { expectNoErrors: true }
  ),
  
  helper.createTest(
    'inline function with closure variable access',
    `def test() number (
      number multiplier = 3
      function multiply = (number x) -> (
        return x * multiplier
      )
      return multiply(4)
    )`,
    { expectNoErrors: true }
  ),
  
  helper.createTest(
    'inline function called with different argument type',
    `def test() number (
      function square = (number x) -> (
        return x * x
      )
      return square("not a number")
    )`,
    { expectErrors: ['Type mismatch: argument 1 of \'square\' expected number, got string'] }
  )
];

module.exports = { tests };
