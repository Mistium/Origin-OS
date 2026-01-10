const helper = require('../helper.js');

const tests = [
  helper.createTest(
    'Spread operator',
    `
      arr = [1,2,3]
      log [...arr, 4, 5]
    `,
    { expect: [[1,2,3,4,5]] }
  ),

  helper.createTest(
    'Spread operator with nested arrays',
    `
      arr = [1,2,3]
      log [...arr, [4,5]]
    `,
    { expect: [[1,2,3,[4,5]]] }
  ),

  helper.createTest(
    'Spread operator with nested objects',
    `
      obj = { a: 1, b: 2 }
      log [...obj.getValues(), { c: 3 }]
    `,
    { expect: [[1,2,{ c: 3 }]] }
  ),

  helper.createTest(
    'Spread operator with nested objects and arrays',
    `
      obj = { a: 1, b: 2 }
      log [...obj.getValues(), [3,4], { c: 5 }]
    `,
    { expect: [[1,2,[3,4],{ c: 5 }]] }
  ),

  helper.createTest(
    'Spread operator with function',
    `
      arr = [1,2,3]
      log [...arr.map(x -> x * 2), 4, 5]
    `,
    { expect: [[2,4,6,4,5]] }
  )
];

module.exports = { tests };
