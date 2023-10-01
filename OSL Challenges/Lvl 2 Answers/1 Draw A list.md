array = ["Hello", "World", "This", "Is", "An", "Array"]

// Initializes an array called 'array' with some strings.

window "show"

// Shows the window.

mainloop:

// Enters the main loop.

c #fff

// Sets the color to '#fff'.

count = 0

// Initializes a variable 'count' and sets it to 0.

loop array.len (

// Enters a loop for the length of the 'array'.

count += 1

// Increments the 'count' variable by 1.

loc 2 2 20 count * -20

// Sets the location for text drawing.

text array.[count] 8

// Draws text from the 'array' based on the 'count' value.

)

// closes the loop

import "win-buttons"

// imports the window buttons
