permission "request" "network"
window "dimensions" 800 450
window "show"
save "contacts.json" "get"
contacts = {"local":{"name":"myself","messages":["myself - hey, how are you"]},"Q1ePKtb2":{"name":"test-contact","messages":["test-contact - hello, i'm a test"]}}
if save-data == null (
    save "contacts.json" "set" {"local":"myself"}
    contacts = save-data
)
mainloop:
loc 999 -2 120 20
colour #202020
square window_width - 250 30 10 1
colour #303030
change_x 20
input window_width - 290 25 "message"
terminal "server.get_app_message"
if app_message.str == "app_message" "app_message = null"
sender = app_message.key("sender")
if app_message != null and contacts.contains(sender) (
message = sender + "-" + app_message.key("text")
    update = {"name":"","messages":[]}
update.key("name") = app_message.key("sender_username")
log update.key("name")
update.key("messages") = contacts.key(sender).key("messages").append(message)
log update
    contacts.key(sender) = update
)
if app_message != null and contacts.contains(sender).not (
    new-contact = {}
    new-contact.key("name") = app_message.key("sender_username")
    new-contact.key("messages") = ["This is the beginning of your conversation"].append(message).destr
    contacts.key(sender) = new-contact
)
log contacts
loc 2 999 100
colour #101010
square 220 window_height 10 1
loc 2 -2 215 10
x = x_position
y = y_position
loc 2 2 -10 -60
frame x_position y_position x y contacts.len * 50
contact-data = contacts.getall("values")
count = 0
loop contact-data.len (
    count += 1
    goto frame_x count * -50
    change_y scroll_y + ( frame_height / 2 )
    colour #303030
    if current == count "colour #505050"
    square frame_width - 20 30 10 1
    if clicked "current = count"
    colour #ffffff
    change_x frame_width / -2 + 20
    text contact-data.[count].key("name") 7
)
frame "clear"
loc 2 2 240 -50
text contact-data.[current].key("messages").join(newline) 9
save "contacts.json" "set" contacts
import "win-buttons"
