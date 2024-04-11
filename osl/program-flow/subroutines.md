## Custom Commands

### Definition Syntax:

```js
def "name" "input1,input2,input3,input4"
    // Your custom command logic here
endef
```

You can use spaces in a custom command's variable definiton if you want, the parser will ignore them

- **def**: Opens a define command block for creating custom commands.
- `"name"`: Represents the name of the custom command.
- `"input1,input2,input3,input4"`: Defines the input parameters that the custom command can accept.

### Usage Syntax:

```js
name "arg1" "arg2" ...
```

- To use a definition, you must use the definition name followed by the inputs, separated by spaces.
- Example: `test_command "hello" 10` runs the `test_command` with the inputs `"hello"` and `10`.

### Example:

```js
def "test_command" "input1,input2"
    log input1
    log input2
endef
```

## Event Command

### Syntax:

```js
event "value1" "condition" "value2"
    // Your event logic here
endev
```

### Conditions:

- `"pressed"`: Runs the event if a key is pressed.
- `"=="`: Runs the event if `value1` is the same as `value2`.
- `"!="`: Runs the event if `value1` is different from `value2`.

### Example:

```js
event "space" "pressed"
    if touched_ground (
        y_velocity = 30
    )
endev
```

Explanation:

- Custom commands can be defined using the `def` block, specifying the name and input parameters.
- Commands are invoked by simply calling their name with the required arguments.
- Events can be defined to trigger based on specified conditions, executing custom logic when the condition is met.

These examples demonstrate how to create custom commands, utilize them, and define events in your script, enhancing modularity and readability.
