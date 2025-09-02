// setAdmin.js
const admin = require("firebase-admin");

// Path to your Firebase service account key JSON file
const serviceAccount = require("./serviceAccountKey.json"); // Download from Firebase Console > Project Settings > Service accounts

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Replace with the UID of your admin user (find it in Firebase Authentication > Users)
const uid = "FpyKRJPTV9QZpgvKIZunrUKro7B3";

admin.auth().setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log("Custom claim 'admin: true' set for user:", uid);
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error setting custom claim:", error);
    process.exit(1);
  });