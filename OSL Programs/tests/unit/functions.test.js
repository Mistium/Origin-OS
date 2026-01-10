const helper = require('../helper.js');

const tests = [
  helper.createTest(
    'Basic function return',
    `
      def add(a, b) (
        return a + b
      )

      log add(2, 3)
    `,
    { expect: [5] }
  ),

  helper.createTest(
    'Function with multiple calls',
    `
      def inc(x) (
        return x + 1
      )

      log inc(1)
      log inc(5)
    `,
    { expect: [2, 6] }
  ),

  helper.createTest(
    'Function does not leak locals',
    `
      def make() (
        local value = 42
        return value
      )

      log make()
    `,
    { expect: [42] }
  ),

  helper.createTest(
    'Function modifies global state',
    `
      total = 0

      def add(n) (
        total += n
        return total
      )

      log add(5)
      log add(3)
    `,
    { expect: [5, 8] }
  ),

  helper.createTest(
    'Function returning string',
    `
      def greet(name) (
        return "Hello, " ++ name
      )

      log greet("Alice")
    `,
    { expect: ['Hello, Alice'] }
  ),

  helper.createTest(
    'Function returning array',
    `
      def makeArray(a, b) (
        return [a, b]
      )

      log makeArray(1, 2)
    `,
    { expect: [[1, 2]] }
  ),

  helper.createTest(
    'Function returning object',
    `
      def makeUser(name, age) (
        return { name: name, age: age }
      )

      log makeUser("Bob", 30)
    `,
    { expect: [{ name: 'Bob', age: 30 }] }
  ),

  helper.createTest(
    'Function recursion',
    `
      def countdown(n) (
        if n == 0 (
          return 0
        )
        log n
        return countdown(n - 1)
      )

      countdown(3)
    `,
    { expect: [3, 2, 1] }
  ),

  helper.createTest(
    'Function stored as variable',
    `
      def myfunc() (
        return 10
      )

      log typeof(myfunc)
    `,
    { expect: ['function'] }
  ),

  helper.createTest(
    'Function cloning',
    `
      def original() (
        return 7
      )

      clone = original
      log clone()
    `,
    { expect: [7] }
  ),

  helper.createTest(
    'Function inside function',
    `
      def outer(x) (
        def inner(y) (
          return y * 2
        )
        return inner(x)
      )

      log outer(5)
    `,
    { expect: [10] }
  ),

  helper.createTest(
    'Function used in expression',
    `
      def square(x) (
        return x * x
      )

      log square(3) + 1
    `,
    { expect: [10] }
  ),

  helper.createTest(
    'Function returning null implicitly',
    `
      def nothing() (
      )

      log nothing()
    `,
    { expect: [null] }
  )
];

module.exports = { tests };
