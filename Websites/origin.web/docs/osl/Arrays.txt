
## Array Methods:

1. **.append("string")**:
   - Adds a new element (in this case, a string) to the end of an array.
   - Example: `["hi"].append("goodbye")` results in `["hi", "goodbye"]`.

2. **.index("string")**:
   - Finds the index of a specific element (string) in an array.
   - Example: `["hi", "goodbye"].index("hi")` returns `1`, with array indices starting from 1.

3. **.delete(int)**:
   - Removes an element at a specific index from an array.
   - Example: `["hi", "goodbye"].delete(1)` returns `["goodbye"]`.

4. **.item(int)** or **.[int]**:
   - Retrieves the item at a specific index in the array.
   - Example: `["hi", "goodbye"].item(1)` returns `"hi"`.

5. **.join("string")**:
   - Combines all elements of an array into a single string, separated by the specified separator.
   - Example: `["hello", "how are you"].join(", ")` returns `"hello, how are you"`.

6. **.split("string")**:
   - Splits a string into an array of substrings, separated by the specified separator.
   - Example: `"hello, how are you".split(" ")` returns `["hello,", "how", "are", "you"]`.

---

## Deprecated Commands (Not Supported in Versions Above 150):

1. **list array "set" index value**:
   - Sets the element at the specified "index" in the "array" to the given "value."

2. **list array "delete" "index"**:
   - Deletes the element at the specified "index" in the "array."

These commands and methods are valuable for working with arrays and strings, allowing for various data manipulation and extraction operations. However, it's important to note that the "list array" commands are deprecated and no longer supported in newer versions of Origin above 150.
