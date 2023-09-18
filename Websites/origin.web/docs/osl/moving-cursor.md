The cursor in this context, refers to the position wher the next graphics command will draw a ui element
for example

`goto 100 0`
`square 50 50 10 1`

[`square 50 50 10 1`](https://github.com/Mistium/Origin-OS/blob/main/Websites/origin.web/docs/osl/ui.md#main-ui-elements)

draws a square at 0 0

## `goto x y`:

- This command moves the cursor to the specified x and y coordinates on the screen.
- Example: `goto 100 200` would move the cursor to the position (100, 200) on the screen.

## `change_x x`:

- This command changes the x coordinate of the cursor to the specified value.
- Example: `change_x 50` would set the cursor's x-coordinate to 50.

## `change_y y`:

- This command changes the y coordinate of the cursor to the specified value.
- Example: `change_y 75` would set the cursor's y-coordinate to 75.

## `change x y`:

- This command changes both the x and y coordinates of the cursor to the specified values.
- Example: `change 50 75` would set the cursor's position to (50, 75).

## `loc a b c d`:

- This command moves the cursor relative to the current frame's dimensions. The parameters a, b, c, and d are used to calculate the new cursor position.
- The `loc` command is equivalent to a sequence of commands:
  - `goto frame_width * -1 / a frame_height / b` sets the cursor's position relative to the frame's dimensions.
  - `change c d` then adjusts the cursor's position further in the x and y directions.
- This command allows you to move the cursor relative to the frame's dimensions, which can be useful when dealing with different screen sizes or resolutions.

These cursor positioning commands provide control over the cursor's movement in a graphical environment, enabling you to specify absolute and relative positions on the screen.
