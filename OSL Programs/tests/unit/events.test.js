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
    { expect: ['my event fired'] }
  ),

  helper.createTest(
    'Event fires multiple times on re-emit',
    `
      window.on("tick", () -> (
        log "tick"
      ))

      window.emit("tick")
      window.emit("tick")
      window.emit("tick")
    `,
    { expect: ['tick', 'tick', 'tick'] }
  ),

  helper.createTest(
    'Multiple listeners on the same event',
    `
      window.on("start", () -> (
        log "listener one"
      ))

      window.on("start", () -> (
        log "listener two"
      ))

      window.emit("start")
    `,
    { expect: ['listener one', 'listener two'] }
  ),

  helper.createTest(
    'Different events do not cross-fire',
    `
      window.on("a", () -> (
        log "a fired"
      ))

      window.on("b", () -> (
        log "b fired"
      ))

      window.emit("a")
    `,
    { expect: ['a fired'] }
  ),
];

module.exports = { tests };
