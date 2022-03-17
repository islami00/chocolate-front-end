// Enable debugging--gcloud
// Import app.
import * as gcdbg from "@google-cloud/debug-agent";
import debug from "debug";
gcdbg.start({serviceContext: {enableCanary: false}});
import * as http from "http";
import {port, gConnect, isGconnect} from "./config";
import {app} from "./httpFx";

// Serve in async main to get secrets.
/** Main function that sets up app in non-firebase envs */
async function main() {
  if (isGconnect) await gConnect();
  debug(`IsGconnect: ${isGconnect}`);
  http.createServer(app).listen(port);
}
main();
