## Video Commands

The video player is useful for.. well videos

- `video "clearall"` - Deletes all loaded videos from ram

- `video url "clear"` - Deletes a specific video from ram

- `video url "play"` - Plays a speicifc video (works between applications)

- `video url "pause"` - Pauses a specific video (works between applications)

- `video url width title subtext icon` - Renders a video with the video player ui

## Now Playing

Title, Subtext and Icon are the variables used with the nowplaying system to allow other apps to access current media

Title is a string of the name of the song or video
Subtext is a string of some extra info
Icon is a url, pointing to a png

Applications can access now playing using the global variables [here]()

## Video Functions

- `url` = any string of a video url

- `url.videoinfo("loaded")` - true or false if a video is loaded

- `url.videoinfo("duration")` - integer in seconds of the video length

- `url.videoinfo("width")` - integer in pixels of the video width

- `url.videoinfo("height")` - integer in pixels of the video height

- `url.videoinfo("current_time")` - integer in seconds of the current time through the video
