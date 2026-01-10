const helper = require('../helper.js');

const tests = [
  helper.createTest(
    'Array sort ascending',
    `arr = [3,1,2]
    log arr.sort()` ,
    { expect: [[1,2,3]] }
  ),
  helper.createTest(
    'Array sort descending',
    `arr = [3,1,2]
    log arr.sort().reverse()` ,
    { expect: [[3,2,1]] }
  ),
  helper.createTest(
    'Array swap',
    `arr = [1,2,3]
    void arr.swap(1,3)
    log arr` ,
    { expect: [[3,2,1]] }
  ),
  helper.createTest(
    'Array randomOf',
    `arr = [1,2,3]
    val = arr.randomOf()
    log arr.contains(val)` ,
    { expect: [true] }
  ),
  helper.createTest(
    'Array trim',
    `arr = [1,2,3,4,5]
    log arr.trim(2,4)` ,
    { expect: [[2,3,4]] }
  ),
  helper.createTest(
    'Array map',
    `arr = [1,2,3]
    log arr.map(x -> x * 2)` ,
    { expect: [[2,4,6]] }
  ),
  helper.createTest(
    'Array fill',
    `arr = (1 to 3).fill("hi")
    log arr` ,
    { expect: [["hi","hi","hi"]] }
  ),

  helper.createTest(
    'String concat',
    `msg = "hello "
    log msg.concat("world")` ,
    { expect: ["hello world"] }
  ),
  helper.createTest(
    'String append',
    `str = "hello"
    log str.append("world")` ,
    { expect: ["helloworld"] }
  ),

  helper.createTest(
    'Object getKeys',
    `obj = {a:1, b:2}
    log obj.getKeys()` ,
    { expect: [["a","b"]] }
  ),
  helper.createTest(
    'Object getValues',
    `obj = {a:1, b:2}
    log obj.getValues()` ,
    { expect: [[1,2]] }
  ),
  helper.createTest(
    'Object contains',
    `obj = {a:1, b:2}
    log obj.contains("a")
    log obj.contains("z")` ,
    { expect: [true, false] }
  ),
];

module.exports = { tests };
