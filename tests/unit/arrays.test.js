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
      number[] numbers = [1, 2, 3]
      return numbers[1]
    )
    test()
    `,
    { expectErrors: ['Type mismatch'] }
  ),

  helper.createTest(
    'array with expressions',
    `def test() array (
      number[] arr = [1 + 2, 3 * 4, 5 - 1]
      return arr
    )`,
    { expectNoErrors: true }
  ),

  helper.createTest(
    'mismatches array type',
    `def test() array (
      string[] arr = [1, 2, 3, 4]
      return arr
    )
    test()`,
    { expectErrors: ['Type mismatch'] }
  ),

  helper.createTest(
    'nested arrays',
    `def test() number (
      array nested = [[1, 2], [3, 4], [5, 6]]
      return nested[1][2]
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
    { expectErrors: ['Return type mismatch'] }
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
  ),

  helper.createTest(
    'typed array assignment - number[] ok',
    `def test() number (
      number[] xs = [1, 2, 3]
      return xs.len
    )`,
    { expectNoErrors: true }
  ),

  helper.createTest(
    'typed array assignment - empty literal mismatches (regression coverage)',
    `def test() number (
      number[] xs = []
      return xs.len
    )
    test()`,
    { expectErrors: ['Type mismatch assigning to xs'] }
  ),

  helper.createTest(
    'typed array assignment - trailing comma ok',
    `def test() number (
      number[] xs = [1, 2, 3,]
      return xs.len
    )
    test()`,
    { expectNoErrors: true }
  ),

  helper.createTest(
    'typed array assignment - number[] from mixed array fails',
    `def test() number (
      number[] xs = [1, "two", 3]
      return 0
    )`,
    { expectErrors: ['Type mismatch assigning to xs'] }
  ),

  helper.createTest(
    'typed array element access inferred type',
    `def test() number (
      number[] xs = [10, 20]
      number v = xs[1]
      return v
    )`,
    { expectNoErrors: true }
  ),

  helper.createTest(
    'typed array element access wrong target type',
    `def test() number (
      number[] xs = [10, 20]
      string v = xs[1]
      return 0
    )`,
    { expectErrors: ['Type mismatch assigning to v'] }
  ),

  helper.createTest(
    'each loop item type from typed array',
    `def test() number (
      number[] xs = [1, 2, 3]
      each i item xs (
        string s = item
        log s
      )
      return 0
    )`,
    { expectErrors: ['Type mismatch assigning to s'] }
  )

  ,helper.createTest(
    'array.filter with lambda',
    `def test() array (
      string[] xs = ["a", "b", "c"]
      return xs.filter((string v) -> (
        return v == "b"
      ))
    )`,
    { expectNoErrors: true }
  ),
  helper.createTest(
    'array.filter with lambda wrong param type should fail',
    `def test() array (
      string[] xs = ["a", "b"]
      return xs.filter((number v) -> (
        return v > 0
      ))
    )`,
    { expectErrors: ['Type mismatch'] }
  )
];

module.exports = { tests };
