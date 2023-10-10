window "show"

// shows the window

count = 0

// sets count to 0

mainloop:

square 200 30 20 0 1

// draws an invisible square at 0 0

c #333

// sets the colour to `#333`

if clicked "c #555"

// sets the colour to `#555` only if the square command on line 9 was clicked

if clicked and can (

// runs this code only if the square is not being clicked last frame and is being clicked this frame

can = false

// sets the can variable to false, meaning this code will not be able to run again until the square isn't being clicked

count += 1

// changes the count variable by 1

)

if clicked.not "can = true"

// sets can to true whenever the square is not clicked

square 200 30 20 1

// draws a visible square at 0 0

goto -100 0

// sets the x y for any subsequent commands to -100 0

text "Clicks \<count\>" 10 : c#fff

// draws text displaying the number of times that the button has been clicked

import "win-buttons"

// imports the window buttons
