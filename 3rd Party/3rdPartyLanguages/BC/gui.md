# How to create testing frames.

We need to use a package for it.
```
package (GUI.FrameBuilder) % load the package / install package from internet %

% initiate package %
GUI.FrameBuilder.SetStartX (-20)
GUI.FrameBuilder.SetStartY (-20)
GUI.FrameBuilder.SetEndX (20)
GUI.FrameBuilder.SetEndY (20)

% we made a simple frame , lets add a topbar so we can drag it %
GUI.FrameBuilder.EnableTopbar ("My cool app", "close_button")
                     % your app name ^        buttons ^ %
GUI/FrameBuilder.BGColor (gray)

```

This will make a simple frame wich should look like this:
[Image](https://github.com/Mistium/Origin-OS/blob/main/3rd%20Party/3rdPartyLanguages/BC/app.png)
