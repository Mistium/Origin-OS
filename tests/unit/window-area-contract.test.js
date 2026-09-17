const fs = require('fs');
const path = require('path');

const source = fs.readFileSync(path.join(__dirname, '../../OSL Programs/apps/System/originWM.osl'), 'utf8');
const dockSource = fs.readFileSync(path.join(__dirname, '../../OSL Programs/apps/Dock/Dock.osl'), 'utf8');
const applicationsSource = fs.readFileSync(path.join(__dirname, '../../OSL Programs/apps/Dock/applications.osl'), 'utf8');
const activitySource = fs.readFileSync(path.join(__dirname, '../../OSL Programs/apps/System/Activity.osl'), 'utf8');
const summitSource = fs.readFileSync(path.join(__dirname, '../../OSL Programs/apps/System/Summit.osl'), 'utf8');
const originStartSource = fs.readFileSync(path.join(__dirname, '../../OSL Programs/apps/System/Origin_Start.osl'), 'utf8');
const settingsSource = fs.readFileSync(path.join(__dirname, '../../OSL Programs/apps/System/Settings.osl'), 'utf8');
const calculatorSource = fs.readFileSync(path.join(__dirname, '../../OSL Programs/apps/System/Calculator.osl'), 'utf8');
const winButtonsSource = fs.readFileSync(path.join(__dirname, '../../OSL Programs/scripts/system/win_buttons.osl'), 'utf8');
const rvoiceSource = fs.readFileSync(path.join(__dirname, '../../OSL Programs/apps/System/RVoice_Handler.osl'), 'utf8');
const gnomeSource = fs.readFileSync(path.join(__dirname, '../../OSL Programs/apps/Dock/Gnome.osl'), 'utf8');
const timeInfoSource = fs.readFileSync(path.join(__dirname, '../../OSL Programs/apps/System/Time_Info.osl'), 'utf8');
const terminalSource = fs.readFileSync(path.join(__dirname, '../../OSL Programs/apps/System/Terminal.osl'), 'utf8');
const httpClientSource = fs.readFileSync(path.join(__dirname, '../../OSL Programs/apps/System/Http_Client.osl'), 'utf8');

const tests = [{
  name: 'originWM preserves shared work-area reservations',
  run: () => {
    if (/origin\.windows\.area\s*=\s*\{\s*top:/s.test(source)) throw new Error('originWM replaces the shared work area');
    if (!source.includes('window_area @= origin.windows.area')) throw new Error('originWM must retain the shared work-area reference');
    for (const edge of ['top', 'bottom', 'right', 'left']) {
      if (!source.includes(`window_area.${edge} = window_area.${edge} ?? 0`)) throw new Error(`missing non-destructive ${edge} default`);
    }
    if (!source.includes('local pointer_x = mouse_ondown ? mouse_press_x mouse_x')) throw new Error('originWM must hit-test queued drags at their press coordinate');
    if (!source.includes('mouse_x: mouse_ondown ? mouse_press_x mouse_x')) throw new Error('originWM must retain the queued drag origin while applying its release coordinate');
    if (!source.includes('if pointer_x < x_position or pointer_y > y_position (')) throw new Error('originWM must test the first dragbox corner against the press coordinate');
    if (!source.includes('if pointer_x > x_position or pointer_y < y_position (')) throw new Error('originWM must test the second dragbox corner against the press coordinate');
    if (!source.includes('if win.restore_bounds == null (')) throw new Error('snap must remember an unset restore rectangle');
    if (!source.includes('top.target_width = restore.width ?? 700')) throw new Error('unsnap must restore the remembered width');
  }
}, {
  name: 'merged Dock remains a visible full-screen desktop host',
  run: () => {
    if (!dockSource.includes('def render_desktop() (')) throw new Error('Dock desktop renderer must be declared as a callable function');
    if (!dockSource.includes('window "show"')) throw new Error('merged Dock must be visible');
    if (!dockSource.includes('window.desktop_layer = true')) throw new Error('merged Dock must stay below ordinary windows');
    if (!dockSource.includes('window.style = {bg: "transparent"}')) throw new Error('merged Dock must not cover the wallpaper');
    if (!dockSource.includes('number width = round(screensize_x)')) throw new Error('merged Dock must cover the full desktop width');
    if (!dockSource.includes('number height = round(screensize_y)')) throw new Error('merged Dock must cover the full desktop height');
    if (dockSource.includes('window.resize(screensize_x, 70)')) throw new Error('merged Dock must not shrink its desktop host to the Dock strip');
    if (!dockSource.includes('x = round(dock_width / -2 + 15)')) throw new Error('Dock render cursor must be visible to segment functions');
    if (dockSource.includes('local x = round(dock_width / -2 + 15)')) throw new Error('Dock render cursor must not be isolated from segment functions');
    if (!dockSource.includes('pen "opacity" 0\n    square screensize_x screensize_y 1 0 1\n    pen "opacity" 100')) throw new Error('desktop hitbox must remain transparent');
    if (!dockSource.includes('local compact_folders = predicted_width > screensize_x - 20')) throw new Error('Dock must compact optional folders before overflowing the screen');
    if ((dockSource.match(/compact_folders and cur\.name\.endsWith\("folders\.osl"\)/g) || []).length !== 2) throw new Error('Dock compaction must apply to segment backgrounds and contents');
    if (!dockSource.includes('local resolved_widths = []')) throw new Error('Dock must resolve each reactive segment width once per frame');
    if ((dockSource.match(/max\(0, cur\.width\.toNum\(\)\)/g) || []).length !== 1) throw new Error('Dock repeats reactive width work inside its rendering passes');
    if (!dockSource.includes('cur.render_width = w')) throw new Error('Dock must pass the resolved width into each segment renderer');
  }
}, {
  name: 'application Dock segment owns open-app state without a duplicate running segment',
  run: () => {
    if (fs.existsSync(path.join(__dirname, '../../OSL Programs/apps/Dock/running.osl'))) throw new Error('retired running-app segment still exists');
    if (dockSource.includes('"Origin/(A) System/Docks/Modules/running.osl",')) throw new Error('Dock defaults still include the retired running-app segment');
    if (!dockSource.includes('segments.contains(retired_running_osl)')) throw new Error('Dock must migrate persisted .osl running segments');
    if (!dockSource.includes('segments.contains(retired_running_ode)')) throw new Error('Dock must migrate persisted .ode running segments');
    if (!applicationsSource.includes('local open_apps = []')) throw new Error('application segment must collect open application identities');
    if (!applicationsSource.includes('candidate.uuid ?? candidate.window.file.uuid')) throw new Error('application segment must resolve window UUIDs across window shapes');
    if (!applicationsSource.includes('if fileGet(1) == ".shortcut" (')) throw new Error('application segment must resolve shortcut targets before comparing open state');
    if (!applicationsSource.includes('app_uuid = open(target_path, [14])[1]')) throw new Error('application segment must compare the target application UUID');
    if (!applicationsSource.includes('file = open(app, [2])\n    )')) throw new Error('application segment must restore the shortcut file context before rendering');
    if (!applicationsSource.includes('if active_window != null (\n      goto icon_x y - 20')) throw new Error('application icons must test their open state');
    if (!applicationsSource.includes('square 14 1 0 : c#global_accent')) throw new Error('open application icons need a true one-pixel accent underline');
    if (!applicationsSource.includes('timer - dock_state.refreshed_at > 0.25')) throw new Error('application Dock folder reads must be cached across frames');
    if (!applicationsSource.includes('for i dock_state.dock.len (')) throw new Error('application rendering must use the populated persistent Dock cache');
    if (!applicationsSource.includes('timer - dock_state.open_apps_refreshed_at > 0.1')) throw new Error('application open-window scans must be cached across frames');
    if (!applicationsSource.includes('dock_state.open_apps = []')) throw new Error('application open-window cache must reset before each refresh');
    if (!applicationsSource.includes('local segment_width = self.render_width ?? self.width.toNum()')) throw new Error('application rendering must reuse Dock\'s resolved segment width');
    if (!applicationsSource.includes('window.focusWindow(active_window.id)')) throw new Error('open application icons must restore and focus their existing window');
    if (!applicationsSource.includes(') else (\n        file "start"')) throw new Error('closed application icons must still launch a new window');
    if (applicationsSource.indexOf('file "interact"') > applicationsSource.indexOf('square 18 3 3 : c#global_accent')) throw new Error('open-state decoration must not replace the icon hit-test before interaction');
    if (applicationsSource.indexOf('rightclick "file" app') > applicationsSource.indexOf('square 18 3 3 : c#global_accent')) throw new Error('open-state decoration must not replace the icon hit-test before its context menu');
    if (!applicationsSource.includes('if mouse_x > icon_x - 22.5 and mouse_x < icon_x + 22.5')) throw new Error('application tooltip hover must not depend on the underline hit-test state');
    if (!applicationsSource.includes('goto curx y + 36')) throw new Error('application tooltip must stay above its Dock icon');
    if (/goto curx y \+ height/.test(applicationsSource)) throw new Error('application tooltip must not inherit the full-screen host height');
    if (applicationsSource.includes('goto curx 15')) throw new Error('application tooltip still uses a screen-relative vertical position');
    if (settingsSource.includes('"Origin/(A) System/Docks/Modules/running.ode",')) throw new Error('Settings reset still restores the retired running-app segment');
  }
}, {
  name: 'HTTP Client controls consume routed DOM click edges and render evaluated labels',
  run: () => {
    if (/\bclicked\b/.test(httpClientSource)) throw new Error('HTTP Client still depends on the stale clicked state');
    if ((httpClientSource.match(/\bif onclick/g) || []).length < 1) throw new Error('HTTP Client method controls must use onclick');
    if (!httpClientSource.includes('text "Make a " ++ buttons[selected] ++ " request to a website:"')) throw new Error('HTTP Client method label must evaluate the selected method');
    if (!httpClientSource.includes('loc 2 2 40 -55')) throw new Error('HTTP Client method controls must render below the title dragbox');
    if (httpClientSource.includes('loc 2 2 40 -20')) throw new Error('HTTP Client method controls still overlap the title dragbox');
    if (!httpClientSource.includes('inputs.type = "text/plain"')) throw new Error('HTTP Client must initialise its content type as an actual input value');
    if (!httpClientSource.includes('http "sendto" inputs.Url')) throw new Error('HTTP Client must send the current URL input value');
    if (httpClientSource.includes('http "sendto" inputs.Url.str')) throw new Error('HTTP Client still dereferences the string URL as a legacy input object');
    if (/\binput_(url|body|type)\b/.test(httpClientSource)) throw new Error('HTTP Client still reads obsolete legacy input variables');
    if (!httpClientSource.includes('resp_len = 0')) throw new Error('HTTP Client must initialise its pending response display');
    if (httpClientSource.includes('onclick and can')) throw new Error('HTTP Client still adds a redundant debounce to its routed send edge');
    if (!httpClientSource.includes('loc 2 2 window.width - 50 -130')) throw new Error('HTTP Client send hitbox must use an explicit resolved position');
    if (httpClientSource.includes('loc -2 2 -50 -130')) throw new Error('HTTP Client send hitbox still uses the mismatched right-anchor collision path');
    if (!httpClientSource.includes('send_clicked = mouse_ondown and abs(mouse_press_x - x_position) < 45 and abs(mouse_press_y - y_position) < 18')) throw new Error('HTTP Client Send must use the routed press coordinates');
    if (!httpClientSource.includes('if send_clicked (')) throw new Error('HTTP Client Send must consume its explicit routed hit test');
    if (!httpClientSource.includes('response_code = "pending"')) throw new Error('HTTP Client must expose pending requests immediately');
    if (!httpClientSource.includes('last_response_success = response_success')) throw new Error('HTTP Client must preserve completed success state before resetting its request');
    if (!httpClientSource.includes('last_response_failed = response_failed')) throw new Error('HTTP Client must preserve completed failure state before resetting its request');
    if (!httpClientSource.includes('if last_response_success (')) throw new Error('HTTP Client must render the preserved success state');
    if (!httpClientSource.includes('if last_response_failed (')) throw new Error('HTTP Client must render the preserved failure state');
    if (!httpClientSource.includes('copy_clicked = mouse_ondown and abs(mouse_press_x - x_position) < 130 and abs(mouse_press_y - y_position) < 18')) throw new Error('HTTP Client copy control must use the routed press coordinates');
    if (!httpClientSource.includes('if copy_clicked (')) throw new Error('HTTP Client must consume its explicit copy hit test');
    if (httpClientSource.indexOf('loc 2 2 window.width - 50 -130') > httpClientSource.indexOf('input w - 10 25 "Url"')) throw new Error('HTTP Client must handle Send before the URL input consumes its outside click');
    if (!httpClientSource.includes('if response_failed or response_success (')) throw new Error('HTTP Client must consume a request only after it completes');
    if (httpClientSource.includes('if response_failed nor response_success (')) throw new Error('HTTP Client still resets requests while they are pending');
    if (!httpClientSource.trimEnd().endsWith('import "win-buttons"')) throw new Error('HTTP Client must expose standard window controls');
  }
}, {
  name: 'interactive Terminal windows expose standard controls and drag from the whole surface',
  run: () => {
    if (!terminalSource.includes('window.setDragbox([2,2,0,0],[-2,-2,0,0])')) throw new Error('Terminal must be draggable from its entire surface');
    if (!terminalSource.includes('if !tty (\n  import "win-buttons"\n)')) throw new Error('normal Terminal windows need visible close, minimise, and maximise controls');
  }
}, {
  name: 'clock popup closes without leaking hidden child windows',
  run: () => {
    if (!timeInfoSource.includes('window.show()')) throw new Error('clock popup must make its child window visible');
    if (!timeInfoSource.includes('if timer - opened_at > 0.1 and window.id != focused_application_id (')) throw new Error('clock popup must close when it loses focus');
    if (!timeInfoSource.includes('if onclick and can (')) throw new Error('clock popup must use the routed click edge for inside clicks');
    if (timeInfoSource.includes('if mouse_down and can (')) throw new Error('clock popup still consumes the global opening mouse press');
  }
}, {
  name: 'Activity samples DOM metrics only for the DOM view',
  run: () => {
    if (!activitySource.includes('if !paused and current_tab == "DOM" (')) throw new Error('Activity must not run DOM profiling on unrelated tabs');
    if (!activitySource.includes('def drawTab(name, label) (')) throw new Error('Activity tabs need separate internal and display labels');
    if (!activitySource.includes('tab_w = 78')) throw new Error('Activity tabs must leave visible gaps on one row');
    if (!activitySource.includes('text label 8 : c#txtc')) throw new Error('Activity tabs must render their compact display labels');
    if (!activitySource.includes('drawTab("Performance", "Graph")')) throw new Error('Activity Performance needs a compact non-overlapping label');
    if (!activitySource.includes('loc 2 2 480 -20\ndrawTab("DOM", "DOM")')) throw new Error('Activity DOM tab must remain on the primary tab row');
    if (!activitySource.includes('graph = (1 to 1000).fill(null)')) throw new Error('Activity must retain its full graph workload for renderer coverage');
    if (!activitySource.includes('if graph.len > 1000 (')) throw new Error('Activity graph history must remain bounded');
    if ((activitySource.match(/c global_accent\n\s+graph/g) || []).length !== 2) throw new Error('Activity graphs must use a visible accent stroke');
    if (!activitySource.includes('graph max(100, window_width - 70) max(100, window_height - 100) graph')) throw new Error('Activity Performance graph must use stable window dimensions');
    if (activitySource.includes('frame.height - 50 graph')) throw new Error('Activity Performance graph still inherits stale frame dimensions');
    if (!activitySource.includes('frame dom_frame_left dom_frame_top x_position y_position dom_lines.len * 20 + 50 (')) throw new Error('Activity DOM report must use a clipped scrolling frame');
    if (!activitySource.includes('loc 2 2 85 -65\n    text "DOM / VDOM profile"')) throw new Error('Activity DOM heading must stay fixed above its scrolling report');
    if (!activitySource.includes('loc 2 2 70 -90')) throw new Error('Activity DOM report frame must begin below its heading');
    if (!activitySource.includes('local dom_report_y = frame.scroll - 10\n      loc 2 2 15 dom_report_y')) throw new Error('Activity DOM metrics must resolve a ten-pixel frame-local top inset before positioning');
    if (activitySource.includes('loc 2 2 570 -20\ntab "DOM"')) throw new Error('Activity DOM tab overlaps the top-right controls');
    if (!activitySource.includes('dom_lines.append("Top VDOM windows:")')) throw new Error('Activity DOM rows must append without replacing the output array');
    if (!activitySource.includes('window.origin?.windows?.ids?.findIndex(id => String(id) === String(w.id))')) throw new Error('Activity DOM rows must resolve window names from the authoritative id mapping');
    if (!activitySource.includes('name: String(windowName || w.name || t.sprite?.name || \'Window\')')) throw new Error('Activity DOM rows need a stable target-name fallback');
    if (/dom_lines\s+@=/.test(activitySource)) throw new Error('Activity DOM rows replace the output array with reference assignment');
    if (activitySource.includes('square 25 25 10 : chx#-40')) throw new Error('Activity must not overlap local controls with shared win-buttons');
    if (activitySource.includes('icon "close" 0.7 : chx#40')) throw new Error('Activity still renders duplicate local window controls');
    if (!activitySource.includes('disk_info.len > 0 ? disk_info.join("\\n") "Usage data unavailable"')) throw new Error('Activity must explain unavailable cloud disk metrics');
    if (!activitySource.includes('text "Metrics unavailable in browser mode" 10')) throw new Error('Activity must explain unavailable hardware disk metrics');
    if (!activitySource.trimEnd().endsWith('import "win-buttons"')) throw new Error('Activity must render movable window controls');
  }
}, {
  name: 'shared window controls handle queued click edges',
  run: () => {
    if ((winButtonsSource.match(/if onclick \(/g) || []).length !== 3) throw new Error('shared close, minimise, and maximise controls must use onclick');
    if (/\bclicked\b/.test(winButtonsSource)) throw new Error('shared window controls still depend on the stale clicked variable');
  }
}, {
  name: 'Calculator handles queued click edges for equals and window controls',
  run: () => {
    if (!calculatorSource.includes('local pointer_click = onclick')) throw new Error('Calculator must retain the transient pointer edge before evaluating key methods');
    if (!calculatorSource.includes('if (pointer_click or "enter".onKeyDown()) and character == "=" (')) throw new Error('Calculator equals must use the retained onclick edge');
    if (!calculatorSource.includes('if (onclick or "backspace".onKeyDown()) and can (')) throw new Error('Calculator backspace must use the queued onclick edge');
    if (/\bclicked\b/.test(calculatorSource)) throw new Error('Calculator still depends on the stale clicked variable');
  }
}, {
  name: 'Summit preserves request context and has a web registry fallback',
  run: () => {
    if (!summitSource.includes('fetch_url = summit.system_url ++ url')) throw new Error('Summit must use its system web registry when the TLD list is unavailable');
    if (!summitSource.includes('local page_key = self.page_key')) throw new Error('Summit async requests must recover their bound page key');
    if (!summitSource.includes('local fetch_url = self.fetch_url')) throw new Error('Summit async requests must recover their bound request URL');
    if (!summitSource.includes('.then(fetch_handler.bind({page_key, fetch_url}))')) throw new Error('Summit must bind request context across promise workers');
    if (summitSource.includes('.then(resp -> (')) throw new Error('Summit must not rely on uncaptured callback locals');
    if (!summitSource.includes('page_frame current_left window.top - 45 current_right window.bottom + 10 tab_id')) throw new Error('Summit page content must clear the shared title controls');
    if (summitSource.includes('page_frame current_left window.top - 10 current_right window.bottom + 10 tab_id')) throw new Error('Summit page content still overlaps the shared title controls');
  }
}, {
  name: 'Origin Start loads its theme helper into the main scope',
  run: () => {
    if (!originStartSource.includes('import "window_tools"\n')) throw new Error('Origin Start must import window_tools into its main scope');
    if (!originStartSource.includes('\nload_theme\n')) throw new Error('Origin Start must call the imported theme helper directly');
    if (originStartSource.includes('wt:load_theme')) throw new Error('Origin Start must not use the broken compiled package alias');
    if (!originStartSource.includes('type: "spacer",\n    name: ""')) throw new Error('Origin Start spacers must have a render-safe name');
    if (!originStartSource.includes('window.y = screensize_y / -2 + window.height / 2 +')) throw new Error('Origin Start must stay inside the bottom screen edge');
    if (originStartSource.includes('window.y = screensize_y - window.height / -2')) throw new Error('Origin Start must not place itself beyond the screen');
  }
}, {
  name: 'Settings sends wallpaper values as separate terminal arguments',
  run: () => {
    if (!settingsSource.includes('terminal "system wallpaper " ++ wallpaper_provider ++ "static/" ++ cur')) throw new Error('wallpaper URLs must not be glued to the command name');
    if (!settingsSource.includes('terminal "system wallpapermode " ++ fillmode')) throw new Error('wallpaper modes must not be glued to the command name');
    if (settingsSource.includes('terminal "system wallpaper" + wallpaper_provider')) throw new Error('broken wallpaper command remains');
    if (settingsSource.includes('terminal "system wallpapermode" + fillmode')) throw new Error('broken wallpaper-mode command remains');
  }
}, {
  name: 'apps separate dynamic terminal command arguments',
  run: () => {
    if (!settingsSource.includes('terminal "system scrollspeed " ++ slider_scrollsp')) throw new Error('Settings scroll speed must be a separate command argument');
    if (!activitySource.includes('terminal "kill " ++ page')) throw new Error('Activity kill target must be a separate command argument');
    if (!rvoiceSource.includes('terminal "rvoice call " ++ passed_data.from')) throw new Error('RVoice caller must be a separate command argument');
    if (!rvoiceSource.includes('terminal "rvoice mic_mode " ++')) throw new Error('RVoice microphone mode must be a separate command argument');
    if (!gnomeSource.includes('terminal "system windows set min-y " ++')) throw new Error('Gnome minimum work area must be a separate command argument');
    if (!gnomeSource.includes('terminal "system windows set max-y " ++')) throw new Error('Gnome maximum work area must be a separate command argument');
  }
}];

module.exports = { tests };
