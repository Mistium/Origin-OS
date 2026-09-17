## Type Info

- ojff (origin json font file)

## Browser font build

The DOM renderer does not fetch `origin.ttf`. At boot it converts `origin.ojff`
in the browser via `window.OJFFToTTF` (`origin/main/osl/core.fractch`) and installs
the result as an `@font-face`, so editing the ojff is what changes on-screen text.

`origin.ttf` is only for use outside originOS. Regenerate it with the same
converter, read straight out of core.fractch so the two can't drift:

```sh
node Fonts/ojff_to_ttf.js Fonts/origin.ojff Fonts/origin.ttf origin
```

Glyphs must stick to the opcodes `canFontText` whitelists — `w c line cont dot
move back scale rect square tri cutcircle`. A glyph using `curve` or `ellipse`
still renders, but drops off the TTF path onto per-glyph SVG.

`origin.ojff` itself is generated; edit `ojff_gen.js` and re-run:

```sh
WEIGHT=3.6 node Fonts/ojff_gen.js Fonts/origin-v8.ojff Fonts/origin.ojff
```

## About

/Fonts is a repository for originOS fonts, this allows people to upload custom fonts for users to download into the originOS system, i plan to add a terminal command to install and list fonts directly from this directory

## Example terminal commands
`font view_all`
```
origin
hebrew
cursed
```

`font install origin`

```
Successfully installed font
//
Failed to load font
```

`font use origin`

```
Swapped default font successfully
//
Already using font
//
Font is not installed
```
`font viewinstalled`

```
A list of your user/Fonts folder
```
