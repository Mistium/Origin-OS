const helper = require('../helper.js');

const tests = [
  helper.createTest(
    'Bitwise AND',
    `
      log 101 & 100
      log 15 & 7
    `,
    { expect: [100, 7] }
  ),

  helper.createTest(
    'Bitwise OR',
    `
      log 101 | 100
      log 12 | 5
    `,
    { expect: [101, 13] }
  ),

  helper.createTest(
    'Bitwise XOR',
    `
      log 5 ^^ 3
      log 12 ^^ 5
      a = 5
      b = 3
      a = a ^^ b
      b = a ^^ b
      a = a ^^ b
      log a
      log b
    `,
    { expect: [6, 9, 3, 5] }
  ),

  helper.createTest(
    'Bitwise Left Shift',
    `
      log 5 << 1
      log 3 << 2
      num = 4
      log num << 1
      log num << 2
      log num << 3
    `,
    { expect: [10, 12, 8, 16, 32] }
  ),

  helper.createTest(
    'Bitwise Right Shift',
    `
      log 8 >> 1
      log 12 >> 2
      num = 16
      log num >> 1
      log num >> 2
      log num >> 3
    `,
    { expect: [4, 3, 8, 4, 2] }
  )
];

module.exports = { tests };
