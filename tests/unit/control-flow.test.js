const helper = require('../helper.js');

const tests = [
  helper.createTest(
    'if statement with all branches returning correct types',
    `def pick(number a, number b) number (
      number c = a + b
      if a (
        return c
      ) else (
        return b + 0
      )
    )
    log pick(1, 2)`,
    { expectNoErrors: true }
  ),
  
  helper.createTest(
    'if statement missing else branch return',
    `def pick(number a, number b) number (
      if a (
        return a + b
      )
      // else branch does not return
    )
    log pick(1, 2)`,
    { expectErrors: ['missing return'] }
  ),
  
  helper.createTest(
    'nested if with wrong return type',
    `def pick(number a, number b) number (
      if a (
        if b (
          return a + b
        ) else (
          return "oops"
        )
      )
      else (
        return a + b
      )
    )
    log pick(1, 2)`,
    { expectErrors: ['Return type mismatch'] }
  ),
  
  helper.createTest(
    'chained if-else-if with final return',
    `def test(number a, number b) number (
      if a (
        return a
      ) else (
        if b (
          return b
        ) else (
          return a + b
        )
      )
    )
    log test(1, 2)`,
    { expectNoErrors: true }
  ),
  
  helper.createTest(
    'switch with all cases returning',
    `def pick(number x) number (
      switch x (
        case 0 
          return 0
        case 1 
          return 1
        case 2
          return 2
        default
          return 3
      )
    )
    log pick(2)`,
    { expectNoErrors: true }
  ),
  
  helper.createTest(
    'switch missing default case',
    `def pick(number x) number (
      switch x (
        case 0 
          return 0
        case 1 
          return 1
        case 2
          return 2
      )
    )
    log pick(2)`,
    { expectErrors: ['missing return'] }
  ),
  
  helper.createTest(
    'switch with local variable type errors',
    `def test(number choice) string (
      switch choice (
        case 1
          string result = 100
          return result
        case 2
          return "two"
        default
          return "default"
      )
    )`,
    { expectErrors: ['Type mismatch assigning to result'] }
  ),
  
  helper.createTest(
    'return statement outside function',
    'return 5',
    { expectErrors: ['Return statement outside of function'] }
  )
];

module.exports = { tests };
