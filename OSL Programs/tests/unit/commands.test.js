const helper = require('../helper.js');

const tests = [
  helper.createTest(
    'Basic custom command',
    `
      def "say_hi" (
        log "hi"
      )

      say_hi
    `,
    { expect: ['hi'] }
  ),

  helper.createTest(
    'Custom command with one input',
    `
      def "echo" "msg" (
        log msg
      )

      echo "hello"
    `,
    { expect: ['hello'] }
  ),

  helper.createTest(
    'Custom command with multiple inputs',
    `
      def "repeat" "count, word" (
        loop count (
          log word
        )
      )

      repeat 3 "hey"
    `,
    { expect: ['hey', 'hey', 'hey'] }
  ),

  helper.createTest(
    'Custom command can be called multiple times',
    `
      def "ping" (
        log "pong"
      )

      ping
      ping
    `,
    { expect: ['pong', 'pong'] }
  ),

  helper.createTest(
    'Custom command uses variables',
    `
      times = 2

      def "speak" "word" (
        loop times (
          log word
        )
      )

      speak "hello"
    `,
    { expect: ['hello', 'hello'] }
  ),

  helper.createTest(
    'Custom command with local variables',
    `
      def "counter" (
        local x = 0
        x ++
        log x
      )

      counter
      counter
    `,
    { expect: [1, 1] }
  ),

  helper.createTest(
    'Custom command modifies global variable',
    `
      total = 0

      def "add" "n" (
        total += n
      )

      add 5
      add 3
      log total
    `,
    { expect: [8] }
  ),

  helper.createTest(
    'Custom command inside loop',
    `
      def "hello" (
        log "hi"
      )

      loop 3 (
        hello
      )
    `,
    { expect: ['hi', 'hi', 'hi'] }
  ),

  helper.createTest(
    'Custom command calling another command',
    `
      def "inner" (
        log "inside"
      )

      def "outer" (
        inner
      )

      outer
    `,
    { expect: ['inside'] }
  ),

  helper.createTest(
    'Command inputs support expressions',
    `
      def "show" "x" (
        log x
      )

      show 1 + 2
    `,
    { expect: [3] }
  ),

  helper.createTest(
    'Command input strings preserve spaces',
    `
      def "say" "text" (
        log text
      )

      say "hello world from osl"
    `,
    { expect: ['hello world from osl'] }
  )
];

module.exports = { tests };
