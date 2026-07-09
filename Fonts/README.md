## Type Info

- ojff (origin json font file)

## Browser font build

The DOM renderer uses a generated TrueType version of the built-in Origin font.
Regenerate it after editing `origin.ojff`:

```sh
python3 -m pip install fonttools
python3 Fonts/ojff_to_ttf.py Fonts/origin.ojff Fonts/origin.ttf
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
