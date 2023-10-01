window "show"
// Displays a window.

mainloop:
// Enters the main loop.

array = "hello how are you".split(" ")
// Initializes an array 'array' by splitting the given string into words.

loc 2 2 20 -20
// Sets the location for text drawing with x = 2 and y = 2, and decrements y by 20 for each subsequent text.

colour #fff
// Sets the text color to white (#fff).

count = 0
// Initializes a variable 'count' and sets it to 0.

loop 4 (
// Enters a loop that will execute 4 times.

count += 1
// Increments the 'count' variable by 1.

if count.pressed "current = count"
// Checks if the 'count' variable is pressed and assigns its value to 'current' if true.

)

text "<current>: <array.[current]>" 10\
// Draws text displaying the value of 'current' and the corresponding element from 'array', with a font size of 10.
