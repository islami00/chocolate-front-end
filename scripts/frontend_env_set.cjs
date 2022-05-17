#!/usr/bin/node
const { writeFile } = require('fs');
const { readFile } = require('fs/promises');
const path = require('path');
const process = require('process');

(async function main() {
  const env = process.env.DEPLOY_ENV;
  console.log('Deploying to env', env);
  if (env === 'nightly') {
    const nightlyEnv = await readFile(path.resolve(__dirname, '../src/config/test.json'), {
      encoding: 'utf-8',
    });
    writeFile(
      path.resolve(__dirname, '../src/config/production.json'),
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
