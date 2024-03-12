## Variable Assignment:

### **variablename = "assign-data"**:
  
**Description:** Sets a variable with the specified name (`variablename`) to the inputted data ("assign-data").

**Example:**
- Setting a variable to a single value:
```
count = 10
```
This sets the variable `count` to the value `10`.

- Setting a variable to an array:
```
array = ["hello", "world"]
```
This sets the variable `array` to the array `["hello", "world"]`.

- Setting a variable to a JSON object:
```
obj = {"name": "John", "age": 30}
```
This sets the variable `obj` to the JSON object `{"name": "John", "age": 30}`.

## List Item Assignment:

- **list.[itemnumber] = "assign-data"**:
**Description:** Sets the selected item of a list (specified by `[itemnumber]`) to the inputted data ("assign-data").
**Example:**
```
mylist.[2] = "new_value"
```
This sets the third item in the list `mylist` to the value `"new_value"`.

## JSON Object Key Assignment:

- **object.key("key") = "assign-data"**:
**Description:** Sets the selected key of a JSON object (specified by `"key"`) to the inputted data ("assign-data").
**Example:**
```
myobject.key("name") = "John"
```
This sets the value associated with the key `"name"` in the JSON object `myobject` to `"John"`.

- **object."key" = "assign-data"**:
**Description:** Sets the selected key of a JSON object (specified by `"key"`) to the inputted data ("assign-data").
**Example:**
```
myobject."name" = "John"
```
This sets the value associated with the key `"name"` in the JSON object `myobject` to `"John"`.

- **object.["key"] = "assign-data"**:
**Description:** Sets the selected key of a JSON object (specified by `"key"`) to the inputted data ("assign-data").
**Example:**
```
myobject.["name"] = "John"
```
This sets the value associated with the key `"name"` in the JSON object `myobject` to `"John"`.

---

## Arithmetic Modifiers:

- **variable += 10**:
**Description:** Adds 10 to the variable's current value.
**Example:**
```
count += 5
```
This increments the value of `count` by 5.

- **variable \*= 5**:
**Description:** Multiplies the variable's current value by 5.
**Example:**
```
total *= 2
```
This doubles the value of `total`.

- **variable /= 5**:
**Description:** Divides the variable's current value by 5.
**Example:**
```
price /= 2
```
This halves the value of `price`.

- **variable -= 5**:
**Description:** Subtracts 5 from the variable's current value.
**Example:**
```
balance -= 10
```
This subtracts 10 from `balance`.

- **variable %= 5**:
**Description:** Performs a modulus operation on the variable's current value.
**Example:**
```
balance %= 10
```
This does a modulus calculation on `balance`.

These commands and modifiers enable you to manipulate variables, lists, and JSON objects, performing assignments and arithmetic operations as needed in your script.

### Example Programs:

#### Program 1: Array Manipulation
```lua
// Setting up an array
colors = ["red", "green", "blue"]

// Adding a new color to the array
colors.[3] = "yellow"

// Displaying the modified array
log colors
// Output: ["red", "green", "blue", "yellow"]
```

#### Program 2: JSON Object Manipulation
```lua
// Setting up a JSON object
person = {"name": "Alice", "age": 25}

// Updating their age
person."age" = 26

-- Displaying the modified JSON object
log person
// Output: {"name": "Alice", "age": 26}
```

#### Program 3: Arithmetic Operations
```lua
// Setting up variables
x = 10
y = 5

// Performing arithmetic operations
x += y
// Incrementing x by y
y *= 2
// Doubling y

-- Displaying the updated values
log "x:" + x
// Output: x: 15
log "y:" + y
// Output: y: 10
```

These example programs demonstrate how to use variable assignment, list item assignment, JSON object key assignment, and arithmetic modifiers in practical scenarios.
