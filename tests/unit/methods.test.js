const helper = require('../helper.js');

const tests = [
  helper.createTest(
    'string methods - length property',
    `def test() number (
      string text = "hello world"
      return text.len
    )`,
    { expectNoErrors: true }
  ),

  helper.createTest(
    'string methods - length property return type mismatch',
    `def test() string (
      string text = "hello world"
      return text.len
    )`,
    { expectErrors: ['Return type mismatch'] }
  ),
  
  helper.createTest(
    'string methods - toUpperCase',
    `def test() string (
      string text = "hello"
      return text.toUpper()
    )`,
    { expectNoErrors: true }
  ),
  
  helper.createTest(
    'string methods - toLowerCase',
    `def test() string (
      string text = "HELLO"
      return text.toLower()
    )`,
    { expectNoErrors: true }
  ),
  
  helper.createTest(
    'string methods - substring',
    `def test() string (
      string text = "hello world"
      return text.trim(1, 5)
    )`,
    { expectNoErrors: true }
  ),
  
  helper.createTest(
    'string methods - indexOf',
    `def test() number (
      string text = "hello world"
      return text.indexOf("world")
    )`,
    { expectNoErrors: true }
  ),
  
  helper.createTest(
    'string methods - replace',
    `def test() string (
      string text = "hello world"
      return text.replace("world", "universe")
    )`,
    { expectNoErrors: true }
  ),
  
  helper.createTest(
    'string methods - split',
    `def test() array (
      string text = "a,b,c,d"
      return text.split(",")
    )`,
    { expectNoErrors: true }
  ),
  
  helper.createTest(
    'string methods - charAt',
    `def test() string (
      string text = "hello"
      return text[1]
      // "h"
    )`,
    { expectNoErrors: true }
  ),
  
  helper.createTest(
    'number methods - toString',
    `def test() string (
      number num = 42
      return num.toStr()
    )`,
    { expectNoErrors: true }
  ),
  
  helper.createTest(
    'number methods - toFixed',
    `def test() string (
      number num = 3.14159
      return num.toFixed(2)
    )`,
    { expectNoErrors: true }
  ),
  
  helper.createTest(
    'boolean methods - toString',
    `def test() string (
      boolean flag = true
      return flag.toStr()
    )`,
    { expectNoErrors: true }
  ),
  
  helper.createTest(
    'method chaining',
    `def test() string (
      string text = "  Hello World  "
      return text.strip().toLower().replace("world", "universe")
    )`,
    { expectNoErrors: true }
  )
];

module.exports = { tests };
