const helper = require('../helper.js');

const tests = [
  helper.createTest(
    'Basic pipe operator',
    `
      def double(number val) (
        return val * 2
      )
      log 10 |> double
    `,
    { expect: [20] }
  ),

  helper.createTest(
    'Pipe operator chaining',
    `
      def double(number val) (
        return val * 2
      )
      def addFive(number val) (
        return val + 5
      )
      def square(number val) (
        return val * val
      )
      log 10 |> double |> addFive |> square
    `,
    { expect: [625] }
  ),

  helper.createTest(
    'Pipe operator with wrapper function',
    `
      def multiplyBy(number val, number factor) (
        return val * factor
      )
      def multiplyByThree(number val) (
        return multiplyBy(val, 3)
      )
      log 10 |> multiplyByThree
    `,
    { expect: [30] }
  ),

  helper.createTest(
    'Pipe operator with anonymous function',
    `
      def multiplyBy(number val, number factor) (
        return val * factor
      )
      log 10 |> (val -> multiplyBy(val, 3))
    `,
    { expect: [30] }
  ),

  helper.createTest(
    'Pipe operator with arrays',
    `
      numbers = [1,2,3,4,5]

      def filterEven(array arr) (
        array result = []
        for i arr.len (
          if arr[i] % 2 == 0 (
            void result.append(arr[i])
          )
        )
        return result
      )

      def multiplyAllByThree(array arr) (
        return arr.map(val -> val * 3)
      )

      def sum(array arr) (
        number total = 0
        for i arr.len (
          total += arr[i]
        )
        return total
      )

      log numbers |> filterEven |> multiplyAllByThree |> sum
    `,
    { expect: [18] }
  )
];

module.exports = { tests };
