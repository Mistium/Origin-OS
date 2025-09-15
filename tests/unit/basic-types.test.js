const helper = require('../helper.js');

const tests = [
  helper.createTest(
    'variable reassignment with wrong type',
    `def test() number (
      number x = 10
      x = 20
      return x
    )`,
    { expectNoErrors: true }
  ),
  
  helper.createTest(
    'variable reassignment with wrong type should fail',
    `def test() number (
      number count = 10
      count = "string"
      return count
    )`,
    { expectErrors: ['Type mismatch reassigning count: expected number, got string'] }
  ),
  
  helper.createTest(
    'variable redeclaration with new type should work',
    `def test() string (
      number count = 10
      string count = "string"
      return count
    )`,
    { expectNoErrors: true }
  ),
  
  helper.createTest(
    'number assignment to number variable',
    `number a = 5`,
    { expectNoErrors: true }
  ),
  
  helper.createTest(
    'string assignment to string variable',
    `string b = "hello"`,
    { expectNoErrors: true }
  ),
  
  helper.createTest(
    'boolean assignment to boolean variable',
    `boolean c = true`,
    { expectNoErrors: true }
  ),
  
  helper.createTest(
    'number assigned to string variable should fail',
    `string text = 123`,
    { expectErrors: ['Type mismatch assigning to text'] }
  ),
  
  helper.createTest(
    'string assigned to number variable should fail',
    `number value = "hello"`,
    { expectErrors: ['Type mismatch assigning to value'] }
  ),
  
  helper.createTest(
    'boolean assigned to string variable should fail',
    `string flag = true`,
    { expectErrors: ['Type mismatch assigning to flag'] }
  ),
  
  helper.createTest(
    'empty string assigned to number should fail',
    `number value = ""`,
    { expectErrors: ['Type mismatch assigning to value'] }
  ),
  
  helper.createTest(
    'zero assigned to string should fail',
    `string text = 0`,
    { expectErrors: ['Type mismatch assigning to text'] }
  ),
  
  helper.createTest(
    'multiple type mismatches in same block',
    `def test() (
      number a = "wrong"
      string b = 456
      number c = 789
      return c
    )`,
    { expectErrors: ['Type mismatch assigning to a', 'Type mismatch assigning to b'] }
  ),
  
  helper.createTest(
    'variable reassignment with wrong type',
    `def test() (
      number count = 10
      count = "string"
      return count
    )`,
    { expectErrors: ['Type mismatch reassigning count: expected number, got string'] }
  )
];

module.exports = { tests };
