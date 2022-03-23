#!/usr/bin/node
const { writeFile } = require('fs');
const { readFile } = require('fs/promises');
const path = require('path');
const process = require('process');

(async function main() {
  const env = process.env.DEPLOY_ENV;
  if (!env) {
    process.emitWarning('Deploy env not specified');
    process.exitCode = 1;
    return;
  }
  if (env === 'nightly') {
    // Use path to resolve relative to script dir
    const nightlyEnv = await readFile(path.resolve(__dirname, '../.env.nightly'), {
      encoding: 'utf-8',
    });
    writeFile(
      path.resolve(__dirname, '../.env'),
      nightlyEnv,
      { encoding: 'utf-8', flag: 'w' },
      () => {}
    );
  }
  // Default is leave it as it is: Production.
})().catch((err) => {
  process.emitWarning(err);
  process.exitCode = 1;
});
