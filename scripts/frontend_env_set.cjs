#!/usr/bin/node
const { writeFile } = require('fs');
const { readFile } = require('fs/promises');
const process = require('process');

(async function main() {
  const env = process.env.DEPLOY_ENV;
  if (!env) {
    process.emitWarning('Deploy env not specified');
    process.exitCode = 1;
    return;
  }
  if (env === 'nightly') {
    const nightlyEnv = await readFile('../.env.nightly', { encoding: 'utf-8' });
    writeFile('../.env', nightlyEnv, { encoding: 'utf-8', flag: 'w' }, () => {});
  }
  // Default is leave it as it is: Production.
})().catch((err) => {
  process.exitCode = 1;
});
