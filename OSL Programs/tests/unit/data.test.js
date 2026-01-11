const helper = require('../helper.js');

const tests = [
  helper.createTest(
    'Simple array creation',
    `
      arr = [1, 2, 3]
      log arr[1]
      log arr[3]
    `,
    { expect: [1, 3] }
  ),

  helper.createTest(
    'Arrays are 1-indexed',
    `
      arr = ["a", "b", "c"]
      log arr[0]
      log arr[1]
    `,
    { expect: [null, "a"] }
  ),

  helper.createTest(
    'Array with computed values',
    `
      base = 10
      arr = [base * 1, base * 2, base * 3]
      log arr[2]
    `,
    { expect: [20] }
  ),

  helper.createTest(
    'Mixed type array',
    `
      arr = [1, "text", true, {x: 10}]
      log arr[2]
      log arr[4].x
    `,
    { expect: ["text", 10] }
  ),

  helper.createTest(
    'Array expressions with ++ and math',
    `
      vals = [1 + 1, "pre" ++ "fix", 10 * 2]
      log vals[1]
      log vals[2]
      log vals[3]
    `,
    { expect: [2, "prefix", 20] }
  ),

  helper.createTest(
    'Simple object creation',
    `
      person = { name: "John", age: 30 }
      log person.name
      log person.age
    `,
    { expect: ["John", 30] }
  ),

  helper.createTest(
    'Object with computed values',
    `
      numbers = {
        num1: 0.5 * 2,
        num2: 1 * 2,
        num3: 1.5 * 2
      }
      log numbers.num1
      log numbers.num3
    `,
    { expect: [1, 3] }
  ),

  helper.createTest(
    'Object method using self',
    `
      multiplier = 2
      product = {
        price: 10,
        discount: 0.2,
        final: def() -> (
          return self.price * (1 - self.discount) * multiplier
        )
      }
      log product.final()
    `,
    { expect: [16] }
  ),

  helper.createTest(
    'Objects can contain arrays and objects',
    `
      obj = {
        list: [1, 2, 3],
        nested: { value: 42 }
      }
      log obj.list[2]
      log obj.nested.value
    `,
    { expect: [2, 42] }
  )
];

module.exports = { tests };
