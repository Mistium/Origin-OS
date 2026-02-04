const helper = require('../helper.js');

const tests = [
  helper.createTest(
    'Local variable basic usage',
    `
      def test() (
        local x = 10
        log x
      )

      test()
    `,
    { expect: [10] }
  ),

  helper.createTest(
    'Local variable does not leak to global',
    `
      local x = "lol"

      def test() (
        local x = 10
      )

      test()
      log x
    `,
    { expect: ['lol'] }
  ),

  helper.createTest(
    'Local shadows global variable',
    `
      value = "global"

      def test() (
        local value = "local"
        log value
      )

      test()
      log value
    `,
    { expect: ['local', 'global'] }
  ),

  helper.createTest(
    'Local reassignment without keyword',
    `
      def test() (
        local count = 0
        count = count + 1
        count = count + 1
        log count
      )

      test()
    `,
    { expect: [2] }
  ),

  helper.createTest(
    'Local mutation with increment operator',
    `
      def test() (
        local v = 0
        v ++
        v ++
        log v
      )

      test()
    `,
    { expect: [2] }
  ),

  helper.createTest(
    'Local variables stored in this',
    `
      def test() (
        local key = "1234"
        log this
      )

      test()
    `,
    { expect: [ ["1234"] ] }
  ),

  helper.createTest(
    'this differs between calls',
    `
      def test() (
        local count = 0
        count ++
        log this.count
      )

      test()
      test()
    `,
    { expect: [1, 1] }
  ),

  helper.createTest(
    'Nested function has separate local scope',
    `
      def outer() (
        local x = 1

        def inner() (
          local x = 2
          log x
        )

        inner()
        log x
      )

      outer()
    `,
    { expect: [2, 1] }
  ),

  helper.createTest(
    'Local variables survive until function exit',
    `
      def test() (
        local x = 5
        x = x + 5
        log x
      )

      test()
    `,
    { expect: [10] }
  ),

  helper.createTest(
    'Global variable accessible if no local exists',
    `
      value = 42

      def test() (
        log value
      )

      test()
    `,
    { expect: [42] }
  ),

  helper.createTest(
    'Local does not affect global with same name',
    `
      hello = "world"

      def test() (
        local hello = "local"
        log hello
      )

      test()
      log hello
    `,
    { expect: ['local', 'world'] }
  )
];

module.exports = { tests };
