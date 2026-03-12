const helper = require('../helper.js');

const tests = [
  // --- Append / prepend ---

  helper.createTest(
    'Prepend value to array',
    `log "hello" + ["world"]`,
    { expect: [['hello', 'world']] }
  ),

  helper.createTest(
    'Append value to array',
    `log ["hello"] + "world"`,
    { expect: [['hello', 'world']] }
  ),

  helper.createTest(
    'Use - on an array returns null',
    `
      arr = ["a", "b", "c"]
      arr @= arr - 1
      log arr
    `,
    { expect: [null] }
  ),

  // --- Concatenate ---

  helper.createTest(
    'Concatenate arrays with ++',
    `
      log ["hello"] ++ ["world"]
      log [1, 2] ++ [3, 4, 5]
    `,
    { expect: [['hello', 'world'], [1, 2, 3, 4, 5]] }
  ),

  // --- Range operator ---

  helper.createTest(
    'Range operator (to)',
    `
      log 1 to 5
      log -2 to 2
      log 10 to 15
    `,
    { expect: [[1,2,3,4,5], [-2,-1,0,1,2], [10,11,12,13,14,15]] }
  ),

  // --- Access ---

  helper.createTest(
    'Out-of-bounds access returns null',
    `
      arr = [1, 2, 3]
      log arr[0]
      log arr[4]
    `,
    { expect: [null, null] }
  ),

  helper.createTest(
    'Negative index access returns last',
    `
      arr = [1, 2, 3]
      log arr[-1]
      log arr[-2]
      log arr[-3]
      log arr[-4]
    `,
    { expect: [3, 2, 1, null] }
  ),
];

module.exports = { tests };
