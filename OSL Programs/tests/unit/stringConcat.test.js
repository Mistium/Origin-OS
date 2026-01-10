const helper = require('../helper.js');

const tests = [
  helper.createTest(
    'Basic string concatenation with +',
    `
      result = "hello" + "world"
      log result
    `,
    { expect: ["hello world"] }
  ),

  helper.createTest(
    'Concatenating strings with numbers',
    `
      message = "The answer is" + 42
      log message
    `,
    { expect: ["The answer is 42"] }
  ),

  helper.createTest(
    'Concatenating multiple strings',
    `
      fullName = "John" + "Doe" + "Smith"
      log fullName
    `,
    { expect: ["John Doe Smith"] }
  ),

  helper.createTest(
    'Building a sentence',
    `
      subject = "The cat"
      verb = "sat"
      preposition = "on"
      object = "the mat"
      sentence = subject + verb + preposition + object
      log sentence
    `,
    { expect: ["The cat sat on the mat"] }
  ),

  helper.createTest(
    '+ vs ++ operator',
    `
      log "hello" + "world"
      log "hello" ++ "world"
    `,
    { expect: ["hello world", "helloworld"] }
  ),

  helper.createTest(
    '+ vs .append() method',
    `
      str1 = "hello"
      str1.append("world")
      log str1

      str2 = "hello"
      str2 = str2 ++ "world"
      log str2

      str3 = "hello"
      str3 = str3 + "world"
      log str3
    `,
    { expect: ["helloworld", "helloworld", "hello world"] }
  )
];

module.exports = { tests };
