const helper = require('../helper.js');

const assertDoesNotCompile = (h, code) => {
  const out = h.compileCode(code);
  assert.true(!!out && out.success === false, 'Expected BYSL compilation failure');
};

const tests = [
  helper.createTest(
    'custom method self refers to receiver (BYSL unsupported)',
    `string.echo = def() -> (
      return self
    )

    def test() string (
      return "hi".echo()
    )

    log test()`,
    {
      expectNoErrors: true,
      customAssert: (h) => assertDoesNotCompile(h, `string.echo = def() -> (
        return self
      )

      def test() string (
        return "hi".echo()
      )

      log test()`)
    }
  ),

  helper.createTest(
    'object literal self can reference properties (BYSL unsupported)',
    `def test() number (
      object calculator = {
        base: 100,
        tax: 0.2,
        total: self.base * (1 + self.tax)
      }
      return calculator.total
    )

    log test()`,
    {
      expectNoErrors: true,
      customAssert: (h) => assertDoesNotCompile(h, `def test() number (
        object calculator = {
          base: 100,
          tax: 0.2,
          total: self.base * (1 + self.tax)
        }
        return calculator.total
      )

      log test()`)
    }
  ),

  helper.createTest(
    'class method self can mutate instance properties (BYSL unsupported)',
    `class Counter (
      value = 0

      def inc(number n) number (
        self.value = value + n
        return value
      )
    )

    log Counter.inc(5)`,
    {
      expectNoErrors: true,
      customAssert: (h) => assertDoesNotCompile(h, `class Counter (
        value = 0

        def inc(number n) number (
          self.value = value + n
          return value
        )
      )

      log Counter.inc(5)`)
    }
  ),

  helper.createTest(
    'class method self property read with typed return (BYSL unsupported)',
    `class Box (
      inner = "hello"

      def get() string (
        return self.inner
      )
    )

    log Box.get()`,
    {
      expectNoErrors: true,
      customAssert: (h) => assertDoesNotCompile(h, `class Box (
        inner = "hello"

        def get() string (
          return self.inner
        )
      )

      log Box.get()`)
    }
  )
];

module.exports = { tests };
