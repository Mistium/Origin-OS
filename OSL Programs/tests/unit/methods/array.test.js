const helper = require('../../helper.js');

const tests = [
  // --- Built-in array methods ---

  helper.createTest(
    'Array concat method',
    `
      arr = [1,2,3]
      log arr.concat([4,5,6])
    `,
    { expect: [[1, 2, 3, 4, 5, 6]] }
  ),

  helper.createTest(
    'Array index method',
    `
      arr = [1,2,3]
      log arr.index(2)
    `,
    { expect: [2] }
  ),

  helper.createTest(
    'Array index returns 0 when not found',
    `
      arr = [1,2,3]
      log arr.index(99)
    `,
    { expect: [0] }
  ),

  helper.createTest(
    'Array lastIndex method',
    `
      arr = ["a","b","a","c"]
      log arr.lastIndex("a")
      log arr.lastIndex("c")
      log arr.lastIndex("z")
    `,
    { expect: [3, 4, 0] }
  ),

  helper.createTest(
    'Array contains is strict (no type coercion)',
    `
      arr = [1, true, null]
      log arr.contains(1)
      log arr.contains("1")
      log arr.contains(true)
      log arr.contains("true")
      log arr.contains(null)
      log arr.contains("null")
    `,
    { expect: [true, false, true, false, true, false] }
  ),

  helper.createTest(
    'Array sort ascending',
    `arr = [3,1,2]
    log arr.sort()`,
    { expect: [[1, 2, 3]] }
  ),

  helper.createTest(
    'Array sort descending',
    `arr = [3,1,2]
    log arr.sort().reverse()`,
    { expect: [[3, 2, 1]] }
  ),

  helper.createTest(
    'Array swap',
    `arr = [1,2,3]
    void arr.swap(1,3)
    log arr`,
    { expect: [[3, 2, 1]] }
  ),

  helper.createTest(
    'Array randomOf',
    `arr = [1,2,3]
    val = arr.randomOf()
    log arr.contains(val)`,
    { expect: [true] }
  ),

  helper.createTest(
    'Array contains with non-string parameter',
    `
      arr = [1, true, null, "hello"]
      log arr.contains(1)
      log arr.contains(true)
      log arr.contains(null)
    `,
    { expect: [true, true, true] }
  ),

  helper.createTest(
    'Array trim',
    `arr = [1,2,3,4,5]
    log arr.trim(2,4)`,
    { expect: [[2, 3, 4]] }
  ),

  helper.createTest(
    'Array map',
    `arr = [1,2,3]
    log arr.map(x -> x * 2)`,
    { expect: [[2, 4, 6]] }
  ),

  helper.createTest(
    'Array fill',
    `arr = (1 to 3).fill("hi")
    log arr`,
    { expect: [['hi', 'hi', 'hi']] }
  ),

  helper.createTest(
    'Array first and last',
    `
      arr = [10, 20, 30]
      log arr.first()
      log arr.last()
    `,
    { expect: [10, 30] }
  ),

  helper.createTest(
    'Array left and right',
    `
      arr = [1,2,3,4,5]
      log arr.left(2)
      log arr.right(2)
    `,
    { expect: [[1, 2], [4, 5]] }
  ),

  helper.createTest(
    'Array deDupe',
    `
      arr = [1,2,2,3,1,4]
      log arr.deDupe()
    `,
    { expect: [[1, 2, 3, 4]] }
  ),

  helper.createTest(
    'Array append and prepend (built-in)',
    `
      arr = [2,3]
      void arr.append(4)
      void arr.prepend(1)
      log arr
    `,
    { expect: [[1, 2, 3, 4]] }
  ),

  helper.createTest(
    'Array insert',
    `
      arr = [1,3,4]
      void arr.insert(2, 2)
      log arr
    `,
    { expect: [[1, 2, 3, 4]] }
  ),

  helper.createTest(
    'Array sum (built-in)',
    `log [1,2,3,4,5].sum()`,
    { expect: [15] }
  ),

  helper.createTest(
    'Array sum ignores non-numbers',
    `log [1, "two", 3, null, true].sum()`,
    { expect: [4] }
  ),

  helper.createTest(
    'Array max and min',
    `
      arr = [3,1,4,1,5,9,2,6]
      log arr.max()
      log arr.min()
    `,
    { expect: [9, 1] }
  ),

  helper.createTest(
    'Array product',
    `log [1,2,3,4].product()`,
    { expect: [24] }
  ),

  helper.createTest(
    'Array sortBy ascending',
    `
    arr = [
      {name: "bob", age: 30},
      {name: "alice", age: 25}
    ]
    log arr.sortBy("age").getKeys("name")
    `,
    { expect: [['alice', 'bob']] }
  ),

  helper.createTest(
    'Array sortBy descending',
    `
    arr = [
      {name: "bob", age: 30},
      {name: "alice", age: 25}
    ]
    log arr.sortBy("age", "descending").getKeys("name")
    `,
    { expect: [['bob', 'alice']] }
  ),

  helper.createTest(
    'Array reverse',
    `
    log [1,2,3].reverse()
    `,
    { expect: [[3, 2, 1]] }
  ),

  helper.createTest(
    'Array toSet',
    `
    s @= [1,2,2,3,3,3].toSet()
    log s.contains(1)
    log s.contains(2)
    log s.contains(3)
    `,
    { expect: [true, true, true] }
  ),

  helper.createTest(
    'Array getKeys',
    `
    arr = [{name: "alice"}, {name: "bob"}]
    log arr.getKeys("name")
    `,
    { expect: [['alice', 'bob']] }
  ),

  helper.createTest(
    'Array getKeys with missing key returns null',
    `
    arr = [{name: "alice"}, {age: 20}]
    log arr.getKeys("name")
    `,
    { expect: [['alice', null]] }
  ),

  helper.createTest(
    'Array containsAny',
    `
    log [1,2,3].containsAny(2, 5)
    log [1,2,3].containsAny(10, 20)
    `,
    { expect: [true, false] }
  ),

  helper.createTest(
    'Array toEntriesObj',
    `
    log [["a", 1], ["b", 2]].toEntriesObj()
    `,
    { expect: [{ a: 1, b: 2 }] }
  ),

  helper.createTest(
    'Array toEntriesObj with invalid entries',
    `
    log [["a", 1], "invalid"].toEntriesObj()
    `,
    { expect: [{}] }
  ),

  helper.createTest(
    'Array clone',
    `
    arr = [1,2,3]
    cloned = arr.clone()
    void cloned.append(4)
    log arr
    log cloned
    `,
    { expect: [[1, 2, 3], [1, 2, 3, 4]] }
  ),

  // --- Type-prototype array methods ---

  helper.createTest(
    'Array prototype sum method',
    `
      Array.sum = def() -> (
        local total = 0
        for i self.len (
          total += self[i]
        )
        return total
      )
      log [1,2,3,4].sum()
    `,
    { expect: [10] }
  ),

  helper.createTest(
    'Array prototype map method',
    `
      Array.double = def() -> (
        return self.map(x -> x * 2)
      )
      log [1,2,3].double()
    `,
    { expect: [[2, 4, 6]] }
  ),
];

module.exports = { tests };
