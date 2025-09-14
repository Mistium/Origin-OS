#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { performance } = require('perf_hooks');

class TestRunner {
  constructor() {
    this.stats = {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      errors: [],
      startTime: 0,
      endTime: 0
    };
    this.verbose = process.argv.includes('--verbose') || process.argv.includes('-v');
    this.filter = process.argv.find(arg => arg.startsWith('--filter='))?.split('=')[1];
    this.colors = {
      reset: '\x1b[0m',
      bright: '\x1b[1m',
      red: '\x1b[31m',
      green: '\x1b[32m',
      yellow: '\x1b[33m',
      blue: '\x1b[34m',
      cyan: '\x1b[36m',
      gray: '\x1b[90m'
    };
  }

  colorize(text, color) {
    if (process.env.NO_COLOR || !process.stdout.isTTY) return text;
    return `${this.colors[color]}${text}${this.colors.reset}`;
  }

  log(message, color = 'reset') {
    console.log(this.colorize(message, color));
  }

  async runAllTests() {
    this.stats.startTime = performance.now();
    
    this.log('\n🧪 OSL Test Suite\n', 'bright');
    
    const testDirs = ['unit', 'integration'];
    
    for (const dir of testDirs) {
      const dirPath = path.join(__dirname, dir);
      if (!fs.existsSync(dirPath)) continue;
      
      this.log(`\n📁 Running ${dir} tests:`, 'blue');
      await this.runTestsInDirectory(dirPath);
    }
    
    this.stats.endTime = performance.now();
    this.printSummary();
  }

  async runTestsInDirectory(dirPath) {
    const files = fs.readdirSync(dirPath)
      .filter(file => file.endsWith('.test.js'))
      .sort();
    
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      await this.runTestFile(filePath);
    }
  }

  async runTestFile(filePath) {
    try {
      // Clear require cache to ensure fresh test runs
      delete require.cache[require.resolve(filePath)];
      
      const testModule = require(filePath);
      const fileName = path.basename(filePath, '.test.js');
      
      if (this.filter && !fileName.includes(this.filter)) {
        return;
      }
      
      this.log(`\n  📄 ${fileName}:`, 'cyan');
      
      // Run setup if exists
      if (testModule.setup) {
        await testModule.setup();
      }
      
      // Run tests
      const tests = testModule.tests || [];
      for (const test of tests) {
        await this.runSingleTest(test, fileName);
      }
      
      // Run cleanup if exists
      if (testModule.cleanup) {
        await testModule.cleanup();
      }
      
    } catch (error) {
      this.stats.total++;
      this.stats.failed++;
      this.stats.errors.push({
        file: path.basename(filePath),
        test: 'File Load',
        error: error.message,
        stack: error.stack
      });
      this.log(`    ❌ Failed to load test file: ${error.message}`, 'red');
    }
  }

  async runSingleTest(test, fileName) {
    this.stats.total++;
    
    try {
      if (test.skip) {
        this.stats.skipped++;
        this.log(`    ⏭️  ${test.name} (skipped)`, 'yellow');
        return;
      }
      
      const startTime = performance.now();
      
      // Run the test
      if (typeof test.run === 'function') {
        await test.run();
      } else if (typeof test === 'function') {
        await test();
      } else {
        throw new Error('Test must have a run function or be a function');
      }
      
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);
      
      this.stats.passed++;
      
      const timeStr = duration > 100 ? this.colorize(`(${duration}ms)`, 'yellow') : 
                     duration > 10 ? this.colorize(`(${duration}ms)`, 'gray') : '';
      
      this.log(`    ✅ ${test.name} ${timeStr}`, 'green');
      
    } catch (error) {
      this.stats.failed++;
      this.stats.errors.push({
        file: fileName,
        test: test.name,
        error: error.message,
        stack: error.stack
      });
      
      this.log(`    ❌ ${test.name}`, 'red');
      if (this.verbose) {
        this.log(`       ${error.message}`, 'gray');
      }
    }
  }

  printSummary() {
    const duration = Math.round(this.stats.endTime - this.stats.startTime);
    const passRate = this.stats.total > 0 ? Math.round((this.stats.passed / this.stats.total) * 100) : 0;
    
    this.log('\n📊 Test Summary:', 'bright');
    this.log(`   Total:   ${this.stats.total}`, 'blue');
    this.log(`   Passed:  ${this.stats.passed}`, 'green');
    this.log(`   Failed:  ${this.stats.failed}`, this.stats.failed > 0 ? 'red' : 'gray');
    this.log(`   Skipped: ${this.stats.skipped}`, this.stats.skipped > 0 ? 'yellow' : 'gray');
    this.log(`   Rate:    ${passRate}%`, passRate >= 90 ? 'green' : passRate >= 70 ? 'yellow' : 'red');
    this.log(`   Time:    ${duration}ms`, 'gray');
    
    if (this.stats.failed > 0) {
      this.log('\n💥 Failures:', 'red');
      this.stats.errors.forEach(error => {
        this.log(`   ${error.file} > ${error.test}:`, 'red');
        this.log(`     ${error.error}`, 'gray');
        if (this.verbose && error.stack) {
          this.log(`     ${error.stack}`, 'gray');
        }
      });
    }
    
    this.log('');
    
    // Exit with error code if tests failed
    if (this.stats.failed > 0) {
      process.exit(1);
    }
  }
}

// Helper function for assertions
global.assert = {
  equals: (actual, expected, message) => {
    if (actual !== expected) {
      throw new Error(message || `Expected ${expected}, got ${actual}`);
    }
  },
  
  true: (value, message) => {
    if (!value) {
      throw new Error(message || `Expected truthy value, got ${value}`);
    }
  },
  
  false: (value, message) => {
    if (value) {
      throw new Error(message || `Expected falsy value, got ${value}`);
    }
  },
  
  throws: (fn, expectedError, message) => {
    try {
      fn();
      throw new Error(message || 'Expected function to throw');
    } catch (error) {
      if (expectedError && !error.message.includes(expectedError)) {
        throw new Error(message || `Expected error containing "${expectedError}", got "${error.message}"`);
      }
    }
  },
  
  contains: (array, item, message) => {
    if (!Array.isArray(array) || !array.includes(item)) {
      throw new Error(message || `Expected array to contain ${item}`);
    }
  },
  
  hasLength: (array, length, message) => {
    if (!Array.isArray(array) || array.length !== length) {
      throw new Error(message || `Expected array length ${length}, got ${array?.length}`);
    }
  },
  
  match: (actual, pattern, message) => {
    if (!pattern.test(actual)) {
      throw new Error(message || `Expected "${actual}" to match pattern ${pattern}`);
    }
  }
};

// Run tests if this file is executed directly
if (require.main === module) {
  const runner = new TestRunner();
  runner.runAllTests().catch(error => {
    console.error('Test runner failed:', error);
    process.exit(1);
  });
}

module.exports = TestRunner;
