const Applet = imports.ui.applet;
const AppletManager = imports.ui.appletManager;
const Cinnamon = imports.gi.Cinnamon;
const Clutter = imports.gi.Clutter;
const Gio = imports.gi.Gio;
const GLib = imports.gi.GLib;
const Pango = imports.gi.Pango;
const St = imports.gi.St;
const Main = imports.ui.main;
const Mainloop = imports.mainloop;
const PopupMenu = imports.ui.popupMenu;
const Settings = imports.ui.settings;
const Tooltips = imports.ui.tooltips;
const Util = imports.misc.util;

// Preserve each application's identity, redrawn in originOS's icon style.
const ART = {
    'nemo.desktop': 'Nemo.svg',
    'cinnamon-settings.desktop': 'Settings.svg',
    'btop.desktop': 'Btop.svg',
    'org.gnome.SystemMonitor.desktop': 'Activity.svg',
    'com.mitchellh.ghostty.desktop': 'Ghostty.svg',
    'dev.zed.Zed.desktop': 'Zed.svg',
    'code.desktop': 'Studio.svg',
    'org.gnome.Calculator.desktop': 'Calculator.svg',
    'google-chrome.desktop': 'Chrome.svg',
    'chromium.desktop': 'Chrome.svg',
    'discord.desktop': 'Discord.svg',
    'spotify.desktop': 'Spotify.svg',
    'org.gnome.Software.desktop': 'App Store.svg'
};

function text(value, style = '') {
    return new St.Label({text: value, style_class: style, y_align: Clutter.ActorAlign.CENTER});
}

class OriginDock extends Applet.Applet {
    constructor(metadata, orientation, panelHeight, instanceId) {
        super(orientation, panelHeight, instanceId);
        this._path = metadata.path;
        this._orientation = orientation;
        this._signals = [];
        this._timers = new Set();
        this._hidden = [];
        this._trays = [];
        this._seen = new WeakSet();
        this._notificationSignals = new Map();
        this._context = null;
        this._filter = 'All';
        this._disposed = false;
        this._settings = new Settings.AppletSettings(this, metadata.uuid, instanceId);
        this._settings.bind('display-name', 'displayName', () => { if (this._nameLabel) this._nameLabel.set_text(this.displayName); });
        this._settings.bind('icon-size', 'iconSize', () => this._rebuildDock());
        this._settings.bind('show-running', 'showRunning', () => this._rebuildDock());
        this.actor.add_style_class_name('origin-dock');
        this._box = new St.BoxLayout({style_class: 'origin-dock-row'});
        this.actor.add_child(this._box);
        this._nav = this._group('origin-navigation');
        this._start = this._symbolButton('search.svg', 'Search applications', () => this.on_applet_clicked());
        this._nav.add_child(this._start);
        this._nav.add_child(this._symbolButton('origin-logo.svg', 'originOS menu', () => this.on_applet_clicked()));
        this._nav.add_child(this._symbolButton('workspaces.svg', 'Workspaces', () => Main.expo.toggle()));
        this._apps = this._group('origin-applications');
        this._places = this._group('origin-places');
        for (const [icon, name, uri] of [
            ['folder-download.svg', 'Downloads', GLib.get_user_special_dir(GLib.UserDirectory.DIRECTORY_DOWNLOAD) || GLib.get_home_dir()],
            ['folder.svg', 'Home', GLib.get_home_dir()],
            ['folder-applications.svg', 'All applications', null],
            ['user-trash.svg', 'Trash', 'trash:///']
        ]) {
            this._places.add_child(this._symbolButton(icon, name, () => uri ? this._openUri(uri) : this.on_applet_clicked(), 'origin-folder-button'));
        }
        this._system = this._group('origin-system');
        this._trayBox = new St.BoxLayout({style_class: 'origin-native-tray', y_align: Clutter.ActorAlign.CENTER});
        this._system.add_child(this._trayBox);
        this._clockButton = new St.Button({style_class: 'origin-clock', can_focus: true});
        const clockBox = new St.BoxLayout({vertical: true});
        this._time = text('', 'origin-time');
        this._date = text('', 'origin-date');
        clockBox.add_child(this._time);
        clockBox.add_child(this._date);
        this._clockButton.set_child(clockBox);
        this._system.add_child(this._clockButton);
        this.menuManager = new PopupMenu.PopupMenuManager(this);
        this.menu = this._popup(this._start, 'origin-launcher');
        this._buildLauncher();
        this._controls = this._popup(this._clockButton, 'origin-controls');
        this._buildControls();
        this._clockButton.connect('clicked', () => {
            this.menu.close(false);
            this._updateControls();
            this._controls.toggle();
        });
        this.menu.connect('open-state-changed', (_menu, open) => {
            this._start.change_style_pseudo_class('checked', open);
            if (open) {
                this._search.set_text('');
                this._renderApps();
                this._renderNotifications();
                this._search.grab_key_focus();
                const width = this.menu.actor.get_preferred_width(-1)[1];
                this.menu.shiftToPosition(this.actor.get_transformed_position()[0] + width / 2);
            }
        });
        this._connect(global.settings, 'changed::favorite-apps', () => this._rebuildDock());
        this._connect(Cinnamon.AppSystem.get_default(), 'app-state-changed', () => this._queueDock());
        this._connect(global.display, 'notify::focus-window', () => this._updateIndicators());
        this._connect(Main.messageTray, 'notify-applet-update', () => this._later(() => this._renderNotifications(), 30));
        Main.keybindingManager.addXletHotKey(this, 'launcher', 'Super_L::Super_R::<Super>space', () => this.on_applet_clicked());
        this._updateClock();
        this._clockTimer = Mainloop.timeout_add_seconds(30, () => {
            this._updateClock();
            return !this._disposed;
        });
        this._rebuildDock();
        this._later(() => this._integrateStock(), 500);
    }

    _connect(object, signal, callback) {
        const id = object.connect(signal, callback);
        this._signals.push([object, id]);
    }

    _later(callback, delay = 100) {
        const id = Mainloop.timeout_add(delay, () => {
            this._timers.delete(id);
            if (!this._disposed) callback();
            return false;
        });
        this._timers.add(id);
        return id;
    }

    _group(style) {
        const box = new St.BoxLayout({style_class: `origin-dock-group ${style}`, y_align: Clutter.ActorAlign.CENTER});
        this._box.add_child(box);
        return box;
    }

    _symbolButton(icon, name, callback, style = '') {
        const button = new St.Button({style_class: `origin-dock-button ${style}`, can_focus: true});
        button.set_child(this._icon(icon, 27));
        button.connect('clicked', callback);
        this._tooltip(button, name);
        return button;
    }

    _tooltip(actor, label) {
        const tooltip = new Tooltips.Tooltip(actor, label);
        actor.connect('destroy', () => tooltip.destroy());
    }

    _icon(name, size) {
        let file = `${this._path}/icons/${name}`;
        if (!GLib.file_test(file, GLib.FileTest.EXISTS)) file += '.svg';
        if (GLib.file_test(file, GLib.FileTest.EXISTS))
            return new St.Icon({gicon: Gio.icon_new_for_string(file), icon_size: size, x_align: Clutter.ActorAlign.CENTER});
        return new St.Icon({icon_name: name, icon_size: size, icon_type: St.IconType.SYMBOLIC, x_align: Clutter.ActorAlign.CENTER});
    }

    _appIcon(info, size) {
        if (ART[info.get_id()]) return this._icon(ART[info.get_id()], size);
        return new St.Icon({gicon: info.get_icon() || Gio.icon_new_for_string('application-x-executable'), icon_size: size});
    }

    _popup(source, style) {
        const menu = new PopupMenu.PopupMenu(source, this._orientation);
        menu.actor.add_style_class_name(`origin-menu ${style}`);
        Main.uiGroup.add_child(menu.actor);
        menu.actor.hide();
        this.menuManager.addMenu(menu);
        return menu;
    }

    _allApps() {
        return Gio.AppInfo.get_all().filter(info => info.should_show() && info.get_id())
            .sort((a, b) => a.get_display_name().localeCompare(b.get_display_name()));
    }

    _queueDock() {
        if (this._dockQueued) return;
        this._dockQueued = true;
        this._later(() => { this._dockQueued = false; this._rebuildDock(); });
    }

    _rebuildDock() {
        if (!this._apps) return;
        if (this._context) { this._context.destroy(); this._context = null; }
        this._apps.destroy_all_children();
        this._dockButtons = [];
        const favorites = global.settings.get_strv('favorite-apps');
        const ids = [...favorites];
        if (this.showRunning) {
            for (const app of Cinnamon.AppSystem.get_default().get_running()) {
                const id = app.get_id();
                if (id && !ids.includes(id)) ids.push(id);
            }
        }
        for (const id of ids) {
            let info = null;
            try { info = Gio.DesktopAppInfo.new(id); }
            catch (_error) { continue; } // Favorites may reference uninstalled apps.
            if (!info) continue;
            const button = new St.Button({style_class: 'origin-app-button', can_focus: true});
            const box = new St.BoxLayout({vertical: true});
            box.add_child(this._appIcon(info, this.iconSize));
            const dot = new St.Widget({style_class: 'origin-running-dot', x_align: Clutter.ActorAlign.CENTER});
            box.add_child(dot);
            button.set_child(box);
            button.connect('clicked', () => this._launch(info));
            button.connect('button-press-event', (_actor, event) => {
                if (event.get_button() !== 3) return Clutter.EVENT_PROPAGATE;
                this._appContext(button, info);
                return Clutter.EVENT_STOP;
            });
            this._tooltip(button, info.get_display_name());
            this._apps.add_child(button);
            this._dockButtons.push({id, button, dot});
        }
        this._updateIndicators();
    }

    _updateIndicators() {
        for (const item of this._dockButtons || []) {
            const app = Cinnamon.AppSystem.get_default().lookup_app(item.id);
            const windows = app ? app.get_windows().filter(w => !w.skip_taskbar) : [];
            item.dot.opacity = windows.length ? 255 : 0;
        }
    }

    _launch(info, fresh = false) {
        this.menu.close(false);
        this._controls.close(false);
        const app = Cinnamon.AppSystem.get_default().lookup_app(info.get_id());
        const windows = app ? app.get_windows().filter(w => !w.skip_taskbar).sort((a, b) => b.get_user_time() - a.get_user_time()) : [];
        if (!fresh && windows.length) {
            if (windows[0] === global.display.focus_window) windows[0].minimize();
            else Main.activateWindow(windows[0]);
        } else if (info.get_id() === 'btop.desktop' && GLib.find_program_in_path('ghostty')) {
            Util.spawn(['ghostty', '-e', 'btop']);
        } else {
            try { info.launch([], global.create_app_launch_context()); }
            catch (error) { Main.notifyError('Could not open application', error.message); }
        }
    }

    _appContext(button, info) {
        if (this._context) this._context.destroy();
        this._context = this._popup(button, 'origin-app-context');
        this._context.addAction('Open new window', () => this._launch(info, true));
        const pinned = global.settings.get_strv('favorite-apps').includes(info.get_id());
        this._context.addAction(pinned ? 'Unpin from dock' : 'Pin to dock', () => {
            let ids = global.settings.get_strv('favorite-apps');
            ids = pinned ? ids.filter(id => id !== info.get_id()) : [...ids, info.get_id()];
            global.settings.set_strv('favorite-apps', ids);
        });
        this._context.open(false);
    }

    _openUri(path) {
        this.menu.close(false);
        const uri = path.includes('://') ? path : Gio.File.new_for_path(path).get_uri();
        try { Gio.AppInfo.launch_default_for_uri(uri, global.create_app_launch_context()); }
        catch (error) { Main.notifyError('Could not open location', error.message); }
    }

    _buildLauncher() {
        this._columns = new St.BoxLayout({style_class: 'origin-columns'});
        this.menu.addActor(this._columns);
        const pane = new St.BoxLayout({vertical: true, style_class: 'origin-launcher-pane'});
        this._columns.add_child(pane);
        this._search = new St.Entry({hint_text: 'Search apps', can_focus: true, style_class: 'origin-search'});
        this._search.set_primary_icon(new St.Icon({icon_name: 'edit-find-symbolic', icon_size: 15}));
        pane.add_child(this._search);
        this._search.clutter_text.connect('text-changed', () => this._renderApps());
        this._search.clutter_text.connect('activate', () => {
            if (this._matches.length) this._launch(this._matches[0]);
        });
        const quick = new St.Widget({layout_manager: new Clutter.GridLayout({column_spacing: 8, row_spacing: 8}), style_class: 'origin-quick-grid'});
        const tiles = [
            ['network-wireless-symbolic', 'Bluetooth', 'Devices & connections', ['blueman-manager']],
            ['drive-harddisk-symbolic', 'Storage', 'Files on this computer', ['nemo', GLib.get_home_dir()]],
            ['preferences-system-symbolic', 'Settings', 'Theme and desktop', ['cinnamon-settings']],
            ['utilities-terminal-symbolic', 'Terminal', 'Ghostty', ['ghostty']]
        ];
        tiles.forEach(([icon, name, subtitle, command], index) => {
            const button = new St.Button({can_focus: true, style_class: 'origin-quick-tile'});
            const row = new St.BoxLayout({style_class: 'origin-quick-row'});
            row.add_child(this._icon(icon, 21));
            const labels = new St.BoxLayout({vertical: true});
            labels.add_child(text(name));
            labels.add_child(text(subtitle, 'origin-muted origin-tile-subtitle'));
            row.add_child(labels);
            button.set_child(row);
            button.connect('clicked', () => { this.menu.close(false); Util.spawn(command); });
            quick.layout_manager.attach(button, index % 2, Math.floor(index / 2), 1, 1);
        });
        pane.add_child(quick);
        pane.add_child(text('All apps', 'origin-section-label'));
        const scroll = new St.ScrollView({style_class: 'origin-app-scroll', x_expand: true, y_expand: true});
        scroll.set_policy(St.PolicyType.NEVER, St.PolicyType.AUTOMATIC);
        this._grid = new St.BoxLayout({vertical: true, style_class: 'origin-app-grid'});
        scroll.add_actor(this._grid);
        pane.add_child(scroll);
        const footer = new St.BoxLayout({style_class: 'origin-user-footer'});
        footer.add_child(text('M', 'origin-avatar'));
        const identity = new St.BoxLayout({vertical: true, x_expand: true});
        this._nameLabel = text(this.displayName, 'origin-user-name');
        identity.add_child(this._nameLabel);
        identity.add_child(text('originOS · Cinnamon', 'origin-muted'));
        footer.add_child(identity);
        for (const [icon, name, command] of [
            ['view-grid-symbolic', 'Workspaces', null],
            ['system-log-out-symbolic', 'Log out', ['cinnamon-session-quit', '--logout']],
            ['system-shutdown-symbolic', 'Power', ['cinnamon-session-quit', '--power-off']]
        ]) footer.add_child(this._symbolButton(icon, name, () => {
            this.menu.close(false);
            if (command) Util.spawn(command); else Main.expo.toggle();
        }, 'origin-footer-button'));
        pane.add_child(footer);
        this._buildNotifications();
    }

    _renderApps() {
        if (!this._grid) return;
        const query = this._search.get_text().trim().toLocaleLowerCase();
        this._matches = this._allApps().filter(info => `${info.get_display_name()} ${info.get_description() || ''} ${info.get_executable() || ''}`.toLocaleLowerCase().includes(query));
        this._grid.destroy_all_children();
        if (!this._matches.length) {
            this._grid.add_child(text('No applications found', 'origin-muted'));
            return;
        }
        let row;
        this._matches.forEach((info, index) => {
            if (index % 4 === 0) {
                row = new St.BoxLayout({style_class: 'origin-app-row'});
                this._grid.add_child(row);
            }
            const button = new St.Button({can_focus: true, style_class: 'origin-grid-app'});
            const box = new St.BoxLayout({vertical: true, style_class: 'origin-grid-app-content'});
            box.add_child(this._appIcon(info, 33));
            const label = text(info.get_display_name(), 'origin-app-name');
            label.clutter_text.line_wrap = true;
            label.clutter_text.line_wrap_mode = Pango.WrapMode.WORD_CHAR;
            label.clutter_text.ellipsize = Pango.EllipsizeMode.END;
            box.add_child(label);
            button.set_child(box);
            button.connect('clicked', () => this._launch(info));
            button.connect('button-press-event', (_actor, event) => {
                if (event.get_button() !== 3) return Clutter.EVENT_PROPAGATE;
                this._appContext(button, info);
                return Clutter.EVENT_STOP;
            });
            row.add_child(button);
        });
    }

    _buildNotifications() {
        const pane = new St.BoxLayout({vertical: true, style_class: 'origin-notification-pane'});
        this._columns.add_child(pane);
        const heading = new St.BoxLayout({style_class: 'origin-notification-header'});
        heading.add_child(text('Notifications', 'origin-heading'));
        this._badge = text('0', 'origin-badge');
        heading.add_child(this._badge);
        pane.add_child(heading);
        const filters = new St.BoxLayout({style_class: 'origin-filters'});
        this._filters = {};
        for (const name of ['All', 'Unread', 'rotur']) {
            const button = new St.Button({label: name, can_focus: true, style_class: 'origin-filter'});
            button.connect('clicked', () => { this._filter = name; this._renderNotifications(); });
            this._filters[name] = button;
            filters.add_child(button);
        }
        pane.add_child(filters);
        pane.add_child(text('Recent activity', 'origin-section-label'));
        const scroll = new St.ScrollView({x_expand: true, y_expand: true, style_class: 'origin-notification-scroll'});
        scroll.set_policy(St.PolicyType.NEVER, St.PolicyType.AUTOMATIC);
        this._notificationList = new St.BoxLayout({vertical: true, style_class: 'origin-notification-list'});
        scroll.add_actor(this._notificationList);
        pane.add_child(scroll);
        const footer = new St.BoxLayout({style_class: 'origin-notification-footer'});
        for (const name of ['Mark all read', 'Clear all']) {
            const button = new St.Button({label: name, can_focus: true, x_expand: true, style_class: 'origin-text-button'});
            button.connect('clicked', () => {
                const native = this._nativeNotifications();
                if (name === 'Clear all' && native) native._clear_all();
                else for (const n of this._notifications()) this._seen.add(n);
                this._renderNotifications();
            });
            footer.add_child(button);
        }
        pane.add_child(footer);
    }

    _nativeNotifications() {
        return AppletManager.getRunningInstancesForUuid('notifications@cinnamon.org')[0];
    }

    _notifications() {
        const native = this._nativeNotifications();
        return native ? native.notifications.filter(n => !n._destroyed).slice().reverse() : [];
    }

    _notificationBody(notification) {
        return notification._bodyUrlHighlighter ? notification._bodyUrlHighlighter.actor.text : '';
    }

    _renderNotifications() {
        if (!this._notificationList) return;
        const all = this._notifications();
        this._badge.set_text(String(all.filter(n => !this._seen.has(n)).length));
        for (const name of Object.keys(this._filters)) this._filters[name].change_style_pseudo_class('selected', name === this._filter);
        this._notificationList.destroy_all_children();
        const filtered = all.filter(n => this._filter === 'All' || (this._filter === 'Unread' && !this._seen.has(n)) ||
            (this._filter === 'rotur' && /rotur|originchats/i.test(`${n.source.title} ${n.title} ${this._notificationBody(n)}`)));
        if (!filtered.length) {
            const empty = new St.BoxLayout({vertical: true, style_class: 'origin-empty-state'});
            empty.add_child(this._icon('notifications-symbolic', 34));
            empty.add_child(text('You’re all caught up', 'origin-empty-title'));
            empty.add_child(text('New notifications will appear here.', 'origin-muted'));
            this._notificationList.add_child(empty);
        }
        for (const notification of filtered) {
            if (!this._notificationSignals.has(notification)) {
                const id = notification.connect('destroy', () => {
                    this._notificationSignals.delete(notification);
                    this._later(() => this._renderNotifications(), 30);
                });
                this._notificationSignals.set(notification, id);
            }
            const row = new St.BoxLayout({style_class: 'origin-notification-card'});
            const button = new St.Button({can_focus: true, x_expand: true, style_class: 'origin-notification-open'});
            const content = new St.BoxLayout({style_class: 'origin-notification-content'});
            const sourceIcon = notification._icon;
            if (sourceIcon instanceof St.Icon) {
                content.add_child(new St.Icon({gicon: sourceIcon.gicon || Gio.icon_new_for_string(sourceIcon.icon_name || 'dialog-information'), icon_size: 28}));
            } else content.add_child(this._icon('notifications-symbolic', 28));
            const body = new St.BoxLayout({vertical: true});
            const line = new St.BoxLayout({style_class: 'origin-notification-title-row'});
            const title = text(notification._titleLabel ? notification._titleLabel.text : notification.title, 'origin-notification-title');
            title.clutter_text.ellipsize = Pango.EllipsizeMode.END;
            line.add_child(title);
            const minutes = Math.max(0, Math.floor((Date.now() - notification._timestamp.getTime()) / 60000));
            line.add_child(text(minutes < 1 ? 'now' : minutes < 60 ? `${minutes}m` : `${Math.floor(minutes / 60)}h`, 'origin-notification-age'));
            body.add_child(line);
            const detail = text(this._notificationBody(notification), 'origin-notification-body');
            detail.clutter_text.ellipsize = Pango.EllipsizeMode.END;
            body.add_child(detail);
            content.add_child(body);
            button.set_child(content);
            button.accessible_name = `${notification.source.title}: ${title.text}`;
            button.connect('clicked', () => {
                this._seen.add(notification);
                this.menu.close(false);
                notification.emit('clicked');
            });
            row.add_child(button);
            row.add_child(this._symbolButton('window-close-symbolic', 'Dismiss notification', () => notification.destroy(), 'origin-dismiss'));
            this._notificationList.add_child(row);
        }
    }

    _buildControls() {
        this._controls.addMenuItem(new PopupMenu.PopupMenuItem('Sound & displays', {reactive: false}));
        this._volume = new PopupMenu.PopupSliderMenuItem(1);
        this._volume.connect('value-changed', (_slider, value) => {
            const sound = AppletManager.getRunningInstancesForUuid('sound@cinnamon.org')[0];
            if (sound && sound._output) {
                sound._output.volume = Math.round(value * (sound._volumeNorm || 65536));
                sound._output.change_is_muted(false);
                sound._output.push_volume();
            }
        });
        this._controls.addMenuItem(this._volume);
        this._brightness = [];
        const native = AppletManager.getRunningInstancesForUuid('display-brightness@local')[0];
        if (native && native._rows) {
            for (const [id, name] of [['macbook', 'MacBook brightness'], ['cinema', 'Cinema Display brightness']]) {
                this._controls.addMenuItem(new PopupMenu.PopupMenuItem(name, {reactive: false}));
                const slider = new PopupMenu.PopupSliderMenuItem(1);
                slider.connect('value-changed', (_slider, value) => native._rows[id].slider.emit('value-changed', value));
                this._brightness.push({id, slider, native});
                this._controls.addMenuItem(slider);
            }
        }
        this._controls.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
        for (const [name, command] of [
            ['Sound & audio devices', ['cinnamon-settings', 'sound']],
            ['Displays', ['cinnamon-settings', 'display']],
            ['Bluetooth devices', ['blueman-manager']],
            ['Network', ['cinnamon-settings', 'network']],
            ['Date & time', ['cinnamon-settings', 'calendar']],
            ['Desktop settings', ['cinnamon-settings']]
        ]) this._controls.addAction(name, () => Util.spawn(command));
    }

    _updateControls() {
        const sound = AppletManager.getRunningInstancesForUuid('sound@cinnamon.org')[0];
        if (sound && sound._output) this._volume.setValue(sound._output.is_muted ? 0 : sound._output.volume / (sound._volumeNorm || 65536));
        for (const {id, slider, native} of this._brightness) {
            native._refresh();
            slider.setValue(native._rows[id].slider._value);
        }
    }

    _updateClock() {
        const now = GLib.DateTime.new_now_local();
        this._time.set_text(now.format('%H:%M'));
        this._date.set_text(now.format('%a %d %b'));
        this._clockButton.accessible_name = now.format('%A %d %B, %H:%M');
    }

    _integrateStock() {
        for (const entry of global.settings.get_strv('enabled-applets')) {
            const uuid = entry.split(':')[3];
            if (uuid === this._uuid) continue;
            for (const applet of AppletManager.getRunningInstancesForUuid(uuid)) {
                const actor = applet.actor;
                if (!actor || actor.is_finalized()) continue;
                if (uuid === 'systray@cinnamon.org' || uuid === 'xapp-status@cinnamon.org') {
                    const parent = actor.get_parent();
                    this._trays.push({actor, parent, index: parent.get_children().indexOf(actor)});
                    global.reparentActor(actor, this._trayBox);
                    continue;
                }
                const visible = actor.visible;
                const signal = actor.connect('notify::visible', () => { if (actor.visible && !this._disposed) actor.hide(); });
                this._hidden.push({actor, visible, signal});
                actor.hide();
                if (uuid === 'menu@cinnamon.org') {
                    this._stockMenu = applet;
                    this._stockClick = applet.on_applet_clicked;
                    this._stockBinding = applet.overlayKey || 'Super_L::Super_R::<Super>space';
                    applet.settings.setValue('overlay-key', '');
                    applet._updateKeybinding();
                    applet.on_applet_clicked = () => this.on_applet_clicked();
                }
            }
        }
        // Register after removing the stock menu's equivalent bindings.
        Main.keybindingManager.addXletHotKey(this, 'launcher', 'Super_L::Super_R::<Super>space', () => this.on_applet_clicked());
    }

    on_applet_clicked() {
        this._controls.close(false);
        if (this.menu.isOpen) this.menu.close(false);
        else this.menu.open(false);
    }

    on_applet_removed_from_panel() {
        this._disposed = true;
        Main.keybindingManager.removeXletHotKey(this, 'launcher');
        Mainloop.source_remove(this._clockTimer);
        for (const id of this._timers) Mainloop.source_remove(id);
        for (const [object, id] of this._signals) object.disconnect(id);
        for (const [notification, id] of this._notificationSignals) {
            if (!notification._destroyed) notification.disconnect(id);
        }
        for (const {actor, visible, signal} of this._hidden) {
            if (actor.is_finalized()) continue;
            actor.disconnect(signal);
            if (visible) actor.show();
        }
        for (const {actor, parent, index} of this._trays) {
            if (actor.is_finalized() || parent.is_finalized()) continue;
            global.reparentActor(actor, parent);
            parent.set_child_at_index(actor, index);
        }
        if (this._stockMenu) {
            this._stockMenu.on_applet_clicked = this._stockClick;
            this._stockMenu.settings.setValue('overlay-key', this._stockBinding);
            this._stockMenu._updateKeybinding();
        }
        if (this._context) this._context.destroy();
        this.menu.destroy();
        this._controls.destroy();
        this._settings.finalize();
    }
}

function main(metadata, orientation, panelHeight, instanceId) {
    return new OriginDock(metadata, orientation, panelHeight, instanceId);
}
