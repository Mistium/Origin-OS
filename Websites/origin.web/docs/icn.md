
### Drawing Lines:

- **line x1 y1 x2 y2**:
  - Draws a line between two sets of x, y positions, specified by `(x1, y1)` and `(x2, y2)`.

- **cont x y**:
  - Continues the current line to the specified x, y position.
  
- **path**:
  - Defines a path consisting of a series of x, y coordinates enclosed within parentheses.
  - Example:
    ```
    path
    x1 y1
    x2 y2
    x3 y3
    ```
    This creates a path with three points `(x1, y1)`, `(x2, y2)`, and `(x3, y3)`.

### Setting Attributes:

- **c #hex-colour**:
  - Sets the color of subsequent objects using a hexadecimal color code.
  
- **w int**:
  - Sets the width of subsequent objects to the specified integer value.

### Drawing Shapes:

- **square x y width height**:
  - Draws an outline of a square at the specified `(x, y)` position with the given `width` and `height`.

- **dot x y**:
  - Draws a single dot at the specified `(x, y)` position.

- **cutcircle x y size angle filled**:
  - This command creates a circle at the `(x, y)` position.
  - It sets the radius of the circle to "size."
  - It rotates the circle to the specified "angle" in degrees.
  - It fills the outline of the circle with "filled" degrees of the line.
  
  Examples:
  - `cutcircle 0 0 10 0 180` creates an outline of a full circle.
  - `cutcircle 0 0 10 0 90` creates an outline of a half circle facing upwards.
  - `cutcircle 0 0 10 9 90` creates an outline of a half circle facing right.
  - `cutcircle 0 0 10 18 90` creates an outline of a half circle facing downwards.

These commands allow you to define and render various shapes and vectors in .Icn files, specifying their positions, colors, sizes, and orientations to create graphical elements for the GUI system.
