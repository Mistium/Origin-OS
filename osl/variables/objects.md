Certainly! Here's an expansion of the documentation for JSON objects and arrays, including simpler examples for the usage of JSON objects:

---

# About

JSON (JavaScript Object Notation) is a major part of large data storage in OSL. It allows for much more complex data structures over basic variables.

## Defining JSON Objects and Arrays

### JSON Object:

```json
object = {"key":"data","key2":"data2"}
```

### JSON Array:

```json
array = ["data","data2","data3"]
```

For more detailed documentation on arrays, refer to the [Array Documentation](https://github.com/Mistium/Origin-OS/wiki/OSL-%E2%80%90-Arrays).

---

# Official JSON Documentation

For detailed information about JSON, visit the [JSON Documentation](https://www.json.org/json-en.html).

## Setting JSON Array Items

To set JSON array items:

```json
array.[itemid] = "data"
```

## Setting JSON Keys

```json
object."key" = "data"
object.["key"] = "data"
```

## Examples

### Adding Data to an Array

```json
array = ["data",["data2","data3"]]

temp = array.[2]
temp.[2] = "data4"
array.[2] = temp
```

If you run the above code, `array` is now equal to `["data",["data2","data4"]]`.

## Important Note

**Array indexes start at 1!!**

To access an item of an array, use:

```json
item_of_array = array.[index]
```

This is the newer replacement command. The older command, `array.item(index)`, is not widely used anymore.

### Accessing Object Keys

```json
key_of_object = object.["key"]
key_of_object = object."key"
key_of_object = object.key("key")
```

For simpler examples and usage of JSON objects, consider the following scenarios:

## Simple JSON Object Examples

### Student Information

```json
student = {"name": "John", "age": 20, "grade": "A"}
```

### Product Information

```json
product = {"name": "Laptop", "price": 999.99, "brand": "Apple"}

product."version" = "professional"
// set a new key to a value: {"name": "Laptop", "price": 999.99, "brand": "Apple", "version": "professional"}

product."price" = 9999.99
// making the value more realistic :3
```

These examples demonstrate basic usage of JSON objects to store various types of data. JSON objects allow for organizing related information into a structured format, enhancing data management and retrieval in OSL scripts.
