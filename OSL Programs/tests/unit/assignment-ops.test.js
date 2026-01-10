const helper = require('../helper.js');

const tests = [
  helper.createTest(
    '+= number',
    `
      x = 10
      x += 5
      log x
    `,
    { expect: [15] }
  ),

  helper.createTest(
    '+= string (space join)',
    `
      msg = "hello"
      msg += "world"
      log msg
    `,
    { expect: ['hello world'] }
  ),

  helper.createTest(
    '-= number',
    `
      x = 10
      x -= 3
      log x
    `,
    { expect: [7] }
  ),

  helper.createTest(
    '*= number',
    `
      x = 4
      x *= 5
      log x
    `,
    { expect: [20] }
  ),

  helper.createTest(
    '/= number',
    `
      x = 20
      x /= 4
      log x
    `,
    { expect: [5] }
  ),

  helper.createTest(
    '%= number',
    `
      x = 10
      x %= 3
      log x
    `,
    { expect: [1] }
  ),

  helper.createTest(
    '^= number',
    `
      x = 5
      x ^= 3
      log x
    `,
    { expect: [125] }
  ),

  helper.createTest(
    '++= concatenate',
    `
      text = "hello"
      text ++= "world"
      log text
    `,
    { expect: ['helloworld'] }
  ),

  helper.createTest(
    'Increment operator (++)',
    `
      x = 0
      x ++
      x ++
      log x
    `,
    { expect: [2] }
  ),

  helper.createTest(
    'Decrement operator (--)',
    `
      x = 5
      x --
      x --
      log x
    `,
    { expect: [3] }
  ),

  helper.createTest(
    'Increment inside expression',
    `
      x = 1
      x ++
      log x + 1
    `,
    { expect: [3] }
  ),

  helper.createTest(
    'Nullish coalescence assigns when undefined',
    `
      value ??= 10
      log value
    `,
    { expect: [10] }
  ),

  helper.createTest(
    'Nullish coalescence does not overwrite existing',
    `
      value = 5
      value ??= 10
      log value
    `,
    { expect: [5] }
  ),

  helper.createTest(
    'Nullish coalescence with null',
    `
      value = null
      value ??= 7
      log value
    `,
    { expect: [7] }
  ),

  helper.createTest(
    'Compound operators chain',
    `
      x = 2
      x *= 5
      x += 3
      x --
      log x
    `,
    { expect: [12] }
  )
];

module.exports = { tests };
