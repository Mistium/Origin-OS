const helper = require('../../helper.js');

const tests = [
  // --- Built-in object methods ---

  helper.createTest(
    'Object getKeys',
    `obj = {a:1, b:2}
    log obj.getKeys()`,
    { expect: [['a','b']] }
  ),

  helper.createTest(
    'Object getValues',
    `obj = {a:1, b:2}
    log obj.getValues()`,
    { expect: [[1,2]] }
  ),

  helper.createTest(
    'Object getEntries',
    `
      obj = {a:1, b:2}
      log obj.getEntries()
    `,
    { expect: [[['a',1],['b',2]]] }
  ),

  helper.createTest(
    'Object contains',
    `obj = {a:1, b:2}
    log obj.contains("a")
    log obj.contains("z")`,
    { expect: [true, false] }
  ),

  helper.createTest(
    'Object contains with non-string parameter',
    `
      obj = {1: "one", true: "yes"}
      log obj.contains(1)
      log obj.contains(true)
      log obj.contains(null)
    `,
    { expect: [true, true, false] }
  ),

  helper.createTest(
    'Object insert method',
    `
      obj = {a: 1}
      void obj.insert("b", 2)
      log obj.b
      log obj.getKeys()
    `,
    { expect: [2, ['a','b']] }
  ),

  // --- Type-prototype object methods ---

  helper.createTest(
    'Object prototype method',
    `
      Object.funny = def() -> (
        return "FUNNY"
      )
      log {}.funny()
    `,
    { expect: ['FUNNY'] }
  ),
];

module.exports = { tests };
