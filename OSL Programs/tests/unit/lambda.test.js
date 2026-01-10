const helper = require('../helper.js');

const tests = [
  helper.createTest(
    'Basic lambda function',
    `
      add = (x, y) -> (x + y)
      log add(5, 3)
    `,
    { expect: [8] }
  ),

  helper.createTest(
    'Single-parameter lambda (no parentheses)',
    `
      square = x -> (x * x)
      log square(5)
    `,
    { expect: [25] }
  ),

  helper.createTest(
    'Lambda returning string',
    `
      greet = name -> ("Hello, " ++ name)
      log greet("Sophie")
    `,
    { expect: ['Hello, Sophie'] }
  ),

  helper.createTest(
    'Lambda assigned and reused',
    `
      mul = (a, b) -> (a * b)
      log mul(3, 4)
      log mul(5, 6)
    `,
    { expect: [12, 30] }
  ),

  helper.createTest(
    'Lambda inside expression',
    `
      log ((x, y) -> (x - y))(10, 4)
    `,
    { expect: [6] }
  ),

  helper.createTest(
    'Lambda used in array map',
    `
      arr = [1,2,3,4]
      log arr.map(x -> (x * 2))
    `,
    { expect: [[2,4,6,8]] }
  ),

  helper.createTest(
    'Lambda capturing outer variable',
    `
      factor = 3
      mul = x -> x * factor
      log mul(5)
    `,
    { expect: [15] }
  ),

  helper.createTest(
    'Lambda returning array',
    `
      pair = (a, b) -> ([a, b])
      log pair(1, 2)
    `,
    { expect: [[1, 2]] }
  ),

  helper.createTest(
    'Lambda returning null explicitly',
    `
      fn = x -> null
      log fn(10)
    `,
    { expect: [null] }
  ),

  helper.createTest(
    'Lambda used as argument to function',
    `
      apply = (fn, val) -> (fn(val))
      double = x -> (x * 2)
      log apply(double, 7)
    `,
    { expect: [14] }
  ),

  helper.createTest(
    'Lambda inside lambda',
    `
      outer = x -> (y -> (x + y))
      add5 = outer(5)
      log add5(3)
    `,
    { expect: [8] }
  )
];

module.exports = { tests };
