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

`text "fileurl" "setfont"`

Sets the font of all subsequent text to a specific text file in the system

All of the above set the `clicked` and `touching_mouse` variables

`image "url" width_in_pixels`

Renders an image from the web or from a data uri with a specified width

---

## Other Ui

`hitbox width height checkx checky`

This command acts like a hidden square.
you can check the "collided" variable for if checkx and checky are inside the hitbox.

`hitbox "hide"` and `hitbox "show"` allow you to show all the hitboxes being rendered in a window

---


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
