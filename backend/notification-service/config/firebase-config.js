// firebase-config.js
import admin from "firebase-admin";
import path from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const serviceAccount = require("./study-sync-ai-1cbc2-firebase-adminsdk-fbsvc-74bc02dd8e.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
