const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

// Cd
const prCWD = path.resolve(__dirname, '../');
process.chdir(prCWD);
const execPromise = promisify(exec);
// Get env, and tag
const env = process.env.DEPLOY_ENV ? `-${process.env.DEPLOY_ENV}` : '';
const ref = process.env.GITHUB_REF;
console.log('Producing tar artifact for ', ref);
let ver = '';
let verEnv = '';
if (ref) {
  const refArr = ref.split('/');
  verEnv = `${refArr[refArr.length - 1]}`;
  // Ret format: viii-?(nightly)-mm-dd-yy[1234]
  ver = `-${verEnv}`;
}

// Then do tar.
(async function main() {
  // tar
  const { stderr, stdout } = await execPromise(`tar -cvf web-app-build${ver}.tar ./build`);
  console.log(stdout);
  if (stderr) {
    throw new Error(stderr);
  }
  const { stderr: var2Err, stdout: var2Out } = await execPromise(
    `
    echo "ARTIFACT_NAME=web-app-build${env}" >> $GITHUB_ENV &&
    echo "ARTIFACT_PATH=web-app-build${ver}.tar" >> $GITHUB_ENV
    `
  );
  console.log(var2Out);
  if (var2Err) {
    throw new Error(var2Err);
  }
})().catch((err) => {
  process.emitWarning(err);
  process.exitCode = 1;
});
