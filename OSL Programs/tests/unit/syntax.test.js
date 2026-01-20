const helper = require('../helper.js');

const tests = [
  helper.createTest(
    'Unary operators',
    `
      // ! is equivalent to val == false
      log !true
      log !false
      log !null

      log -5
      log ~5
    `,
    { expect: [false, true, false, -5, ~5] }
  ),
];

module.exports = { tests };