const helper = require('../helper.js');

const tests = [
  helper.createTest(
    'global variable with no type reassigned',
    `lol = 10
     def reassign() (
       lol = "hi"
     )
     reassign()`,
    { expectNoErrors: true }
  ),
];

module.exports = { tests };