const helper = require('../helper.js');

const tests = [
  helper.createTest(
    'String concat method',
    `
      msg = "hello "
      log msg.concat("world")
    `,
    { expect: ['hello world'] }
  ),

  helper.createTest(
    'Math method',
    `
      log 0.sin()
    `,
    { expect: [0] }
  )
];

module.exports = { tests };
