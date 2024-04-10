## Accessing Variables

### Syntax:

```js
log variable_name
// Gets the variable and outputs to the browser console
```

### Example:

```js
score = 100
log score
// Outputs 100 to the browser console
```

## Using Variables

### Syntax:

```js
variable_name = value
```

- Assigns a value to a variable.

### Example:

```js
health = 50
```

## Accessing Specific Items of Arrays

### Syntax:

```js
array_name.[index]
```

- Accesses the item at the specified index in the array. (indexes start at 1)

### Example:

```js
fruits = ["apple", "banana", "orange"]
log fruits.[3]
// Outputs "orange" to the browser console
```

### Additional Example:

```js
log fruits.[1]
// Outputs "apple" to the browser console
```

## Accessing Specific Keys from an Object

### Syntax:

```js
object_name."key"
```

- Accesses the value associated with the specified key in the object.

### Example:

```js
player = {"name":"John","score":100}
log player."name"
// Outputs "John" to the browser console
```

### Additional Example:

```js
log player."score"
// Outputs 100 to the browser console
```

## Moving Data Around

### Syntax:

```js
target_variable = source_variable
```

- Copies the value from the source variable to the target variable.

### Example:

```js
x = 10
y = x
```

### Additional Example:

```js
z = y
log z
// Outputs 10 to the browser console
```

### Additional Notes:
- Variable types are determined dynamically based on their format. `{}` represents an object, `[]` represents an array, and `""` represents a string. Numbers are interpreted as numerical values.
