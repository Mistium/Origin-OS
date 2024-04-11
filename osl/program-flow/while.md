## while condition (commands):
  - The `while` statement repeats a block of code while a condition is true.

Example:
```lua
while boolean (
   command
   command
)
```

### Syntax:
```
while <condition> (
    <commands>
)
```

- `<condition>`: The condition that determines whether to continue executing the block of commands.
- `<commands>`: The commands to be executed within the loop.

### Example:
```lua
while distance_to_object < 10 (
    robot "moveForward" 10
    robot "turnLeft" 10

    robot "get_data"
    distance_to_object = robot."sensor1"
)
```

In this example, the robot will keep moving forward and turning left as long as there is an obstacle ahead.

## until condition (commands):
  - The `until` statement repeats a block of code until a condition is true.

Example:
```lua
until boolean (
   command
   command
)
```

### Syntax:
```lua
until <condition> (
    <commands>
)
```

- `<condition>`: The condition that determines whether to stop executing the block of commands.
- `<commands>`: The commands to be executed within the loop.

### Example:
```lua
until isGoalReached (
  // do things to get to goal
)
```

In this example, the robot will keep moving forward until the goal is reached.

### Additional Examples and Use Cases:
1. **User Input Validation with `while`:**
```lua
-- Ask for user input until a valid value is entered
userInput = null
while userInput != null (
    userInput = "hello".ask
)
```
This example demonstrates how the `while` statement can be used to repeatedly prompt the user for input until a valid value is entered.

2. **Waiting for External Event with `until`:**
```lua
-- Wait until a sensor detects an object
local objectDetected = false
until objectDetected (
    robot "get_data"
    objectDetected = robot."detected"
)
```
Here, the `until` statement is used to wait until a sensor detects an object before proceeding with the next set of commands.
