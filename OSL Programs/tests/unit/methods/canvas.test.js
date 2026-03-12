const helper = require('../../helper.js');

const tests = [
  helper.createTest(
    'Canvas init and typeof',
    `
      canvas myCanvas @= canvas(10, 10, "#fff")
      log typeof(myCanvas) == "canvas"
    `,
    { expect: [true] }
  ),

  helper.createTest(
    'Canvas width and height',
    `
      canvas myCanvas @= canvas(20, 30, "#fff")
      log myCanvas.width()
      log myCanvas.height()
    `,
    { expect: [20, 30] }
  ),

  helper.createTest(
    'Canvas pixels equals width times height',
    `
      canvas myCanvas @= canvas(4, 5, "#fff")
      log myCanvas.pixels()
    `,
    { expect: [20] }
  ),

  helper.createTest(
    'Canvas setPixel and getPixel round-trip',
    `
      canvas myCanvas @= canvas(4, 4, "#fff")
      void myCanvas.setPixel(1, "#ff0000")
      log myCanvas.getPixel(1)
    `,
    { expect: ['#ff0000'] }
  ),

  helper.createTest(
    'Canvas setPixelAt and getPixelAt round-trip',
    `
      canvas myCanvas @= canvas(10, 10, "#fff")
      void myCanvas.setPixelAt(0, 0, "#00ff00")
      log myCanvas.getPixelAt(0, 0)
    `,
    { expect: ['#00ff00'] }
  ),

  helper.createTest(
    'Canvas clear erases written pixels back to background',
    `
      canvas myCanvas @= canvas(4, 4, "#000")
      void myCanvas.setPixel(1, "#ff0000")
      void myCanvas.clear()
      // clear() erases content but canvas background colour remains
      log myCanvas.getPixel(1)
    `,
    { expect: ['#000000'] }
  ),

  helper.createTest(
    'Canvas fill sets pixels to colour',
    `
      canvas myCanvas @= canvas(2, 2, "#fff")
      void myCanvas.fill("#0000ff")
      log myCanvas.getPixel(1)
    `,
    { expect: ['#0000ff'] }
  ),

  helper.createTest(
    'Canvas toURL returns a data URI string',
    `
      canvas myCanvas @= canvas(4, 4, "#fff")
      url = myCanvas.toURL()
      log typeof(url) == "string"
      log url.startsWith("data:")
    `,
    { expect: [true, true] }
  ),

  helper.createTest(
    'Canvas toArr returns raw pixel data',
    `
      canvas myCanvas @= canvas(2, 2, "#fff")
      // toArr returns a Uint8ClampedArray (raw RGBA bytes), not an OSL array
      log typeof(myCanvas.toArr()) == "array"
    `,
    { expect: [false] }
  ),

  helper.createTest(
    'Canvas stretch changes pixel count',
    `
      canvas myCanvas @= canvas(4, 4, "#fff")
      void myCanvas.stretch(8, 16)
      log myCanvas.pixels()
    `,
    { expect: [128] }
  ),
];

module.exports = { tests };
