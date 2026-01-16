const helper = require('../helper.js');

const tests = [
    helper.createTest(
        'window "goto"',
        `
        window "goto" 100 100
        log window.x
        log window.y
        
        window "goto" 200 200
        log window.x
        log window.y

        window.goto(100, 100)
        log window.x
        log window.y

        window.goto(200, 200)
        log window.x
        log window.y
        `,
        { expect: [100, 100, 200, 200, 100, 100, 200, 200] }
    ),
    helper.createTest(
        'window "dimensions"',
        `
        window "dimensions" 100 100
        log window.width
        log window.height

        window "dimensions" 200 200
        log window.width
        log window.height

        window.resize(100, 100)
        log window.width
        log window.height

        window.resize(200, 200)
        log window.width
        log window.height
        `,
        { expect: [100, 100, 200, 200, 100, 100, 200, 200] }
    ),

    helper.createTest(
        "window show/hide",
        `
        window "show"
        log window.shown

        window "hide"
        log window.shown

        window.show()
        log window.shown

        window.hide()
        log window.shown
        `,
        { expect: [true, false, true, false] }
    )
]