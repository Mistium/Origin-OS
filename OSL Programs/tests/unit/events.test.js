const helper = require('../helper.js');

const tests = [
  helper.createTest(
    'Basic event emission and handling',
    `
      window.on("event", () -> (
        log "my event fired"
      ))

      window.emit("event")
    `,
    { expect: ["my event fired"] }
  ),
];

module.exports = { tests };
