const helper = require('../helper.js');

const tests = [
  helper.createTest(
    'for loop with correct type scoping',
    `def count() number (
      number total = 0
      for i 5 (
        total += i
      )
      return total
    )
    log count()`,
    { expectNoErrors: true }
  ),
  
  helper.createTest(
    'for loop with type mismatch in local variable',
    `def test() number (
      for i 5 (
        string counter = i
        log counter
      )
      return 0
    )`,
    { expectErrors: ['Type mismatch assigning to counter'] }
  ),
  
  helper.createTest(
    'while loop with accumulator',
    `def sumTo(number n) number (
      number i = 0
      number acc = 0
      while i < n (
        acc = acc + i
        i = i + 1
      )
      return acc
    )
    log sumTo(5)`,
    { expectNoErrors: true }
  ),
  
  helper.createTest(
    'while loop with type mismatch in local variable',
    `def test() number (
      number i = 0
      while i < 5 (
        string value = i * 2
        i = i + 1
      )
      return i
    )`,
    { expectErrors: ['Type mismatch assigning to value'] }
  ),
  
  helper.createTest(
    'each loop with correct types',
    `def count(number a) number (
      number acc = 0
      each i itm [1,2,3] (
        acc = acc + itm
      )
      return acc
    )
    log count(0)`,
    { expectNoErrors: true }
  ),
  
  helper.createTest(
    'each loop with type mismatch - string assigned from number array',
    `def test() number (
      each i item [1,2,3] (
        string num = item
        log num
      )
      return 0
    )`,
    { expectErrors: ['Type mismatch assigning to num'] }
  ),
  
  helper.createTest(
    'each loop with mixed array types',
    `def test() number (
      each i item [1,"hello",true] (
        log item
      )
      return 0
    )`,
    { expectNoErrors: true }
  ),
  
  helper.createTest(
    'nested loops with scoping',
    `def test() number (
      for i 3 (
        for j 3 (
          number sum = i + j
          log sum
        )
      )
      return 0
    )`,
    { expectNoErrors: true }
  ),
  
  helper.createTest(
    'nested loops with type errors',
    `def test() number (
      for i 3 (
        for j 3 (
          string sum = i + j
          log sum
        )
      )
      return 0
    )`,
    { expectErrors: ['Type mismatch assigning to sum'] }
  )
];

module.exports = { tests };
