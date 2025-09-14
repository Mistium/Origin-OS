const helper = require('../helper.js');

const tests = [
  helper.createTest(
    'command with return statements',
    `def "hello_world" "param" (
      log param
      return
    )
    hello_world 10`,
    { expectNoErrors: true }
  ),

  helper.createTest(
    'command with typed params',
    `def "hello_world" "string param, number extra" (
      log param + extra
      return
    )
    hello_world "hello" 10`,
    { expectNoErrors: true }
  ),

  helper.createTest(
    'command with typed params',
    `def "hello_world" "string param, number extra" (
      log param + extra
      return
    )
    hello_world 10 10`,
    { expectErrors: ['Type mismatch'] }
  ),

  helper.createTest(
    'command with empty return statements',
    `def "hello_world" "param" (
      log param
      return
    )
    hello_world 10`,
    { expectNoErrors: true }
  ),

  helper.createTest(
    'command with return values',
    `def "hello_world" "param" (
      log param
      return 10
    )
    hello_world 10`,
    { expectErrors: ['Commands cannot return values'] }
  ),

  helper.createTest(
    'command with typed params',
    `def "hello_world" "string param" (
      log param
    )
    hello_world 10`,
    { expectErrors: ['Type mismatch'] }
  ),

  helper.createTest(
    'command with returns',
    `def "hello_world" "param" (
      if param (
        return "string"
      ) else (
        return 10
      )
    )
    hello_world 10`,
    { expectNoErrors: true }
  )

]

module.exports = { tests };