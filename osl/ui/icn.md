# Rendering Icons In OSL

The icon command renders a single ".icn" file that can be created locally on your account or pulled from the system.

### Functionality

The icon command allows you to display icons within your OSL application. These icons can be sourced from files in the system's Icons folder, specified by their names, or created using raw icon data directly within the command.

### Syntax

```osl
icon "code/name" size
```

### Parameters

- `"code/name"`: Specifies the name of the icon file or provides raw icon code for rendering.
- `size`: Sets the multiplier for the size of the icon to be rendered. (1 indicates the original size of the icon)

### Color Modifier

You can modify the color of the icon using a modifier syntax:

```osl
icon "code/name" size : c#fff
```

### Icon Creation Recommendations

It's recommended to keep all icon data inside the application and avoid referencing locally created icons. This ensures consistent access to icons across different users.

### Examples

1. Display an icon named "my_icon" with a size multiplier of 1:
   ```osl
   icon "my_icon" 1
   ```

2. Draw an "X" icon using raw icon code and set its size to 2:
   ```osl
   icon "c #fff line -10 10 10 -10 line -10 -10 10 10" 2
   ```

3. Display an icon using an array of icon data and set its color to white (#fff):
   ```osl
   icon ["c","#fff","line","-10","10","10","-10","line","-10","-10","10","10"] 1 : c#fff
   ```

### Notes

- Ensure that icon files are accessible to all users by storing them within the application rather than locally.

```js
// Define the icon code as a variable
my_icon_code = ["c","#fff","line","-10","10","10","-10","line","-10","-10","10","10"]

// Render the icon using the variable
icon my_icon_code 2
```

In this example:
- We define an icon code as a variable named `my_icon_code`.
- The icon code is specified as an array containing instructions to draw the icon.
- Later, we use the `icon` command and pass the `my_icon_code` variable as the icon data. We also set the size multiplier to `2` to make the icon larger.
- 
This approach allows you to store icon data directly within your application's script, ensuring accessibility to all users without relying on external files or resources.


# Writing icn code

### Drawing Lines:

- **line x1 y1 x2 y2**:
  - Draws a line between two sets of x, y positions, specified by `(x1, y1)` and `(x2, y2)`.

- **cont x y**:
  - Continues the current line to the specified x, y position.
 

### Setting Attributes:

- **c #hex-colour**:
  - Sets the color of subsequent objects using a hexadecimal color code.
  
- **w int**:
  - Sets the weight of the lines in subsequent objects to the specified number value

### Drawing Shapes:

- **square x y width height**:
  - Draws an outline of a square at the specified `(x, y)` position with the given `width` and `height`.

- **dot x y**:
  - Draws a single dot at the specified `(x, y)` position.

- **cutcircle x y size angle filled**:

  `cutcircle x y size angle(0 to 36) filled(0 to 360)`

  - This command creates a circle at the `(x, y)` position.
  - It sets the radius of the circle to "size."
  - It rotates the circle to the specified "angle" in degrees.
  - It fills the outline of the circle with "filled" degrees of the line.
  
  Examples:
  - `cutcircle 0 0 10 0 180` creates an outline of a full circle.
  - `cutcircle 0 0 10 0 90` creates an outline of a half circle facing upwards.
  - `cutcircle 0 0 10 9 90` creates an outline of a half circle facing right.
  - `cutcircle 0 0 10 18 90` creates an outline of a half circle facing downwards.

Icn does not support indentation
Icn does not support comments

These commands allow you to define and render various shapes and vectors in .Icn files, specifying their positions, colors, sizes, and orientations to create graphical elements for the GUI system.
