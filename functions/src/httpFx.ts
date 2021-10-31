import * as cors from "cors";
import * as express from "express";
import * as functions from "firebase-functions";
// eslint-disable-next-line
import { AnyKindOfDictionary } from "lodash";
import fetch from "node-fetch";
export interface ReviewContent {
  reviewText: string;
  rating: number;
}
type pinataResponse={
      IpfsHash: string;
      PinSize: number;
      Timestamp: string;
      isDuplicate: boolean;
    };
type res = {
    error?: AnyKindOfDictionary;
    success?:string;
  };
const pinataApiKey = functions.config().pinata.api.key;
const pinataSecretApiKey = functions.config().pinata.secret.api.key;
const pinataJWT= functions.config().pinata.jwt;
const headersList = {
  "Accept": "*/*",
  "User-Agent": "Thunder Client (https://www.thunderclient.io)",
  "pinata_api_key": pinataApiKey,
  "pinata_secret_api_key": pinataSecretApiKey,
  "Authorization": `Bearer ${pinataJWT}`,
  "Content-Type": "application/json",
};


export const basicHttp = functions.https.onRequest((request, response) => {
  console.log("Started exec");

  response.send("Sweet, can I do express stuff here??");
  console.log("Ended exec:");
});
const endpoint = "https://api.pinata.cloud/pinning/pinJSONToIPFS/";
const app = express();
app.use(cors({origin: true}));
app.post("/pin", (request, response) => {
  const body = JSON.parse(request.body);

  const ret:res = {
    error: undefined,
    success: undefined,
  };
  if (!body.reviewText || !body.rating) {
    ret.error = "wrong body";
    return response.status(400).send(ret);
  }
  fetch(endpoint, {
    method: "POST",
    body: JSON.stringify(body),
    headers: headersList,
  })
      .then((response) => response.json())
      .then((data) => {
        const returnable= data as unknown as NonNullable<pinataResponse>;
        ret.success = returnable.IpfsHash;
        // sending a string over
        response.send(ret);
      }).catch((error)=>{
        ret.error = error;
        response.status(400).send(ret);
      }).finally(()=>{
        response.end();
      });
  return response;
});
app.get("/cat", (request, response) => {
  response.send("Hello cat");
});
app.get("/dog", (request, response) => {
  response.send("Hello dog");
});
export const api = functions.https.onRequest(app);
