import admin from "firebase-admin";

import serviceAccount from "./study-sync-ai-1cbc2-firebase-adminsdk-fbsvc-74bc02dd8e.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export default admin;