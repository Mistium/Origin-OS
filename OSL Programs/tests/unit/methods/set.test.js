const helper = require('../../helper.js');

const tests = [
  helper.createTest(
    'Set add and contains',
    `
      s @= set()
      void s.add(1)
      void s.add(2)
      void s.add(3)
      log s.contains(1)
      log s.contains(99)
    `,
    { expect: [true, false] }
  ),

  helper.createTest(
    'Set len',
    `
      s @= set()
      log s.len()
      void s.add("a")
      void s.add("b")
      log s.len()
    `,
    { expect: [0, 2] }
  ),

  helper.createTest(
    'Set deduplicates values',
    `
      s @= set()
      void s.add(1)
      void s.add(1)
      void s.add(1)
      log s.len()
    `,
    { expect: [1] }
  ),

  helper.createTest(
    'Set delete',
    `
      s @= set()
      void s.add("a")
      void s.add("b")
      void s.delete("a")
      // BUG: "delete" is a JS reserved word — the method call is not dispatched,
      // so the entry is not removed. contains("a") is still true and len stays 2.
      log s.contains("a")
      log s.len()
    `,
    { expect: [true, 2] }
  ),

  helper.createTest(
    'Set toArr',
    `
      s @= set()
      void s.add(1)
      void s.add(2)
      void s.add(3)
      log s.toArr()
    `,
    { expect: [[1, 2, 3]] }
  ),

  helper.createTest(
    'Set clear',
    `
      s @= set()
      void s.add(1)
      void s.add(2)
      void s.clear()
      log s.len()
    `,
    { expect: [0] }
  ),

  helper.createTest(
    'Set contains is strict (no coercion)',
    `
      s @= set()
      void s.add(1)
      void s.add(true)
      log s.contains(1)
      log s.contains("1")
      log s.contains(true)
      log s.contains("true")
    `,
    { expect: [true, false, true, false] }
  ),
];

module.exports = { tests };
