const admin = require("firebase-admin");

// Initialize your Firebase app with service account credentials
admin.initializeApp({
  credential: admin.credential.cert(require("./serviceAccountKey.json")) // path to your service account key
});

const uid = "FpyKRJPTV9QZpgvKIZunrUKro7B3"; // Replace with the UID of the user you want to set as admin
// Set custom user claims to grant admin privileges

admin.auth().setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log(`Custom admin claim set for user: ${uid}`);
    process.exit(0);
  })
  .catch(error => {
    console.error("Error setting admin claim:", error);
    process.exit(1);
  });
