The .append("string") method is used to add a new element to the end of an array. In the example provided, the string "goodbye" is appended to the array ["hi"]. The result is a new array ["hi", "goodbye"]

.append("string")
["hi"].append("goodbye")
outputs ["hi","goodbye"]

---

The .index("string") method is used to find the index of a specific element in an array. In the example provided, the index of "hi" in the array ["hi", "goodbye"] is found. The output is 1
Note that array indices start from 1, so the first element of an array is at index 1.

.index("string")
["hi","goodbye"].index("hi")
returns 1

---

The .delete(int) method is used to remove an element from an array at a specific index. 

.delete(int)
["hi","goodbye"].delete(1)
returns ["goodbye"]

---

.item(int) / .[int]
gets the item at "int" of the selected array

.join("string")
["hello","how are you"].join(", ") 
outputs "hello, how are you"

.split("string")
"hello, how are you".split(" ") 
outputs ["hello,","how","are","you"]

---

Legacy Commands

THESE COMMANDS ARE DEPRECIATED AND NO LONGER WORK IN VERSIONS OF ORIGIN ABOVE 150

this command sets the inputted "index" in "array" to "value" and outputs the result in the "data" variable
list array "set" index value

this command deletes the inputted "index" in "array" and outputs the result in the "data" variable
list array "delete" "index"
