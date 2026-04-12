const helper = require('../../helper.js');

const tests = [
    helper.createTest(
        'Result ok creates success result',
        `
        res @= result.ok(42)
        log res.isOk()
        log res.isErr()
        `,
        { expect: [true, false] }
    ),

    helper.createTest(
        'Result err creates error result',
        `
        res @= result.err("something went wrong")
        log res.isOk()
        log res.isErr()
        `,
        { expect: [false, true] }
    ),

    helper.createTest(
        'Result unwrap returns value on ok',
        `
        res @= result.ok(42)
        log res.unwrap()
        `,
        { expect: [42] }
    ),

    helper.createTest(
        'Result unwrap throws on err',
        `
        res @= result.err("error!")
        attempt @= ?res.unwrap()
        if attempt.isErr() (
            log "caught"
        )
        `,
        { expect: ['caught'] }
    ),

    helper.createTest(
        'Result unwrapOr returns value on ok',
        `
        res @= result.ok(42)
        log res.unwrapOr(99)
        `,
        { expect: [42] }
    ),

    helper.createTest(
        'Result unwrapOr returns default on err',
        `
        res @= result.err("error")
        log res.unwrapOr(99)
        `,
        { expect: [99] }
    ),

    helper.createTest(
        'Result expect returns value on ok',
        `
        res @= result.ok("hello")
        log res.expect("should not happen")
        `,
        { expect: ['hello'] }
    ),

    helper.createTest(
        'Result expect throws with message on err',
        `
        res @= result.err("bad")
        attempt @= ?res.expect("failed")
        if attempt.isErr() (
            log "caught"
        )
        `,
        { expect: ['caught'] }
    ),

    helper.createTest(
        'Result unwrapErr returns error on err',
        `
        res @= result.err("my error")
        log res.unwrapErr()
        `,
        { expect: ['my error'] }
    ),

    helper.createTest(
        'Result unwrapErr throws on ok',
        `
        res @= result.ok(42)
        attempt @= ?res.unwrapErr()
        if attempt.isErr() (
            log "caught"
        )
        `,
        { expect: ['caught'] }
    ),

    helper.createTest(
        'Result expectErr returns error on err',
        `
        res @= result.err("my error")
        log res.expectErr("should not happen")
        `,
        { expect: ['my error'] }
    ),

    helper.createTest(
        'Result expectErr throws on ok',
        `
        res @= result.ok(42)
        attempt @= ?res.expectErr("unexpected ok")
        if attempt.isErr() (
            log "caught"
        )
        `,
        { expect: ['caught'] }
    ),
];

module.exports = { tests };
