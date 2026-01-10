const helper = require('../helper.js');

const tests = [
  helper.createTest(
    'Basic nullish coalescing (??)',
    `
      username = null
      defaultName = "Guest"
      displayName = username ?? defaultName
      log displayName

      username = "Alice"
      displayName = username ?? defaultName
      log displayName
    `,
    { expect: ["Guest", "Alice"] }
  ),

  helper.createTest(
    'Nullish coalescing preserves falsy values',
    `
      score = 0
      defaultScore = 100

      finalScore = score ?? defaultScore
      log finalScore

      finalScoreOr = score or defaultScore
      log finalScoreOr
    `,
    { expect: [0, 100] }
  ),

  helper.createTest(
    'Nullish coalescing with object properties',
    `
      user = { name: "Alice", age: 30 }
      bio = user.bio ?? "No bio available"
      log bio
    `,
    { expect: ["No bio available"] }
  ),

  helper.createTest(
    'Chained nullish coalescing',
    `
      primary = null
      backup = null
      defaultVal = 42

      value = primary ?? backup ?? defaultVal
      log value
    `,
    { expect: [42] }
  ),

  helper.createTest(
    'Nullish assignment (??=)',
    `
      variable = null
      variable ??= 10
      log variable

      variable2 = 5
      variable2 ??= 20
      log variable2
    `,
    { expect: [10, 5] }
  )
];

module.exports = { tests };
