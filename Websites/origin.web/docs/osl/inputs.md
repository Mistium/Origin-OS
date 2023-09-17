## UI-Based Inputs:

1. **input**:
   - Parameters: width, height, id, rounding, txt_colour
   - Function: Draws an input field that can be written in by the user.
   - Example: `input 200 30 username 5 #333`

2. **toggle**:
   - Parameters: id, size
   - Function: Draws a toggle switch.
   - Example: `toggle notificationToggle small`

3. **slider**:
   - Parameters: width, height, id
   - Function: Draws a slider.
   - Example: `slider 200 20 volumeSlider`

4. **bar**:
   - Parameters: width, height, rounding, percent (0-1)
   - Function: Draws a progress bar.
   - Example: `bar 300 10 5 0.75`

5. **input_id**:
   - Function: Sets data for an input element.
   - Example: `input_identifier = set-data`
   
---

## Code-Based Inputs:

Key detection is done using the following commands:

1. `"space".pressed`:
   - Function: Returns whether the space key is currently down.
   - Example: `"space".pressed`

2. `"space".released`:
   - Function: Returns whether the space key is currently up.
   - Example: `"space".released`

3. `"space".onpress`:
   - Function: Returns true on the same frame that the space key is pressed.
   - Example: `"space".onpress`

These commands allow you to create and interact with various UI elements and detect key presses within your graphical user interface or game. You can use these commands to design user interfaces and implement interactivity based on user input.
