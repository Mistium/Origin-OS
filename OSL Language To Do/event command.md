### Basic Syntax

place this code in the setup part of your code before the mainloop label

event condition (

)

---

### Function Osl Equivalent

No direct equivalent in osl code exists for the event/on command.

This command will be jumped to by the system whenever a condition is met. This allows more optimisation in osl and removes the need to check conditions every frame

---

### Example Use
event "space".pressed and touching_ground (

y_velocity = 30

)
