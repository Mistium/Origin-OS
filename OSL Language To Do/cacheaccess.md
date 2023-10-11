### Basic Syntax

guicache "clearall" // Deletes the entire cache of all saved commands

guicache "clear" id // Deletes a selected command from the cache

guicache "set" id "data" // Sets an index of the cache to an inputted command

guicache "get" id // Returns a command in the cache

guicache "insert" "data" id // Inserts a command into the cache

guicache "inuse" true/false // this command allows you to change whether the window displays the gui cache or the current runtime gui elements

gui_cache = window cache data

---

### Function Osl Equivalent

You can technically build a caching system within the osl engine, however these commands interact directly with the window caching system.

There is therefore no osl equivalent for this system

---

### Example Use

This command is inteded to be used over a large program in order to help with optimisations, it is difficult to show how it could be used in a small program.
