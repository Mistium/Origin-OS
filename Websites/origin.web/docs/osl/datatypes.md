OSL supports the following data types:

1. **String**:
   - Defined by enclosing text in double quotation marks (`"`).
   - Example: `"Hello"`

2. **Boolean**:
   - Represented as `True` or `False` (case-insensitive).
   - No need for double quotation marks.
   - Example: `True`

3. **Number**:
   - Represented as numeric values that may include decimal points and negative signs.
   - No need for double quotation marks.
   - Must match the regex pattern `[0-9.\-]+`.
   - Example: `-1.75`

4. **JSON Array**:
   - Defined by enclosing a comma-separated list of values within square brackets (`[]`).
   - Example: `["Hi", "how", "are", "you"]`

5. **JSON Object**:
   - Defined by enclosing key-value pairs within curly braces (`{}`).
   - Example: `{"hello": ["how", "are", "you"]}`

6. **null**:
   - Defined by being an empty variable
   - Example: 

These data types allow OSL scripts to work with various kinds of data, from simple strings and numbers to more complex data structures like JSON arrays and objects. This flexibility enables OSL scripts to handle a wide range of tasks and data manipulation.
