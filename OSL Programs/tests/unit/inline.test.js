const helper = require('../helper.js');

const tests = [
  helper.createTest(
    'Inline function basic usage',
    `
      add = def(x, y) -> (
        return x + y
      )

      log add(5, 3)
    `,
    { expect: [8] }
  ),

  helper.createTest(
    'Inline function stored in variable',
    `
      fn = def(a, b) -> (
        return a * b
      )

      log fn(4, 2)
    `,
    { expect: [8] }
  ),

  helper.createTest(
    'Inline function captures outer variable',
    `
      factor = 3

      mul = def(x) -> (
        return x * factor
      )

      log mul(5)
    `,
    { expect: [15] }
  ),

  helper.createTest(
    'Inline function passed as argument (map)',
    `
      arr = [1,2,3,4,5]

      result = arr.map(def(item) -> (
        return item * 2
      ))

      log result
    `,
    { expect: [[2,4,6,8,10]] }
  ),

  helper.createTest(
    'Inline function defined then passed',
    `
      arr = [1,2,3,4,5]

      func = def(item) -> (
        return item + 1
      )

      log arr.map(func)
    `,
    { expect: [[2,3,4,5,6]] }
  ),

  helper.createTest(
    'Inline function with multiple statements',
    `
      fn = def(x) -> (
        y = x * 2
        return y + 1
      )

      log fn(4)
    `,
    { expect: [9] }
  ),

  helper.createTest(
    'Inline function returns string',
    `
      greet = def(name) -> (
        return "Hello, " ++ name
      )

      log greet("Sophie")
    `,
    { expect: ['Hello, Sophie'] }
  ),

  helper.createTest(
    'Inline function inside expression',
    `
      log (def(x) -> (
        return x * x
      ))(5)
    `,
    { expect: [25] }
  ),

  helper.createTest(
    'Inline function used multiple times',
    `
      sq = def(x) -> (
        return x * x
      )

      log sq(2)
      log sq(3)
      log sq(4)
    `,
    { expect: [4, 9, 16] }
  ),

  helper.createTest(
    'Inline function returns array',
    `
      make = def(a, b) -> (
        return [a, b]
      )

      log make(1, 2)
    `,
    { expect: [[1, 2]] }
  ),

  helper.createTest(
    'Inline function returns null implicitly',
    `
      fn = def() -> (
      )

      log fn()
    `,
    { expect: [null] }
  ),

  helper.createTest(
    'Inline function cloned via assignment',
    `
      base = def(x) -> (
        return x + 10
      )

      copy = base

      log copy(5)
    `,
    { expect: [15] }
  )
];

module.exports = { tests };
