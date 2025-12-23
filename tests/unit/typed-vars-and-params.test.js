const helper = require('../helper.js');

const tests = [
  helper.createTest(
    'typed object property: property type enforced on read',
    `object user = {name: "Bob"}
string user.name = "Charlie"
string x = user.name
number y = user.name`,
    { expectErrors: ['Type mismatch assigning to y: expected number got string'] }
  ),

  helper.createTest(
    'typed object property: typed assignment ok',
    `object user = {name: "Bob"}
string user.name = "Charlie"
string x = user.name`,
    { expectNoErrors: true }
  ),

  helper.createTest(
    'typed array: mixed element types rejected',
    `string[] a = ["x", "y"]
string[] b = ["x", 2]`,
    { expectErrors: ['Type mismatch assigning to b: expected string[] got array'] }
  ),

  helper.createTest(
    'typed parameters: argument type mismatch rejected',
    `add = def(number a, number b) -> (
  return a + b
)

number x = add(1, "2")`,
    { expectErrors: ["Type mismatch: argument 2 of 'add' expected number, got string"] }
  ),

  helper.createTest(
    'typed parameters: correct argument types allowed',
    `add = def(number a, number b) -> (
  return a + b
)

number x = add(1, 2)`,
    { expectNoErrors: true }
  ),
];

module.exports = { tests };
