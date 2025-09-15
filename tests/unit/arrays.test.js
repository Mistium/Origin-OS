const helper = require('../helper.js');

const tests = [
  helper.createTest(
    'arrays with consistent types',
    `def test() array (
      array numbers = [1, 2, 3, 4]
      array strings = ["a", "b", "c"]
      array booleans = [true, false, true]
      return numbers
    )`,
    { expectNoErrors: true }
  ),
  
  helper.createTest(
    'mixed type arrays',
    `def test() array (
      array mixed = [1, "hello", true, 3.14]
      return mixed
    )`,
    { expectNoErrors: true } // Mixed arrays should be allowed
  ),

  helper.createTest(
    'array item type enforcement',
    `def test() string (
      array numbers = [1, 2, 3]
      return numbers[1]
    )
    test()
    `,
    { expectErrors: ['Type mismatch'] }
  ),

  helper.createTest(
    'array with expressions',
    `def test() array (
      array arr = [1 + 2, 3 * 4, 5 - 1]
      return arr
    )`,
    { expectNoErrors: true }
  ),

  helper.createTest(
    'nested arrays',
    `def test() array (
      array nested = [[1, 2], [3, 4], [5, 6]]
      return nested[0][1]
    )`,
    { expectNoErrors: true }
  ),
  
  helper.createTest(
    'array indexing with correct types',
    `def test() number (
      array arr = [10, 20, 30]
      number index = 1
      return arr[index]
    )`,
    { expectNoErrors: true }
  ),
  
  helper.createTest(
    'array methods - append',
    `def test() array (
      array arr = [1, 2, 3]
      void arr.append(4)
      return arr
    )`,
    { expectNoErrors: true }
  ),
  
  helper.createTest(
    'array methods - pop',
    `def test() array (
      array arr = [1, 2, 3]
      number popped = arr.pop()
      return popped
    )`,
    { expectNoErrors: true }
  ),
  
  helper.createTest(
    'array methods - len property',
    `def test() number (
      array arr = [1, 2, 3, 4, 5]
      return arr.len
    )`,
    { expectNoErrors: true }
  ),
  
  helper.createTest(
    'array assignment to typed variable',
    `def test() array (
      array numbers = [1, 2, 3]
      return numbers
    )`,
    { expectNoErrors: true }
  ),
  
  helper.createTest(
    'empty array creation',
    `def test() array (
      array empty = []
      return empty
    )`,
    { expectNoErrors: true }
  ),
  
  helper.createTest(
    'array concatenation',
    `def test() array (
      array arr1 = [1, 2]
      array arr2 = [3, 4]
      return arr1.concat(arr2)
    )`,
    { expectNoErrors: true }
  ),
  
  helper.createTest(
    'array with function results',
    `def getValue() number (
      return 42
    )
    def test() array (
      array arr = [getValue(), getValue() * 2, 100]
      return arr
    )`,
    { expectNoErrors: true }
  ),
  
  helper.createTest(
    'array destructuring simulation',
    `def test() number (
      array arr = [10, 20]
      number first = arr[1]
      number second = arr[2]
      return first + second
    )`,
    { expectNoErrors: true }
  )
];

module.exports = { tests };
