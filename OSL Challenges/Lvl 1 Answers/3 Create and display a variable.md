window "show"

// shows the window

count = 0

// sets the variable "count" to 0

mainloop:

count += 1

// changes the count variable by 1

goto 0 0

// goes to (x 0, y 0)

colour #fff

// sets the colour for all subsequent commands to #fff

text "<count>" 10

// Draws the value of count as text at 0 0
