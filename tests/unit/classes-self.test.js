const helper = require('../helper.js');

const tests = [
  helper.createTest(
    'class method uses self to mutate property (docs-style)',
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
    'class method uses self property read (no crash)',
    `class Box (
      inner = "hi"

      def get() string (
        return self.inner
      )
    )
    log Box.get()`,
    { expectNoErrors: true }
  ),

  helper.createTest(
    'class method return type mismatch via self usage',
    `class Counter (
      value = 0

      def bad() number (
        // toStr() returns string, but the method declares number
        return self.value.toStr()
      )
    )
    log Counter.bad()`,
    { expectErrors: ['Return type mismatch'] }
  ),
];

module.exports = { tests };
