const helper = require('../helper.js');

const tests = [
  helper.createTest(
    'String.stripStart and String.stripEnd methods',
    `
      string text = "hello world"
      log text.stripStart("hello ")
      log text.stripEnd(" world")
      log text.stripStart("wow")
      log text.stripEnd("wow")
      log text.stripStart("")
      log text.stripEnd("")
    `,
    { expect: ['world', 'hello', 'hello world', 'hello world', 'hello world', 'hello world'] }
  ),

  helper.createTest(
    'String.padStart and String.padEnd methods',
    `
      string text = "hello"
      log text.padStart("!", 10)
      log text.padEnd("!", 10)
      log text.padStart("!", 3)
      log text.padEnd("!", 3)
    `,
    { expect: ['!!!!!hello', 'hello!!!!!', 'hello', 'hello'] }
  ),

  helper.createTest(
    'String.count method',
    `
      string text = "hello world"
      log text.count("hello")
      log text.count("world")
      log text.count("o")
      log text.count("")
    `,
    { expect: [1, 1, 2, 0] }
  ),

];

module.exports = { tests };