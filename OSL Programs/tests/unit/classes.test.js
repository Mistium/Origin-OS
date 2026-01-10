const helper = require('../helper.js');

const tests = [
  helper.createTest(
    'Basic class property access',
    `
      class Person (
        name = "Unknown"
        age = 0
      )

      log Person.name
      log Person.age
    `,
    { expect: ['Unknown', 0] }
  ),

  helper.createTest(
    'Class method execution',
    `
      class Greeter (
        greeting = "Hello"

        def greet() (
          return greeting
        )
      )

      log Greeter.greet()
    `,
    { expect: ['Hello'] }
  ),

  helper.createTest(
    'Class property mutation via method',
    `
      class Counter (
        count = 0

        def inc() (
          self.count ++
          return count
        )
      )

      log Counter.inc()
      log Counter.inc()
      log Counter.count
    `,
    { expect: [1, 2, 2] }
  ),

  helper.createTest(
    'Private property inaccessible externally',
    `
      class User (
        username = "guest"
        _password = "secret"
      )

      log User.username
      log User._password
    `,
    { expect: ['guest', null] }
  ),

  helper.createTest(
    'Private property accessible inside class',
    `
      class User (
        _password = "secret"

        def get() (
          return _password
        )
      )

      log User.get()
    `,
    { expect: ['secret'] }
  ),

  helper.createTest(
    'Inheritance property override',
    `
      class Animal (
        sound = "?"
        def speak() (
          return sound
        )
      )

      class Dog extends Animal (
        sound = "Woof"
      )

      log Dog.speak()
    `,
    { expect: ['Woof'] }
  ),

  helper.createTest(
    'Inheritance method access',
    `
      class Base (
        value = 5
        def get() (
          return value
        )
      )

      class Child extends Base (
        // empty
      )

      log Child.get()
    `,
    { expect: [5] }
  ),

  helper.createTest(
    'Class cloning creates independent copy',
    `
      class Counter (
        count = 0
      )

      a = Counter
      b = Counter

      a.count = 10

      log a.count
      log b.count
    `,
    { expect: [10, 0] }
  ),

  helper.createTest(
    'Class referencing shares state',
    `
      class Counter (
        count = 0
      )

      a @= Counter
      b @= Counter

      a.count = 7

      log b.count
      log Counter.count
    `,
    { expect: [7, 7] }
  ),

  helper.createTest(
    'Method context uses class scope',
    `
      class Math (
        value = 10

        def add(x) (
          self.value = value + x
          return value
        )
      )

      log Math.add(5)
      log Math.value
    `,
    { expect: [15, 15] }
  ),

  helper.createTest(
    'Multiple method calls preserve state',
    `
      class Tracker (
        count = 0

        def hit() (
          self.count ++
          return count
        )
      )

      log Tracker.hit()
      log Tracker.hit()
      log Tracker.hit()
    `,
    { expect: [1, 2, 3] }
  ),

  helper.createTest(
    'Private data encapsulation',
    `
      class Store (
        _data = {}

        def set(k, v) (
          self._data[k] = v
          return true
        )

        def get(k) (
          return _data[k]
        )
      )

      s = Store
      void s.set("x", 42)
      log s.get("x")
    `,
    { expect: [42] }
  )
];

module.exports = { tests };
