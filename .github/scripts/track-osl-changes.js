const fs = require('fs');
const path = require('path');

const OSL_PATH = ':path';
const TRACKER_FILE = path.join(OSL_PATH, 'osl-tracker.json');

// Get current OSL files
function getCurrentOSLFiles() {
  try {
    const files = fs.readdirSync(OSL_PATH)
      .filter(file => file.endsWith('.osl'))
      .sort();
    return files;
  } catch (error) {
    console.error('Error reading OSL directory:', error);
    return [];
  }
}

// Load existing tracker data
function loadTrackerData() {
  try {
    if (fs.existsSync(TRACKER_FILE)) {
      const data = fs.readFileSync(TRACKER_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading tracker data:', error);
  }
  
  return {
    lastUpdated: new Date().toISOString(),
    totalScripts: 0,
    scripts: {}
  };
}

// Save tracker data
function saveTrackerData(data) {
  try {
    fs.writeFileSync(TRACKER_FILE, JSON.stringify(data, null, 2));
    console.log('Tracker data saved successfully');
  } catch (error) {
    console.error('Error saving tracker data:', error);
  }
}

// Get file stats
function getFileStats(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return {
      size: stats.size,
      modified: stats.mtime.toISOString(),
      created: stats.birthtime.toISOString()
    };
  } catch (error) {
    console.error(`Error getting stats for ${filePath}:`, error);
    return null;
  }
}

// Calculate file hash for change detection
function calculateFileHash(filePath) {
  try {
    const crypto = require('crypto');
    const fileBuffer = fs.readFileSync(filePath);
    return crypto.createHash('md5').update(fileBuffer).digest('hex');
  } catch (error) {
    console.error(`Error calculating hash for ${filePath}:`, error);
    return null;
  }
}

// Main tracking function
function trackOSLChanges() {
  console.log('Starting OSL script tracking...');
  
  const currentFiles = getCurrentOSLFiles();
  const trackerData = loadTrackerData();
  
  let hasChanges = false;
  
  // Check for new or modified files
  currentFiles.forEach(fileName => {
    const filePath = path.join(OSL_PATH, fileName);
    const fileStats = getFileStats(filePath);
    const fileHash = calculateFileHash(filePath);
    
    if (!fileStats || !fileHash) return;
    
    const existingScript = trackerData.scripts[fileName];
    
    if (!existingScript) {
      // New file
      console.log(`New OSL script detected: ${fileName}`);
      trackerData.scripts[fileName] = {
        name: fileName,
        firstAdded: new Date().toISOString(),
        lastModified: fileStats.modified,
        changeCount: 0,
        size: fileStats.size,
        hash: fileHash,
        status: 'active'
      };
      hasChanges = true;
    } else if (existingScript.hash !== fileHash) {
      // File modified
      console.log(`OSL script modified: ${fileName}`);
      existingScript.lastModified = fileStats.modified;
      existingScript.changeCount += 1;
      existingScript.size = fileStats.size;
      existingScript.hash = fileHash;
      existingScript.status = 'active';
      hasChanges = true;
    } else {
      // File unchanged, but mark as active
      existingScript.status = 'active';
    }
  });
  
  // Check for removed files
  Object.keys(trackerData.scripts).forEach(fileName => {
    if (!currentFiles.includes(fileName)) {
      console.log(`OSL script removed: ${fileName}`);
      trackerData.scripts[fileName].status = 'removed';
      trackerData.scripts[fileName].removedDate = new Date().toISOString();
      hasChanges = true;
    }
  });
  
  // Update metadata
  if (hasChanges) {
    trackerData.lastUpdated = new Date().toISOString();
    trackerData.totalScripts = currentFiles.length;
    trackerData.totalActiveScripts = Object.values(trackerData.scripts)
      .filter(script => script.status === 'active').length;
    trackerData.totalRemovedScripts = Object.values(trackerData.scripts)
      .filter(script => script.status === 'removed').length;
    
    // Add summary statistics
    trackerData.statistics = {
      mostChangedScript: null,
      totalChanges: 0,
      averageChangesPerScript: 0
    };
    
    const activeScripts = Object.values(trackerData.scripts)
      .filter(script => script.status === 'active');
    
    if (activeScripts.length > 0) {
      const totalChanges = activeScripts.reduce((sum, script) => sum + script.changeCount, 0);
      trackerData.statistics.totalChanges = totalChanges;
      trackerData.statistics.averageChangesPerScript = Math.round((totalChanges / activeScripts.length) * 100) / 100;
      
      const mostChanged = activeScripts.reduce((max, script) => 
        script.changeCount > max.changeCount ? script : max
      );
      trackerData.statistics.mostChangedScript = {
        name: mostChanged.name,
        changeCount: mostChanged.changeCount
      };
    }
    
    saveTrackerData(trackerData);
    console.log(`Tracking complete. ${currentFiles.length} active scripts tracked.`);
  } else {
    console.log('No changes detected in OSL scripts.');
  }
  
  return hasChanges;
}

// Run the tracker
if (require.main === module) {
  trackOSLChanges();
}
