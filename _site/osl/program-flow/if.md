### if Statements

In the OSL language, `if` statements are pivotal for controlling the flow of a program based on certain conditions. Below is a breakdown of how `if` statements work:

#### Basic `if` Statement:

The basic `if` statement tests a condition. If the condition is true, the commands within the block are executed. If not, the program moves to the next section.

Example:
```lua
if condition (
   say "command1"
   say "command2"
)
```

### if-else Statements

`if-else` statements allow for alternative code blocks to be executed if the condition is false.

#### `if-else` Statement:

If the condition in the `if` statement is true, the commands within the first block are executed. Otherwise, the commands within the `else` block are executed.

Example:
```lua
if condition (
   say "command1"
   say "command2"
) else (
   say "command3"
   say "command4"
)
```

### else-if Statements

`else-if` statements allow for multiple conditions to be checked sequentially. If one condition is true, the corresponding block of code is executed.

#### `else-if` Statement:

Multiple conditions can be checked using `else-if`. If the condition in the `if` statement is false, the program checks the condition in the `else-if`. If that's true, the corresponding block of commands is executed.

Example:
```lua
if condition1 (
   say "command1"
   say "command2"
) else if condition2 (
   say "command3"
   say "command4"
) else (
   say "command5"
   say "command6"
)
```

### Short Forms

Short forms of `if` and `if-else` statements can be used for concise syntax.

#### Short Form of if Statement:

```lua
if condition "command1"
```

#### Short Form of if-else Statement:

```lua
if condition "command1" else "command2"
```

### Additional Information on Conditional Statements (if):

- Conditions can involve logical operators (`and`, `or`, `not`) and comparison operators (`==`, `~=`, `<`, `>`, `<=`, `>=`).
- Conditions can also include function calls that return boolean values.
- `if` statements can be nested within each other to create more complex decision-making structures.

Now, let's look at examples for each type of statement:

### Examples:

#### Basic `if` Statement:

```lua
-- Example of a basic if statement
-- If the temperature is greater than 25, it's considered a hot day
local temperature = 30
if temperature > 25 (
    say "It's a hot day!"
)
```
In this example, the `if` statement checks if the `temperature` variable is greater than 25. If the condition is true, the program executes the commands inside the block, which outputs "It's a hot day!" using the `say` command.

#### `if-else` Statement:

```lua
-- Example of an if-else statement
-- Determines if a person is an adult or a minor based on their age
local age = 17

if age >= 18 (
    say "You are an adult."
) else (
    say "You are a minor."
)
```
In this example, the `if-else` statement checks if the `age` variable is greater than or equal to 18. If the condition is true, it outputs "You are an adult." If the condition is false, it outputs "You are a minor."

#### `else-if` Statement:

```lua
-- Example of an else-if statement
-- Assigns a letter grade based on a numerical grade
local grade = 85

if grade >= 90 (
    say "You got an A."
) else if grade >= 80 (
    say "You got a B."
) else if grade >= 70 (
    say "You got a C."
) else (
    say "You need to improve your grade."
)
```
In this example, the `else-if` statement checks multiple conditions to determine the letter grade based on the `grade` variable. If the grade is greater than or equal to 90, it outputs "You got an A." If the grade is between 80 and 89, it outputs "You got a B." If the grade is between 70 and 79, it outputs "You got a C." Otherwise, it outputs "You need to improve your grade."

#### Short Forms:

```lua
-- Short forms of if and if-else statements
-- These provide a concise way to write simple conditional statements
-- Short form of if statement
local x = 8
say(x > 5)

-- Short form of if-else statement
local y = 3
say(y > 5)
```

In these examples, the short forms of `if` and `if-else` statements are shown. These are useful for writing simple conditional statements in a concise manner. The condition is directly followed by the command to execute if the condition is true. If an `else` block is required, it's written after `else`, followed by the command to execute if the condition is false.
