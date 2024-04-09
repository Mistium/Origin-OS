## Arrays

Arrays are used to store multiple values in a single variable. Each value in an array is accessed by its index.

### Creating Arrays

Arrays can be created using square brackets `[]` and separating values with commas.

Values can be any type mixed and matched

#### Syntax:

```js
array_name = [value1, value2, ...]
```

#### Example:

```js
numbers = [1, 2, 3, 4, 5]

my_data = ["hello",1,53,{"test":"hi"}]

test = "Array".new(100)
// creates an array of 100 elements: ["","", ...]

```

### Accessing Array Elements

Array elements are accessed using square brackets `.[index]` and specifying the index of the element.

#### Syntax:

```js
array_name.[index]
```

#### Example:

```js
log numbers.[2]
// Outputs 3 to the browser console
```

### Modifying Array Elements

Array elements can be modified by assigning a new value to a specific index.

#### Syntax:

```js
array_name.[index] = new_value
```

#### Example:

```js
numbers.[0] = 10
log numbers.[0]
// Outputs 10 to the browser console
```

### Array Length

The length of an array can be obtained using the `len` property.

#### Syntax:

```js
array_name.len
```

#### Example:

```js
log numbers.len
// Outputs the length of the array to the browser console
```

### Adding Elements to an Array

New elements can be added to the end of an array using the `append()` method.

#### Syntax:

```js
array_name.append(new_element);
```

#### Example:

```js
numbers.append(6);
// adds 6 to the end of the array
```

### Removing Elements from an Array

Elements can be removed from an array using the `delete()` method.

#### Syntax:

```js
array_name.delete(int)
// deletes an item in the array
```

#### Example:

```js
numbers.delete(1)
// deletes the first item in the array
```

The last element in the array can be removed using the `pop()` method.

#### Syntax:

```js
array_name = array_name.pop()
// deletes the last item in the array
```

#### Example:

```js
array_name.pop()
// deletes the last item in the array
```

### Inserting items into an array

Elements can be inserted into an array using the `insert()` method.

#### Syntax:

```js
array_name.insert(index,data)
// Inserts data into an index of the array
```

#### Example:

```js
numbers.insert(1,"hello")
// Inserts the value "hello" at index 1 of the array
```

### Creating Arrays from strings

Arrays can be created from a string using the `split()` method.

#### Syntax:

```js
string.split(delimiter)
// Creates an array from the input string split into parts based on the delimiter
```

#### Example:

```js
string = "hello how are you?"
log string.split(" ")
// logs ["hello","how","are","you?"] to the browser console
```

### Creating Strings from Arrays

Strings can be created from an array using the `join()` method.

#### Syntax:

```js
array.join(delimiter)
// Creates a string from the input array based on the delimiter
```

#### Example:

```js
array = ["hello","how","are","you?"]
log array.join("/")
// logs "hello/how/are/you?" to the browser console
```

### Finding an element in an array

Elements can be found in an array using `index()` method.

#### Syntax:

```js
array_name.index("item_string")
// finds an item in the array
```

#### Example:

```js
numbers = [2,5,6,1]

log numbers.index(1)
// logs 4 to the browser console, because `1` is at position 4
```

### Iterating Over Arrays

Arrays can be iterated using commands such as `loop`

#### Syntax - Loop:

```js
i = 0
loop total_loops_to_complete (
    i ++
    // iterate the pointer
    
    // Access array elements using array_name.[i]
)
```

### Example - For Loop:

```js
numbers = [2,5,6,1]
i = 0
loop array_name.len (
    i ++
    // iterate the pointer
    log numbers.[i]
    // Logs the item of numbers to the browser console
)
```
