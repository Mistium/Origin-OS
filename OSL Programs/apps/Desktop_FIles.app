clicked_id = 0
window "x" 0
window "y" 30
windowfileloc = "Origin/(C) Users/" ++ username ++ "/Desktop"
mainloop:
movefileloc windowfileloc
include windowfileloc

if mouse_down and can (
  can = false
  mouse_start_x = mouse_x
  mouse_start_y = mouse_y
)

if mouse_down (
  sqw = mouse_start_x - mouse_x
  sqh = mouse_start_y - mouse_y
  goto mouse_x + ( sqw / 2 ) mouse_y + ( sqh / 2 )
  square sqw sqh 5 : c#global_accent
  square sqw sqh 5 : c#111
)

window "dimensions" screensize_x + 40 screensize_y - 60

applications_count = 0
loop desktop.len (
  applications_count += 1
  file "open" "id" desktop.[applications_count]

  file "get" "X"
  data2 = data

  file "get" "Y"
  goto data2 data - 25

  file "render" 2 "interactable"
)

if mouse_down.not "can = true"
