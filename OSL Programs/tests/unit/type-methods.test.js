const helper = require('../helper.js');

const tests = [
  helper.createTest(
    'Object method',
    `
      Object.funny = def() -> (
        return "FUNNY"
      )
      log {}.funny()
    `,
    { expect: ['FUNNY'] }
  ),

  helper.createTest(
    'Array method',
    `
      Array.sum = def() -> (
        local total = 0
        for i self.len (
          total += self[i]
        )
        return total
      )
      log [1,2,3,4].sum()
    `,
    { expect: [10] }
  ),

  helper.createTest(
    'Number method',
    `
      Number.double = def() -> (
        return self * 2
      )
      log 5.double()
    `,
    { expect: [10] }
  ),

  helper.createTest(
    'Boolean method',
    `
      Boolean.isTrue = def() -> (
        return self == true
      )
      log true.isTrue()
      log false.isTrue()
    `,
    { expect: [true, false] }
  ),

  helper.createTest(
    'String method',
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
    'Method using self in expression',
    `
      String.shout = def() -> (
        return self.toUpper() ++ "!"
      )
      log "hello".shout()
    `,
    { expect: ['HELLO!'] }
  ),

  helper.createTest(
    'Array method map',
    `
      Array.double = def() -> (
        return self.map(x -> x * 2)
      )
      log [1,2,3].double()
    `,
    { expect: [[2,4,6]] }
  )
];

module.exports = { tests };
