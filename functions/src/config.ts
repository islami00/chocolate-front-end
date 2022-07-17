import {config} from "firebase-functions";
import {SecretsReader} from "./gcpSecrets";
// Layer in raw dotenv, mostly for local testing.
import "dotenv/config";

// secrets and globals
let pinataApiKey: string;
let pinataSecretApiKey: string;
let pinataJWT: string;
let isGconnect = false;
let gcpSecretsLoader: SecretsReader;

// checks secrets
const {PINATA_API_KEY, PINATA_API_SECRET, PINATA_JWT} = process.env;
if (!PINATA_API_KEY || !PINATA_API_SECRET || !PINATA_JWT) {
  throw new Error("Secrets not defined");
}

// gets gCloud secrets
const gConnect = async (): Promise<void> => {
  pinataApiKey = await gcpSecretsLoader.getSecretValue(PINATA_API_KEY);
  pinataSecretApiKey = await gcpSecretsLoader.getSecretValue(PINATA_API_SECRET);
  pinataJWT = await gcpSecretsLoader.getSecretValue(PINATA_JWT);
};

// NOTE: Env vars would need to be explicitly set in app.yaml
// or removed and set via dotenv if using environment variables with App Engine
if (process.env.NODE_ENV === "dev-dotenv") {
  // Testing
  pinataApiKey = PINATA_API_KEY;
  pinataSecretApiKey = PINATA_API_SECRET;
  pinataJWT = PINATA_JWT;
} else if (process.env.NODE_ENV === "prod-gcp") {
  // Setup Gcloud and pass on for later use.
  gcpSecretsLoader = new SecretsReader();
  isGconnect = true;
} else {
  // firebase
  pinataApiKey = config().pinata.api.key;
  pinataSecretApiKey = config().pinata.secret.api.key;
  pinataJWT = config().pinata.jwt;
}
const port = Number(process.env.PORT) || 3000;
export {
  pinataApiKey,
  pinataJWT,
  pinataSecretApiKey,
  port,
  isGconnect,
  gConnect,
};
