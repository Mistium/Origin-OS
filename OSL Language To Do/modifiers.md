### Basic Syntax

Modifiers are little snippits you can add to the end of osl commands to modify how they run or behave within a single line, instead of over multiple

you place the command after a " : command_goes_here"
You may place as many of these commands as you want

text "hello" 10 : c#fff gto#100,100

---

### Commands List

#### Set the colour of the ui element

c#hexcode

col#hexcode

#### Move the ui element

chx#x_change

chy#y_change

cha#x_change,y_change

gto#x,y

loc#a,b,c,d

#### Adding Functionlity

bkg#hexcode,rounding // you can enter just a hex code and it will give you the default rounding of 10px

---

### Function Osl Equivalent

Just moving osl functions into the end of another command, this allow you to run specific commands that only affect a single line in a single line instead of taking up multiple.

---

### Example Use

text "hello" 10 : c#fff
