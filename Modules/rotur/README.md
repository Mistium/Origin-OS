This is a full rotur client implementation in osl.

```js
import 'rotur/v1' from 'packages' as 'rotur'

client @= rotur.subscribe('my_room', 'rtr-username')

requests = 0

client.onMessage @= def(msg) -> (
  log msg.origin.username + 'sent me: ' + msg.val.payload
  if msg.val.payload == 'ping' (
    rotur.pMessage(client.room, msg.origin.username, 'pong')
  )
  requests ++
)

mainloop:

goto window.left + 10 window.top - 20
text 'Requests: ' ++ requests 10 : c#fff

import 'win-buttons'
```
