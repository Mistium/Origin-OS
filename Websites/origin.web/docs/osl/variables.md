
## Variable Assignment:

- **variablename = "assign-data"**:
  - This command sets a variable with the specified name (`variablename`) to the inputted data ("assign-data").
  - Example: `count = 10` sets the variable `count` to the value `10`.
  - Setting a variable to an array: `array = ["hello","world"]` sets the variable `array` to the value `["hello","world"]`

## List Item Assignment:

- **list.[itemnumber] = "assign-data"**:
  - This command sets the selected item of a list (specified by `[itemnumber]`) to the inputted data ("assign-data").
  - Example: `mylist.[2] = "new_value"` sets the third item in the list `mylist` to the value `"new_value"`.

## JSON Object Key Assignment:

- **object.key("key") = "assign-data"**:
  - This command sets the selected key of a JSON object (specified by `"key"`) to the inputted data ("assign-data").
  - Example: `myobject.key("name") = "John"` sets the value associated with the key `"name"` in the JSON object `myobject` to `"John"`.

---

## Arithmetic Modifiers:

- **variable += 10**:
  - This code appends ten to the end of a string or adds ten to a number data type.
  - Example: `count += 5` would increment the value of the variable `count` by 5.

- **variable \*= 5**:
  - Sets the variable to itself multiplied by 5. This operation works only on number data types.
  - Example: `total *= 2` would double the value of the variable `total`.

- **variable /= 5**:
  - Sets the variable to itself divided by 5. This operation works only on number data types.
  - Example: `price /= 2` would halve the value of the variable `price`.

- **variable -= 5**:
  - Sets the variable to itself minus 5. This operation works only on number data types.
  - Example: `balance -= 10` would subtract 10 from the value of the variable `balance`.

These commands and modifiers allow you to manipulate variables, lists, and JSON objects, performing assignments and arithmetic operations as needed in your script.
