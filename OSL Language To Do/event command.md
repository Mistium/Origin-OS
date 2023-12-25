### Basic Syntax

Place this code in the setup part of your code before the mainloop label
```
event "value1" "condition" "value2"

endev
```

### Conditions

- "pressed"
  - Runs the event if a key is pressed
- "=="
  - Runs the event if value1 is the same as value2
- "!="
  - Runs the event if value1 is different to value2
- ">"
  - Runs the event if value1 is bigger than value2
- "<"
  - Runs the event if value1 is smaller than value2
---

### Function Osl Equivalent

No direct equivalent in osl code exists for the event/on command.

This command will be jumped to by the system whenever a condition is met. This allows more optimisation in osl and removes the need to check conditions every frame

---

### Example Use
```
event "space" "pressed"
  if touched_ground (
    y_velocity = 30
  )
endev
```
