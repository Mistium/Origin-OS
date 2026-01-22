const helper = require('../helper.js');

const tests = [
    helper.createTest(
      'If/Else statement',
      `x = 5
      if x > 3 (
        log "greater"
      ) else (
        log "less or equal"
      )`,
      { expect: ["greater"] }
    ),

    helper.createTest(
      'While loop',
      `x = 0
      while x < 3 (
        log x
        x += 1
      )`,
      { expect: [0,1,2] }
    ),

    helper.createTest(
      'For loop',
      `for i 3 (
        log i
      )`,
      { expect: [1,2,3] }
    ),

    helper.createTest(
      'Loop statement',
      `i = 0
      loop 3 (
        log i
        i += 1
      )`,
      { expect: [0,1,2] }
    ),

    helper.createTest(
      'Switch case basic',
      `val = 2
      switch val (
        case 1
          log "one"
          break
        case 2
          log "two"
          break
        default
          log "other"
          break
      )`,
      { expect: ["two"] }
    ),
    helper.createTest(
      'Switch case default',
      `val = 5
      switch val (
        case 1
          log "one"
          break
        case 2
          log "two"
          break
        default
          log "other"
          break
      )`,
      { expect: ["other"] }
    ),
    helper.createTest(
      'Switch case multiple',
      `val = 1
       loop 3 (
         switch val (
           case 1
             log "one"
             break
           case 2
             log "two"
             break
           default
             log "other"
             break
         )
         val ++
       )
      `,
      { expect: ["one","two","other"] }
    ),
    helper.createTest(
      'Switch case is case sensitive',
      `val = "One"
       switch val (
         case "one"
           log "one"
           break
         case "One"
           log "One"
           break
         default
           log "other"
           break
       )
      `,
      { expect: ["One"] }
    )
];

module.exports = { tests };