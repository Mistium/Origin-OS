// to stop this program press space

permission "request" "terminal"

mainloop:
terminal "system display set colour_shift" + ( timer * 0.2 )
terminal "system display set rotation" + ( timer * 1000 )
if "space".pressed (
terminal "system display set colour-shift 100"
terminal "system display set rotation 0"
window "Stop"
)
import "win-buttons"
