const helper = require('../helper.js');

const tests = [
  helper.createTest(
    'Deep clone object with =',
    `
      original = {x: 1, y: {z: 2}}
      clone = original

      clone.x = 10
      clone.y.z = 20

      log original.x
      log original.y.z
      log clone.x
      log clone.y.z
    `,
    { expect: [1, 2, 10, 20] }
  ),

  helper.createTest(
    'Reference object with @=',
    `
      original = {x: 1, y: {z: 2}}
      reference @= original

      reference.x = 10
      reference.y.z = 20

      log original.x
      log original.y.z
      log reference.x
      log reference.y.z
    `,
    { expect: [10, 20, 10, 20] }
  ),

  helper.createTest(
    'Deep clone array with nested array',
    `
      arr1 = [1, 2, [3, 4]]
      arr2 = arr1

      arr2[1] = 10
      arr2[3][1] = 40

      log arr1[1]
      log arr1[3][1]
      log arr2[1]
      log arr2[3][1]
    `,
    { expect: [1, 3, 10, 40] }
  ),

  helper.createTest(
    'Reference array with nested array',
    `
      arr1 = [1, 2, [3, 4]]
      arr2 @= arr1

      arr2[1] = 10
      arr2[3][1] = 40

      log arr1[1]
      log arr1[3][1]
      log arr2[1]
      log arr2[3][1]
    `,
    { expect: [10, 40, 10, 40] }
  ),

  helper.createTest(
    'Multiple references point to same object',
    `
      base = {count: 0}
      a @= base
      b @= base

      a.count = 5
      b.count = b.count + 1

      log base.count
      log a.count
      log b.count
    `,
    { expect: [6, 6, 6] }
  ),

  helper.createTest(
    'Clone breaks reference chain',
    `
      base = {value: 1}
      ref @= base
      clone = base

      ref.value = 10
      clone.value = 20

      log base.value
      log ref.value
      log clone.value
    `,
    { expect: [10, 10, 20] }
  )
];

module.exports = { tests };
