### Basic Syntax

(Anything in square brackets is where the user can pass data to the command)

[filename].getsave("array"/"text"/"line"/"")

line returns all the data on a single line

null and text are the same, returning the raw file data 

array returns the full file with each line as a seperate item in an array

save [filename.json] "key" [key] [key_data]
 - If the file is a json file you can directly set a key
save [filename] "item" [line_number] [data]
 - Sets a specific item of the file to a data value
save [filename] "append" [data]
 - Appends data to the end of a save file
save [filename] "add"
 - Creates a blank file

---

### Info

These commands offload a lot of work from the user onto the system and can be used for a very wide varienty of things.
