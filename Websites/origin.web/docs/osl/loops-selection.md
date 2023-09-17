
## Main Loop Label:

- **mainloop:**:
  - This is a label that serves as the entry point for an application's script after the first run cycle. It's where the program starts running after the initial setup.

## Conditional Statements (if):

- **if condition (commands)**:
  - The `if` statement is used to test a condition. If the condition is true, the code within the block (enclosed in parentheses) is executed.
  - Example: `if condition (`

## Looping Constructs (loop):

- **loop number-of-times (commands)**:
  - The `loop` statement is used to repeat a block of code a specified number of times.
  - Example: `loop number-of-times (`

- **until condition (commands)**:
  - The `until` statement is used to repeat a block of code until a condition is met.
  - Example: `until boolean (`

## Control Flow (goto and label):

- **goto "label_name"**:
  - The `goto` command is used to jump to a specified label within the script.
  - Example: `goto "label_name"`

- **label "label_name"** or **label_name:**:
  - The `label` command defines a label that can be used as a target for the `goto` command.

## Including External Files:

- **import "file_path"** or **import "file_name" "file_type"**:
  - The `import` command is used to run another OSL file's data. You can specify the file by its path or name and type.

## Running Commands in a JSON Array:

- **run ["command","command2"]**:
  - The `run` command is used to loop through a JSON array and execute the specified commands inside the array.

## Breaking Out of Loops (break):

- **break**:
  - The `break` command is used to immediately exit from a loop or selection and continue with the code outside the loop.

Please note that some constructs are marked as currently unsupported, which implies that they may not be functional in your current scripting environment. These constructs provide control over the flow of your script, allowing you to make decisions, loop through code, and navigate within your application's logic.
