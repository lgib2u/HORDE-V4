#!/usr/bin/env node
/**
 * Waits for shadow-cljs to emit worker entry files before starting webpack.
 * Fixes the race where webpack runs before target/db-worker.js and
 * target/inference-worker.js exist, which would otherwise show 2 module-not-found errors.
 */
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const POLL_MS = 500;
const TIMEOUT_MS = 120000;

const workersByConfig = {
  app: ['target/db-worker.js', 'target/inference-worker.js'],
  mobile: ['target/db-worker.js'],
};

function checkFiles(configName) {
  const files = workersByConfig[configName];
  if (!files) {
    console.error('Usage: node wait-for-workers-and-webpack.js <app|mobile>');
    process.exit(1);
  }
  return files.every((f) => fs.existsSync(path.join(ROOT, f)));
}

function waitForWorkers(configName) {
  return new Promise((resolve, reject) => {
    const deadline = Date.now() + TIMEOUT_MS;
    const interval = setInterval(() => {
      if (checkFiles(configName)) {
        clearInterval(interval);
        resolve();
        return;
      }
      if (Date.now() >= deadline) {
        clearInterval(interval);
        reject(new Error('Timeout waiting for worker files from shadow-cljs'));
      }
    }, POLL_MS);
  });
}

const configName = process.argv[2] || 'app';
waitForWorkers(configName)
  .then(() => {
    const child = spawn(
      'npx',
      ['webpack', '--watch', '--config-name', configName],
      { cwd: ROOT, stdio: 'inherit', shell: true }
    );
    child.on('close', (code) => process.exit(code ?? 0));
  })
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
