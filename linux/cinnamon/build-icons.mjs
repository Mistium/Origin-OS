#!/usr/bin/env node
// Convert the current originOS ICN artwork using rotur-sdk's renderer.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {fileURLToPath, pathToFileURL} from 'node:url';
import crypto from 'node:crypto';

const here = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const option = name => args.includes(name) ? args[args.indexOf(name) + 1] : undefined;
const sdk = option('--sdk') || path.join(os.homedir(), 'rotur-sdk/dist/index.mjs');
const {iconToSvg} = await import(pathToFileURL(path.resolve(sdk)).href);
const sourceFile = path.join(here, 'icon-sources.json');
const navigation = {
  'origin-logo.svg': 'w 2.2 cutcircle 0 0 12 4.5 150 cutcircle 0 0 7 5 150 line -3 -4 -9 -10',
  'workspaces.svg': 'w 2.5 line -10 5 0 0 cont 10 5 cont 0 10 cont -10 5 line -10 -1 0 -6 cont 10 -1 line -10 -7 0 -12 cont 10 -7',
  'search.svg': 'w 2.5 cutcircle -2 2 8 0 180 line 4 -4 12 -12'
};
if (option('--source')) {
  const root = path.resolve(option('--source'));
  const manifest = fs.readFileSync(path.join(root, 'OSL Programs/apps/System/.Install_system.json'), 'utf8');
  const pack = fs.readFileSync(path.join(root, 'Icons/all-icons.json'), 'utf8');
  const names = new Set(['Files', 'Settings', 'Activity', 'Studio', 'Terminal', 'Calculator', 'Summit', 'Contacts', 'OMail', 'Wallet', 'App Store', 'Beam', 'Camera']);
  const applications = JSON.parse(manifest).filter(app => names.has(app.name.replace(/\.osl$/, ''))).map(({name, icon}) => ({name: name.replace(/\.osl$/, ''), icon}));
  const icons = JSON.parse(pack).data;
  const windowScript = fs.readFileSync(path.join(root, 'OSL Programs/scripts/system/win_buttons.osl'), 'utf8');
  const windowButtons = {};
  for (const [name, originName] of Object.entries({close: 'close', minimize: 'down', maximize: 'maximise', restore: 'minimise'})) {
    if (!icons[originName]) throw new Error(`Missing window icon: ${originName}`);
    windowButtons[name] = {originName, icon: icons[originName]};
  }
  const named = {};
  function collect(string) {
    for (const match of string.matchAll(/\bicn\s+(\S+)/g)) {
      const name = match[1];
      if (named[name]) continue;
      if (!icons[name]) throw new Error(`Missing named icon: ${name}`);
      named[name] = icons[name];
      collect(icons[name]);
    }
  }
  for (const app of applications) collect(app.icon);
  for (const name of ['folder', 'download', 'bin', 'desktops']) collect(`icn ${name}`);
  fs.writeFileSync(sourceFile, JSON.stringify({
    source: 'Mistium/Origin-OS · OSL Programs/apps/System/.Install_system.json + Icons/all-icons.json',
    manifestSha256: crypto.createHash('sha256').update(manifest).digest('hex'),
    packSha256: crypto.createHash('sha256').update(pack).digest('hex'),
    windowScript: 'OSL Programs/scripts/system/win_buttons.osl',
    windowScriptSha256: crypto.createHash('sha256').update(windowScript).digest('hex'),
    windowButtons, applications, named, navigation
  }, null, 2) + '\n');
}
const source = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));
const applet = path.join(here, 'applet/icons');
fs.mkdirSync(applet, {recursive: true});
const convert = (string, viewSize = 11) => iconToSvg(string, {
  viewSize, color: '#f5effb', resolver: name => source.named[name],
  svgAttrs: {width: '48', height: '48'}
});
for (const app of source.applications) {
  let svg = convert(app.icon);
  // ICN rect includes the current pen width. This SDK release exports its
  // filled centre but omits that stroke; restore it from the unchanged tokens.
  let penWidth = 1;
  const rectangleWidths = [];
  for (const match of app.icon.matchAll(/\bw\s+([\d.]+)|\brect\s+[-\d.]+\s+[-\d.]+\s+[-\d.]+\s+[-\d.]+/g)) {
    if (match[1]) penWidth = Number(match[1]);
    else rectangleWidths.push(penWidth);
  }
  let rectangle = 0;
  svg = svg.replace(/<rect\b[^>]*\/>/g, tag => {
    const width = rectangleWidths[rectangle++];
    if (width === undefined) throw new Error(`Unexpected rectangle in ${app.name}`);
    const color = tag.match(/fill="([^"]+)"/)[1];
    return tag.replace('/>', ` stroke="${color}" stroke-width="${width}" stroke-linejoin="round"/>`);
  });
  if (rectangle !== rectangleWidths.length) throw new Error(`Missing rectangle in ${app.name}`);
  // The current SDK omits ICN's fill toggle. Files uses it for this one folder
  // path; retain the manifest's existing blue fill without changing its shape.
  if (app.name === 'Files') svg = svg.replace(/(<path [^>]*stroke="#3d8ee8"[^>]*?)fill="none"/g, '$1fill="#3d8ee8"');
  fs.writeFileSync(path.join(applet, `${app.name}.svg`), svg + '\n');
}
for (const [name, string] of Object.entries(source.navigation)) fs.writeFileSync(path.join(applet, name), convert(string, 15) + '\n');

const theme = path.join(here, 'icon-theme');
for (const type of ['apps', 'places', 'actions']) fs.mkdirSync(path.join(theme, 'scalable', type), {recursive: true});
const aliases = {
  'nemo': 'Nemo', 'system-file-manager': 'Nemo',
  'cinnamon-settings': 'Settings', 'preferences-system': 'Settings', 'preferences-desktop': 'Settings',
  'utilities-terminal': 'Ghostty', 'com.mitchellh.ghostty': 'Ghostty',
  'accessories-calculator': 'Calculator', 'org.gnome.Calculator': 'Calculator',
  'btop': 'Btop', 'org.gnome.SystemMonitor': 'Activity',
  'dev.zed.Zed': 'Zed', 'visual-studio-code': 'Studio',
  'google-chrome': 'Chrome', 'chromium': 'Chrome',
  'discord': 'Discord', 'spotify': 'Spotify', 'spotify-client': 'Spotify'
};
for (const [name, application] of Object.entries(aliases)) {
  fs.copyFileSync(path.join(applet, `${application}.svg`), path.join(theme, 'scalable/apps', `${name}.svg`));
}
const folder = convert('c #a9d2f2 icn folder 1', 13).replace(/fill="none"/g, 'fill="#a9d2f2"');
const body = svg => svg.replace(/^<svg[^>]*>\n?/, '').replace(/<\/svg>\s*$/, '');
const folderIcons = {
  'folder': null, 'folder-open': null, 'folder-documents': null,
  'user-home': null, 'folder-download': 'download', 'folder-downloads': 'download',
  'user-desktop': 'desktops', 'folder-desktop': 'desktops',
  'folder-applications': 'desktops', 'user-trash': 'bin', 'user-trash-full': 'bin'
};
for (const [name, overlay] of Object.entries(folderIcons)) {
  let svg = folder;
  if (overlay) svg = folder.replace('</svg>', body(convert(`c #5963e7 icn ${overlay} 0.52`, 13)) + '</svg>');
  fs.writeFileSync(path.join(theme, 'scalable/places', `${name}.svg`), svg + '\n');
  fs.writeFileSync(path.join(applet, `${name}.svg`), svg + '\n');
}
for (const name of ['close', 'minimize', 'maximize', 'restore']) {
  const icon = source.windowButtons[name];
  const svg = iconToSvg(icon.icon, {viewSize: 13, color: '#eee7f4', svgAttrs: {width: '16', height: '16'}}) + '\n';
  fs.writeFileSync(path.join(here, 'theme/gtk-3.0/assets', `${name}.svg`), svg);
  fs.writeFileSync(path.join(theme, 'scalable/actions', `window-${name}-symbolic.svg`), svg);
}
console.log(`Converted ${source.applications.length} current system-app icons, navigation, folders and window actions.`);
