const helper = require('../../helper.js');

const tests = [
  helper.createTest(
    'XML init and toStr round-trip',
    `
      xml doc @= xml("<root><item>hello</item></root>")
      log typeof(doc) == "xml"
    `,
    { expect: [true] }
  ),

  helper.createTest(
    'XML getText',
    `
      xml doc @= xml("<root><item>hello</item></root>")
      log doc.getText("item")
    `,
    { expect: ['hello'] }
  ),

  helper.createTest(
    'XML getText returns null for missing path',
    `
      xml doc @= xml("<root><item>hello</item></root>")
      log doc.getText("missing")
    `,
    { expect: [null] }
  ),

  helper.createTest(
    'XML getAttr',
    `
      xml doc @= xml("<root><item id=\\"42\\" colour=\\"red\\">hello</item></root>")
      log doc.getAttr("item", "id")
      log doc.getAttr("item", "colour")
    `,
    { expect: ['42', 'red'] }
  ),

  helper.createTest(
    'XML getAttr returns null for missing attribute',
    `
      xml doc @= xml("<root><item>hello</item></root>")
      log doc.getAttr("item", "missing")
    `,
    { expect: [null] }
  ),

  helper.createTest(
    'XML has',
    `
      xml doc @= xml("<root><item>hello</item></root>")
      log doc.has("item")
      log doc.has("missing")
    `,
    { expect: [true, false] }
  ),

  helper.createTest(
    'XML hasAttr',
    `
      xml doc @= xml("<root><item id=\\"1\\">hello</item></root>")
      log doc.hasAttr("item", "id")
      log doc.hasAttr("item", "missing")
    `,
    { expect: [true, false] }
  ),

  helper.createTest(
    'XML setText',
    `
      xml doc @= xml("<root><item>hello</item></root>")
      void doc.setText("item", "world")
      log doc.getText("item")
    `,
    { expect: ['world'] }
  ),

  helper.createTest(
    'XML setAttr',
    `
      xml doc @= xml("<root><item id=\\"1\\">hello</item></root>")
      void doc.setAttr("item", "id", "99")
      log doc.getAttr("item", "id")
    `,
    { expect: ['99'] }
  ),

  helper.createTest(
    'XML count',
    `
      xml doc @= xml("<root><item>a</item><item>b</item><item>c</item></root>")
      log doc.count("root")
    `,
    { expect: [3] }
  ),

  helper.createTest(
    'XML getAll',
    `
      xml doc @= xml("<root><item>a</item><item>b</item></root>")
      log doc.getAll("item").len
    `,
    { expect: [2] }
  ),

  helper.createTest(
    'XML remove',
    `
      xml doc @= xml("<root><item>hello</item></root>")
      void doc.remove("item")
      log doc.has("item")
    `,
    { expect: [false] }
  ),

  helper.createTest(
    'XML clear removes children but keeps element',
    `
      xml doc @= xml("<root><item><child>x</child></item></root>")
      void doc.clear("item")
      log doc.has("item")
      log doc.count("item")
    `,
    { expect: [true, 0] }
  ),
];

module.exports = { tests };
