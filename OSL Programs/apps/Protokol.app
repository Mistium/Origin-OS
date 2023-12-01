permission "request" "network"
window "show"
mainloop:
loc 999 2 0 -20
colour #202020
square window_width 30 10 1
loc 2 2 0 -20
colour #ffffff
text "Protokol" 10
loc 2 2 window_width / 4 - 35 -70
colour #202020
input window_width / 2 - 70 25 1 "Server ID"
colour #202020
change_x window_width / 2 - 50
input window_width / 2 - 50 25 2 "Data"
colour #202020
loc -2 2 -40 -70
square 60 15 10 1
change_x -25
input_temp = input_1.split("/")
if input_temp.len == 1 "input_temp = input_1.append("Origin")"
if clicked (
  terminal "server.send" + input_temp.[1] + input_temp.[2] + input_2
)
colour #ffffff
text "Send" 7
terminal "server.get_app_message"
if app_message != null "temp = app_message"
loc 2 2 0 -120
text "My ID" + "'" + owp_id + "'" 9
loc 2 2 0 -170
text "Received from" + temp.key("sender") + "at" + temp.key("timestamp").timestamp("convert-date") + " \n  \n " + temp.key("text") 8
import "win-buttons"
