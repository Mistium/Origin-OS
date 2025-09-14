const helper = require('../helper.js');

const tests = [
  helper.createTest(
    'AST compilation with basic function',
    `def greet(string name) string (
      return "Hello, ".concat(name)
    )
    log greet("World")`,
    { 
      expectNoErrors: true,
      testCompilation: true,
      expectCompiledOutput: true
    }
  ),
  
  helper.createTest(
    'Function inlining optimization',
    `def square(number x) number (
      return x * x
    )
    
    def test() number (
      number a = square(5)
      number b = square(3)
      return a + b
    )
    
    log test()`,
    { 
      expectNoErrors: true,
      testInlining: true,
      expectInlinedFunctions: ['square']
    }
  ),
  
  helper.createTest(
    'Complex AST with nested structures',
    `def processData(array data) array (
      array result = []
      
      each i item data (
        if item.value > 10 (
          object processed = {
            original: item.value,
            doubled: item.value * 2,
            formatted: item.value.toStr()
          }
          void result.push(processed)
        )
      )
      
      return result
    )
    
    def test() array (
      array input = [
        { value: 5 },
        { value: 15 },
        { value: 8 },
        { value: 20 }
      ]
      
      return processData(input)
    )
    
    log test()`,
    { 
      expectNoErrors: true,
      testCompilation: true,
      expectCompiledOutput: true
    }
  ),
  
  helper.createTest(
    'Recursive function compilation',
    `def factorial(number n) number (
      if n <= 1 (
        return 1
      ) else (
        return n * factorial(n - 1)
      )
    )
    
    def test() number (
      return factorial(5)
    )
    
    log test()`,
    { 
      expectNoErrors: true,
      testCompilation: true,
      expectCompiledOutput: true,
      testRecursion: true
    }
  ),
  
  helper.createTest(
    'Lambda compilation and execution',
    `def test() number (
      function multiply = (number x) -> (
        return x * 3
      )

      array numbers = [1, 2, 3, 4, 5]
      number sum = 0

      each i num numbers (
        sum = sum + multiply(num)
      )
      
      return sum
    )
    
    log test()`,
    {
      expectNoErrors: true,
      testCompilation: true,
      testLambdaCompilation: true,
      expectCompiledOutput: true
    }
  )
];

module.exports = { tests };
