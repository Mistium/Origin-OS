const helper = require('../helper.js');

const tests = [
  // --- If / else ---

  helper.createTest(
    'If true branch',
    `
      x = 5
      if x > 3 (
        log "greater"
      ) else (
        log "less or equal"
      )
    `,
    { expect: ['greater'] }
  ),

  helper.createTest(
    'If false branch (else)',
    `
      x = 2
      if x > 3 (
        log "greater"
      ) else (
        log "less or equal"
      )
    `,
    { expect: ['less or equal'] }
  ),

  helper.createTest(
    'Else-if chain',
    `
      grade = 85
      if grade >= 90 (
        log "A"
      ) else if grade >= 80 (
        log "B"
      ) else if grade >= 70 (
        log "C"
      ) else (
        log "F"
      )
    `,
    { expect: ['B'] }
  ),

  helper.createTest(
    'Nested if statements',
    `
      a = true
      b = true
      if a (
        if b (
          log "both"
        ) else (
          log "a only"
        )
      )
    `,
    { expect: ['both'] }
  ),

  // --- While loop ---

  helper.createTest(
    'While loop',
    `
      x = 0
      while x < 3 (
        log x
        x += 1
      )
    `,
    { expect: [0, 1, 2] }
  ),

  // --- For loop ---

  helper.createTest(
    'For loop',
    `
      for i 3 (
        log i
      )
    `,
    { expect: [1, 2, 3] }
  ),

  // --- Loop statement ---

  helper.createTest(
    'Loop statement',
    `
      i = 0
      loop 3 (
        log i
        i += 1
      )
    `,
    { expect: [0, 1, 2] }
  ),

  helper.createTest(
    'Nested loops',
    `
      for i 2 (
        for j 2 (
          log i ++ "-" ++ j
        )
      )
    `,
    { expect: ['1-1', '1-2', '2-1', '2-2'] }
  ),

  // --- Each loop ---

  helper.createTest(
    'Each loop over array (value only)',
    `
      each val [10, 20, 30] (
        log val
      )
    `,
    { expect: [10, 20, 30] }
  ),

  helper.createTest(
    'Each loop over array (index and value)',
    `
      each i val ["a", "b", "c"] (
        log i ++ ":" ++ val
      )
    `,
    { expect: ['1:a', '2:b', '3:c'] }
  ),

  helper.createTest(
    'Each loop over range',
    `
      result = []
      each value 1 to 5 (
        result.append(value)
      )
      log result
    `,
    { expect: [[1, 2, 3, 4, 5]] }
  ),

  // --- Switch ---

  helper.createTest(
    'Switch case basic',
    `
      val = 2
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
    `,
    { expect: ['two'] }
  ),

  helper.createTest(
    'Switch case default',
    `
      val = 5
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
    `,
    { expect: ['other'] }
  ),

  helper.createTest(
    'Switch iterating through all cases',
    `
      val = 1
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
    { expect: ['one', 'two', 'other'] }
  ),

  helper.createTest(
    'Switch is case sensitive',
    `
      val = "One"
      switch val (
        case "one"
          log "lower"
          break
        case "One"
          log "upper"
          break
        default
          log "other"
          break
      )
    `,
    { expect: ['upper'] }
  ),
];

module.exports = { tests };
