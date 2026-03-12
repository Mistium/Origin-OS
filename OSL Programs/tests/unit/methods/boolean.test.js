const helper = require('../../helper.js');

const tests = [
  // --- Type-prototype boolean methods ---

  helper.createTest(
    'Boolean prototype method',
    `
      Boolean.isTrue = def() -> (
        return self == true
      )
      log true.isTrue()
      log false.isTrue()
    `,
    { expect: [true, false] }
  ),
];

module.exports = { tests };
