window "show"
def "load"
network "get" "https://discordlookup.mesavirep.xyz/v1/user/" ++ input_id
userdata = data.replace(newline,"")
badges = userdata.key("badges")
displayname = userdata.key("global_name")
username = userdata.key("tag").split("#").[1]
loaded = true
endef
loaded = false
window "resizable" False
window "dimensions" 340 700
mainloop:
if loaded.not (
  loc 999 999 0 -20
  square 300 25 10 1
  if clicked "load"
  loc 999 999 137 20
  square 25 25 10 1
  if clicked "input_id =" + clipboard.str
  c #fff
  icon "paste" 1
  loc 999 999 -145 -20
  text "Load Profile" 8
  c #222
  loc 999 999 -20 20
  square 260 25 10
  input 260 25 "id"
)

if loaded (
  goto 0 0
  c #222
  square 100 100 1000
  loc 999 2 0 -25
  c userdata.key("banner").key("color")
  square window_width 30 35
  c #222
  loc 2 2 60 -60
  square 80 80 10 1
  loc 2 2 60 -60
  image userdata.key("avatar").key("link") ++ ".png" 128
  c #000
  goto 0 -55
  square 300 550 20 1
  loc -2 2 badges.len * -10 - 20 -90
  square badges.len * 20 15 20 1
  count = 0
  loop badges.len (
    count += 1
    loc -2 2 count * -10 - 20 -90
    image "https://raw.githubusercontent.com/Mistium/DiscordBadges/main/" ++ badges.[count] ++ ".png" 20
  )
  loc 2 2 25 -145
  c #fff
  text displayname 12
  loc 2 2 25 -170
  text username 9
)
frame "clear"
loc -2 2 -20 -20
c #444
icon "circle-full" 1.5
c #fff
icon "Close" 0.6
if clicked or "space".pressed "window "stop""
