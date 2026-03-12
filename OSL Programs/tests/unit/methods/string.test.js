const helper = require('../../helper.js');

const tests = [
  // --- Built-in string methods ---

  helper.createTest(
    'String concat method',
    `
      msg = "hello "
      log msg.concat("world")
    `,
    { expect: ['hello world'] }
  ),

  helper.createTest(
    'String append method',
    `
      log "hello".append("world")
      log "hello".append(" ", "world")
    `,
    { expect: ['helloworld', 'hello world'] }
  ),

  helper.createTest(
    'String prepend method',
    `
      log "world".prepend("hello ")
    `,
    { expect: ['hello world'] }
  ),

  helper.createTest(
    'String index method',
    `
      msg = "hello"
      log msg.index("l")
      log msg.index("z")
    `,
    { expect: [3, 0] }
  ),

  helper.createTest(
    'String lastIndex method',
    `
      log "abcabc".lastIndex("a")
      log "abcabc".lastIndex("c")
      log "abcabc".lastIndex("z")
    `,
    { expect: [4, 6, 0] }
  ),

  helper.createTest(
    'String contains is case-insensitive',
    `
      log "Hello World".contains("hello")
      log "Hello World".contains("WORLD")
      log "Hello World".contains("xyz")
    `,
    { expect: [true, true, false] }
  ),

  helper.createTest(
    'String contains with non-string parameter',
    `
      str = "hello 42 true"
      log str.contains(42)
      log str.contains(true)
      log str.contains(null)
    `,
    { expect: [true, true, false] }
  ),

  helper.createTest(
    'String stripStart and stripEnd methods',
    `
      string text = "hello world"
      log text.stripStart("hello ")
      log text.stripEnd(" world")
      log text.stripStart("wow")
      log text.stripEnd("wow")
      log text.stripStart("")
      log text.stripEnd("")
    `,
    { expect: ['world', 'hello', 'hello world', 'hello world', 'hello world', 'hello world'] }
  ),

  helper.createTest(
    'String padStart and padEnd methods',
    `
      string text = "hello"
      log text.padStart("!", 10)
      log text.padEnd("!", 10)
      log text.padStart("!", 3)
      log text.padEnd("!", 3)
    `,
    { expect: ['!!!!!hello', 'hello!!!!!', 'hello', 'hello'] }
  ),

  helper.createTest(
    'String count method',
    `
      string text = "hello world"
      log text.count("hello")
      log text.count("world")
      log text.count("o")
      log text.count("")
    `,
    { expect: [1, 1, 2, 0] }
  ),

  helper.createTest(
    'String toUpper and toLower',
    `
      log "Hello World".toUpper()
      log "Hello World".toLower()
    `,
    { expect: ['HELLO WORLD', 'hello world'] }
  ),

  helper.createTest(
    'String toTitle',
    `log "hello world".toTitle()`,
    { expect: ['Hello World'] }
  ),

  helper.createTest(
    'String reverse',
    `log "hello".reverse()`,
    { expect: ['olleh'] }
  ),

  helper.createTest(
    'String startsWith and endsWith',
    `
      str = "hello world"
      log str.startsWith("hello")
      log str.startsWith("world")
      log str.endsWith("world")
      log str.endsWith("hello")
    `,
    { expect: [true, false, true, false] }
  ),

  helper.createTest(
    'String replace and replaceFirst',
    `
      log "aabbaa".replace("a", "x")
      log "aabbaa".replaceFirst("a", "x")
    `,
    { expect: ['xxbbxx', 'xabbaa'] }
  ),

  helper.createTest(
    'String split',
    `
      log "a,b,c".split(",")
      log "hello world".split(" ")
    `,
    { expect: [['a','b','c'], ['hello','world']] }
  ),

  helper.createTest(
    'String ord',
    `
      log "A".ord()
      log "a".ord()
      log " ".ord()
    `,
    { expect: [65, 97, 32] }
  ),

  helper.createTest(
    'String left and right',
    `
      log "hello".left(3)
      log "hello".right(3)
    `,
    { expect: ['hel', 'llo'] }
  ),

  helper.createTest(
    'String insert',
    `log "helo".insert(3, "l")`,
    { expect: ['hello'] }
  ),

  helper.createTest(
    'String atob and btoa',
    `
      encoded = "hello".btoa()
      log encoded
      log encoded.atob()
    `,
    { expect: ['aGVsbG8=', 'hello'] }
  ),

  // --- Type-prototype string methods ---

  helper.createTest(
    'String prototype method',
    `
      String.backwards = def() -> (
        local rev = ""
        local i = self.len
        loop self.len (
          rev ++= self[i]
          i --
        )
        return rev
      )
      log "hello".backwards()
    `,
    { expect: ['olleh'] }
  ),

  helper.createTest(
    'String prototype method using self in expression',
    `
      String.shout = def() -> (
        return self.toUpper() ++ "!"
      )
      log "hello".shout()
    `,
    { expect: ['HELLO!'] }
  ),
];

module.exports = { tests };
