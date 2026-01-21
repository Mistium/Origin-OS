const helper = require('../helper.js');

const values = [
    3.7,
    "hello",
    [],
    {},
    null,
    true,
    false,
    0,
    1,
    -1,
    -0.1,
    0.1,
    0.5,
    "0.5"
]

const createGlobalFunctionTest = (name) => {
    const out = [];
    const args = values.map(v => JSON.stringify(v));

    for (let i = 0; i < args.length; i++) {
        out.push(`log ${name}(${args[i]})`);
    }

    return out.join("\n");
};

const tests = [
    helper.createTest(
        'round function',
        createGlobalFunctionTest('round'),
        {
            expect: [
                4, 0, 0, 0, 0,
                1, 0, 0, 1, -1,
                0, 0, 1, 1
            ]
        }
    ),

    helper.createTest(
        'floor function',
        createGlobalFunctionTest('floor'),
        {
            expect: [
                3, 0, 0, 0, 0,
                1, 0, 0, 1, -1,
                -1, 0, 0, 0
            ]
        }
    ),

    helper.createTest(
        'ceil function',
        createGlobalFunctionTest('ceil'),
        {
            expect: [
                4, 0, 0, 0, 0,
                1, 0, 0, 1, -1,
                0, 1, 1, 1
            ]
        }
    ),

    helper.createTest(
        'abs function',
        createGlobalFunctionTest('abs'),
        {
            expect: [
                3.7, 0, 0, 0, 0,
                1, 0, 0, 1, 1,
                0.1, 0.1, 0.5, 0.5
            ]
        }
    ),

    helper.createTest(
        'typeof function',
        createGlobalFunctionTest('typeof'),
        {
            expect: [
                'number', 'string', 'array', 'object',
                'null', 'boolean', 'boolean', 'number',
                'number', 'number', 'number', 'number',
                'number', 'string'
            ]
        }
    ),

    helper.createTest(
        'btoa function',
        createGlobalFunctionTest('btoa'),
        {
            expect: [
                'My43', 'aGVsbG8=', 'W10=', 'e30=',
                'bnVsbA==', 'dHJ1ZQ==', 'ZmFsc2U=', 'MA==',
                'MQ==', 'LTE=', 'LTAuMQ==', 'MC4x',
                'MC41', 'MC41'
            ]
        }
    ),
]

module.exports = { tests };