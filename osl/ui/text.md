
# The Text Component

## Basic `text` Component:

A text component does exactly what it sounds like, it allows you to render text on your application's window.

Example:
```js
text "Hello, World!" 10
// ten is the size of our text (it's defined as the space between each character)
```

Now that we have our text component, you might notice that it's not showing on our window. That's because it's missing a color!

Here we set a variable to the value of #fff which is a hexadecimal code for white (you don't have to use a variable, you can just do `c #fff`):
```js
white = #fff
c white
text "Hello, World!" 10
```

The `c` command sets the color of all subsequent elements until another `c` command, or an element overrides it.

Here we render two text elements one after the other:
```js
c #fff
text "hello world" 10
// "wow" is rendered directly after "hello world" so it looks like "hello worldwow"
text "wow" 10
```

### Additional Text Features:

#### Text Positioning:

You can specify the position of the text using coordinates. For example:
```js
c #fff
goto 100 100
text "Hello, World!" 10
```
This will render the text "Hello, World!" with a size of 10 in white at the position (100, 100) on the application window.


#### Text Color:

```js
c #F00
text "Red Text" 12 at 50 250

c #00FF00
// Green color using RGB value
text "Green Text" 12 at 200 250

blue = #00F
c blue
// Using variable color
text "Blue Text" 12 at 350 250
```

#### Text Scaling:

You can scale the text size using the size input.
```js
// Double the size of the text
text "Large Text" 20

// Half the size of the text
text "Small Text" 5
```

## More

- **Command**: 
  - `text "text-to-draw" size`

- **Function**: 
  - Renders text at the draw cursor with a specified size.

- **Parameters**:
  - `"text-to-draw"`: The text string to be rendered.
  - `size`: The size of the text to be rendered.

- **Example**:
  ```
  text "Hello, World!" 16
  ```

- **Explanation**:
  - In this example, the text "Hello, World!" is rendered at the current draw cursor position with a font size of 16.
  - The `text` command allows for direct rendering of text strings on the screen.
  - Additionally, the `text` command can be used to set the font for subsequent text rendering by providing the URL or file path of a text file containing font data along with the `"setfont"` parameter.

This command provides a simple and effective way to display text within the UI, allowing for customization of text appearance and font selection when needed.
