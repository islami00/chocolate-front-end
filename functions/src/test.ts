// Import app.
// Serve
import * as http from "http";
import {port} from "./config";
import {app} from "./httpFx";

http.createServer(app).listen(port);
// On good call, should server err due to firebase config not being available.

