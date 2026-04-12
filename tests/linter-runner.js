#!/usr/bin/env node

const path = require('path');
const TestRunner = require('./runner.js');

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

const runner = new TestRunner();
runner.runAllTests().catch(error => {
  console.error('Test runner failed:', error);
  process.exit(1);
});
