const helper = require('../../helper.js');

const tests = [
  // --- Built-in object methods ---

  helper.createTest(
    'Object getKeys',
    `obj = {a:1, b:2}
    log obj.getKeys()`,
    { expect: [['a', 'b']] }
  ),

  helper.createTest(
    'Object getValues',
    `obj = {a:1, b:2}
    log obj.getValues()`,
    { expect: [[1, 2]] }
  ),

  helper.createTest(
    'Object getEntries',
    `
      obj = {a:1, b:2}
      log obj.getEntries()
    `,
    { expect: [[['a', 1], ['b', 2]]] }
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
    { expect: [2, ['a', 'b']] }
  ),

  helper.createTest(
    'Object omit',
    `
    obj = {a: 1, b: 2, c: 3}
    log obj.omit("a")
    log obj.omit("a", "c")
    `,
    { expect: [{ b: 2, c: 3 }, { b: 2 }] }
  ),

  helper.createTest(
    'Object pick',
    `
    obj = {a: 1, b: 2, c: 3}
    log obj.pick("a")
    log obj.pick("a", "c")
    `,
    { expect: [{ a: 1 }, { a: 1, c: 3 }] }
  ),

  helper.createTest(
    'Object flip',
    `
    obj = {a: 1, b: 2}
    log obj.flip()
    `,
    { expect: [{ 1: 'a', 2: 'b' }] }
  ),

  helper.createTest(
    'Object clone',
    `
    obj = {a: 1, b: 2}
    cloned = obj.clone()
    log cloned
    void cloned.insert("c", 3)
    log obj.getKeys()
    log cloned.getKeys()
    `,
    { expect: [{ a: 1, b: 2 }, ['a', 'b'], ['a', 'b', 'c']] }
  ),

  helper.createTest(
    'Object toMap',
    `
    obj = {a: 1, b: 2}
    m @= obj.toMap()
    log m.get("a")
    log m.get("b")
    `,
    { expect: [1, 2] }
  ),

  helper.createTest(
    'Object toStr',
    `
    obj = {a: 1, b: 2}
    log obj.toStr()
    `,
    { expect: ['{"a":1,"b":2}'] }
  ),

  helper.createTest(
    'Object JsonParse',
    `
    obj = '{"x": 10, "y": 20}'
    log obj.JsonParse()
    `,
    { expect: [{ x: 10, y: 20 }] }
  ),

  helper.createTest(
    'Object JsonFormat',
    `
    obj = {a: 1, b: 2}
    log obj.JsonFormat().contains("\\n")
    `,
    { expect: [true] }
  ),

  helper.createTest(
    'Object getProto returns null for plain object',
    `
    obj = {a: 1}
    log obj.getProto()
    `,
    { expect: [null] }
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
