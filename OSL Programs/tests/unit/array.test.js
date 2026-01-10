const helper = require('../helper.js');

const tests = [
  helper.createTest(
    'Append and prepend values to array',
    `
      log "hello" + ["world"]
      log ["hello"] + "world"
    `,
    { expect: [["hello","world"], ["hello","world"]] }
  ),

  helper.createTest(
    'Remove value from array by value or index',
    `
      log ["hello"] - "hello"
      log ["a","b","c"] - 1
    `,
    { expect: [null, null] }
  ),

  helper.createTest(
    'Concatenate arrays',
    `
      log ["hello"] ++ ["world"]
      log [1,2] ++ [3,4,5]
    `,
    { expect: [["hello","world"], [1,2,3,4,5]] }
  ),

  helper.createTest(
    'Range operator (to)',
    `
      log 1 to 5
      log -2 to 2
      log 10 to 15
    `,
    { expect: [[1,2,3,4,5], [-2,-1,0,1,2], [10,11,12,13,14,15]] }
  ),

  helper.createTest(
    'Using range in each loop',
    `
      result = []
      each value 1 to 5 (
        result.append(value)
      )
      log result
    `,
    { expect: [[1,2,3,4,5]] }
  )
];

module.exports = { tests };
