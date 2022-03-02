// Setup env vars for each env
import { randomBytes } from 'crypto';
// Layer in raw dotenv, mostly for local testing.
import 'dotenv/config';
import { config } from 'firebase-functions';
import { SecretsReader } from './gcloudSecrets';
// All entities requiring secret will wait for this.
let binarySemaphore = true;
// Partial wait function because we absolutely only want gConnect to enter critical section first.
export const wait  = function(){
    while(binarySemaphore);
}
export const signal = function(){
    binarySemaphore = false;
}
// secrets and globals
let dbString: string;
let sessionSecret: string;

let isGconnect = false;
let gcpSecretsLoader: SecretsReader;

// checks secrets for affected
const { DB_STRING, SESSION_SECRET } = process.env;

// gets gCloud secrets
const gConnect = async () => {
  if (!DB_STRING || !SESSION_SECRET) throw new Error('Secrets not defined');
  dbString = await gcpSecretsLoader.GetSecretValue(DB_STRING);
  sessionSecret = await gcpSecretsLoader.GetSecretValue(SESSION_SECRET);
  signal();
};
// Test for gConnect. Resolves after two ticks
let isMockGConnect = false;
const wrapMockGConnect  = async function(){
    // Testing. 
    if (!DB_STRING) throw new Error('Secrets not defined');
    dbString = DB_STRING;
    // Keep an array of session secrets in db so we can rotate
    sessionSecret = SESSION_SECRET ?? randomBytes(32).toString();
    // Fail case. Handled properly in sessionConfig.
    // if (!DB_STRING) throw new Error('Secrets not defined');
    signal();
}
// NOTE: Env vars would need to be explicitly set in app.yaml or removed from app.yaml and set via dotenv if using RAW with App Engine to avoid override
if (process.env.NODE_ENV === 'test' && process.env.NODE_RAW) {
  // Testing. 
  if (!DB_STRING) throw new Error('Secrets not defined');
  dbString = DB_STRING;
  sessionSecret = SESSION_SECRET ?? randomBytes(32).toString();
  signal();
} else if (process.env.NODE_ENV === 'test') {
  // Setup Gcloud and pass on for later use.
  gcpSecretsLoader = new SecretsReader();
  isGconnect = true;
}else if(process.env.NODE_ENV === 'test-gcp-secrets'){
  isMockGConnect = true
} else {
  // firebase
  dbString = config().db.string;
  sessionSecret = config().session.secret;
  signal();
}
const port = Number(process.env.PORT) || 3000;
export { dbString, sessionSecret, port, isGconnect, gConnect, isMockGConnect, wrapMockGConnect };
