const helper = require('../helper.js');

const tests = [
  helper.createTest(
    'Basic symbol creation',
    `
      id1 = symbol()
      id2 = symbol()
      log id1 !== id2
    `,
    { expect: [true] }
  ),

  helper.createTest(
    'Using symbol as object key',
    `
      private_data = symbol()
      userobj = { name: "Alice", age: 25 }
      userobj[private_data] = "Sensitive information"
      log userobj[private_data]
    `,
    { expect: ["Sensitive information"] }
  ),

  helper.createTest(
    'Symbol property not in getKeys()',
    `
      private_data = symbol()
      user = { name: "Alice", age: 25 }
      user[private_data] = "Hidden info"
      keys = []
      each key user.getKeys() (
        keys = keys + key
      )
      log keys
    `,
    { expect: [["name", "age"]] }
  ),

  helper.createTest(
    'Symbols remain immutable',
    `
      sym = symbol()
      oldSym = sym
      sym = symbol()
      log oldSym !== sym
    `,
    { expect: [true] }
  )
];

module.exports = { tests };
