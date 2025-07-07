#!/usr/bin/env node

/**
 * OSL Script Tracker - Summary Report Generator
 * Displays a comprehensive summary of all tracked OSL scripts
 */

const fs = require('fs');
const path = require('path');

const TRACKER_FILE = path.join(':path', 'osl-tracker.json');

function loadTrackerData() {
  try {
    if (fs.existsSync(TRACKER_FILE)) {
      const data = fs.readFileSync(TRACKER_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('❌ Error loading tracker data:', error.message);
  }
  return null;
}

function formatDate(dateString) {
  try {
    return new Date(dateString).toLocaleString();
  } catch {
    return 'Unknown';
  }
}

function formatSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function generateSummary() {
  console.log('📊 OSL Script Tracker - Summary Report');
  console.log('════════════════════════════════════════');
  
  const data = loadTrackerData();
  if (!data) {
    console.log('❌ No tracking data found. Run the tracker first.');
    return;
  }
  
  console.log(`🕒 Last Updated: ${formatDate(data.lastUpdated)}`);
  console.log(`📁 Total Scripts: ${data.totalScripts || 0}`);
  console.log(`✅ Active Scripts: ${data.totalActiveScripts || 0}`);
  console.log(`🗑️  Removed Scripts: ${data.totalRemovedScripts || 0}`);
  
  if (data.statistics) {
    console.log(`🔄 Total Changes: ${data.statistics.totalChanges || 0}`);
    console.log(`📈 Average Changes/Script: ${data.statistics.averageChangesPerScript || 0}`);
    
    if (data.statistics.mostChangedScript) {
      console.log(`🏆 Most Changed: ${data.statistics.mostChangedScript.name} (${data.statistics.mostChangedScript.changeCount} changes)`);
    }
  }
  
  console.log('');
  console.log('📝 Script Details:');
  console.log('────────────────────────────────────────');
  
  const scripts = Object.values(data.scripts || {});
  const activeScripts = scripts.filter(s => s.status === 'active');
  const removedScripts = scripts.filter(s => s.status === 'removed');
  
  if (activeScripts.length > 0) {
    console.log('✅ Active Scripts:');
    activeScripts
      .sort((a, b) => b.changeCount - a.changeCount)
      .forEach(script => {
        const changes = script.changeCount > 0 ? ` (${script.changeCount} changes)` : '';
        const size = formatSize(script.size);
        const modified = formatDate(script.lastModified);
        console.log(`   📄 ${script.name}${changes} - ${size} - Modified: ${modified}`);
      });
  }
  
  if (removedScripts.length > 0) {
    console.log('');
    console.log('🗑️  Removed Scripts:');
    removedScripts.forEach(script => {
      const removed = formatDate(script.removedDate);
      console.log(`   📄 ${script.name} - Removed: ${removed}`);
    });
  }
  
  console.log('');
  console.log('🔧 Usage:');
  console.log('   ./:path/track-osl.sh          - Run manual tracking');
  console.log('   node .github/scripts/summary.js - Generate this report');
}

// Run if called directly
if (require.main === module) {
  generateSummary();
}

module.exports = { generateSummary };
