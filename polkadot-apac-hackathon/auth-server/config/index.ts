// Setup env vars for each env
import { randomBytes } from 'crypto';
// Layer in raw dotenv, mostly for local testing.
import 'dotenv/config';
import { config } from 'firebase-functions';
import { SecretsReader } from './gcloudSecrets';

let isGconnect = false;
let gcpSecretsLoader: SecretsReader;

const { DB_STRING, SESSION_SECRET } = process.env;

// gets gCloud secrets
const gConnect = async () => {
    if (!DB_STRING || !SESSION_SECRET) throw new Error('Secrets not defined');
    const dbString = await gcpSecretsLoader.GetSecretValue(DB_STRING);
    const sessionSecret = await gcpSecretsLoader.GetSecretValue(SESSION_SECRET);
    return {dbString,sessionSecret};
};

// Test for gConnect.
// Move this entire process to a test file test runners are set up
const wrapMockGConnect = async function () {
  // Testing.
  if (!DB_STRING) throw new Error('Secrets not defined');
  const dbString = DB_STRING;
  // Instead, Keep an array of session secrets in db so we can rotate
  const sessionSecret = SESSION_SECRET ?? randomBytes(32).toString();
  return {dbString,sessionSecret};
};
// 
// NOTE: Env vars would need to be explicitly set in app.yaml or removed from app.yaml and set via dotenv if using RAW with App Engine to avoid override
// Promisify
type ResolveEnvVar =  ((arg : {dbString: string; sessionSecret: string;})=>void);
type RejectEnvVar = (arg: Error)=>void;
const envVarPromise = new Promise(function(res: ResolveEnvVar, rej: RejectEnvVar){
  if (process.env.NODE_ENV === 'dev-dotenv') {
    // Testing.
    if (!DB_STRING) return rej(new Error('Secrets not defined'));
    const dbString = DB_STRING;
    const sessionSecret = SESSION_SECRET ?? randomBytes(32).toString();
    res({dbString, sessionSecret});
  } else if (process.env.NODE_ENV === 'prod-gcp') {
    // Setup Gcloud and pass on for later use.
    gcpSecretsLoader = new SecretsReader();
    isGconnect = true;
    gConnect().then(res).catch(rej);
  } else if (process.env.NODE_ENV === 'test-gcp-secrets') {
    wrapMockGConnect().then(res).catch(rej);
  } else {
    // firebase
    const dbString = config().db.string;
    const sessionSecret = config().session.secret;
    if(!dbString || !sessionSecret) return rej(new Error('Secrets not defined'));
    res({dbString, sessionSecret});
  }
});
const port = Number(process.env.PORT) || 3000;
export { envVarPromise, port, isGconnect, gConnect, wrapMockGConnect };
