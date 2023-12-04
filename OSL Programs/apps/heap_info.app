permission "request" "Javascript"

mainloop:

loc 2 2 20 -20
total = "performance.memory.totalJSHeapSize"
max = "performance.memory.jsHeapSizeLimit"
percent = total.eval / max.eval * 1000
percent = percent.round / 10

text "<total.eval> / <max.eval>" 10 : c#fff

loc 2 2 20 -50
text "<percent>% used" 10

import "win-buttons"
