const helper = require('../helper.js');

const tests = [
  // --- Arithmetic ---

  helper.createTest(
    'Addition',
    `log 5 + 3`,
    { expect: [8] }
  ),

  helper.createTest(
    'Subtraction',
    `log 10 - 4`,
    { expect: [6] }
  ),

  helper.createTest(
    'Multiplication',
    `log 6 * 7`,
    { expect: [42] }
  ),

  helper.createTest(
    'Division',
    `log 20 / 4`,
    { expect: [5] }
  ),

  helper.createTest(
    'Modulo',
    `log 10 % 3`,
    { expect: [1] }
  ),

  helper.createTest(
    'Power',
    `log 2 ^ 8`,
    { expect: [256] }
  ),

  helper.createTest(
    'Left-to-right operator order (no PEMDAS)',
    `log 10 + 5 / 3`,
    { expect: [5] }
  ),

  helper.createTest(
    'Parentheses override evaluation order',
    `log 10 + (4 / 2)`,
    { expect: [12] }
  ),

  // --- Unary ---

  helper.createTest(
    'Unary negation',
    `
      log -5
      x = 3
      log -x
    `,
    { expect: [-5, -3] }
  ),

  helper.createTest(
    'Bitwise NOT',
    `log ~5`,
    { expect: [~5] }
  ),

  helper.createTest(
    'Logical NOT',
    `
      log !true
      log !false
      log !null
    `,
    { expect: [false, true, false] }
  ),

  // --- Comparison ---

  helper.createTest(
    'Equality operators',
    `
      log 5 == 5
      log "hello" == "Hello"
      log "world" === "world"
      log "hello" === "Hello"
      log "10" === 10
    `,
    { expect: [true, true, true, false, false] }
  ),

  helper.createTest(
    'Inequality operators',
    `
      log 10 != 5
      log 10 !== 5
    `,
    { expect: [true, true] }
  ),

  helper.createTest(
    'Greater / less than',
    `
      log 10 > 5
      log 5 > 10
      log 10 >= 10
      log 10 < 5
      log 5 < 10
      log 5 <= 5
    `,
    { expect: [true, false, true, false, true, true] }
  ),

  helper.createTest(
    'Inverted relational operators',
    `
      log 10 !> 5
      log 10 !< 5
    `,
    { expect: [false, true] }
  ),

  // --- Logical ---

  helper.createTest(
    'and operator',
    `
      log true and true
      log true and false
      log false and false
    `,
    { expect: [true, false, false] }
  ),

  helper.createTest(
    'or operator',
    `
      log true or false
      log false or false
      log 0 or 5
    `,
    { expect: [true, false, 5] }
  ),

  helper.createTest(
    'Logical operators with parentheses',
    `
      a = 5
      b = 10
      log (a < b) and (b == 10)
      log (a > b) or (b == 10)
    `,
    { expect: [true, true] }
  ),

  // --- Ternary ---

  helper.createTest(
    'Ternary operator',
    `
      x = 10
      log x == 10 ? "yes" "no"
      log x > 20 ? "big" "small"
      log x == 10 ? "yes" : "no"
    `,
    { expect: ['yes', 'small', 'yes'] }
  ),
];

module.exports = { tests };
