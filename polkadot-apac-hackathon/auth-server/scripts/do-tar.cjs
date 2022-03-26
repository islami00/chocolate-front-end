const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execPromise = promisify(exec);
const prCWD = path.resolve(__dirname, '../');
// Assume each project folder is an id
const here = path.basename(prCWD);
process.chdir(prCWD);
// Get env, and tag
const env = process.env.DEPLOY_ENV ? `-${process.env.DEPLOY_ENV}` : '';
const ref = process.env.GITHUB_REF;
console.log('Producing tar artifact for ', ref);
let ver = '';
if (ref) {
  const refArr = ref.split('/');
  ver = `-${refArr[refArr.length - 1]}`;
}

// Then do tar.
(async function main() {
  // tar
  const { stderr, stdout } = await execPromise(`tar -cvf server-${here}${ver}${env}.tar ./lib`);
  console.log(stdout);
  if (stderr) {
    throw new Error(stderr);
  }
  //   Then set gh artifact env var.
  // https://docs.github.com/en/actions/creating-actions/metadata-syntax-for-github-actions#runsstepsenv
  // https://github.com/actions/upload-artifact/issues/22#issuecomment-873445944
  const { stderr: varErr, stdout: varOut } = await execPromise(
    `echo "ARTIFACT_NAME=${here}" >> $GITHUB_ENV`
  );
  console.log(varOut);
  if (varErr) {
    throw new Error(varErr);
  }
})().catch((err) => {
  process.emitWarning(err);
  process.exitCode = 1;
});
