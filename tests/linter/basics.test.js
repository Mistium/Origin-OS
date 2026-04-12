const OSLUtils = require('../../Resources/OSL Utils.js');

function lintCode(code) {
  const utils = new OSLUtils();
  return utils.lintSyntax({ CODE: code });
}

function hasError(errors, messageSubstring) {
  return errors.some(e => e.message.includes(messageSubstring));
}

const tests = [
  {
    name: 'if statement with newline before opening paren should error',
    run: () => {
      const code = 'if true\n(\n)';
      const result = lintCode(code);
      assert.true(result.errors.length > 0, 'Expected lint error for newline before (');
      assert.true(
        hasError(result.errors, 'must be on the same line'),
        'Expected error about body being on same line'
      );
    }
  },

  {
    name: 'if statement without newline before opening paren should pass',
    run: () => {
      const code = 'if true (\n)';
      const result = lintCode(code);
      assert.equals(result.errors.length, 0, 'Expected no lint errors');
    }
  },

  {
    name: 'computed property key should not trigger newline error',
    run: () => {
      const code = 'object o = {\n("dynamic_" ++ "key"): "value"\n}';
      const result = lintCode(code);
      assert.equals(result.errors.length, 0, 'Computed property key should not error');
    }
  },

  {
    name: 'while statement with newline before opening paren should error',
    run: () => {
      const code = 'while true\n(';
      const result = lintCode(code);
      assert.true(result.errors.length > 0, 'Expected lint error for newline before (');
      assert.true(
        hasError(result.errors, 'must be on the same line'),
        'Expected error about body being on same line'
      );
    }
  },

  {
    name: 'for statement with newline before opening paren should error',
    run: () => {
      const code = 'for i 10\n(';
      const result = lintCode(code);
      assert.true(result.errors.length > 0, 'Expected lint error for newline before (');
      assert.true(
        hasError(result.errors, 'must be on the same line'),
        'Expected error about body being on same line'
      );
    }
  },

  {
    name: 'each statement with newline before opening paren should error',
    run: () => {
      const code = 'each x [1, 2, 3]\n(';
      const result = lintCode(code);
      assert.true(result.errors.length > 0, 'Expected lint error for newline before (');
      assert.true(
        hasError(result.errors, 'must be on the same line'),
        'Expected error about body being on same line'
      );
    }
  },

  {
    name: 'until statement with newline before opening paren should error',
    run: () => {
      const code = 'until false\n(';
      const result = lintCode(code);
      assert.true(result.errors.length > 0, 'Expected lint error for newline before (');
      assert.true(
        hasError(result.errors, 'must be on the same line'),
        'Expected error about body being on same line'
      );
    }
  },

  {
    name: 'loop statement with body on same line should pass',
    run: () => {
      const code = 'loop 10 (';
      const result = lintCode(code);
      const errors = result.errors.filter(e => !e.message.includes('Unclosed'));
      assert.equals(errors.length, 0, 'Expected no lint errors (except unclosed bracket)');
    }
  },

  {
    name: 'loop statement with body on new line should error',
    run: () => {
      const code = 'loop 10\n(';
      const result = lintCode(code);
      const errors = result.errors.filter(e => !e.message.includes('Unclosed'));
      assert.true(result.errors.length > 0, 'Expected lint error for newline before (');
      assert.true(
        hasError(result.errors, 'must be on the same line'),
        'Expected error about body being on same line'
      );
    }
  },

  {
    name: 'if with parenthesized condition and newline before body should error',
    run: () => {
      const code = 'if (x > 5)\n(';
      const result = lintCode(code);
      assert.true(result.errors.length > 0, 'Expected lint error');
    }
  }
];

module.exports = { tests };
