### Basic Syntax

place this code in the setup part of your code before the mainloop label

sound "load" "url/uri"

// loads a sound into ram to remove loading times

sound "play" "url/uri"

// plays a sound from the beginning

sound "pause" "url/uri"

// pauses a sound

sound "seek" time "url/uri"

// goes to a time in a sound and starts playing it

sound "clear" "url/uri"

// deletes a sound

sound "volume" int

// changes the volume of all sounds

sound "skew" int

// skews the sound left or right


"sound url".soundinfo("loaded")
- boolean of if the sound is loaded into the system or not

"sound url".soundinfo("duration")
- integer of the length of the sound in seconds

"sound url".soundinfo("current_time")
- integer of how far through the sound you are

"sound url".soundinfo("paused")
- true or false of if the sound is paused or not

---

### Function Osl Equivalent

No direct equivalent in osl code exists for sound commands.

These commands allow the system to play sounds

---

### Example Use

sound "load" "example.com/beep.wav"

sound "play" "example.com/beep.wav"

