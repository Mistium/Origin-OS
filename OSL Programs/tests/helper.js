let nextId = 0;

class OSLTestHelper {
  createTest(name, code, options = {}) {
    return {
      id: `test-${nextId++}`,
      name,
      code,
      expect: options.expect ?? [],
      _logs: []
    };
  }
}

module.exports = new OSLTestHelper();
