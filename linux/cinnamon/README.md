# originOS Cinnamon prototype

**Saved work in progress. The active machine was restored to its previous
Cinnamon appearance at the user's request.** This is not a completed or
pixel-perfect desktop release.

The prototype lives on the `cinnamon-desktop` branch of Mistium/Origin-OS.
It can also be used as a standalone folder; the installer uses the bundled
artwork and does not require a build of the web OS.

## Apply or restore

From a terminal in your Cinnamon session, as your regular user:

```sh
python3 install.py check
python3 install.py install
```

Restore the appearance captured immediately before installation:

```sh
python3 install.py restore
```

The installer saves the affected settings under
`~/.local/state/origin-cinnamon/before-origin.json` with private permissions.
It installs an applet, GTK/Cinnamon themes, an icon theme and a wallpaper into
your user data directory. It does not replace Cinnamon or alter Sunshine,
Moonlight, networking, audio routing or keyboard mappings. It stops the
optional `cinnamon-video-wallpaper.service` while the static wallpaper is in
use and remembers its previous state for restoration. Restore leaves the
package files installed but inactive.

Requirements: Cinnamon on X11, Python 3 with PyGObject/Gio, and the usual
Cinnamon and Nemo settings schemas. Artwork and runtime JavaScript are
already included. No Node packages are required for installation.

## What's saved

- `applet/`: native Cinnamon dock, launcher, app search, notification column,
  clock, places and links to existing sound/brightness controls.
- `theme/`: Cinnamon CSS and GTK 3 theme, including window decoration rules.
- `icon-theme/`: matching folders, actions and application icons, with
  Papirus/Adwaita fallbacks.
- `icon-sources.json`: the selected current ICN icon strings and named
  sub-icons, with source checksums. This comes from
  `OSL Programs/apps/System/.Install_system.json` and `Icons/all-icons.json`
  on the existing originOS v7 checkout, not the older PNG artwork.
- `build-icons.mjs`: uses `rotur-sdk`'s `iconToSvg` converter. It compensates
  for that converter version omitting rectangle pen width; the folder fill
  export still needs improvement.
- `nemo/origin-nemo.c`: experimental native GTK layout module. It rearranges
  Nemo's existing widgets; its file operations remain Nemo's. **This module
  is not enabled or installed by `install.py`.**
- `streaming/`: optional client priority helper that was separately deployed
  to Debian during stream tuning. It is not enabled by the desktop installer.
- `preview/`: actual captures of earlier prototype stages. They show the work
  in progress, not an interactive browser implementation of the desktop.
- `references/` and `local-state/`, when present locally: supplied reference
  images and the local recovery snapshot. These folders are deliberately
  excluded from Git; they are included in the local archive.

## Appearance decisions from the user

Use Cinnamon as the base. Match the forest wallpaper, separated floating
dock groups, compact monochrome text and two-column start menu. Running apps
have a thin line beneath them; the focused app must not get a selection box.
Application identities should remain recognizable: Chrome, Discord, Spotify,
Ghostty, Zed, btop and Nemo have origin-style redraws rather than unrelated
originOS application icons. The current system-app ICN strings remain saved
as references and for desktop functions.

Window controls should use the `close`, `down` and `maximise` definitions
referenced by `OSL Programs/scripts/system/win_buttons.osl`. Those definitions
are recorded in `icon-sources.json` and converted into the GTK action icons.

## Known unfinished work

- The prototype is not pixel-perfect. The original screenshots are the
  intended reference, not the captured intermediate previews.
- The Nemo GTK module was compiled and loaded experimentally. Its window
  recreation currently loses placement, and its titlebar/sidebar adaptation
  needs more testing. Do not deploy it as a default file manager yet.
- Stock Nemo's sidebar gradient repeats per row in the early theme-only
  preview. The module's parent-gradient approach needs verification.
- ICN connected-line folder paths still export as outlines despite their
  fill directive. The exporter needs to join that contour before filling it.
- The launcher/notification UI and quick controls need more interaction and
  lifecycle checks, including brightness refresh, many running applications,
  multi-monitor changes and clean applet reloads.
- Existing native tray applets are reparented into the dock. Theme/icon
  refreshes occasionally logged a stock XApp icon-sync warning.
- The installer has a basic restore flow, but needs an independent review
  and isolated install/update/restore tests before release.

## Continue development

Syntax and package checks:

```sh
node --check applet/applet.js
node --check build-icons.mjs
python3 -m py_compile install.py streaming/moonlight-priority.py
python3 install.py check
```

Regenerate SVGs using the existing SDK checkout:

```sh
node build-icons.mjs --sdk ~/rotur-sdk/dist/index.mjs
```

To refresh the captured ICN source as well:

```sh
node build-icons.mjs --sdk ~/rotur-sdk/dist/index.mjs --source ~/Origin-OS
```

Compile the experimental Nemo module without installing it:

```sh
cc -O2 -Wall -Wextra -Werror -Wno-deprecated-declarations -fPIC -shared \
  nemo/origin-nemo.c -o /tmp/origin-nemo.so \
  $(pkg-config --cflags --libs gtk+-3.0 gmodule-2.0)
```

It is a GTK module loaded only by a newly started Nemo process with
`GTK_MODULES=/tmp/origin-nemo.so`. Avoid closing a real file-manager session
or interrupting file operations just to test it. The prototype tests used
only `/tmp/originOS-demo`. No GTK module environment variable was added to
the user's session, and the experimental process was stopped on restoration.

After updating an installed applet:

```sh
python3 install.py files-only
gdbus call --session --dest org.Cinnamon --object-path /org/Cinnamon \
  --method org.Cinnamon.ReloadXlet origin-dock@mistium APPLET
```

For accurate menu captures, use Cinnamon's native
`org.gnome.Shell.Screenshot` interface at `/org/gnome/Shell/Screenshot`.
ImageMagick `import` can close a grabbed popup before it captures it.

## Streaming changes retained on the live machines

Moonlight still uses native i965 hardware decoding, H.264, 4000×1440 at
60 fps and the same requested 40 Mbps bitrate. Frame pacing was enabled and
the Debian client was allowed its requested process priorities through
`moonlight-priority@sophie.service`. A sampled overlay improved from about
58.7 to 59.7 rendered fps and from 2.46% to 0.82% timing-jitter drops; that
does not prove every intermittent freeze is fixed. The desktop rollback
does not undo these separately requested streaming improvements.

The original audio, keyboard and automatic display-layout helpers remain
under `~/.local/share/cinnamon-stream/` and on Debian. They are separate
from this desktop prototype.
