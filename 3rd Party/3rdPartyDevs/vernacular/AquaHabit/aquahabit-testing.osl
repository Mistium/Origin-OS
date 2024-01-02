// here is what I have so far. you can come clean it up if you feel so obligated, just make sure to leave a comment explaining what you did, and document your changes in a way that is easy to understand :)

window "dimensions" 300 600
window "resizable" false
// changed this cos docs were wrong, needs to have false as a bool not as a string

drank = 0
percent = 0
// setup tingz ^

mainloop:
drank += 1
// TODO: delete this ^

goal = 125
// sets the goal ^

low = goal / 3
mid = low * 2
high = low * 3 - 1
// sets the 3 stages you can be in ^

percent = drank * ( 100 / goal )
display = percent.round
// calculates a percent, and rounds it to a displayable number ^

c #fff
goto 0 140
change_x display.len + 1 * -10 
text "<display>%" 20
// shows the percent to the user ^

goto 0 140
fill = display * 1.8
dir = display / 5.55
// makes the ring fill out correctly ^

icon "w 2 c #fff cutcircle 0 0 10 0 180" 10
icon "w 1.5 c #6488ea cutcircle 0 0 10" + dir + fill 10
// draws the ring ^

info = "<drank>oz of <goal>oz"
goto info.len * -4 0
// moved the change_x into the goto

text info 12
