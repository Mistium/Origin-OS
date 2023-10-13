
frame window_width / -2 window_height / 2 window_width / 2 window_height / -2 page_len

current_tab_name = {"title":"originOS","icon":"origin-logo"}
heroimage = "https://raw.githubusercontent.com/Mistium/Origin-OS/main/Websites/origin.web/assets/originscreenshot1.png"

heroimagesizemultiplier = frame_width / heroimage.imageinfo("width") * 0.5

loc 999 2 0 heroimage.imageinfo("height") * heroimagesizemultiplier * -0.5 + scroll_y

image heroimage frame_width
y = heroimage.imageinfo("height") * heroimagesizemultiplier * -1 + scroll_y

wm = frame_width / 1000
c #333
loc 999 2 0 y - 60
square frame_width 50 10 1
c #fff
target = 5
if mouse_touching (
target = 7
)
size += target - size / 5
loc 999 2 0 y - 60
change_x -32 * size
text "A Desktop Gui Made, for OSL Scripting and Ease Of Creation" size
page_len = y - scroll_y * -1 + 590

c #333
loc 999 2 0 y - 350
square frame_width - 20 500 10 1

c #fff
loc 2 2 20 y - 130
text "OSL Documentation" 8
loc 2 2 20 y - 160
text "ICN Documentation" 8

c #111
loc 999 2 0 -20
square frame_width 50 10 1
c #fff
loc 2 2 20 -20
text "originOS Flow" 10 : c#fff
frame "clear"
import "win-buttons"
