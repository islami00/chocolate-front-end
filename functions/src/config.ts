// Make app independent of firebase
import {config} from "firebase-functions";
let pinataApiKey: string; let pinataSecretApiKey: string; let pinataJWT: string;

if (process.env.NODE_ENV === "test") {
  // Testing
  pinataApiKey = process.env.PINATA_API_KEY ?? "";
  pinataSecretApiKey = process.env.PINATA_API_SECRET ?? "";
  pinataJWT= process.env.PINATA_JWT ?? "";
} else {
  pinataApiKey = config().pinata.api.key;
  pinataSecretApiKey = config().pinata.secret.api.key;
  pinataJWT= config().pinata.jwt;
}
const port = Number(process.env.PORT) || 3000;
export {pinataApiKey, pinataJWT, pinataSecretApiKey, port};

