const helper = require('../helper.js');

const tests = [
  helper.createTest(
    'reassignment of string.toStr() (valid)',
    `def test() string (
      string.toStr = def() -> (
        return self
      )
      return "hello".toStr()
    )
    log test()`,
    { expectNoErrors: true }
  ),

  helper.createTest(
    'reassignment of string.toStr() (invalid return type)',
    `def test() string (
      string.toStr = def() -> (
        return 123
      )
      return "hello".toStr()
    )
    log test()`,
    { expectErrors: ['Return type mismatch'] }
  ),

  helper.createTest(
    'reassignment of string.toNum() (method returns number)',
    `def test() number (
      string.toNum = def() -> (
        return self.len
      )
      return "hello".toNum()
    )
    log test()`,
    { expectNoErrors: true }
  ),
]

module.exports = { tests };