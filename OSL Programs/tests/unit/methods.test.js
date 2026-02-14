const helper = require('../helper.js');

const anyValues = [
  3.7,
  "hello",
  [],
  {},
  null,
  true,
  false,
  "true",
  "false",
  0,
  1,
  -1,
  -0.1,
  0.1,
  0.5,
  "0.5"
]

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
]

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

const createGlobalMethodTest = (name, values) => {
  const out = [];
  const args = values.map(v => typeof v === 'number' ? toPlainString(v) : JSON.stringify(v));

  for (let i = 0; i < args.length; i++) {
    out.push(`log (${args[i]}).${name}()`);
  }

  return out.join("\n");
};

const tests = [
  helper.createTest(
    'String concat method',
    `
      msg = "hello "
      log msg.concat("world")
    `,
    { expect: ['hello world'] }
  ),

  helper.createTest(
    'Array concat method',
    `
      arr = [1,2,3]
      log arr.concat([4,5,6])
    `,
    { expect: [ [1,2,3,4,5,6] ] }
  ),

  helper.createTest(
    'string index method',
    `
      msg = "hello"
      log msg.index("l")
    `,
    { expect: [3] }
  ),

  helper.createTest(
    'array index method',
    `
      arr = [1,2,3]
      log arr.index(2)
    `,
    { expect: [2] }
  ),

  helper.createTest(
    '.sin() method',
    createGlobalMethodTest('sin', numberValues),
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
    createGlobalMethodTest('cos', numberValues),
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
    createGlobalMethodTest('tan', numberValues),
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
    createGlobalMethodTest('asin', numberValues),
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
    createGlobalMethodTest('acos', numberValues),
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
    createGlobalMethodTest('atan', numberValues),
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

  helper.createTest(
    '.chr() method',
    createGlobalMethodTest('chr', numberValues),
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
    createGlobalMethodTest('isPrime', numberValues),
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
    createGlobalMethodTest('sign', numberValues),
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
    createGlobalMethodTest('sqrt', numberValues),
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
    createGlobalMethodTest('round', numberValues),
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
    '.floor() method',
    createGlobalMethodTest('floor', numberValues),
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
    createGlobalMethodTest('ceiling', numberValues),
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
    createGlobalMethodTest('abs', numberValues),
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
    '.toStr() method',
    createGlobalMethodTest('toStr', anyValues),
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
    createGlobalMethodTest('toNum', anyValues),
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
    'toInt() method',
    createGlobalMethodTest('toInt', anyValues),
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
    createGlobalMethodTest('toBool', anyValues),
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
];

module.exports = { tests };
