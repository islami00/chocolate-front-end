// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
// Import app.
import {https} from "firebase-functions";
import {app} from "./httpFx";
// Export served
export const api = https.onRequest(app);
