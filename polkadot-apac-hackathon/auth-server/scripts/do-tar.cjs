const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execPromise = promisify(exec);
const prCWD = path.resolve(__dirname, '../');
// Assume each project folder is an id
const here = path.basename(prCWD);
process.chdir(prCWD);
// Get env, and tag
const ref = process.env.GITHUB_REF;
console.log('Producing tar artifact for ', ref);
let ver = '';
let gVerEnv = '';
if (ref) {
  const refArr = ref.split('/');
  const verEnv = `${refArr[refArr.length - 1]}`;
  // Ret format: viii-nightly-mm-dd-yy[1234]
  gVerEnv = verEnv.replace(/\./g, '').replace(/\+/g, '--');
  ver = `-${verEnv}`;
}

// Then do tar.
(async function main() {
  // tar
  const { stderr, stdout } = await execPromise(`tar -cvf servers-${here}${ver}.tar ./lib`);
  console.log(stdout);
  if (stderr) {
    throw new Error(stderr);
  }
  //   Then set gh artifact env var.
  // https://docs.github.com/en/actions/creating-actions/metadata-syntax-for-github-actions#runsstepsenv
  // https://github.com/actions/upload-artifact/issues/22#issuecomment-873445944
  const { stderr: var2Err, stdout: var2Out } = await execPromise(
    `
    echo "ARTIFACT_NAME=${here}" >> $GITHUB_ENV &&
    echo "APP_VERSION_GCLOUD=${gVerEnv}" >> $GITHUB_ENV
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
