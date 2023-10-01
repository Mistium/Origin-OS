UI is rendered once every frame.
This is non negotiable with the system

? means the input is a boolean

---

## Colour Commands

`colour #hexcode`

`c #hexcode`

sets the current colour of any subsequent ui

## Colour Info

OSL uses hexadecimal colours in most of it's system however,
single value rgb colours are supported too.

Example hex codes:
`#fff`
`#ffffff`

---

## Main Ui Elements

`square px-width px-height outline-px-width filled invisible?`

draws a rectangle centered on the draw cursor

`icon "icon-name"/"raw-icon-data" size`

draws an icon centered on the draw cursor

`text "text-to-draw" size`

Renders text at the draw cursor with a size

`image "url" width_in_pixels`

Renders an image from the web or from a data uri with a specified width


## Ui Info

Icons are pulled from files. Use the file name 

of a icon on the computer to render it or just plain

icon data.

---

## Pen

The pen draws a line behind the draw cursor

`pen "down"/"up"`

lifts or lowers the pen

`pen "size" pen-size`

sets the size of the pen
