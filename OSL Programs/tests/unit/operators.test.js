const helper = require('../helper.js');

const tests = [
    helper.createTest(
        'Addition',
        `
        x = 5 + 3
        log x
        `,
        { expect: [8] }
    ),

    helper.createTest(
        'Left-to-right operator order',
        `
        x = 10 + 5 / 3
        log x
        `,
        { expect: [5] }
    ),

    helper.createTest(
        'Comparison operator',
        `
        x = 10
        log x == 10
        `,
        { expect: [true] }
    ),

    helper.createTest(
        'Logical operator',
        `
        a = 5
        b = 10
        log a < b and b == 10
        `,
        { expect: [true] }
    ),

    helper.createTest(
        'Logical operator with parentheses',
        `
        a = 5
        b = 10
        log (a < b) and (b == 10)
        `,
        { expect: [true] }
    ),

    helper.createTest(
        'Ternary operator',
        `
        x = 10
        log x == 10 ? "yes" : "no"
        `,
        { expect: ['yes'] }
    ),
];

module.exports = { tests };
