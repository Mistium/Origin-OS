## loop
  - The `loop` statement repeats a block of code a specified number of times.

Example:
```lua
loop 5 (
   command
   command
)
```

### Syntax:
```
loop <number-of-times> (
    <commands>
)
```

- `<number-of-times>`: The number of times to repeat the block of commands.
- `<commands>`: The commands to be executed within the loop.

### Example:
```lua
loop 3 (
    moveForward
    turnLeft
)
```

In this example, the robot will move forward and then turn left three times.

### Additional Examples and Use Cases:
1. **Fibonacci Sequence Generation:**
```lua
// Generate Fibonacci sequence up to n terms
def "fibonacci" "total_loops"
    a = 0
    b = 0
    c = 1
    loop total_loops (
        a = b + c
        b = c
        c = a
    )
    return = c
endef

// Usage:
loop 10 (
  fibonacci 5
  say return
)
```
This example demonstrates how the `loop` command can be used to repeatedly generate the Fibonacci sequence with a specified number of terms.

2. **Repeated Task Execution:**
```lua
// Perform a task repeatedly for a certain duration
def "performTask"
    // Your task implementation goes here
endef

// Usage:
loop 10 (
    performTask
)
```
Here, the `loop` command is used to execute a task function multiple times, which can be useful for performing repetitive tasks within a program.
