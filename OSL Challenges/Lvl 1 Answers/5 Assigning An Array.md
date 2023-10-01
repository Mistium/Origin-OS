window "show"

// Displays a window.

mainloop:

// Enters the main loop.

array = ["hello", "how", "are", "you"]

// Initializes an array 'array' with some strings.

loc 2 2 20 -20

// Sets the location for text drawing with x = 2 and y = 2, and decrements y by 20 for each subsequent text.

colour #fff

// Sets the text color to white (#fff).

text array 10

// Draws text using the 'array' with a font size of 10.
