const helper = require('../../helper.js');

// Type-conversion methods that work on any value.

const anyValues = [
  3.7,
  'hello',
  [],
  {},
  null,
  true,
  false,
  'true',
  'false',
  0,
  1,
  -1,
  -0.1,
  0.1,
  0.5,
  '0.5',
];

function toPlainString(n) {
  if (!Number.isFinite(n)) return String(n);

  const s = n.toString();
  if (!s.includes('e')) return s;

  const [coeff, exp] = s.split('e');
  const e = Number(exp);
  const [int, frac = ''] = coeff.split('.');

  if (e < 0) {
    return '0.' + '0'.repeat(-e - 1) + int + frac;
  }

  return int + frac + '0'.repeat(e - frac.length);
}

const createAnyMethodTest = (name) => {
  const out = [];
  for (const v of anyValues) {
    const arg = typeof v === 'number' ? toPlainString(v) : JSON.stringify(v);
    out.push(`log (${arg}).${name}()`);
  }
  return out.join('\n');
};

const tests = [
  helper.createTest(
    '.toStr() method',
    createAnyMethodTest('toStr'),
    {
      expect: [
        '3.7', 'hello', '[]',
        '{}', 'null', 'true',
        'false', 'true', 'false',
        '0', '1', '-1',
        '-0.1', '0.1', '0.5',
        '0.5'
      ]
    }
  ),

  helper.createTest(
    '.toNum() method',
    createAnyMethodTest('toNum'),
    {
      expect: [
        3.7, 0, 0, 0, 0,
        1, 0, 1, 0, 0,
        1, -1, -0.1, 0.1, 0.5,
        0.5
      ]
    }
  ),

  helper.createTest(
    '.toInt() method',
    createAnyMethodTest('toInt'),
    {
      expect: [
        3, 0, 0, 0, 0, 1,
        0, 1, 0, 0, 1, -1,
        0, 0, 0, 0
      ]
    }
  ),

  helper.createTest(
    '.toBool() method',
    createAnyMethodTest('toBool'),
    {
      expect: [
        false, false, false,
        false, false, true,
        false, true, false,
        false, false, false,
        false, false, false,
        false
      ]
    }
  ),

  helper.createTest(
    '.contains() on null always returns false',
    `
      log null.contains(null)
      log null.contains(true)
      log null.contains(false)
      log null.contains("hello")
      log null.contains([])
      log null.contains({})
      log null.contains(3.7)
    `,
    { expect: [false, false, false, false, false, false, false] }
  ),
];

module.exports = { tests };
