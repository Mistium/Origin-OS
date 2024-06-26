### Documentation for ActionScript Commands

#### 1. `get.files`

- **Purpose**: Lists all files in the current directory.
- **Usage**: No parameters are required.

#### 2. `get.time`

- **Purpose**: Retrieves the current system time AND the current date.
- **Usage**: No parameters are required.

#### 3. `create.file`

- **Purpose**: Creates a new file with specified name and content.
- **Usage**: Requires `name` and `content` parameters.

#### 4. `read.file`

- **Purpose**: Reads the content of an existing file.
- **Usage**: Requires `name` parameter.

#### 5. `create.dir`

- **Purpose**: Creates a new directory.
- **Usage**: Requires `name` parameter.

#### 6. `delete.file`

- **Purpose**: Deletes an existing file.
- **Usage**: Requires `name` parameter.

#### 7. `delete.dir`

- **Purpose**: Deletes an existing directory.
- **Usage**: Requires `name` parameter.

#### 8. `math`

- **Purpose**: Evaluates a mathematical expression.
- **Usage**: Requires a valid mathematical expression.

#### 9. `unknown.command`

- **Purpose**: Demonstrates handling of an unknown command.
- **Usage**: Not recognized by the system, typically results in an error message.

### Notes

- Each command in the ActionScript performs a specific file operation or mathematical evaluation.
- Parameters for `create.file`, `read.file`, `create.dir`, `delete.file`, `delete.dir`, and `math` are enclosed within curly braces `{}`.
- `unknown.command` is an invalid command and returns an error.

### All functions samples
```
get.files
get.time
create.file {name test.txt content "Hello, World!"}
read.file {name test.txt}
create.dir {name new_directory}
delete.file {name test.txt}
delete.dir {name new_directory}
math {2 + 2}
math {sqrt(16)}
unknown.command
```
