def "new" "name,pass"
  network "signup" name pass
  status = "Waiting"
endef

status = ""
return = ""

window "resizable" false
window "dimensions" 400 600
topage = "signup"

mainloop:
if new_network_data (
  if network_data_command == "New_Account" (
    if network_data == "Account Created Successfully" (
      window "stop"
    ) else (
      status = ""
      return = network_data
    )
  )
  new_network_data = false
)

goto
square 0 0 10000 : c#111

loc -2 2 -25 -25
icon "close" 0.9 : c#fff
if clicked "window stop"

if page == "signup" (
  loc 2 2 200 -120
  image "https://cdn.discordapp.com/attachments/1147471100742209566/1155098350459297792/communityIcon_t415kxa45pmb1.png" 120

  loc 2 2 200 -220
  square 320 30 20 : c#000
  input 300 25 "signup_name" "Username..."

  loc 2 2 200 -290
  square 320 30 20 : c#000
  input 300 25 "signup_pass" "Password..."

  loc 2 2 200 -360
  square 320 30 20 : c#000
  if clicked "new input_signup_name input_signup_pass"
  text "Create Account" 8 : c#fff chx#-150
)

if page == "login" (
  loc 2 2 200 -120
  image "https://cdn.discordapp.com/attachments/1147471100742209566/1155098350459297792/communityIcon_t415kxa45pmb1.png" 120

  loc 2 2 200 -220
  square 320 30 20 : c#000
  input 300 25 "signup_name" "Username..."

  loc 2 2 200 -290
  square 320 30 20 : c#000
  input 300 25 "signup_pass" "Password..."

  loc 2 2 200 -360
  square 320 30 20 : c#000
  if clicked "new input_signup_name input_signup_pass"
  text "Login To Account" 8 : c#fff chx#-150
)

loc 2 2 50 -420
text return 9

if status == "Waiting" (
  return = ""
  goto 0 50
  icon "w 5 cutcircle 0 0 20" + ( timer * 20 ) + "70" 1 : c#fff
)

if topage != null and mouse_down.not (
  page = topage
  topage = null
)
