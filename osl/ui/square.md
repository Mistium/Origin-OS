# Square

The `square` command draws a centered rectangle with specified dimensions and border weight on the draw cursor.

## Syntax:

```js
square px-width px-height border_weight 0/1 invisible?
```

## Parameters:

- `px-width`: The width of the square in pixels.
- `px-height`: The height of the square in pixels.
- `border_weight`: The thickness of the square's border.
- `0` (required): If you want to set a square to be invisible and to use it as a hitbox, you need this item in the command
- `invisible?` (optional): Specifies whether the square is invisible. If omitted, defaults to 1 (visible).

## Example:

```
square 100 50 5 0 1
```

In this example:
- A square with a width of 100 pixels, height of 50 pixels, and a border thickness of 5 pixels is drawn.
- The square is centered on the draw cursor.
- The square is set to be invisible (0).

## Additional Examples:

```
square 50 50 2 1
// Draws a visible square with width and height of 50 pixels and a border thickness of 2 pixels

square 30 30 0 0
// Draws an invisible square (hitbox) with width and height of 30 pixels and no border
```

## Additional Notes:

- The `invisible` parameter determines the visibility of the square. It defaults to visible (1).
- The `0` before `invisible?` is required for compatibility purposes.
