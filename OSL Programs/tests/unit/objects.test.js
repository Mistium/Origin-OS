const helper = require('../helper.js');

const tests = [
  helper.createTest(
    'Object property short hand',
    `
      val = 10
      obj = {
        key: "value",
        val
      }
      log obj.key
      log obj.val
    `,
    { expect: ['value', 10] }
  ),

  helper.createTest(
    'Object property assignment',
    `
    obj = {}
    obj.name = "Origin"
    obj.version = 1.0
    log obj.name
    log obj.version
    `,
    { expect: ['Origin', 1.0] }
  ),
];

module.exports = { tests };