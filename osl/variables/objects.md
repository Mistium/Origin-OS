# About

JSON (JavaScript Object Notation) is a major part of large data storage in OSL. It allows for much more complex data structures over basic variables.

## Defining JSON Objects and Arrays

### JSON Object:

```js
object = {"key":"data","key2":"data2"}
```

### JSON Array:

```js
array = ["data","data2","data3"]
```

For more detailed documentation on arrays, refer to the [Array Documentation](https://github.com/Mistium/Origin-OS/wiki/OSL-%E2%80%90-Arrays).

---

# Official JSON Documentation

For detailed information about JSON, visit the [JSON Documentation](https://www.json.org/json-en.html).

## Setting JSON Array Items

To set JSON array items:

```js
array.[itemid] = "data"
```

## Setting JSON Keys

```js
object."key" = "data"
object.["key"] = "data"
```

## Examples

### Adding Data to an Array

```js
array = ["data",["data2","data3"]]

temp = array.[2]
temp.[2] = "data4"
array.[2] = temp
```

If you run the above code, `array` is now equal to `["data",["data2","data4"]]`.

## Important Note

**Array indexes start at 1!!**

To access an item of an array, use:

```js
item_of_array = array.[index]
```

This is the newer replacement command. The older command, `array.item(index)`, is not widely used anymore.

### Accessing Object Keys

```js
key_of_object = object.["key"]
key_of_object = object."key"
key_of_object = object.key("key")
```

For simpler examples and usage of JSON objects, consider the following scenarios:

## Simple JSON Object Examples

### Student Information

```js
student = {"name": "John", "age": 20, "grade": "A"}
```

### Product Information

```js
product = {"name": "Laptop", "price": 999.99, "brand": "Apple"}

product."version" = "professional"
// set a new key to a value:
// {"name": "Laptop", "price": 999.99, "brand": "Apple", "version": "professional"}

product."price" = 9999.99
// making the value more realistic :3
```
