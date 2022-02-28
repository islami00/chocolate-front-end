// Enable debugging--gcloud
// Import app.
import * as gcdbg from "@google-cloud/debug-agent";
gcdbg.start({ serviceContext: { enableCanary: false }});
import * as http from "http";
import {port} from "./config";
import {app} from "./httpFx";

// Serve
http.createServer(app).listen(port);
// On good call, should server err due to firebase config not being available.

