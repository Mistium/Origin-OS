const helper = require('../helper.js');

const tests = [
  helper.createTest(
    'complex calculator function with multiple operations',
    `def calculate(number a, number b, string op) number (
      if op == "add" (
        return a + b
      ) else if op == "subtract" (
        return a - b
      ) else if op == "multiply" (
        return a * b
      ) else if op == "divide" (
        if b != 0 (
          return a / b
        ) else (
          return 0
        )
      ) else (
        return -1
      )
    )
    
    def test() number (
      number result1 = calculate(10, 5, "add")
      number result2 = calculate(20, 4, "divide")
      number result3 = calculate(3, 7, "multiply")
      return result1 + result2 + result3
    )
    
    log test()`,
    { expectNoErrors: true }
  ),
  
  helper.createTest(
    'string processing pipeline',
    `def processText(string input) string (
      string cleaned = input.trim().toLowerCase()
      array words = cleaned.split(" ")
      string result = ""
      
      each i word words (
        if word.length > 3 (
          result = result.concat(word.toUpperCase()).concat(" ")
        )
      )
      
      return result.trim()
    )
    
    def test() string (
      string input = "  Hello beautiful World of Programming  "
      return processText(input)
    )
    
    log test()`,
    { expectNoErrors: true }
  ),
  
  helper.createTest(
    'nested function calls with type validation',
    `def formatNumber(number n) string (
      if n > 0 (
        return "positive: " ++ n
      ) else if n < 0 (
        return "negative: " ++ n
      ) else (
        return "zero"
      )
    )

    def processNumbers(array numbers) array (
      array results = []
      
      each i num numbers (
        string formatted = formatNumber(num)
        void results.push(formatted)
      )
      
      return results
    )
    
    def test() array (
      array nums = [5, -3, 0, 42, -17]
      return processNumbers(nums)
    )
    
    log test()`,
    { expectNoErrors: true }
  ),
  
  helper.createTest(
    'complex control flow with multiple variables',
    `def fibonacci(number n) number (
      if n <= 1 (
        return n
      )
      
      number a = 0
      number b = 1
      number result = 0

      for i n - 1 (
        result = a + b
        a = b
        b = result
      )
      
      return result
    )

    def generateSequence(number count) array (
      array sequence = []
      
      for i count (
        void sequence.push(fibonacci(i))
      )
      
      return sequence
    )
    
    def test() array (
      return generateSequence(8)
    )
    
    log test()`,
    { expectNoErrors: true }
  ),
  
  helper.createTest(
    'lambda-based functional programming',
    `def map(array arr, function fn) array (
      array result = []
      
      each i item arr (
        void result.push(fn(item))
      )
      
      return result
    )
    
    def filter(array arr, function predicate) array (
      array result = []
      
      each i item arr (
        if predicate(item) (
          void result.push(item)
        )
      )
      
      return result
    )
    
    def test() array (
      array numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

      function double @= (x) -> (
        return x * 2
      )

      function isEven @= (x) -> (
        return x % 2 == 0
      )

      array doubled @= map(numbers, double)
      array evens @= filter(doubled, isEven)

      return evens
    )
    
    log test()`,
    { expectNoErrors: true }
  )
];

module.exports = { tests };
