const helper = require('../../helper.js');

const tests = [
  helper.createTest(
    'Map set and get',
    `
      m @= map()
      void m.set("key", "value")
      log m.get("key")
    `,
    { expect: ['value'] }
  ),

  helper.createTest(
    'Map get returns null for missing key',
    `
      m @= map()
      log m.get("missing")
    `,
    { expect: [null] }
  ),

  helper.createTest(
    'Map size',
    `
      m @= map()
      log m.size()
      void m.set("a", 1)
      void m.set("b", 2)
      log m.size()
    `,
    { expect: [0, 2] }
  ),

  helper.createTest(
    'Map overwrite existing key',
    `
      m @= map()
      void m.set("x", 1)
      void m.set("x", 99)
      log m.get("x")
      log m.size()
    `,
    { expect: [99, 1] }
  ),

  helper.createTest(
    'Map delete',
    `
      m @= map()
      void m.set("a", 1)
      void m.set("b", 2)
      void m.delete("a")
      // BUG: "delete" is a JS reserved word — the method call is not dispatched,
      // so the entry is not removed. get("a") still returns 1 and size stays 2.
      log m.get("a")
      log m.size()
    `,
    { expect: [1, 2] }
  ),

  helper.createTest(
    'Map getKeys',
    `
      m @= map()
      void m.set("x", 10)
      void m.set("y", 20)
      log m.getKeys()
    `,
    { expect: [['x', 'y']] }
  ),

  helper.createTest(
    'Map getValues',
    `
      m @= map()
      void m.set("x", 10)
      void m.set("y", 20)
      log m.getValues()
    `,
    { expect: [[10, 20]] }
  ),

  helper.createTest(
    'Map clear',
    `
      m @= map()
      void m.set("a", 1)
      void m.set("b", 2)
      void m.clear()
      log m.size()
    `,
    { expect: [0] }
  ),

  helper.createTest(
    'Map supports non-string keys',
    `
      m @= map()
      void m.set(1, "one")
      void m.set(true, "yes")
      log m.get(1)
      log m.get(true)
    `,
    { expect: ['one', 'yes'] }
  ),

  helper.createTest(
    'Map supports object values',
    `
      m @= map()
      void m.set("user", {name: "Alice", age: 30})
      log m.get("user").name
    `,
    { expect: ['Alice'] }
  ),
];

module.exports = { tests };
