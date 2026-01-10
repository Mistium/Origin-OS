const helper = require('../helper.js');

const tests = [
  helper.createTest(
    'Equality (==) case-insensitive',
    `
      log "hello" == "Hello"
      log "10" == 10
      log 5 == 5
    `,
    { expect: [true, true, true] }
  ),

  helper.createTest(
    'Equality (===) case-sensitive',
    `
      log "hello" === "Hello"
      log "world" === "world"
      log "10" === 10
    `,
    { expect: [false, true, false] }
  ),

  helper.createTest(
    'Greater than / Greater or equal',
    `
      log 10 > 5
      log "a" > "b"
      log 5 >= 5
      log 10 >= 5
    `,
    { expect: [true, false, true, true] }
  ),

  helper.createTest(
    'Less than / Less or equal',
    `
      log 10 < 5
      log "a" < "b"
      log 5 <= 5
      log 3 <= 5
    `,
    { expect: [false, true, true, true] }
  ),

  helper.createTest(
    'Contains / in operator',
    `
      log "1" in "1234"
      log "5" in "1234"
      log "abc" in "abcdef"
    `,
    { expect: [true, false, true] }
  ),

  helper.createTest(
    'Ternary operator',
    `
      age = 20
      status = age >= 18 ? "adult" "minor"
      score = 85
      result = score > 60 ? "pass" "fail"
      points = 50
      log status
      log result
      log "Points: " ++ (points > 100 ? "max" points)
    `,
    { expect: ["adult", "pass", "Points: 50"] }
  ),

  helper.createTest(
    'Inverting comparisons',
    `
      log 10 != 5
      log 10 !== 5
      log 10 !> 5
      log 10 !< 5
    `,
    { expect: [true, true, false, true] }
  )
];

module.exports = { tests };
