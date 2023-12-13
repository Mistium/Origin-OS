
window "dimensions" 600 400
window "resizable" false
px = -200
py = -75
pxs = 100
pxst = 100
pxv = 0
pyv = 0

ox = 50
oxv = 0
oy = -75

camx = -300
camy = -800

move = false
first_visit = true

page1 = "https://raw.githubusercontent.com/Mistium/Origin-OS/main/OSL%20Programs/assets/1121/Untitled_Artwork%201.png"
page2 = "https://raw.githubusercontent.com/Mistium/Origin-OS/main/OSL%20Programs/assets/1121/1_Night.png"
page3 = "https://raw.githubusercontent.com/Mistium/Origin-OS/main/OSL%20Programs/assets/1121/2nd_To_Last.png"
page4 = "https://raw.githubusercontent.com/Mistium/Origin-OS/main/OSL%20Programs/assets/1121/page5.png"
grass = "https://raw.githubusercontent.com/Mistium/Origin-OS/main/OSL%20Programs/assets/1121/final_grass.png"
zipline = "https://raw.githubusercontent.com/Mistium/Origin-OS/main/OSL%20Programs/assets/1121/Zip_line_.png"
heart = "https://raw.githubusercontent.com/Mistium/Origin-OS/main/OSL%20Programs/assets/1121/heart.png"

op = 2

map_page = page1
current_page = 1

mainloop:

if "a".pressed (
  pxv -= 2
  pxst = -90
)
if "d".pressed (
  pxv += 2
  pxst = 90
)
if "w".pressed and grounded (
  pyv = 20
)

pxs += pxst - pxs / 5
px += pxv
pxv *= 0.6

ox += oxv
oxv *= 0.6

pyv -= 1.5
py += pyv

size = 740
goto 0 0
stretch "x" 100
direction 90

if current_page == 1 (
    if py < -80 (
        py = -80
        pyv = 0
    )
    if px < -300 "px = -300"
    if px > 250 (
        px = -290
        current_page = 2
        map_page = page2
    )
)
if current_page == 2 (
    if oy < ox / 10 - 130 (
        oy = ox / 10 - 130
    )
    goto 0 0
    direction 80
    if py < px / 10 - 130 (
        py = px / 10 - 130
        pyv = 0
    )
    if px < -300 (
        px = 240
        current_page = 1
        map_page = page1
    )
    if px > 300 (
        px = -240
        current_page = 3
        map_page = page3
    )
)
if current_page == 3 (
    direction 90
    stretch "x" -100
    if py < -110 (
        py = -110
        pyv = 0
    )
    if px < -300 (
        px = 240
        current_page = 2
        map_page = page2
    )
    if px > 250 (
        current_page = 4
        map_page = grass
    )
    change px / 5 90
    size += 100
)
if current_page == 4 (
    camxtarget = mouse_x / 30
    camytarget = mouse_y / 30
    direction = 90
    stretch "x" 100
    px = 0
    py = -1000
    camx += camxtarget - camx / 300
    camy += camxtarget - camx / 300
    goto camx / 8 camy / 8
    image page4 700
    direction 90
    stretch "x" -100
    image zipline 700
    goto camx / 3 + 50 camy / 4 + 100
    stretch "x" -100
    image zipline 700
    change 180 40
    image "https://raw.githubusercontent.com/Mistium/Origin-OS/main/OSL%20Programs/assets/1121/Walk-2%202.png" 40
    change 10
    stretch "x" 100
    image "https://raw.githubusercontent.com/Mistium/Origin-OS/main/OSL%20Programs/assets/1121/Walk-1.png" 40
    loc 2 -2 20 100
    text "I love you <3, I know I say it a lot :P" ++ newline ++ "but I really do, more than anything" 10 : c#fff
    goto camx / -2 camy / -2
    stretch "x" 100
    size += 500
)
change px / 10
image map_page size
grounded = pyv == 0
stretch "x" pxs
goto px py
direction 90
if "a".pressed or "d".pressed "turnright timer.multiply(300).sin * 15"
image "https://raw.githubusercontent.com/Mistium/Origin-OS/main/OSL%20Programs/assets/1121/Walk-2%202.png" 50

if current_page == 2 and ( op == 2 ) (
    direction 90
    stretch "x" 100
    goto ox oy
    turnright timer.multiply(300).sin * 15
    image "https://raw.githubusercontent.com/Mistium/Origin-OS/main/OSL%20Programs/assets/1121/Walk-1.png" 50
    oxv += 2
    if ox > 300 (
        op = 3
        ox = 100
    )
)
if current_page == 3 and ( op == 3 ) (
    direction 90
    stretch "x" 100
    goto ox oy
    oxv += 1
    turnright timer.multiply(300).sin * 10
    image "https://raw.githubusercontent.com/Mistium/Origin-OS/main/OSL%20Programs/assets/1121/Walk-1.png" 50
)
import "win-buttons"