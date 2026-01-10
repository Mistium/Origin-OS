const helper = require('../helper.js');

const tests = [
  helper.createTest(
    'If statement (true)',
    `
      x = 10
      if x == 10 (
        log "yes"
      )
    `,
    { expect: ['yes'] }
  ),

  helper.createTest(
    'Loop statement',
    `
      loop 3 (
        log "hi"
      )
    `,
    { expect: ['hi', 'hi', 'hi'] }
  ),

  helper.createTest(
    'For loop',
    `
      for i 3 (
        log i
      )
    `,
    { expect: [1, 2, 3] }
  )
];

module.exports = { tests };
