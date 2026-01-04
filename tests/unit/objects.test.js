const helper = require('../helper.js');

const tests = [
  helper.createTest(
    'object property access with correct types',
    `def test() string (
      object person = { name: "Alice", age: 30 }
      return person.name
    )
    test()`,
    { expectNoErrors: true }
  ),

  helper.createTest(
    'object property access with wrong type should fail',
      `def test() number (
        object person = { name: "Alice", age: 30 }
        return person.name
      )
      test()`,
      { expectErrors: ['Type mismatch'] }
  ),

  helper.createTest(
    'object with nested objects',
    `def test() string (
      object company = { name: "TechCorp", ceo: { name: "Bob", age: 45 } }
      return company.ceo.name
    )
    test()`,
    { expectNoErrors: true }
  ),

  helper.createTest(
    'object property access with dynamic keys',
    `def test(string key) string (
      object data = { a: "Value A", b: "Value B" }
      return data[key]
    )
    test("a")`,
    { expectNoErrors: true }
  ),

  helper.createTest(
    'object type return mismatch',
    `def test() array (
      object data = { a: [1, 2], b: [3, 4] }
      return data
    )
    test()`,
    { expectErrors: ['Type mismatch'] }
  ),

  helper.createTest(
    'empty object return mismatch',
    `def test() array (
      return {}
    )
    test()`,
    { expectErrors: ['Type mismatch'] }
  ),

  helper.createTest(
    'object literal with trailing comma',
    `def test() number (
      object o = { a: 1, }
      return o.a
    )
    test()`,
    { expectNoErrors: true }
  ),

  helper.createTest(
    'object shorthand property initializer',
    `def test() string (
      string a = "x"
      object o = {a}
      return o.a
    )
    test()`,
    { expectNoErrors: true }
  ),

  helper.createTest(
    'object literal property access in return statement (valid)',
    `def test() number (
      return { a: 1, b: 2 }.a
    )
    test()`,
    { expectNoErrors: true }
  ),

  helper.createTest(
    'object literal property access in return statement (type mismatch)',
    `def test() number (
      return { a: "a", b: "b" }.a
    )
    test()`,
    { expectErrors: ['Type mismatch'] }
  ),
  helper.createTest(
    'object property lambda called with wrong argument type should fail',
    `def test() number (
      object o = { getValue: def(number x) number (
        return x * 2
      ) }
      return o.getValue("wrong")
    )
    test()`,
    { expectErrors: ['Type mismatch'] }
  ),
  helper.createTest(
    'object property lambda with correct types allowed',
    `def test() number (
      object o = { getValue: def(number x) number (
        return x * 2
      ) }
      return o.getValue(5)
    )
    test()`,
    { expectNoErrors: true }
  ),
]

module.exports = { tests }