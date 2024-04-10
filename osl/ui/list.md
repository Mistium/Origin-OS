# Square

The `square` command draws a centered rectangle with specified dimensions and border weight on the draw cursor.

## Syntax:

```
square px-width px-height border_weight 0/1 invisible?
```

## Parameters:

- `px-width`: The width of the square in pixels.
- `px-height`: The height of the square in pixels.
- `border_weight`: The thickness of the square's border.
- `0` (required): If you want to set a square to be invisible and to use it as a hitbox, you need this item in the command.
- `invisible?` (optional): Specifies whether the square is invisible. If omitted, defaults to 1 (visible).

## Example:

```
square 100 50 5 0 1
```

In this example:
- A square with a width of 100 pixels, height of 50 pixels, and a border thickness of 5 pixels is drawn.
- The square is centered on the draw cursor.
- The square is set to be visible with item 5 of the `100 50 5 0 1` (1).

---

# Icon

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

You can store an icon locally using a variable:
```
x_icon = "c #fff line -10 10 10 -10 line -10 -10 10 10"

// setup goes before mainloop
mainloop:
// main goes after mainloop

icon x_icon 1
// render icon
```

---

# Text

The `text` command renders text at the draw cursor with a specified size.

## Command Syntax:

```
text "text-to-draw" size
```

## Parameters:

- `"text-to-draw"`: The text string to be rendered.
- `size`: The size of the text to be rendered.

## Example:

```
text "Hello, World!" 16
```

In this example, the text "Hello, World!" is rendered at the current draw cursor position with a font size of 16.

---

# Image

The `image` command renders an image from a raw URL with optional width and height specifications.

### Load an image indirectly (more performant for bigger image URLs or "data:" URLs)

```
image "load" "data" "name"
```

## Example:

```
image "load" "data:url stuff goes here" "test_image"
```
Put before the main loop to ensure it's only loaded once.

```lua
mainloop:
image "test_image" 200
```
Render the loaded image at a very low performance cost.

### Command Syntax:

```
image "url" width_in_pixels height_in_pixels
```

### Parameters:

- `"url"`: The raw URL of the image to be rendered.
- `width_in_pixels` (optional): The width of the rendered image in pixels. If omitted, the image will resize to fit its width correctly, and its height will adjust accordingly to maintain the original aspect ratio.
- `height_in_pixels` (optional): The height of the rendered image in pixels. If omitted, the image will stretch or shrink to match the specified width, preserving its aspect ratio.

### Example:

```
image "https://example.com/image.jpg" 120 80
```

In this example, an image from the specified URL is rendered with a width of 120 pixels and a height of 80 pixels.

### Additional Notes:

- The image command supports raw image URLs and can render images from web sources.
- There is no maximum limit on the size of the image that can be rendered.
- If the image fails to load or if the URL is inaccessible, a "not loaded" placeholder image will be displayed.
- Images can be positioned on the screen using the draw cursor and rotated using direction commands.
- While data URLs can be used with the `image` command, it's not recommended due to potentially large file sizes.
- Images with alpha channels (transparency) are supported and rendered appropriately.
- Images can be dynamically changed during runtime, similar to other UI elements.

---

# Triangle

The `triangle` command draws a triangle with specified vertices on the draw cursor.

## Command Syntax:

```
triangle point1_x point1_y point2_x point2_y point3_x point3_y border_weight
```

## Parameters:

- `point1_x`: x-coordinate of the first vertex.
- `point1_y`: y-coordinate of the first vertex.
- `point2_x`: x-coordinate of the second vertex.
- `point2_y`: y-coordinate of the second vertex.
- `point3_x`: x-coordinate of the third vertex.
- `point3_y`: y-coordinate of the third

 vertex.
- `border_weight`: Thickness of the triangle's border.

## Example:

```
triangle 10 20 30 40 50 60 2
```

In this example, a triangle is drawn with vertices at (10, 20), (30, 40), and (50, 60), with a border thickness of 2.
The vertices are offset by the xy of the triangle element.

## Additional Notes:

- The triangle element is not clickable. It serves as a visual element without interactive functionality.

---

# Other UI

## Hitbox

The `hitbox` command creates a hidden square for collision detection.

### Command Syntax:

- `hitbox width height checkx checky`: Acts like a hidden square for collision detection.
- `hitbox "hide"` and `hitbox "show"` allow showing/hiding hitboxes.

### Example:

```
hitbox 50 50 0 0
```

---

## Pen

The `pen` command lifts or lowers the pen and sets its size.

### Command Syntax:

- `pen "down"/"up"`: Lifts or lowers the pen.
- `pen "size" pen-size`: Sets the size of the pen.

### Example:

```
pen "down"
```

---

## Image Manipulation (v4.2.7 and above)

### Stretch

The `stretch` command adjusts the size of an image.

- `stretch "x" 100`: Sets the width of the image to its normal width.
- `stretch "y" 50`: Sets the height of the image to half its normal height.

#### Example:

```lua
stretch "x" 120
```

### Rotate

The `direction`, `turnleft`, and `turnright` commands rotate images.

- `direction 90`: Points right.
- `direction -45`: Points top left.
- `turnleft 10`: Changes direction by 10 degrees counterclockwise.
- `turnright 20`: Changes direction by 20 degrees clockwise.

#### Example:

```lua
direction 45
```
