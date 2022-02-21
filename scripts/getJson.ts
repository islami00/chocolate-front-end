import { writeFile } from "fs/promises";
import fetch from "node-fetch";
import path from "path";
process.env;
const rpcEndpoint = "http://9933-silver-sloth-xiy9cp8p.ws-eu33.gitpod.io/";
const headersList = {
  Accept: "*/*",
  "User-Agent": "Thunder Client (https://www.thunderclient.io)",
  "Content-Type": "application/json",
};

fetch(rpcEndpoint, {
  method: "POST",
  body: '{"id":"1", "jsonrpc":"2.0", "method": "state_getMetadata", "params":[]}',
  headers: headersList,
})
  .then((response) => response.text())
  .then((data) => {
    writeFile(path.resolve(__dirname, "../jsons/chocolate.json"), data, {
      encoding: "utf-8",
      flag: "w",
    })
      .then(() => console.log("done"))
      .catch((err) => console.log(err));
  });
