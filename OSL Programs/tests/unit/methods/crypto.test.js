const helper = require('../../helper.js');

const tests = [
    helper.createTest(
        'Crypto randomUUID returns string',
        `
        id = crypto.randomUUID()
        log typeof(id) == "string"
        log id.len
        `,
        { expect: [true, 36] }
    ),

    helper.createTest(
        'Crypto randomUUID format',
        `
        id = crypto.randomUUID()
        log id.contains("-")
        `,
        { expect: [true] }
    ),

    helper.createTest(
        'Crypto randomInt returns number in range',
        `
        n = crypto.randomInt(10)
        log n >= 0
        log n < 10
        `,
        { expect: [true, true] }
    ),

    helper.createTest(
        'Crypto randomInt with 1 always returns 0',
        `
        log crypto.randomInt(1)
        `,
        { expect: [0] }
    ),

    helper.createTest(
        'Crypto randomFloat returns number between 0 and 1',
        `
        n = crypto.randomFloat()
        log n >= 0
        log n < 1
        `,
        { expect: [true, true] }
    ),

    helper.createTest(
        'Crypto random returns number in range',
        `
        n = crypto.random(5, 10)
        log n >= 5
        log n < 10
        `,
        { expect: [true, true] }
    ),

    helper.createTest(
        'Crypto random with same min and max',
        `
        n = crypto.random(5, 5)
        log n == 5
        `,
        { expect: [true] }
    ),
];

module.exports = { tests };
