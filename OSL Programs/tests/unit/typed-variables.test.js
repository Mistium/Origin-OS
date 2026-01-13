const helper = require('../helper.js');

const tests = [
  helper.createTest(
    'Typed string variable',
    `
      string name = "Alice"
      log name
    `,
    { expect: ['Alice'] }
  ),

  helper.createTest(
    'Typed number variable',
    `
      number age = 30
      log age
    `,
    { expect: [30] }
  ),

  helper.createTest(
    'Typed boolean variable',
    `
      boolean active = true
      log active
    `,
    { expect: [true] }
  ),

  helper.createTest(
    'Typed array variable',
    `
      array items = [1, 2, 3]
      log items
    `,
    { expect: [[1, 2, 3]] }
  ),

  helper.createTest(
    'Typed object variable',
    `
      object settings = { theme: "dark" }
      log settings.theme
    `,
    { expect: ['dark'] }
  ),

  helper.createTest(
    'Reassign typed variable (valid)',
    `
      number score = 10
      score = score + 5
      log score
    `,
    { expect: [15] }
  ),

  helper.createTest(
    'Typed object property',
    `
      user = {
        name: "Bob",
        age: 20
      }

      string user.name = "Charlie"
      number user.age = 25

      log user.name
      log user.age
    `,
    { expect: ['Charlie', 25] }
  ),

  helper.createTest(
    'any type allows reassignment',
    `
      any value = 10
      value = "hello"
      value = true
      log value
    `,
    { expect: [true] }
  ),

  helper.createTest(
    'Typed function argument (valid)',
    `
      def double(number x) (
        return x * 2
      )

      number value = 5
      log double(value)
    `,
    { expect: [10] }
  ),

  helper.createTest(
    'Type conversion: string to number',
    `
      string text = "42"
      number value = text.toNum()
      log value
    `,
    { expect: [42] }
  ),

  helper.createTest(
    'Type conversion: number to string',
    `
      number price = 19.99
      string label = price.toStr()
      log label
    `,
    { expect: ['19.99'] }
  ),

  helper.createTest(
    'Typed variable retains type after conversion',
    `
      number value = "10".toNum()
      value = value + 5
      log value
    `,
    { expect: [15] }
  ),

  helper.createTest(
    'Any typed variable functions like local variables',
    `
    def arrSum(arr) (
      any out = 0
      for i arr.len (
        out += arr[i]
      )
      return out
    )

    log arrsum([1,2,3,4,5])
    `,
    { expect: [15] }
  ),

  helper.createTest(
    'Any typed variable does affect local variables',
    `
    any lol = 10
    local lol = 20
    log lol
    `,
    { expect: [20] }
  ),
];

module.exports = { tests };
