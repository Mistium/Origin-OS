#!/usr/bin/python3
"""Install the originOS Cinnamon desktop, or restore the previous appearance."""
import argparse
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import time
from gi.repository import Gio, GLib

HERE = Path(__file__).resolve().parent
DATA = Path(GLib.get_user_data_dir())
CONFIG = Path(GLib.get_user_config_dir())
STATE = Path(GLib.get_user_state_dir()) / 'origin-cinnamon'
UUID = 'origin-dock@mistium'
APPLET = DATA / 'cinnamon/applets' / UUID
THEME = DATA / 'themes/originOS'
BACKGROUND = DATA / 'origin-cinnamon/veil.jpg'
BACKUP = STATE / 'before-origin.json'

CHANGES = {
    'org.cinnamon': ['enabled-applets', 'panels-height', 'favorite-apps', 'next-applet-id'],
    'org.cinnamon.theme': ['name'],
    'org.cinnamon.desktop.interface': ['gtk-theme', 'icon-theme'],
    'org.cinnamon.desktop.wm.preferences': ['theme', 'button-layout', 'titlebar-font', 'titlebar-uses-system-font'],
    'org.cinnamon.desktop.background': ['picture-uri', 'picture-options'],
    'org.cinnamon.desktop.background.slideshow': ['slideshow-enabled'],
    'org.cinnamon.muffin': ['overlay-key'],
    'org.nemo.preferences': ['default-folder-viewer'],
    'org.nemo.window-state': ['start-with-menu-bar', 'sidebar-width', 'geometry', 'maximized'],
    'org.nemo.desktop': ['desktop-layout']
}


def run(*arguments):
    return subprocess.run(arguments, capture_output=True, text=True)


def settings(schema):
    return Gio.Settings.new(schema)


def save_backup():
    STATE.mkdir(parents=True, exist_ok=True, mode=0o700)
    if BACKUP.exists():
        return  # Updating a theme must not overwrite the original recovery state.
    values = {schema: {key: settings(schema).get_value(key).print_(True) for key in keys}
              for schema, keys in CHANGES.items()}
    menu = CONFIG / 'cinnamon/spices/menu@cinnamon.org/0.json'
    values['_menu_file'] = menu.read_text() if menu.exists() else None
    values['_video_active'] = run('systemctl', '--user', 'is-active', 'cinnamon-video-wallpaper.service').returncode == 0
    values['_video_enabled'] = run('systemctl', '--user', 'is-enabled', 'cinnamon-video-wallpaper.service').returncode == 0
    BACKUP.write_text(json.dumps(values, indent=2))
    BACKUP.chmod(0o600)


def install_files():
    shutil.copytree(HERE / 'applet', APPLET, dirs_exist_ok=True)
    shutil.copytree(HERE / 'theme', THEME, dirs_exist_ok=True)
    shutil.copytree(HERE / 'icon-theme', DATA / 'icons/originOS', dirs_exist_ok=True)
    BACKGROUND.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(HERE / 'assets/veil.jpg', BACKGROUND)


def install():
    if not os.environ.get('DBUS_SESSION_BUS_ADDRESS'):
        raise SystemExit('Run this as your desktop user inside the Cinnamon session.')
    if 'X-Cinnamon' not in os.environ.get('XDG_CURRENT_DESKTOP', ''):
        if run('pgrep', '-u', str(os.getuid()), '-x', 'cinnamon').returncode:
            raise SystemExit('Cinnamon must already be running.')
    save_backup()
    install_files()
    # Capture before changing anything, then retain every stock applet instance.
    # The dock only hides their actors; tray icons and notification history stay live.
    desktop = settings('org.cinnamon')
    enabled = desktop.get_strv('enabled-applets')
    next_id = desktop.get_int('next-applet-id')
    if not any(f':{UUID}:' in entry for entry in enabled):
        panels = settings('org.cinnamon').get_strv('panels-enabled')
        bottom = next((entry.split(':')[0] for entry in panels if entry.endswith(':bottom')), None)
        if bottom is None:
            raise SystemExit('Add a bottom Cinnamon panel before installing this dock.')
        enabled.append(f'panel{bottom}:center:0:{UUID}:{next_id}')
        desktop.set_int('next-applet-id', next_id + 1)
    panel_ids = {entry.split(':')[0] for entry in desktop.get_strv('panels-enabled') if entry.endswith(':bottom')}
    heights = [f'{entry.split(":")[0]}:76' if entry.split(':')[0] in panel_ids else entry
               for entry in desktop.get_strv('panels-height')]
    desktop.set_strv('panels-height', heights)
    candidates = ['nemo.desktop', 'cinnamon-settings.desktop', 'btop.desktop', 'dev.zed.Zed.desktop',
                  'org.gnome.Calculator.desktop', 'com.mitchellh.ghostty.desktop',
                  'discord.desktop', 'google-chrome.desktop', 'spotify.desktop']
    installed_ids = {app.get_id() for app in Gio.AppInfo.get_all()}
    desktop.set_strv('favorite-apps', [app for app in candidates if app in installed_ids])
    settings('org.cinnamon.desktop.background.slideshow').set_boolean('slideshow-enabled', False)
    run('systemctl', '--user', 'disable', '--now', 'cinnamon-video-wallpaper.service')
    settings('org.cinnamon.desktop.background').set_string('picture-uri', BACKGROUND.as_uri())
    settings('org.cinnamon.desktop.background').set_string('picture-options', 'zoom')
    settings('org.cinnamon.theme').set_string('name', 'originOS')
    settings('org.cinnamon.desktop.interface').set_string('gtk-theme', 'originOS')
    settings('org.cinnamon.desktop.interface').set_string('icon-theme', 'originOS')
    wm = settings('org.cinnamon.desktop.wm.preferences')
    wm.set_string('theme', 'originOS')
    wm.set_string('button-layout', ':maximize,minimize,close')
    wm.set_string('titlebar-font', 'Adwaita Mono 10')
    wm.set_boolean('titlebar-uses-system-font', False)
    settings('org.cinnamon.muffin').set_string('overlay-key', 'Super_L')
    settings('org.nemo.preferences').set_string('default-folder-viewer', 'list-view')
    # Avoid desktop shortcut icons competing with the dock; files are untouched.
    settings('org.nemo.desktop').set_string('desktop-layout', 'false::false')
    desktop.set_strv('enabled-applets', enabled)
    Gio.Settings.sync()
    print(f'Installed originOS on Cinnamon. Recovery: {sys.executable} {__file__} restore')


def restore():
    if not BACKUP.exists():
        raise SystemExit('There is no saved desktop configuration to restore.')
    values = json.loads(BACKUP.read_text())
    # Removing the dock first runs its cleanup and gives stock applets their actors back.
    desktop = settings('org.cinnamon')
    desktop.set_strv('enabled-applets', [entry for entry in desktop.get_strv('enabled-applets') if f':{UUID}:' not in entry])
    Gio.Settings.sync()
    time.sleep(.8)
    for schema, keys in values.items():
        if schema.startswith('_'):
            continue
        target = settings(schema)
        for key, value in keys.items():
            target.set_value(key, GLib.Variant.parse(None, value, None, None))
    if values.get('_menu_file') is not None:
        (CONFIG / 'cinnamon/spices/menu@cinnamon.org/0.json').write_text(values['_menu_file'])
    Gio.Settings.sync()
    if values.get('_video_enabled'):
        run('systemctl', '--user', 'enable', 'cinnamon-video-wallpaper.service')
    if values.get('_video_active'):
        run('systemctl', '--user', 'start', 'cinnamon-video-wallpaper.service')
    archive = STATE / f'restored-{int(time.time())}.json'
    BACKUP.rename(archive)
    print('Restored the previous desktop appearance. Package files remain available for reinstalling.')


def check():
    for schema, keys in CHANGES.items():
        for key in keys:
            settings(schema).get_value(key)
    for path in (HERE / 'applet/applet.js', HERE / 'theme/cinnamon/cinnamon.css',
                 HERE / 'applet/icons/Chrome.svg', HERE / 'assets/veil.jpg'):
        if not path.is_file():
            raise SystemExit(f'Missing package file: {path}')
    print('Package assets and Cinnamon settings schemas are available.')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('action', choices=['install', 'restore', 'check', 'files-only'])
    action = parser.parse_args().action
    {'install': install, 'restore': restore, 'check': check, 'files-only': install_files}[action]()
