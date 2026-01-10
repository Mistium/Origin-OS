const helper = require('../helper.js');

const tests = [
  helper.createTest(
    'String type',
    `
      msg = "hello world"
      log msg
    `,
    { expect: ['hello world'] }
  ),

  helper.createTest(
    'Boolean type (true)',
    `
      flag = true
      log flag
    `,
    { expect: [true] }
  ),

  helper.createTest(
    'Boolean type (false)',
    `
      flag = false
      log flag
    `,
    { expect: [false] }
  ),

  helper.createTest(
    'Number type (integer)',
    `
      x = 42
      log x
    `,
    { expect: [42] }
  ),

  helper.createTest(
    'Number type (decimal)',
    `
      x = 19.5
      log x
    `,
    { expect: [19.5] }
  ),

  helper.createTest(
    'Array type',
    `
      arr = [1, 2, 3]
      log arr
    `,
    { expect: [[1, 2, 3]] }
  ),

  helper.createTest(
    'Array mixed types',
    `
      arr = [1, "two", true]
      log arr
    `,
    { expect: [[1, 'two', true]] }
  ),

  helper.createTest(
    'Object type',
    `
      obj = {
        name: "John",
        age: 30
      }
      log obj
    `,
    { expect: [{ name: 'John', age: 30 }] }
  ),

  helper.createTest(
    'Nested object',
    `
      user = {
        info: {
          id: 123
        }
      }
      log user.info.id
    `,
    { expect: [123] }
  ),

  helper.createTest(
    'Null type',
    `
      value = null
      log value
    `,
    { expect: [null] }
  ),

  helper.createTest(
    'Empty string does not equal null',
    `
      log "" != null
    `,
    { expect: [true] }
  ),

  helper.createTest(
    'typeof string',
    `
      log typeof("hello")
    `,
    { expect: ['string'] }
  ),

  helper.createTest(
    'typeof number',
    `
      log typeof(42)
    `,
    { expect: ['number'] }
  ),

  helper.createTest(
    'typeof boolean',
    `
      log typeof(false)
    `,
    { expect: ['boolean'] }
  ),

  helper.createTest(
    'typeof array',
    `
      log typeof([1,2,3])
    `,
    { expect: ['array'] }
  ),

  helper.createTest(
    'typeof object',
    `
      log typeof({x: 1})
    `,
    { expect: ['object'] }
  ),

  helper.createTest(
    'typeof null',
    `
      log typeof(null)
    `,
    { expect: ['null'] }
  ),

  helper.createTest(
    'getType method',
    `
      x = 10
      log x.getType()
    `,
    { expect: ['number'] }
  )
];

module.exports = { tests };
