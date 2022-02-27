import * as cors from "cors";
import debug from "debug";
import * as express from "express";
import fetch from "node-fetch";
import {pinataApiKey, pinataJWT, pinataSecretApiKey} from "./config";
// types
export interface ReviewContent {
  reviewText: string;
  rating: number;
}
interface PinataSuccess {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
  isDuplicate: boolean;
  error: undefined;
}
interface PinataError {
  error: {
    reason: string;
    details: string;
  }
}
type PinataResponse = PinataSuccess | PinataError;
interface PinSuccess {success: string}
interface PinFail {error: string}
type PinRes = PinFail | PinSuccess
// Consts
const headersList = {
  "Accept": "*/*",
  "User-Agent": "Thunder Client (https://www.thunderclient.io)",
  "pinata_api_key": pinataApiKey,
  "pinata_secret_api_key": pinataSecretApiKey,
  "Authorization": `Bearer ${pinataJWT}`,
  "Content-Type": "application/json",
};
const endpoint = "https://api.pinata.cloud/pinning/pinJSONToIPFS/";

// App config
const app = express();
app.use(cors({origin: true}));
app.use(express.json());
// Error handler. Must have  next as arg
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const error: express.ErrorRequestHandler = function(err, req, res, next) {
  // log it
  debug(err.stack);

  // respond with 500 "Internal Server Error", instead of default stack trace
  res.status(500);
  res.json("Oops! Internal Server Error");
};
/**
 * Post: "/pin"
 */
interface PinRequest {
  reviewText: string;
  rating: string;
}
// Generics: app.[method]<Params,ResBody,ReqBody,ReqQuery,Locals>
app.post<null, PinRes, PinRequest>("/pin", (request, response, next) => {
  const {body} = request;
  // External error, return early with bad res.
  // Body is always json.
  const invalidBod = !body.reviewText || !body.rating;
  if (invalidBod) return response.status(403).send({error: "Invalid json"});

  fetch(endpoint, {
    method: "POST",
    body: JSON.stringify(body),
    headers: headersList,
  })
      .then(async (_response) => {
        if (_response.status < 200 || _response.status >= 300) {
          // Internal err
          throw new Error(await _response.json());
        }

        const data = await _response.json() as unknown as PinataResponse;
        if (data.error) {
          throw new Error(JSON.stringify(data.error));
        }
        // sending a string over
        response.status(200).json({success: data.IpfsHash});
      })
      .catch((error)=>{
        // Internal err, logged in errback, just pass to next.
        next(error);
      });
  // Ts err, must return val.
  return;
});
// Final err back
app.use(error);
export {app};

