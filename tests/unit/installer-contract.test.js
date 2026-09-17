const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '../..');
const manifestPath = path.join(repoRoot, 'OSL Programs/apps/System/.Install_system.json');

const tests = [{
  name: 'local installer entries point to files that exist',
  run: () => {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    const missing = manifest
      .filter(entry => new URL(entry.url).hostname === 'origin.mistium.com')
      .map(entry => decodeURIComponent(new URL(entry.url).pathname.slice(1)))
      .filter(relativePath => !fs.existsSync(path.join(repoRoot, relativePath)));

    if (missing.length > 0) {
      throw new Error(`installer references missing files: ${missing.join(', ')}`);
    }
  }
}];

module.exports = { tests };
