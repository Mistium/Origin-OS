const helper = require('../../helper.js');

const numberValues = [
  0,
  0.0000001,
  -0.0000001,

  0.1,
  0.5,
  1,
  -1,

  3.7,
  10,
  45,
  89.999999,
  90,
  90.000001,

  180,
  270,
  360,

  720,
  -360,

  1e6,
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

const createNumberMethodTest = (name) => {
  const out = [];
  for (const v of numberValues) {
    out.push(`log (${toPlainString(v)}).${name}()`);
  }
  return out.join('\n');
};

const tests = [
  // --- Trigonometric methods ---

  helper.createTest(
    '.sin() method',
    createNumberMethodTest('sin'),
    {
      expect: [
        0, 1.7e-9,
        -0.0174524064, 0.0017453284,
        0.0087265355, 0.0174524064,
        -0.0174524064, 0.0645323083,
        0.1736481777, 0.7071067812,
        1, 1,
        1, 0,
        -1, 0,
        0, 0,
        -0.984807753
      ]
    }
  ),

  helper.createTest(
    '.cos() method',
    createNumberMethodTest('cos'),
    {
      expect: [
        1, 1,
        0.9998476952, 0.9999984769,
        0.9999619231, 0.9998476952,
        0.9998476952, 0.9979156183,
        0.984807753, 0.7071067812,
        1.75e-8, 0,
        -1.75e-8, -1,
        0, 1,
        1, 1,
        0.1736481777
      ]
    }
  ),

  helper.createTest(
    '.tan() method',
    createNumberMethodTest('tan'),
    {
      expect: [
        0, 1.7e-9,
        -0.0174550649, 0.001745331,
        0.0087268678, 0.0174550649,
        -0.0174550649, 0.0646670992,
        0.1763269807, 1,
        57295779.81445014, null,
        -57295780.216477975, 0,
        null, 0,
        0, 0,
        -5.6712818197
      ]
    }
  ),

  helper.createTest(
    '.asin() method',
    createNumberMethodTest('asin'),
    {
      expect: [
        0, 0.000005729577951308242,
        -90, 5.739170477266787,
        30.000000000000004, 90,
        -90, null,
        null, null,
        null, null,
        null, null,
        null, null,
        null, null,
        null
      ]
    }
  ),

  helper.createTest(
    '.acos() method',
    createNumberMethodTest('acos'),
    {
      expect: [
        90, 89.99999427042206,
        180, 84.26082952273322,
        60.00000000000001, 0,
        180, null,
        null, null,
        null, null,
        null, null,
        null, null,
        null, null,
        null
      ]
    }
  ),

  helper.createTest(
    '.atan() method',
    createNumberMethodTest('atan'),
    {
      expect: [
        0, 0.000005729577951308213,
        -45, 5.710593137499643,
        26.56505117707799, 45,
        -45, 74.87599269168945,
        84.28940686250037, 88.72696997994328,
        89.36340641696384, 89.36340642403653,
        89.36340643110921, 89.68169338854864,
        89.78779437951188, 89.84084546625536,
        89.92042257962264, -89.84084546625536,
        89.99994270422049
      ]
    }
  ),

  // --- Math methods ---

  helper.createTest(
    '.chr() method',
    createNumberMethodTest('chr'),
    {
      expect: [
        '\x00', '\x00', '￿', '\x00',
        '\x00', '\x01', '￿', '\x03',
        '\n', '-', 'Y', 'Z',
        'Z', '´', 'Ď', 'Ũ',
        'ː', 'ﺘ', '䉀'
      ]
    }
  ),

  helper.createTest(
    '.isPrime() method',
    createNumberMethodTest('isPrime'),
    {
      expect: [
        false, false, false, false,
        false, false, false, true,
        false, false, true, false,
        true, false, false, false,
        false, false, false
      ]
    }
  ),

  helper.createTest(
    '.sign() method',
    createNumberMethodTest('sign'),
    {
      expect: [
        '+', '+', '-', '+', '+',
        '+', '-', '+', '+', '+',
        '+', '+', '+', '+', '+',
        '+', '+', '-', '+'
      ]
    }
  ),

  helper.createTest(
    '.sqrt() method',
    createNumberMethodTest('sqrt'),
    {
      expect: [
        0, 0.00031622776601683794,
        null, 0.31622776601683794,
        0.7071067811865476, 1,
        null, 1.9235384061671346,
        3.1622776601683795, 6.708203932499369,
        9.48683292780051, 9.486832980505138,
        9.486833033209765, 13.416407864998739,
        16.431676725154983, 18.973665961010276,
        26.832815729997478, null,
        1000
      ]
    }
  ),

  helper.createTest(
    '.round() method',
    createNumberMethodTest('round'),
    {
      expect: [
        0, 0, -1, 0,
        1, 1, -1, 4,
        10, 45, 90, 90,
        90, 180, 270, 360,
        720, -360, 1000000
      ]
    }
  ),

  helper.createTest(
    '.round() with precision argument',
    `
      log (3.14159).round(2)
      log (3.14159).round(4)
      log (1.005).round(2)
      log (100.0).round(2)
    `,
    // 1.005 cannot be represented exactly in IEEE 754 — 1.005 * 100 = 100.49999...
    // so it floors to 1, not 1.01. This is expected floating-point behaviour.
    { expect: [3.14, 3.1416, 1, 100] }
  ),

  helper.createTest(
    '.floor() method',
    createNumberMethodTest('floor'),
    {
      expect: [
        0, 0, -1, 0,
        0, 1, -1, 3,
        10, 45, 89, 90,
        90, 180, 270, 360,
        720, -360, 1000000
      ]
    }
  ),

  helper.createTest(
    '.ceiling() method',
    createNumberMethodTest('ceiling'),
    {
      expect: [
        0, 1, -1, 1,
        1, 1, -1, 4,
        10, 45, 90, 90,
        91, 180, 270, 360,
        720, -360, 1000000
      ]
    }
  ),

  helper.createTest(
    '.abs() method',
    createNumberMethodTest('abs'),
    {
      expect: [
        0, 1e-7, 1,
        0.1, 0.5, 1,
        1, 3.7, 10,
        45, 89.999999, 90,
        90.000001, 180, 270,
        360, 720, 360,
        1000000
      ]
    }
  ),

  helper.createTest(
    '.invabs() method',
    `
      log (5).invabs()
      log (-5).invabs()
      log (0).invabs()
    `,
    { expect: [-5, -5, 0] }
  ),

  helper.createTest(
    '.log() method (base 10)',
    `
      log (1).log()
      log (10).log()
      log (100).log()
      log (1000).log()
    `,
    // Math.log(1000)/Math.LN10 has floating-point imprecision at 1000.
    { expect: [0, 1, 2, 2.9999999999999996] }
  ),

  helper.createTest(
    '.ln() method (natural log)',
    `
      log (1).ln()
    `,
    // ln(1) = 0; ln(e) ≈ 1 but e isn't a literal, so just pin ln(1)
    { expect: [0] }
  ),

  helper.createTest(
    '.clamp() method',
    `
      log (5).clamp(1, 10)
      log (0).clamp(1, 10)
      log (15).clamp(1, 10)
      log (-5).clamp(-10, -1)
      log (5).clamp(10, 1)
    `,
    { expect: [5, 1, 10, -5, 5] }
  ),

  helper.createTest(
    '.chance() boundary values',
    `
      log (0).chance()
      log (100).chance()
    `,
    { expect: [false, true] }
  ),

  // --- Type-prototype number methods ---

  helper.createTest(
    'Number prototype method',
    `
      Number.double = def() -> (
        return self * 2
      )
      log 5.double()
    `,
    { expect: [10] }
  ),
];

module.exports = { tests };
