import admin from "./src/config/firebase-config.js";

async function run() {
  try {
    const listUsersResult = await admin.auth().listUsers(1);
    console.log("Users fetched successfully:", listUsersResult.users.length);
  } catch (err) {
    console.error("Error fetching users:", err.message);
  }
}

run();
