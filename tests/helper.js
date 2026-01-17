const OSLUtils = require('../Resources/OSL Utils.js');

/**
 * Test helper utilities for OSL testing
 */
class OSLTestHelper {
  constructor() {
    this.utils = new OSLUtils();
  }

  /**
   * Create a fresh OSL Utils instance for each test
   */
  createUtils() {
    return new OSLUtils();
  }

  /**
   * Generate AST from OSL code
   */
  generateAST(code) {
    return this.utils.generateFullAST({ CODE: code });
  }

  /**
   * Get type errors from code
   */
  getTypeErrors(code) {
    const ast = this.generateAST(code);
    this.utils.applyTypes(ast);
    return this.utils.getErrorsFromAstMain({ AST: ast });
  }

  /**
   * Assert that code has no type errors
   */
  assertNoTypeErrors(code, message) {
    const errors = this.getTypeErrors(code);
    if (errors.length > 0) {
      const errorMessages = errors.map(e => e.message).join(', ');
      throw new Error(message || `Expected no type errors, but got: ${errorMessages}`);
    }
  }

  /**
   * Assert that code has specific type errors
   */
  assertHasTypeError(code, expectedErrorSubstrings, message) {
    const errors = this.getTypeErrors(code);
    const errorMessages = errors.map(e => e.message);
    
    if (!Array.isArray(expectedErrorSubstrings)) {
      expectedErrorSubstrings = [expectedErrorSubstrings];
    }
    
    for (const expectedError of expectedErrorSubstrings) {
      const found = errorMessages.some(msg => msg.includes(expectedError));
      if (!found) {
        throw new Error(message || 
          `Expected error containing "${expectedError}", but got errors: ${errorMessages.join(', ')}`);
      }
    }
  }

  /**
   * Assert that code has exactly the specified number of errors
   */
  assertErrorCount(code, expectedCount, message) {
    const errors = this.getTypeErrors(code);
    if (errors.length !== expectedCount) {
      const errorMessages = errors.map(e => e.message).join(', ');
      throw new Error(message || 
        `Expected ${expectedCount} errors, got ${errors.length}: ${errorMessages}`);
    }
  }

  /**
   * Generate and compile OSL code (for integration tests)
   */
  compileCode(code) {
    const ast = this.generateAST(code);
    return this.utils.generateBysl(ast);
  }

  /**
   * Create a test case object
   */
  createTest(name, code, expectations) {
    return {
      name,
      code,
      ...expectations,
      run: () => {
        if (expectations.expectNoErrors) {
          this.assertNoTypeErrors(code);
        }
        if (expectations.expectErrors) {
          this.assertHasTypeError(code, expectations.expectErrors);
        }
        if (expectations.expectErrorCount !== undefined) {
          this.assertErrorCount(code, expectations.expectErrorCount);
        }
        if (expectations.customAssert) {
          expectations.customAssert(this);
        }
      }
    };
  }

  /**
   * Create multiple test cases from a simple format
   */
  createTests(testData) {
    return testData.map(test => this.createTest(
      test.name,
      test.code,
      {
        expectNoErrors: test.expectErrors === undefined || (Array.isArray(test.expectErrors) && test.expectErrors.length === 0),
        expectErrors: test.expectErrorsContains || test.expectErrors,
        customAssert: test.customAssert
      }
    ));
  }

  /**
   * Load test data from JSON file
   */
  loadTestData(filePath) {
    const fs = require('fs');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return this.createTests(data);
  }
}

// Export singleton instance
module.exports = new OSLTestHelper();
