const helper = require('../helper.js');

const tests = [
  helper.createTest(
    'custom method self refers to receiver',
    `string.echo = def() -> (
      return self
    )

    def test() string (
      return "hi".echo()
    )

    log test()`,
    { expectNoErrors: true }
  ),

  helper.createTest(
    'custom method self refers to receiver but with type conversion',
    `string.echo = def() -> (
      return self.toNum()
    )

    def test() string (
      return "hi".echo()
    )

    log test()`,
    { expectErrors: ['Type mismatch returning from function string.echo: expected number, got string'] }
  ),

  helper.createTest(
    'object literal self can reference properties',
    `def test() number (
      object calculator = {
        base: 100,
        tax: 0.2,
        total: self.base * (1 + self.tax)
      }
      return calculator.total
    )

    log test()`,
    { expectNoErrors: true }
  ),

  helper.createTest(
    'class method self can mutate instance properties',
    `class Counter (
      value = 0

      def inc(number n) number (
        self.value = value + n
        return value
      )
    )

    log Counter.inc(5)`,
    { expectNoErrors: true }
  ),

  helper.createTest(
    'class method self property read with typed return',
    `class Box (
      inner = "hello"

      def get() string (
        return self.inner
      )
    )

    log Box.get()`,
    { expectNoErrors: true }
  )
];

module.exports = { tests };
