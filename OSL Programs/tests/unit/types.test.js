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
    'getType method',
    `
      x = 10
      log x.getType()
    `,
    { expect: ['number'] }
  ),

  helper.createTest(
    'lengths of different types',
    `
      arr = [1,2,3]
      str = "hello"
      obj = {a:1, b:2}
      nullVal = null
      log arr.len
      log str.len
      log obj.len
      log nullVal.len
    `,
    { expect: [3, 5, 2, 0] }
  )
];

module.exports = { tests };
