#!/usr/bin/env node
import chokidar from 'chokidar';
import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const WATCH_PATTERNS = [
  join(__dirname, '../../public/assets/kr-solidarity/**/*.png'),
  join(__dirname, '../../public/assets/kr-ui/**/*.png')
];

// Debounce configuration
const DEBOUNCE_MS = 500;
let debounceTimer = null;

/**
 * Run the sync command
 */
function runSync() {
  console.log('🔄 Regenerating manifest and hero registry...');
  
  const syncProcess = spawn('npm', ['run', 'kr:sync'], {
    cwd: join(__dirname, '../..'),
    stdio: 'inherit',
    shell: true
  });
  
  syncProcess.on('close', (code) => {
    if (code === 0) {
      console.log('✅ Sync complete\n');
    } else {
      console.error(`❌ Sync failed with exit code ${code}\n`);
    }
  });
}

/**
 * Debounced sync trigger
 */
function triggerSync() {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  
  debounceTimer = setTimeout(() => {
    runSync();
  }, DEBOUNCE_MS);
}

/**
 * Main watcher function
 */
function startWatcher() {
  console.log('👀 KR Asset Watcher Started');
  console.log('📁 Watching:');
  WATCH_PATTERNS.forEach(pattern => console.log(`   ${pattern}`));
  console.log('');
  
  const watcher = chokidar.watch(WATCH_PATTERNS, {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true,
    ignoreInitial: true // don't trigger on startup
  });
  
  watcher
    .on('add', path => {
      console.log(`➕ Asset added: ${path.split('/').slice(-2).join('/')}`);
      triggerSync();
    })
    .on('change', path => {
      console.log(`📝 Asset changed: ${path.split('/').slice(-2).join('/')}`);
      triggerSync();
    })
    .on('unlink', path => {
      console.log(`➖ Asset removed: ${path.split('/').slice(-2).join('/')}`);
      triggerSync();
    })
    .on('error', error => {
      console.error(`❌ Watcher error: ${error}`);
    });
  
  console.log('✨ Watching for changes... (Press Ctrl+C to stop)\n');
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Watcher stopped');
  process.exit(0);
});

// Start watcher
startWatcher();
