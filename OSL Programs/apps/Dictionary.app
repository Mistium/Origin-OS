import "win-buttons"
get = 0
mainloop:
loc 2 2 100 -30
c #333
input 100 25 "search"
if "enter".pressed (
  get = "https://api.dictionaryapi.dev/api/v2/entries/en/" ++ input_search
)
if get != 0 (
network "get" get
  data = data.[1]."meanings".replace(".","")
)
loc 2 2 20 -50
count = 0
loop data.len (
  count += 1
  loc 2 2 20 -50 - ( count * 20 )
  text data.[count]."definitions".[1] 10 : c#fff
)
