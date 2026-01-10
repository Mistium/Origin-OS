const helper = require('../helper.js');

const tests = [
  helper.createTest(
   'Assignment (number)',
   `lol = 10
    log lol`,
    { expect: [10] }
  ),

  helper.createTest(
    'Assignment (string)',
    `lol = "hello world"
    log lol`,
    { expect: ['hello world'] }
  ),

  helper.createTest(
    'Assignment from variable',
    `
      a = 5
      b = a
      log b
    `,
    { expect: [5] }
  )
];

module.exports = { tests };
